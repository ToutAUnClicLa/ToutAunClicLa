/**
 * Componente de paginación reutilizable
 * Proporciona navegación entre páginas con controles intuitivos
 */
"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  showInfo?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  disabled = false,
  showInfo = true,
  className = '',
  size = 'md'
}: PaginationProps) {
  
  if (totalPages <= 1) return null;

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const buttonSizes = {
    sm: 'sm',
    md: 'sm',
    lg: 'default'
  } as const;

  // Generar páginas a mostrar
  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisiblePages = 7;
    
    if (totalPages <= maxVisiblePages) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Mostrar páginas con elipsis
      if (currentPage <= 4) {
        // Mostrar primeras páginas
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Mostrar últimas páginas
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Mostrar páginas del medio
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage && !disabled) {
      onPageChange(page);
    }
  };

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4", className)}>
      {showInfo && totalItems && itemsPerPage && (
        <div className={cn("text-gray-600", sizeClasses[size])}>
          Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} resultados
        </div>
      )}
      
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size={buttonSizes[size]}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || disabled}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Anterior</span>
        </Button>
        
        <div className="flex items-center gap-1">
          {visiblePages.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <div key={`ellipsis-${index}`} className="px-2">
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </div>
              );
            }
            
            return (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size={buttonSizes[size]}
                onClick={() => handlePageChange(page)}
                disabled={disabled}
                className={cn(
                  "min-w-[2.5rem]",
                  page === currentPage && "bg-primary text-primary-foreground"
                )}
              >
                {page}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size={buttonSizes[size]}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || disabled}
          className="gap-1"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
