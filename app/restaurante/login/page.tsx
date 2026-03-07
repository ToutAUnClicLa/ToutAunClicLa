"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import { Label } from "@/components/common/ui/label";
import { toast } from "sonner";
import { Store, Loader2 } from "lucide-react";
import { restaurantAdminService } from "@/lib/services/restaurant";

export default function RestaurantLogin() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ username: "", password: "" });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await restaurantAdminService.login(formData);
            localStorage.setItem("restaurant_token", data.token);
            toast.success("Login exitoso");
            router.push("/restaurante/pedidos");
        } catch (error: any) {
            toast.error(error.message || "Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 z-0 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 z-0 pointer-events-none"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="flex flex-col items-center justify-center space-y-4 mb-8">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-indigo-600 shadow-xl shadow-indigo-100/50 border border-slate-100 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Store className="w-10 h-10 relative z-10 drop-shadow-sm" />
                    </div>
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-black font-heading text-slate-900 tracking-tight">Portal de Socios</h1>
                        <p className="text-slate-500 text-sm font-medium">Inicia sesión para administrar tu restaurante</p>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100/60 p-8 sm:p-10 backdrop-blur-xl bg-white/80">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-3">
                            <Label htmlFor="username" className="text-slate-700 font-semibold text-sm ml-1">Usuario del Restaurante</Label>
                            <Input
                                id="username"
                                type="text"
                                required
                                placeholder="Ej: mimarca"
                                value={formData.username}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, username: e.target.value })}
                                className="h-14 rounded-2xl border-slate-200 focus-visible:ring-indigo-100 focus-visible:border-indigo-400 bg-slate-50/50 px-4 text-base transition-colors hover:bg-slate-50"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="password" className="text-slate-700 font-semibold text-sm ml-1">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                                className="h-14 rounded-2xl border-slate-200 focus-visible:ring-indigo-100 focus-visible:border-indigo-400 bg-slate-50/50 px-4 text-base transition-colors hover:bg-slate-50"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-[0_8px_16px_-6px_rgba(79,70,229,0.5)] font-semibold text-base transition-all hover:-translate-y-0.5 mt-4 border border-indigo-500"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                            {loading ? "Verificando..." : "Ingresar al Panel"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
