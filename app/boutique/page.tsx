"use client";

import { Suspense } from 'react';
import { ProductList } from '@/components/modules/catalog/ProductList';

const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-6">
    <div className="container">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4">
              <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default function BoutiquePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProductList 
        categoryId={3} 
        categoryName="boutique" 
        title="Boutique" 
      />
    </Suspense>
  );
}