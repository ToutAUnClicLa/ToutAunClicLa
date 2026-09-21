"use client";

import RestaurantProductForm from "@/components/admin/restaurant-manager/RestaurantProductForm";

export default function NuevoProductoPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <RestaurantProductForm 
                onCancelPath="/restaurante/productos" 
            />
        </div>
    );
}
