import { supabase } from '@/lib/database/client';

export interface CartItem {
  id: number;
  usuario_id: number;
  producto_id: number;
  cantidad: number;
  producto: {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen_principal: string;
    stock: number;
  };
}

// Interfaz para los datos devueltos por Supabase
interface CartItemResponse {
  id: string | number;
  usuario_id: string | number;
  producto_id: string | number;
  cantidad: number;
  productos: {
    id: string | number;
    nombre: string;
    descripcion: string;
    precio: string | number;
    imagen_principal: string;
    stock: string | number;
  }[];
}

export async function addToCart(productId: number, quantity: number = 1) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('correo_electronico', user.email)
      .single();

    if (userError || !userData) {
      console.error('Error al obtener el usuario:', userError);
      throw new Error('User profile not found');
    }

    // Check if product already exists in cart
    const { data: existingItem, error: existingError } = await supabase
      .from('carrito')
      .select('*')
      .eq('usuario_id', userData.id)
      .eq('producto_id', productId)
      .single();

    if (existingError && existingError.code !== 'PGRST116') {
      console.error('Error al verificar carrito existente:', existingError);
      throw existingError;
    }

    if (existingItem) {
      // Update quantity if product exists
      const { error } = await supabase
        .from('carrito')
        .update({ cantidad: existingItem.cantidad + quantity })
        .eq('id', existingItem.id);

      if (error) {
        console.error('Error al actualizar cantidad en carrito:', error);
        throw error;
      }
    } else {
      // Insert new item if product doesn't exist
      const { error } = await supabase
        .from('carrito')
        .insert({
          usuario_id: userData.id,
          producto_id: productId,
          cantidad: quantity
        });

      if (error) {
        console.error('Error al insertar en carrito:', error);
        throw error;
      }
    }
  } catch (err) {
    console.error('Error en addToCart:', err);
    throw err;
  }
}

export async function removeFromCart(cartItemId: number) {
  try {
    const { error } = await supabase
      .from('carrito')
      .delete()
      .eq('id', cartItemId);

    if (error) {
      console.error('Error al eliminar del carrito:', error);
      throw error;
    }
  } catch (err) {
    console.error('Error en removeFromCart:', err);
    throw err;
  }
}

export async function updateCartItemQuantity(cartItemId: number, quantity: number) {
  try {
    if (quantity <= 0) {
      return removeFromCart(cartItemId);
    }
    
    const { error } = await supabase
      .from('carrito')
      .update({ cantidad: quantity })
      .eq('id', cartItemId);

    if (error) {
      console.error('Error al actualizar cantidad en carrito:', error);
      throw error;
    }
  } catch (err) {
    console.error('Error en updateCartItemQuantity:', err);
    throw err;
  }
}

export async function getCartItems(): Promise<CartItem[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('correo_electronico', user.email)
      .single();

    if (userError || !userData) {
      console.error('Error al obtener el usuario:', userError);
      throw new Error('User profile not found');
    }

    const { data, error } = await supabase
      .from('carrito')
      .select(`
        id,
        usuario_id,
        producto_id,
        cantidad,
        productos (
          id,
          nombre,
          descripcion,
          precio,
          imagen_principal,
          stock
        )
      `)
      .eq('usuario_id', userData.id);

    if (error) {
      console.error('Error al obtener carrito:', error);
      throw error;
    }
    
    if (!data || data.length === 0) return [];
    
    // Convertir los datos de Supabase al formato CartItem
    return (data as CartItemResponse[]).map(item => {
      // Obtener el primer producto del array
      const productoData = item.productos[0];
      
      if (!productoData) {
        console.error('Error: Producto no encontrado para item de carrito', item);
        return null;
      }
      
      return {
        id: Number(item.id),
        usuario_id: Number(item.usuario_id),
        producto_id: Number(item.producto_id),
        cantidad: item.cantidad,
        producto: {
          id: Number(productoData.id),
          nombre: productoData.nombre,
          descripcion: productoData.descripcion,
          precio: Number(productoData.precio),
          imagen_principal: productoData.imagen_principal,
          stock: Number(productoData.stock)
        }
      };
    }).filter(Boolean) as CartItem[];
  } catch (err) {
    console.error('Error en getCartItems:', err);
    return [];
  }
}

export async function clearCart() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('correo_electronico', user.email)
      .single();

    if (userError || !userData) {
      console.error('Error al obtener el usuario:', userError);
      throw new Error('User profile not found');
    }

    const { error } = await supabase
      .from('carrito')
      .delete()
      .eq('usuario_id', userData.id);

    if (error) {
      console.error('Error al limpiar carrito:', error);
      throw error;
    }
  } catch (err) {
    console.error('Error en clearCart:', err);
    throw err;
  }
}