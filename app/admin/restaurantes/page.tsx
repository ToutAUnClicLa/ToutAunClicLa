"use client";

import { useEffect, useState } from "react";
import { superAdminService } from "@/lib/services/superAdmin";
import { Loader2, Plus, Store, KeyRound, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import { Label } from "@/components/common/ui/label";
import { Textarea } from "@/components/common/ui/textarea";
import Link from "next/link";

export default function SuperAdminRestaurantes() {
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [isCredModalOpen, setIsCredModalOpen] = useState(false);

    // Credentials Modals State
    const [selectedRest, setSelectedRest] = useState<any>(null);
    const [credData, setCredData] = useState({ username: "", password: "", is_active: true });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await superAdminService.getRestaurants();
            setRestaurants(data);
        } catch (error: any) {
            toast.error(error.message || "Error al cargar restaurantes");
        } finally {
            setLoading(false);
        }
    };

    const openCredentialsModal = (rest: any) => {
        setSelectedRest(rest);
        if (rest.auth_user) {
            setCredData({
                username: rest.auth_user.username,
                password: "", // Nunca mostrada
                is_active: rest.auth_user.is_active
            });
        } else {
            setCredData({ username: "", password: "", is_active: true });
        }
        setIsCredModalOpen(true);
    };

    const handleSaveCredentials = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedRest.auth_user) {
                // Update existing
                await superAdminService.updateCredentials(selectedRest.auth_user.id, {
                    username: credData.username,
                    ...(credData.password ? { password: credData.password } : {}),
                    is_active: credData.is_active
                });
                toast.success("Credenciales actualizadas");
            } else {
                // Create new
                await superAdminService.createCredentials({
                    restaurante_id: selectedRest.id,
                    username: credData.username,
                    password: credData.password
                });
                toast.success("Credenciales creadas. ¡Ya pueden iniciar sesión!");
            }
            setIsCredModalOpen(false);
            fetchData();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const totalPages = Math.ceil(restaurants.length / itemsPerPage);
    const paginatedRestaurants = restaurants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-slate-900">Gestión de Restaurantes</h1>
                    <p className="text-slate-500 text-sm">Crea nuevos restaurantes y asigna contraseñas a sus dueños</p>
                </div>
                <Link href="/admin/restaurantes/nuevo" className="w-full lg:w-auto">
                    <Button className="w-full lg:w-auto bg-indigo-600 hover:bg-indigo-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Añadir Restaurante
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Restaurante</th>
                                <th className="px-6 py-4">Estado Info</th>
                                <th className="px-6 py-4">Acceso al Panel</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginatedRestaurants.map((rest) => (
                                <tr key={rest.id} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                                                {rest.Imagen ? <img src={rest.Imagen} alt="" className="w-full h-full object-cover" /> : <Store className="w-5 h-5 text-slate-400" />}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">{rest.nombre}</p>
                                                <p className="text-xs text-slate-500 truncate max-w-[200px]">{rest.Descripcion || "Sin descripción"}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${rest.disponible ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                                            {rest.disponible ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                            {rest.disponible ? 'Visible' : 'Oculto'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {rest.auth_user ? (
                                            <div>
                                                <p className="font-medium text-slate-900">@{rest.auth_user.username}</p>
                                                <p className="text-xs font-medium mt-0.5">
                                                    {rest.auth_user.is_active ?
                                                        <span className="text-green-600">Activo</span> :
                                                        <span className="text-red-600">Suspendido</span>
                                                    }
                                                </p>
                                            </div>
                                        ) : (
                                            <span className="text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md text-xs font-medium border border-amber-200">
                                                Sin credenciales
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="sm" onClick={() => openCredentialsModal(rest)} className="text-slate-600 border-slate-200 hover:bg-slate-50">
                                                <KeyRound className="w-4 h-4" />
                                            </Button>
                                            <Link href={`/admin/restaurantes/${rest.id}`}>
                                                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-semibold tracking-wide h-9 px-4">
                                                    Gestionar Local <ArrowRight className="w-4 h-4 ml-2" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {totalPages > 1 && (
                    <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                        <span className="text-sm text-slate-500">
                            Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, restaurants.length)} de {restaurants.length} restaurantes
                        </span>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                Anterior
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Siguiente
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Accesos */}
            {isCredModalOpen && selectedRest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsCredModalOpen(false)} />
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm relative z-10 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
                            <KeyRound className="w-5 h-5 text-indigo-600" />
                            <h2 className="text-lg font-semibold text-slate-900">Accesos: {selectedRest.nombre}</h2>
                        </div>

                        <form onSubmit={handleSaveCredentials} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label>Nombre de Usuario</Label>
                                <Input required value={credData.username} onChange={e => setCredData({ ...credData, username: e.target.value })} placeholder="Ej. miarepa" />
                                <p className="text-xs text-slate-500">Único para todo el sistema.</p>
                            </div>

                            <div className="space-y-2">
                                <Label>{selectedRest.auth_user ? "Nueva Contraseña (Opcional)" : "Contraseña Compartida"}</Label>
                                <Input
                                    required={!selectedRest.auth_user}
                                    type="password"
                                    value={credData.password}
                                    onChange={e => setCredData({ ...credData, password: e.target.value })}
                                    placeholder={selectedRest.auth_user ? "Dejar en blanco para mantener" : "••••••••"}
                                />
                            </div>

                            {selectedRest.auth_user && (
                                <div className="pt-2">
                                    <Label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={credData.is_active}
                                            onChange={(e) => setCredData({ ...credData, is_active: e.target.checked })}
                                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                        <span className="font-medium text-slate-900">Cuenta Activa</span>
                                    </Label>
                                    <p className="text-xs text-slate-500 ml-5 mt-1">Desmárcalo para prohibir el inicio de sesión a este usuario.</p>
                                </div>
                            )}

                            <div className="pt-4 flex justify-end gap-3">
                                <Button type="button" variant="ghost" onClick={() => setIsCredModalOpen(false)}>Cancelar</Button>
                                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                                    {selectedRest.auth_user ? "Guardar" : "Generar Accesos"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
