import { supabase } from '@/lib/supabase/client';

export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen_principal: string;
  categoria_id: number;
  subcategoria_id: number;
  subcategorias: { nombre: string };
  categorias: { nombre: string };
  reviews: Array<{
    id: number;
    estrellas: number;
    comentario: string;
    fecha_creacion: string;
  }>;
  rating: number;
  reviewCount: number;
}

export interface FormattedProduct extends Omit<Product, 'id'> {
  id: number;
  categoryName: string;
  formattedPrice: string;
}

export interface ProductFilters {
  search: string;
  subcategory: number | null;
  minPrice: number;
  maxPrice: number;
  sortBy: 'newest' | 'nameAsc' | 'nameDesc' | 'priceAsc' | 'priceDesc';
}

export async function getProductsByCategory(
  categoriaId: number, 
  filters: ProductFilters = {
    search: '',
    subcategory: null,
    minPrice: 0,
    maxPrice: 1000,
    sortBy: 'nameAsc'
  }
) {
  try {
    let query = supabase
      .from('productos')
      .select(`
        *,
        subcategorias (nombre),
        categorias (nombre),
        reviews (
          id,
          estrellas,
          comentario,
          fecha_creacion
        )
      `)
      .eq('categoria_id', categoriaId);
    
    if (filters.search) {
      query = query.ilike('nombre', `%${filters.search}%`);
    }
    
    if (filters.subcategory) {
      query = query.eq('subcategoria_id', filters.subcategory);
    }
    
    if (filters.minPrice > 0) {
      query = query.gte('precio', filters.minPrice);
    }
    
    if (filters.maxPrice < 1000) {
      query = query.lte('precio', filters.maxPrice);
    }
    
    switch (filters.sortBy) {
      case 'nameAsc':
        query = query.order('nombre', { ascending: true });
        break;
      case 'nameDesc':
        query = query.order('nombre', { ascending: false });
        break;
      case 'priceAsc':
        query = query.order('precio', { ascending: true });
        break;
      case 'priceDesc':
        query = query.order('precio', { ascending: false });
        break;
      default:
        query = query.order('fecha_creacion', { ascending: false });
    }

    const { data, error } = await query;

    if (error) throw error;

    const transformedData = data?.map(product => ({
      ...product,
      id: Number(product.id),
      categoria_id: Number(product.categoria_id),
      subcategoria_id: Number(product.subcategoria_id),
      precio: Number(product.precio),
      stock: Number(product.stock),
      imagen_principal: product.imagen_principal?.startsWith('http') 
        ? product.imagen_principal 
        : product.imagen_principal 
          ? supabase.storage.from('productos').getPublicUrl(product.imagen_principal).data.publicUrl
          : '/placeholder.png',
      rating: product.reviews?.reduce((acc: number, review: any) => acc + review.estrellas, 0) / 
              (product.reviews?.length || 1),
      reviewCount: product.reviews?.length || 0
    })) || [];

    return transformedData;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function getSubcategories(categoryId: number) {
  try {
    const { data, error } = await supabase
      .from('subcategorias')
      .select('id, nombre')
      .eq('categoria_id', categoryId)
      .order('nombre');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    throw error;
  }
}

export function formatProduct(product: Product, categoryName: string): FormattedProduct {
  return {
    ...product,
    id: Number(product.id),
    categoryName,
    formattedPrice: new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(product.precio)
  };
}

export async function getProductDetail(productId: number) {
  const { data, error } = await supabase
    .from('productos')
    .select(`
      *,
      subcategorias (nombre),
      categorias (nombre),
      reviews (
        id,
        estrellas,
        comentario,
        fecha_creacion
      )
    `)
    .eq('id', productId)
    .single();

  if (error) throw error;

  return {
    ...data,
    id: Number(data.id),
    categoria_id: Number(data.categoria_id),
    subcategoria_id: Number(data.subcategoria_id),
    precio: Number(data.precio),
    stock: Number(data.stock),
    imagen_principal: data.imagen_principal?.startsWith('http')
      ? data.imagen_principal
      : data.imagen_principal
        ? supabase.storage.from('productos').getPublicUrl(data.imagen_principal).data.publicUrl
        : '/placeholder.png',
    rating: data.reviews?.reduce((acc: number, review: any) => acc + review.estrellas, 0) / 
            (data.reviews?.length || 1),
    reviewCount: data.reviews?.length || 0
  };
}