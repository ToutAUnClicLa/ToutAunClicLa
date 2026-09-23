"use client";

import { useState } from 'react';
import { Button } from '@/components/common/ui/button';
import { Input } from '@/components/common/ui/input';
import { Badge } from '@/components/common/ui/badge';
import { Ticket, X, Loader2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from 'sonner';
import { Coupon } from '@/lib/services/cart';

interface CouponInputProps {
  onApplyCoupon: (code: string) => Promise<boolean>;
  onRemoveCoupon?: () => Promise<boolean>;
  appliedCoupon?: Coupon | null;
  disabled?: boolean;
  className?: string;
}

export function CouponInput({
  onApplyCoupon,
  onRemoveCoupon,
  appliedCoupon,
  disabled = false,
  className = ''
}: CouponInputProps) {
  const { t } = useTranslation();
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error(t('cart.summary.coupon.error'));
      return;
    }

    setIsLoading(true);
    console.log('🎫 Aplicando cupón desde UI:', couponCode.trim());
    
    try {
      const success = await onApplyCoupon(couponCode.trim());
      if (success) {
        setCouponCode('');
        toast.success(t('cart.summary.coupon.success'));
        console.log('✨ Cupón aplicado exitosamente desde UI');
      } else {
        console.log('❌ Cupón no pudo ser aplicado');
      }
    } catch (error: any) {
      console.error('❌ Error en UI aplicando cupón:', error);
      if (error.message?.includes('no válido') || error.message?.includes('not valid') || error.message?.includes('Invalid coupon')) {
        toast.error(t('cart.summary.coupon.error'));
      } else if (error.message?.includes('expirado') || error.message?.includes('expired')) {
        toast.error(t('cart.summary.coupon.expired'));
      } else if (error.message?.includes('Empty cart')) {
        toast.error(t('cart.summary.coupon.emptyCartError'));
      } else if (error.message?.includes('Rate limit') || error.message?.includes('Too Many Requests')) {
        toast.error(t('cart.summary.coupon.rateLimitError'));
      } else if (error.message?.includes('Personal usage limit reached') || error.message?.includes('límite personal de uso') || error.message?.includes('userUsageCount')) {
        toast.error(t('cart.summary.coupon.usageLimitReached'));
      } else {
        toast.error(t('cart.summary.coupon.error'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    if (!onRemoveCoupon) return;

    setIsLoading(true);
    try {
      await onRemoveCoupon();
      toast.success(t('cart.summary.coupon.removedSuccess'));
    } catch (error) {
      console.error('Error removing coupon:', error);
      toast.error(t('cart.summary.coupon.removeError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !disabled && !isLoading && couponCode.trim()) {
      handleApplyCoupon();
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Cupón aplicado */}
      {appliedCoupon ? (
        <div className="flex items-center justify-between gap-2 rounded-xl border border-[var(--shop-hairline)] bg-[var(--shop-purple-wash)] p-3">
          <div className="flex min-w-0 items-center gap-2">
            <Ticket className="h-4 w-4 shrink-0 text-[var(--shop-purple)]" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--shop-ink)]">
                {t('cart.summary.coupon.applied')}: {appliedCoupon.code || appliedCoupon.codigo}
              </p>
              <p className="text-xs text-[var(--shop-muted)]">
                {appliedCoupon.description || appliedCoupon.descripcion || 
                 (appliedCoupon.type === 'free_shipping' 
                  ? t('cart.summary.coupon.freeShippingDescription') 
                  : t('cart.summary.coupon.discountDescription', { percent: appliedCoupon.discount || appliedCoupon.valor }))}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="rounded-full border-0 bg-white text-[var(--shop-purple)]">
            {appliedCoupon.type === 'free_shipping' 
              ? t('cart.freeShipping')
              : `${appliedCoupon.discount || appliedCoupon.valor}%`}
          </Badge>
          {onRemoveCoupon && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveCoupon}
              disabled={isLoading}
              className="h-11 w-11 p-0 text-[var(--shop-muted)] hover:text-[var(--shop-ink)]"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        /* Input para cupón */
        <div className="space-y-2">
          <p className="text-sm font-medium text-[var(--shop-ink)]">
            {t('cart.summary.coupon.question')}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex-1">
              <Input
                type="text"
                placeholder={t('cart.summary.coupon.placeholder')}
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                disabled={disabled || isLoading}
                className="h-11 min-h-11 rounded-full border-[var(--shop-hairline)] text-sm"
                maxLength={40}
              />
            </div>
            <Button
              onClick={handleApplyCoupon}
              disabled={disabled || isLoading || !couponCode.trim()}
              size="sm"
              className="inline-flex h-11 min-h-11 items-center justify-center rounded-full bg-[var(--shop-purple)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--shop-purple-hover)]"
            >
              {isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                t('cart.summary.coupon.apply')
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}