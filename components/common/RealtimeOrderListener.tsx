'use client';

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/config/supabase';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface RealtimeOrderListenerProps {
  role: 'admin' | 'restaurant';
  restauranteId?: number;
}

export const RealtimeOrderListener = ({ role, restauranteId }: RealtimeOrderListenerProps) => {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const processedOrders = useRef<Set<string>>(new Set());
  const recentLocalUpdates = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Inicializar audio de notificación
    const audioPath = '/JINGLE.mp3';
    audioRef.current = new Audio(audioPath);
    audioRef.current.volume = 1;

    audioRef.current.addEventListener('error', (e) => {
      console.error('❌ Error cargando JINGLE.mp3:', e);
    });

    let channel: any;

    if (role === 'admin') {
      // Super Admin: Escuchar inserciones en 'pedidos'
      channel = supabase
        .channel('admin-orders')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'pedidos' },
          (payload) => {
            console.log('🚀 EVENTO RECIBIDO (Admin):', payload);
            handleNewOrder(payload.new.id, payload.new.total);
          }
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'pedidos' },
          (payload) => {
            console.log('🔄 ACTUALIZACIÓN RECIBIDA (Admin):', payload);
            handleStatusUpdate(payload.new.id, payload.new.estado);
          }
        )
        .subscribe((status) => {
          console.log(`🔌 Estado suscripción Admin: ${status}`);
          if (status === 'CHANNEL_ERROR') {
            console.error('❌ Error de Canal Realtime. Verifica RLS y Publicaciones.');
          }
        });
    } else if (role === 'restaurant' && restauranteId) {
      // Restaurante Admin: Escuchar inserciones en 'detalles_pedido'
      channel = supabase
        .channel(`restaurant-orders-${restauranteId}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'detalles_pedido' },
          async (payload) => {
            console.log('🚀 EVENTO RECIBIDO (Restaurante):', payload);
            const newItem = payload.new;

            // Si ya procesamos este pedido recientemente, ignorar para evitar spam por múltiples items
            if (processedOrders.current.has(newItem.pedido_id.toString())) {
              console.log(`⏭️ Pedido ${newItem.pedido_id} ya procesado, ignorando item.`);
              return;
            }

            try {
              console.log('🔍 Verificando restaurante del producto:', newItem.producto_id);
              // Verificar si el producto pertenece a este restaurante
              const { data: product, error } = await supabase
                .from('productos')
                .select('subcategoria_id')
                .eq('id', newItem.producto_id)
                .single();

              if (error) {
                console.error('❌ Error buscando producto:', error);
                return;
              }

              console.log(`✅ Producto encontrado. Pertenece a subcategoría: ${product?.subcategoria_id} (Tipo: ${typeof product?.subcategoria_id}). Esperado: ${restauranteId} (Tipo: ${typeof restauranteId})`);

              // Usar comparación no estricta o convertir ambos a número para evitar errores por tipo (string vs number)
              if (product && Number(product.subcategoria_id) === Number(restauranteId)) {
                // Marcar como procesado para evitar duplicados en el mismo pedido
                processedOrders.current.add(newItem.pedido_id.toString());
                setTimeout(() => processedOrders.current.delete(newItem.pedido_id.toString()), 30000); // 30s TTL

                console.log(`🏪 Nuevo pedido para restaurante ${restauranteId}:`, newItem.pedido_id);
                handleNewOrder(newItem.pedido_id);
              }
            } catch (err) {
              console.error('Error verificando producto en realtime:', err);
            }
          }
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'pedidos' },
          async (payload) => {
            console.log('🔄 ACTUALIZACIÓN RECIBIDA:', payload);
            handleStatusUpdate(payload.new.id, payload.new.estado);
          }
        )
        .subscribe((status) => {
          console.log(`🔌 Estado suscripción (${role}): ${status}`);
          if (status === 'CHANNEL_ERROR') {
            console.error('❌ Error de Canal Realtime.');
          }
        });
    }

    // Escuchar actualizaciones manuales desde esta misma ventana para evitar notificaciones dobles
    const handleManualUpdate = (event: any) => {
      const { orderId } = event.detail;
      if (orderId) {
        recentLocalUpdates.current.add(orderId.toString());
        // Limpiar después de 10 segundos
        setTimeout(() => {
          recentLocalUpdates.current.delete(orderId.toString());
        }, 10000);
      }
    };

    const handleStopSound = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };

    window.addEventListener('manual-order-update', handleManualUpdate);
    window.addEventListener('stop-notification-sound', handleStopSound);

    return () => {
      window.removeEventListener('manual-order-update', handleManualUpdate);
      window.removeEventListener('stop-notification-sound', handleStopSound);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [role, restauranteId]);

  const handleNewOrder = (orderId: string | number, total?: number) => {
    // Reproducir sonido
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => {
        console.warn('⚠️ Audio bloqueado por el navegador. Se requiere interacción del usuario.', e);
      });
    }

    // Dispatch custom event for pages to refresh their data
    window.dispatchEvent(new CustomEvent('new-order-received', {
      detail: { orderId, role, restauranteId }
    }));

    // Mostrar notificación
    toast.success('¡Nuevo Pedido Recibido!', {
      description: `Pedido #${orderId}${total ? ` - Total: $${total}` : ''}`,
      duration: 10000, // 10 segundos
      action: {
        label: 'Ver Pedido',
        onClick: () => {
          const path = role === 'admin' ? '/admin/pedidos' : '/restaurante/pedidos';
          router.push(path);
        }
      }
    });
  };

  const handleStatusUpdate = (orderId: string | number, newStatus?: string) => {
    console.log(`✨ Estado del pedido ${orderId} actualizado a ${newStatus}. Avisando a componentes...`);

    // Despachar evento para refrescar
    window.dispatchEvent(new CustomEvent('order-status-updated', {
      detail: { orderId, status: newStatus }
    }));

    // Toast opcional para avisar que algo cambió (sin ser tan invasivo como un pedido nuevo)
    // EXHAUSTIVO: Evitar mostrar si nosotros mismos acabamos de hacer el cambio (deduplicación)
    if (newStatus && !recentLocalUpdates.current.has(orderId.toString())) {
      toast.info(`Pedido #${orderId} actualizado`, {
        description: `Nuevo estado: ${newStatus}`,
        duration: 5000,
      });
    } else {
      console.log(`🔇 Omitiendo toast de actualización por ser cambio local/reciente: ${orderId}`);
    }
  };

  return null; // Componente invisible
};
