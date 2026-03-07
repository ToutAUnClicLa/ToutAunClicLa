"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RestaurantProductForm from "@/components/admin/restaurant-manager/RestaurantProductForm";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EditarProductoSuperAdminPage() {
    const params = useParams();
    const router = useRouter();
    const restauranteId = params?.id ? Number(params.id) : undefined;
    const productId = params?.productId;
    
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!restauranteId || !productId) return;
            
            try {
                // Obtenemos todos los productos de este restaurante como Super Admin
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500/api/v1'}/restaurants/products?restauranteId=${restauranteId}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
                });
                
                if (!res.ok) throw new Error("Error fetching products");
                const jsonData = await res.json();
                
                // Encontrar el producto específico
                const foundProduct = jsonData.products?.find((p: any) => p.id === Number(productId));
                
                if (foundProduct) {
                    setProduct(foundProduct);
                } else {
                    toast.error("Producto no encontrado.");
                    router.push(`/admin/restaurantes/${restauranteId}`);
                }
            } catch (error) {
                console.error("Error cargando producto:", error);
                toast.error("No se pudo cargar el producto.");
                router.push(`/admin/restaurantes/${restauranteId}`);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [restauranteId, productId, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <RestaurantProductForm 
                restauranteId={restauranteId}
                initialProduct={product}
                onCancelPath={`/admin/restaurantes/${restauranteId}`} 
            />
        </div>
    );
}
