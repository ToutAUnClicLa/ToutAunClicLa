import { supabase } from '@/lib/supabase/client';

export interface CartItem {
  id: string;
  usuario_id: string;
  producto_id: string;
  cantidad: number;
  producto: {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen_principal: string;
    stock: number;
  };
}

export async function addToCart(productId: string, quantity: number = 1) {
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

export async function removeFromCart(cartItemId: string) {
  const { error } = await supabase
    .from('carrito')
    .delete()
    .eq('id', cartItemId);

  if (error) throw error;
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
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
  return data as CartItem[];
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