"use client";

import { useState } from 'react';
import { Star, ThumbsUp, Flag, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { UserAvatar } from '@/components/common/ui/user-avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/common/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/common/ui/alert-dialog';
import { deleteReview } from '@/lib/services/reviews';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';

interface Review {
  id: string;
  usuario_id: string;
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
  onReviewDeleted?: (reviewId: string) => void;
}

export function ReviewList({ reviews, onReviewDeleted }: ReviewListProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [deletingReview, setDeletingReview] = useState<string | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!Array.isArray(reviews) || reviews.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">{t('reviews.noReviews')}</p>
      </div>
    );
  }

  const handleDeleteReview = async (reviewId: string) => {
    try {
      setDeletingReview(reviewId);
      await deleteReview(reviewId);
      
      toast.success(t('notifications.success.reviewDeleted'));
      
      // Notificar al componente padre
      onReviewDeleted?.(reviewId);
      
    } catch (error: any) {
      console.error('Error al eliminar review:', error);
      toast.error(error.message || t('notifications.error.reviewDeleteError'));
    } finally {
      setDeletingReview(null);
      setShowDeleteDialog(false);
      setReviewToDelete(null);
    }
  };

  const confirmDeleteReview = (reviewId: string) => {
    setReviewToDelete(reviewId);
    setShowDeleteDialog(true);
  };

  return (
    <>
      <div className="space-y-6 mt-6">
        {reviews.map((review) => {
          const isOwner = user?.id === review.usuario_id;
          const isDeleting = deletingReview === review.id;
          
          return (
            <div key={review.id} className="border-b pb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <UserAvatar 
                    name={review.usuarios?.nombre || t('reviews.anonymousUser')}
                    size="lg"
                  />
                  <div>
                    <p className="font-medium">{review.usuarios?.nombre || t('reviews.anonymousUser')}</p>
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
                
                {/* Menu de opciones */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {isOwner && (
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                        onClick={() => confirmDeleteReview(review.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {isDeleting ? t('common.deleting') : t('reviews.deleteComment')}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="cursor-pointer">
                      <Flag className="h-4 w-4 mr-2" />
                      {t('reviews.reportComment')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <p className="mt-3 text-gray-600">{review.comentario}</p>
              
              <div className="mt-4 flex items-center gap-4">
                <Button variant="ghost" size="sm" className="text-gray-500">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  {t('reviews.helpful')} ({review.likes || 0})
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('reviews.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('reviews.deleteConfirmDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => reviewToDelete && handleDeleteReview(reviewToDelete)}
              className="bg-red-600 hover:bg-red-700"
              disabled={!!deletingReview}
            >
              {deletingReview ? t('common.deleting') : t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}