"use client";

import { ProductList } from '@/components/modules/catalog/ProductList';

export default function BoutiquePage() {
  return <ProductList categoryId={3} categoryName="boutique" title="Boutique" />;
}