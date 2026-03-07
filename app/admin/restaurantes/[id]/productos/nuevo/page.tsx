"use client";

import { useParams } from "next/navigation";
import RestaurantProductForm from "@/components/admin/restaurant-manager/RestaurantProductForm";

export default function NuevoProductoSuperAdminPage() {
    const params = useParams();
    const restauranteId = params?.id ? Number(params.id) : undefined;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <RestaurantProductForm 
                restauranteId={restauranteId}
                onCancelPath={`/admin/restaurantes/${restauranteId}`} 
            />
        </div>
    );
}
