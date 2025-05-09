"use client";

import { Star, ThumbsUp, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import Image from 'next/image';

interface Review {
  id: string;
  usuarios: {
    nombre: string;
    email: string;
  };
  estrellas: number;
  comentario: string;
  fecha_creacion: string;
  likes: number;
}

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No hay reseñas todavía</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                {review.usuarios?.email ? (
                  <div className="w-full h-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-lg font-medium text-indigo-600">
                      {review.usuarios.nombre.charAt(0).toUpperCase()}
                    </span>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
              <div>
                <p className="font-medium">{review.usuarios?.nombre || 'Usuario anónimo'}</p>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.estrellas ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-500">
                    {formatDistanceToNow(new Date(review.fecha_creacion), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <Flag className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-3 text-gray-600">{review.comentario}</p>
          <div className="mt-4 flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-gray-500">
              <ThumbsUp className="h-4 w-4 mr-2" />
              Útil ({review.likes || 0})
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}