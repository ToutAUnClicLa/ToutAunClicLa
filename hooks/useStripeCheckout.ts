// hooks/useStripeCheckout.ts
import { useState, useCallback } from 'react';
import type { StripeCheckoutResponse } from '@/lib/services/cart';

interface CheckoutParams {
  addressId: string;
  couponCode?: string;
}

interface CheckoutResult {
  success: boolean;
  data?: StripeCheckoutResponse;
  error?: string;
}

export const useStripeCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckoutSession = useCallback(async (params: CheckoutParams): Promise<CheckoutResult> => {
    setLoading(true);
    setError(null);

    try {
      console.log('🚀 Creating checkout session...', params);
      
      const response = await fetch('/api/v1/stripe/checkout/create-session', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          shipping_address_id: params.addressId,
          coupon_code: params.couponCode || '',
          success_url: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/checkout/cancel`
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data: StripeCheckoutResponse = await response.json();
      
      console.log('✅ Checkout session created:', data.sessionId);

      // ✨ NEW - Log específico para promociones
      if (data.orderSummary.promotionApplied) {
        console.log('🎉 Promotion detected in checkout!', {
          originalShipping: data.orderSummary.originalShippingCost,
          finalShipping: data.orderSummary.shippingCost,
          discount: data.orderSummary.shippingDiscount,
          totalSavings: data.orderSummary.savings
        });
      }

      // Redirigir a Stripe
      window.location.href = data.url;
      
      return { success: true, data };
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creating checkout';
      setError(errorMessage);
      console.error('❌ Checkout error:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createCheckoutSession
  };
};