import { supabase } from '@/lib/supabase/client';

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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data: userData } = await supabase
    .from('usuarios')
    .select('id')
    .eq('email', user.email)
    .single();

  if (!userData) throw new Error('User profile not found');

  // Check if product already exists in cart
  const { data: existingItem } = await supabase
    .from('carrito')
    .select('*')
    .eq('usuario_id', userData.id)
    .eq('producto_id', productId)
    .single();

  if (existingItem) {
    // Update quantity if product exists
    const { error } = await supabase
      .from('carrito')
      .update({ cantidad: existingItem.cantidad + quantity })
      .eq('id', existingItem.id);

    if (error) throw error;
  } else {
    // Insert new item if product doesn't exist
    const { error } = await supabase
      .from('carrito')
      .insert({
        usuario_id: userData.id,
        producto_id: productId,
        cantidad: quantity
      });

    if (error) throw error;
  }
}

export async function removeFromCart(cartItemId: number) {
  const { error } = await supabase
    .from('carrito')
    .delete()
    .eq('id', cartItemId);

  if (error) throw error;
}

export async function updateCartItemQuantity(cartItemId: number, quantity: number) {
  const { error } = await supabase
    .from('carrito')
    .update({ cantidad: quantity })
    .eq('id', cartItemId);

  if (error) throw error;
}

export async function getCartItems(): Promise<CartItem[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data: userData } = await supabase
    .from('usuarios')
    .select('id')
    .eq('email', user.email)
    .single();

  if (!userData) throw new Error('User profile not found');

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

  if (error) throw error;
  
  // Convertir los datos de Supabase al formato CartItem
  return (data as CartItemResponse[]).map(item => {
    // Obtener el primer producto del array
    const productoData = item.productos[0];
    
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
  });
}

export async function clearCart() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data: userData } = await supabase
    .from('usuarios')
    .select('id')
    .eq('email', user.email)
    .single();

  if (!userData) throw new Error('User profile not found');

  const { error } = await supabase
    .from('carrito')
    .delete()
    .eq('usuario_id', userData.id);

  if (error) throw error;
}