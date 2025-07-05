"use client";

import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { Badge } from '@/components/common/ui/badge';
import { useCart } from '@/hooks/useCart';

export function CartButton() {
  const router = useRouter();
  const { totalQuantity } = useCart({ autoLoad: false, lazy: true });

  const handleCartClick = () => {
    router.push('/cart');
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="relative hover:bg-gray-100 transition-colors duration-200"
      onClick={handleCartClick}
    >
      <ShoppingCart className="h-6 w-6 text-gray-700" />
      {totalQuantity > 0 && (
        <Badge 
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold shadow-lg animate-pulse"
        >
          {totalQuantity > 99 ? '99+' : totalQuantity}
        </Badge>
      )}
    </Button>
  );
}
