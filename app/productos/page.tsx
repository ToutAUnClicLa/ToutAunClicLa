"use client";

import { ProductList } from '@/components/modules/catalog/ProductList';

export default function ProductosPage() {
  return (
    <ProductList 
      categoryId={1} 
      categoryName="productos" 
      title="Nuestros Productos" 
    />
  );
}