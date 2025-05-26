"use client";

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { Textarea } from '@/components/common/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { createReview } from '@/lib/services/reviews';
import { toast } from 'sonner';
import AuthModal from '@/components/features/auth/AuthModal';

interface ReviewFormProps {
  productId: string;
}

export function ReviewForm({ productId }: ReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (rating === 0) {
      toast.error('Por favor selecciona una calificación');
      return;
    }

    try {
      setIsSubmitting(true);
      await createReview({
        productId,
        rating,
        comment,
      });
      toast.success('Reseña enviada exitosamente');
      setRating(0);
      setComment('');
      // Reload the page to show the new review
      window.location.reload();
    } catch (error) {
      console.error('Error creating review:', error);
      toast.error('Error al enviar la reseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <>
        <div className="text-center py-6">
          <p className="text-gray-500 mb-4">Inicia sesión para dejar una reseña</p>
          <Button onClick={() => setShowAuthModal(true)}>
            Iniciar Sesión
          </Button>
        </div>
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Tu calificación</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 hover:scale-110 transition-transform"
            >
              <Star
                className={`h-6 w-6 ${
                  star <= (hoverRating || rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tu comentario</label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Comparte tu experiencia con este producto..."
          className="min-h-[100px]"
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Enviar reseña'}
      </Button>
    </form>
  );
}