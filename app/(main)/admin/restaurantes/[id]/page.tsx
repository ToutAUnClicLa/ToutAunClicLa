"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { superAdminService } from "@/lib/services/superAdmin";
import { Loader2, ArrowLeft, Store, Package, Settings, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/common/ui/tabs";
import { toast } from "sonner";
import { RestaurantProfileForm, RestaurantProductsManager } from "@/components/admin/restaurant-manager";

export default function SuperAdminRestaurantDetail() {
    const params = useParams();
    const router = useRouter();
    const [restaurantId, setRestaurantId] = useState<number | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            setRestaurantId(Number(params.id));
        }
    }, [params]);

    useEffect(() => {
        if (restaurantId) {
            fetchRestaurantData(restaurantId);
        }
    }, [restaurantId]);

    const fetchRestaurantData = async (id: number) => {
        try {
            const data = await superAdminService.getRestaurantProfile(id);
            setProfile(data);
        } catch (error) {
            toast.error("Error cargando el restaurante");
            router.push("/admin/restaurantes");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Cabecera */}
            <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
                <Link
                    href="/admin/restaurantes"
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-800"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight flex items-center gap-3">
                        {profile?.nombre || "Detalle del Restaurante"}
                        {profile?.disponible && (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold tracking-wide border border-emerald-200">
                                Activo
                            </span>
                        )}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1 flex items-center gap-1.5">
                        <Settings className="w-3.5 h-3.5" />
                        Modo de Control Maestro (Super Admin)
                    </p>
                </div>
            </div>

            <p className="text-sm font-medium text-amber-600 bg-amber-50 border border-amber-200 p-4 rounded-xl">
                Cualquier cambio realizado en esta vista impactará directamente la base de datos de producción de este restaurante. Utiliza estas herramientas con precaución.
            </p>

            <Tabs defaultValue="perfil" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 bg-slate-100/80 p-1 rounded-xl">
                    <TabsTrigger value="perfil" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Store className="w-4 h-4 mr-2" />
                        Perfil y Config
                    </TabsTrigger>
                    <TabsTrigger value="productos" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Package className="w-4 h-4 mr-2" />
                        Catálogo
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="perfil" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                   <RestaurantProfileForm restauranteId={restaurantId!} />
                </TabsContent>

                <TabsContent value="productos" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                   <RestaurantProductsManager restauranteId={restaurantId!} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
