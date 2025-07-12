"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/common/ui/button';
import { getProductImages } from '@/lib/utils';

interface ProductImageGalleryProps {
  product: {
    imagen_principal?: string;
    imagen_secundaria?: string; 
    imagen_terciaria?: string;
    nombre: string;
  };
  className?: string;
}

export function ProductImageGallery({ product, className = "" }: ProductImageGalleryProps) {
  const images = getProductImages(product);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const hasMultipleImages = images.length > 1;

  return (
    <div className={`relative ${className}`}>
      {/* Imagen principal */}
      <div className="relative aspect-square overflow-hidden rounded-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
          >
            <Image
              src={images[currentImageIndex]}
              alt={`${product.nombre} - Imagen ${currentImageIndex + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={currentImageIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Controles de navegación - solo si hay múltiples imágenes */}
        {hasMultipleImages && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Indicador de imagen actual */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 rounded-full px-2 py-1">
              <span className="text-white text-xs">
                {currentImageIndex + 1} / {images.length}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Miniaturas - solo si hay múltiples imágenes */}
      {hasMultipleImages && (
        <div className="flex gap-2 mt-4 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentImageIndex
                  ? 'border-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Image
                src={image}
                alt={`${product.nombre} - Miniatura ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
