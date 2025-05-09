"use client";

import { ProductList } from '@/components/modules/catalog/ProductList';

export default function ComidasPage() {
  return (
    <ProductList 
      categoryId={2} 
      categoryName="comidas" 
      title="Comidas Tradicionales" 
    />
  );
}