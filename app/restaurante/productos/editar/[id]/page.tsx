"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RestaurantProductForm from "@/components/admin/restaurant-manager/RestaurantProductForm";
import { restaurantAdminService } from "@/lib/services/restaurant";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EditarProductoPage() {
    const params = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                if (params?.id) {
                    const data = await restaurantAdminService.getProduct(params.id as string);
                    setProduct(data);
                }
            } catch (error) {
                console.error("Error cargando producto:", error);
                toast.error("No se pudo cargar el producto.");
                router.push("/restaurante/productos");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [params?.id, router]);

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
                initialProduct={product}
                onCancelPath="/restaurante/productos" 
            />
        </div>
    );
}
