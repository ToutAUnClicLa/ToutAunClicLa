import { Metadata } from 'next';
import VariationsShowcase from '@/components/demo/VariationsShowcase';

export const metadata: Metadata = {
  title: 'Sistema de Variaciones - Demo | Tout Au N Clic Là',
  description: 'Demostración completa del sistema de variaciones de productos con ejemplos reales y funcionalidades avanzadas.',
  keywords: 'variaciones, productos, personalización, opciones, precios dinámicos',
};

export default function VariationsDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <VariationsShowcase />
    </div>
  );
}