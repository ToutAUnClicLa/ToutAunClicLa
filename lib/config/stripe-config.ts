// Configuración de productos Stripe
export type ProductId = string;

// Definir los tipos de productos
export type StripeMode = 'payment' | 'subscription';

export interface StripeProduct {
  id: ProductId;
  name: string;
  price: number;
  priceId: string; // ID de precio en Stripe
  mode: StripeMode; // Modo de pago (pago único o suscripción)
  description?: string;
}

export const products: Record<string, StripeProduct> = {
  basic: {
    id: 'prod_basic',
    name: 'Plan Básico',
    price: 999, // En centavos, $9.99
    priceId: 'price_basic_123', // Reemplazar con el ID real de Stripe
    mode: 'subscription',
    description: 'Acceso a funcionalidades básicas de la plataforma'
  },
  premium: {
    id: 'prod_premium',
    name: 'Plan Premium',
    price: 1999, // En centavos, $19.99
    priceId: 'price_premium_123', // Reemplazar con el ID real de Stripe
    mode: 'subscription',
    description: 'Acceso a funcionalidades premium y soporte prioritario'
  },
  enterprise: {
    id: 'prod_enterprise',
    name: 'Plan Empresarial',
    price: 4999, // En centavos, $49.99
    priceId: 'price_enterprise_123', // Reemplazar con el ID real de Stripe
    mode: 'subscription',
    description: 'Solución completa para empresas con soporte 24/7'
  },
};

// Configuración de Stripe
export const stripeConfig = {
  publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '',
  apiVersion: '2023-10-16',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
}; 