"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/card';
import { Badge } from '@/components/common/ui/badge';
import { Button } from '@/components/common/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/ui/tabs';
import { ProductVariations } from '@/components/features/modules/product/ProductVariations';
import { CartItemVariations } from '@/components/features/modules/cart/CartItemVariations';
import { formatPrice } from '@/lib/utils';
import { ProductWithVariations, VariationSelection } from '@/types/variations';
import { CartItem } from '@/lib/services/cart';

/**
 * Componente de demostración del sistema completo de variaciones
 * Muestra ejemplos reales de diferentes tipos de productos con variaciones
 */
export function VariationsShowcase() {
  const [pizzaSelection, setPizzaSelection] = useState<VariationSelection | null>(null);
  const [clothingSelection, setClothingSelection] = useState<VariationSelection | null>(null);
  const [serviceSelection, setServiceSelection] = useState<VariationSelection | null>(null);

  // Ejemplos de productos con diferentes tipos de variaciones

  // 1. Pizza - Múltiples grupos (tamaño, masa, ingredientes)
  const pizzaProduct: ProductWithVariations = {
    id: 1001,
    nombre: "Pizza Margherita Artesanal",
    descripcion: "Pizza clásica con salsa de tomate, mozzarella fresca y albahaca",
    precio: 18.99,
    stock: 50,
    imagen_principal: "/images/pizza.jpg",
    categoria_id: 2,
    fecha_creacion: "2024-01-01",
    hasVariations: true,
    categorias: { id: 2, nombre: "Comidas" },
    variations: [
      {
        id: 1,
        group_name: "Tamaño",
        group_type: "single",
        is_required: true,
        min_selections: 1,
        max_selections: 1,
        display_order: 1,
        product_variations: [
          {
            id: 101,
            name: "Personal (8\")",
            description: "Perfecta para 1 persona",
            price_modifier: -3.00,
            is_default: false,
            stock: 20
          },
          {
            id: 102,
            name: "Mediana (12\")",
            description: "Ideal para 2-3 personas",
            price_modifier: 0,
            is_default: true,
            stock: 25
          },
          {
            id: 103,
            name: "Grande (16\")",
            description: "Para compartir en familia (4-5 personas)",
            price_modifier: 6.00,
            is_default: false,
            stock: 15
          }
        ]
      },
      {
        id: 2,
        group_name: "Tipo de Masa",
        group_type: "single",
        is_required: true,
        min_selections: 1,
        max_selections: 1,
        display_order: 2,
        product_variations: [
          {
            id: 201,
            name: "Masa Tradicional",
            description: "Masa clásica italiana",
            price_modifier: 0,
            is_default: true,
            stock: 50
          },
          {
            id: 202,
            name: "Masa Delgada",
            description: "Masa crujiente estilo napolitana",
            price_modifier: 1.50,
            is_default: false,
            stock: 30
          },
          {
            id: 203,
            name: "Masa Integral",
            description: "Masa de harina integral (más saludable)",
            price_modifier: 2.50,
            is_default: false,
            stock: 20
          }
        ]
      },
      {
        id: 3,
        group_name: "Ingredientes Extras",
        group_type: "multiple",
        is_required: false,
        min_selections: 0,
        max_selections: 5,
        display_order: 3,
        product_variations: [
          {
            id: 301,
            name: "Pepperoni",
            description: "Salami picante italiano",
            price_modifier: 2.50,
            is_default: false,
            stock: 100
          },
          {
            id: 302,
            name: "Champiñones",
            description: "Hongos frescos salteados",
            price_modifier: 1.50,
            is_default: false,
            stock: 50
          },
          {
            id: 303,
            name: "Aceitunas Negras",
            description: "Aceitunas kalamata",
            price_modifier: 1.00,
            is_default: false,
            stock: 80
          },
          {
            id: 304,
            name: "Queso Extra",
            description: "Doble porción de mozzarella",
            price_modifier: 3.00,
            is_default: false,
            stock: 40
          }
        ]
      }
    ]
  };

  // 2. Camiseta - Talla y color
  const clothingProduct: ProductWithVariations = {
    id: 1002,
    nombre: "Camiseta Artesanal Colombiana",
    descripcion: "Camiseta 100% algodón con diseños tradicionales",
    precio: 24.99,
    stock: 100,
    imagen_principal: "/images/camiseta.jpg",
    categoria_id: 3,
    fecha_creacion: "2024-01-01",
    hasVariations: true,
    categorias: { id: 3, nombre: "Boutique" },
    variations: [
      {
        id: 4,
        group_name: "Talla",
        group_type: "single",
        is_required: true,
        min_selections: 1,
        max_selections: 1,
        display_order: 1,
        product_variations: [
          {
            id: 401,
            name: "S",
            description: "Small - Pecho: 86-91cm",
            price_modifier: 0,
            is_default: false,
            stock: 15
          },
          {
            id: 402,
            name: "M",
            description: "Medium - Pecho: 96-101cm",
            price_modifier: 0,
            is_default: true,
            stock: 25
          },
          {
            id: 403,
            name: "L",
            description: "Large - Pecho: 106-111cm",
            price_modifier: 0,
            is_default: false,
            stock: 20
          },
          {
            id: 404,
            name: "XL",
            description: "Extra Large - Pecho: 116-121cm",
            price_modifier: 2.00,
            is_default: false,
            stock: 10
          }
        ]
      },
      {
        id: 5,
        group_name: "Color",
        group_type: "single",
        is_required: true,
        min_selections: 1,
        max_selections: 1,
        display_order: 2,
        product_variations: [
          {
            id: 501,
            name: "Blanco Natural",
            description: "Algodón blanco natural",
            price_modifier: 0,
            is_default: true,
            stock: 30
          },
          {
            id: 502,
            name: "Azul Caribe",
            description: "Azul inspirado en el Caribe colombiano",
            price_modifier: 1.00,
            is_default: false,
            stock: 25
          },
          {
            id: 503,
            name: "Rojo Guayacán",
            description: "Rojo tradicional con tintes naturales",
            price_modifier: 1.50,
            is_default: false,
            stock: 20
          }
        ]
      }
    ]
  };

  // 3. Servicio de limpieza - Tipo de vehículo y servicios adicionales
  const serviceProduct: ProductWithVariations = {
    id: 1003,
    nombre: "Servicio de Limpieza de Vehículos",
    descripcion: "Limpieza profesional completa para tu vehículo",
    precio: 35.00,
    stock: 999,
    imagen_principal: "/images/car-wash.jpg",
    categoria_id: 4,
    fecha_creacion: "2024-01-01",
    hasVariations: true,
    categorias: { id: 4, nombre: "Servicios" },
    variations: [
      {
        id: 6,
        group_name: "Tipo de Vehículo",
        group_type: "single",
        is_required: true,
        min_selections: 1,
        max_selections: 1,
        display_order: 1,
        product_variations: [
          {
            id: 601,
            name: "Auto Compacto",
            description: "Sedán pequeño, hatchback",
            price_modifier: 0,
            is_default: true,
            available: true
          },
          {
            id: 602,
            name: "SUV / Camioneta",
            description: "Vehículos grandes tipo SUV",
            price_modifier: 15.00,
            is_default: false,
            available: true
          },
          {
            id: 603,
            name: "Van / Minibús",
            description: "Vehículos comerciales grandes",
            price_modifier: 25.00,
            is_default: false,
            available: true
          }
        ]
      },
      {
        id: 7,
        group_name: "Servicios Adicionales",
        group_type: "multiple",
        is_required: false,
        min_selections: 0,
        max_selections: 4,
        display_order: 2,
        product_variations: [
          {
            id: 701,
            name: "Encerado Premium",
            description: "Cera protectora de alta calidad",
            price_modifier: 12.00,
            is_default: false,
            available: true
          },
          {
            id: 702,
            name: "Limpieza de Motor",
            description: "Limpieza profunda del compartimento del motor",
            price_modifier: 18.00,
            is_default: false,
            available: true
          },
          {
            id: 703,
            name: "Tratamiento de Llantas",
            description: "Limpieza y brillo para llantas",
            price_modifier: 8.00,
            is_default: false,
            available: true
          },
          {
            id: 704,
            name: "Ambientador Especial",
            description: "Fragancia duradera para el interior",
            price_modifier: 5.00,
            is_default: false,
            available: true
          }
        ]
      }
    ]
  };

  // Ejemplo de item en carrito con variaciones
  const cartItemExample: CartItem = {
    id: "cart_001",
    usuario_id: "user_123",
    producto_id: 1001,
    cantidad: 2,
    productos: {
      id: 1001,
      nombre: "Pizza Margherita Artesanal",
      descripcion: "Pizza clásica con salsa de tomate, mozzarella fresca y albahaca",
      precio: 18.99,
      imagen_principal: "/images/pizza.jpg",
      stock: 50,
      categoria_id: 2,
      categorias: { id: 2, nombre: "Comidas" }
    },
    variations: [
      {
        cart_item_id: "cart_001",
        quantity: 1,
        price_at_time: 6.00,
        product_variations: {
          id: 103,
          name: "Grande (16\")",
          description: "Para compartir en familia",
          price_modifier: 6.00
        }
      },
      {
        cart_item_id: "cart_001",
        quantity: 1,
        price_at_time: 2.50,
        product_variations: {
          id: 301,
          name: "Pepperoni",
          description: "Salami picante italiano",
          price_modifier: 2.50
        }
      },
      {
        cart_item_id: "cart_001",
        quantity: 2,
        price_at_time: 1.50,
        product_variations: {
          id: 302,
          name: "Champiñones",
          description: "Hongos frescos salteados",
          price_modifier: 1.50
        }
      }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🎨 Sistema de Variaciones de Productos
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Demostración completa del sistema de variaciones con ejemplos reales: 
          productos con opciones únicas, múltiples selecciones, precios dinámicos y visualización en carrito.
        </p>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products">🛍️ Selección de Productos</TabsTrigger>
          <TabsTrigger value="cart">🛒 Visualización en Carrito</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-8">
          {/* Pizza Example */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    🍕 {pizzaProduct.nombre}
                    <Badge variant="secondary">Múltiples opciones</Badge>
                  </div>
                  <p className="text-gray-600 mt-2">{pizzaProduct.descripcion}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {pizzaSelection ? formatPrice(pizzaSelection.finalPrice) : `Desde ${formatPrice(pizzaProduct.precio)}`}
                  </div>
                  {pizzaSelection && (
                    <div className="text-sm text-gray-500">
                      Base: {formatPrice(pizzaProduct.precio)} + {formatPrice(pizzaSelection.totalPriceModifier)}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ProductVariations
                product={pizzaProduct}
                onSelectionChange={setPizzaSelection}
                showPriceBreakdown={true}
              />
              {pizzaSelection?.isValid && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-700 font-medium">
                    ✅ Configuración válida - Lista para agregar al carrito
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Clothing Example */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    👕 {clothingProduct.nombre}
                    <Badge variant="secondary">Talla y Color</Badge>
                  </CardTitle>
                  <p className="text-gray-600 mt-2">{clothingProduct.descripcion}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {clothingSelection ? formatPrice(clothingSelection.finalPrice) : formatPrice(clothingProduct.precio)}
                  </div>
                  {clothingSelection && clothingSelection.totalPriceModifier !== 0 && (
                    <div className="text-sm text-gray-500">
                      Base: {formatPrice(clothingProduct.precio)} + {formatPrice(clothingSelection.totalPriceModifier)}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ProductVariations
                product={clothingProduct}
                onSelectionChange={setClothingSelection}
                showPriceBreakdown={true}
              />
            </CardContent>
          </Card>

          {/* Service Example */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    🚗 {serviceProduct.nombre}
                    <Badge variant="secondary">Servicios</Badge>
                  </CardTitle>
                  <p className="text-gray-600 mt-2">{serviceProduct.descripcion}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {serviceSelection ? formatPrice(serviceSelection.finalPrice) : `Desde ${formatPrice(serviceProduct.precio)}`}
                  </div>
                  {serviceSelection && serviceSelection.totalPriceModifier !== 0 && (
                    <div className="text-sm text-gray-500">
                      Base: {formatPrice(serviceProduct.precio)} + {formatPrice(serviceSelection.totalPriceModifier)}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ProductVariations
                product={serviceProduct}
                onSelectionChange={setServiceSelection}
                showPriceBreakdown={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cart" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>🛒 Ejemplo de Item en Carrito con Variaciones</CardTitle>
              <p className="text-gray-600">
                Así se ve un producto con variaciones una vez agregado al carrito.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Compact view */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  Vista Compacta
                  <Badge variant="outline">Carrito</Badge>
                </h3>
                <CartItemVariations item={cartItemExample} showDetailed={false} />
              </div>

              {/* Detailed view */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  Vista Detallada
                  <Badge variant="outline">Expandida</Badge>
                </h3>
                <CartItemVariations item={cartItemExample} showDetailed={true} />
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>📊 Información del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">3</div>
                  <div className="text-sm text-blue-700">Tipos de productos</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">7</div>
                  <div className="text-sm text-green-700">Grupos de variaciones</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">18</div>
                  <div className="text-sm text-purple-700">Opciones totales</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>✨ Características del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-green-600 mb-2">🎯 Validación Inteligente</h4>
              <p className="text-sm text-gray-600">
                Validación en tiempo real de opciones requeridas, límites mínimos y máximos
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-blue-600 mb-2">💰 Cálculo Dinámico</h4>
              <p className="text-sm text-gray-600">
                Precios actualizados automáticamente con modificadores positivos y negativos
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-purple-600 mb-2">📦 Gestión de Stock</h4>
              <p className="text-sm text-gray-600">
                Control de inventario por variación individual con alertas de disponibilidad
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-orange-600 mb-2">🛒 Integración Completa</h4>
              <p className="text-sm text-gray-600">
                Carrito, checkout y órdenes manejan variaciones con precios históricos
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-red-600 mb-2">🎨 UI Adaptativa</h4>
              <p className="text-sm text-gray-600">
                Interfaz que se adapta según el tipo: radio buttons o checkboxes
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-indigo-600 mb-2">🔄 Estados Avanzados</h4>
              <p className="text-sm text-gray-600">
                Manejo de opciones por defecto, agotadas y con stock limitado
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default VariationsShowcase;