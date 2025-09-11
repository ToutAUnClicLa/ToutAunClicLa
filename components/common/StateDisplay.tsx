/**
 * Componente para mostrar estados de loading, error y vacío
 * Reutilizable en toda la aplicación
 */
"use client";

import { motion } from 'framer-motion';
import { Package, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { Card, CardContent } from '@/components/common/ui/card';
import { Skeleton } from '@/components/common/ui/skeleton';
import { cn } from '@/lib/utils';

interface StateDisplayProps {
  type: 'loading' | 'error' | 'empty';
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
  itemsCount?: number;
  variant?: 'grid' | 'list' | 'compact';
}

const defaultMessages = {
  loading: {
    title: 'Cargando...',
    message: 'Obteniendo información'
  },
  error: {
    title: 'Error al cargar',
    message: 'Ocurrió un problema al obtener los datos'
  },
  empty: {
    title: 'No se encontraron resultados',
    message: 'Intenta ajustar tus filtros o buscar con otros términos'
  }
};

const LoadingSkeleton = ({ itemsCount = 8, variant = 'grid' }: { itemsCount: number; variant: 'grid' | 'list' | 'compact' }) => {
  const gridClasses = {
    grid: 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6',
    list: 'space-y-4',
    compact: 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6'
  };

  if (variant === 'list') {
    return (
      <div className={gridClasses[variant]}>
        {Array.from({ length: itemsCount }).map((_, i) => (
          <div key={i} className="flex gap-4 p-4 border rounded-lg">
            <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-6 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={gridClasses[variant]}>
      {Array.from({ length: itemsCount }).map((_, i) => (
        <div key={i} className="group">
          <Card className="overflow-hidden border-0 shadow-md">
            <div className="relative aspect-square overflow-hidden">
              <Skeleton className="w-full h-full" />
            </div>
            <CardContent className="p-2 sm:p-4 space-y-2">
              <Skeleton className="h-3 sm:h-4 w-3/4" />
              <Skeleton className="h-2 sm:h-3 w-1/2" />
              <div className="space-y-2">
                <Skeleton className="h-4 sm:h-6 w-1/4" />
                <div className="flex gap-1 sm:gap-2">
                  <Skeleton className="h-6 sm:h-8 flex-1" />
                  <Skeleton className="h-6 sm:h-8 w-6 sm:w-8 rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

export function StateDisplay({ 
  type, 
  title, 
  message, 
  onRetry, 
  retryLabel = 'Intentar de nuevo', 
  className = '',
  itemsCount = 8,
  variant = 'grid'
}: StateDisplayProps) {
  
  if (type === 'loading') {
    return <LoadingSkeleton itemsCount={itemsCount} variant={variant} />;
  }

  const config = defaultMessages[type];
  const displayTitle = title || config.title;
  const displayMessage = message || config.message;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-10 h-10 text-red-400" />;
      case 'empty':
      default:
        return <Package className="w-10 h-10 text-gray-400" />;
    }
  };

  const getIconBg = () => {
    switch (type) {
      case 'error':
        return 'from-red-100 to-orange-100';
      case 'empty':
      default:
        return 'from-gray-100 to-gray-200';
    }
  };

  return (
    <div className={cn("text-center py-16", className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-4"
      >
        <div className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center mx-auto bg-gradient-to-br",
          getIconBg()
        )}>
          {getIcon()}
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900">
          {displayTitle}
        </h3>
        
        <p className="text-gray-600 max-w-md mx-auto">
          {displayMessage}
        </p>
        
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            {retryLabel}
          </Button>
        )}
      </motion.div>
    </div>
  );
}
