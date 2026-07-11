"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RestaurantProductForm from "@/components/admin/restaurant-manager/RestaurantProductForm";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { API_CONFIG } from "@/lib/config/api";

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
                // Usamos el endpoint de producto individual para obtener el precio
                // CRUDO de la BD (sin descuento aplicado). Si usáramos el listado
                // público, el precio ya vendría descontado y al guardar se compondría.
                const res = await fetch(
                    `${API_CONFIG.BASE_URL}/restaurants/products/${productId}?restauranteId=${restauranteId}`,
                    { headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` } }
                );

                if (!res.ok) throw new Error("Error fetching product");
                const jsonData = await res.json();
                const foundProduct = jsonData.product ?? jsonData;

                if (foundProduct?.id) {
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
