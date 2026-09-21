"use client";

import { RestaurantProfileForm } from "@/components/admin/restaurant-manager";

export default function PerfilPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">Perfil de tu Tienda</h1>
                    <p className="text-slate-500 text-sm mt-1">Configura la información pública y horarios de atención de tu restaurante.</p>
                </div>
            </div>

            <RestaurantProfileForm />
        </div>
    );
}
