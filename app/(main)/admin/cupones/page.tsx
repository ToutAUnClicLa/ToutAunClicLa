"use client";

import { useEffect, useState } from "react";
import { superAdminService } from "@/lib/services/superAdmin";
import { Loader2, Ticket, Plus, Link as LinkIcon, Calendar, Hash, Tag, PowerOff, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/common/ui/input";
import { Button } from "@/components/common/ui/button";
import { Label } from "@/components/common/ui/label";

export default function SuperAdminCupones() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [isCModalOpen, setIsCModalOpen] = useState(false);
    
    const [newCoupon, setNewCoupon] = useState({
        codigo: "",
        descuento: "",
        limite_usos: "",
        fecha_expiracion: "",
        descripcion: ""
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const data = await superAdminService.getAllCoupons();
            setCoupons(data);
        } catch (error: any) {
            toast.error(error.message || "Error al cargar cupones");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await superAdminService.createCoupon({
                ...newCoupon,
                limite_usos: newCoupon.limite_usos ? parseInt(newCoupon.limite_usos) : null,
                descuento: newCoupon.descuento ? parseFloat(newCoupon.descuento) : 0
            });
            toast.success("Cupón creado exitosamente");
            setIsCModalOpen(false);
            fetchCoupons();
        } catch (error: any) {
            toast.error(error.message || "Error creando cupón");
        }
    };

    const handleToggleStatus = async (id: string, currentlyActive: boolean) => {
        try {
            await superAdminService.toggleCouponStatus(id, !currentlyActive);
            toast.success(currentlyActive ? "Cupón Desactivado" : "Cupón Activado");
            fetchCoupons();
        } catch (error: any) {
            toast.error(error.message || "Error al actualizar cupón");
        }
    };

    const handleDeleteCoupon = async (id: string) => {
        if (!confirm("¿Seguro que deseas eliminar este cupón definitivamente?")) return;
        try {
            await superAdminService.deleteCoupon(id);
            toast.success("Cupón eliminado");
            fetchCoupons();
        } catch (error: any) {
            toast.error(error.message || "Error al eliminar");
        }
    };

    const totalPages = Math.ceil(coupons.length / itemsPerPage);
    const paginatedCoupons = coupons.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                    <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight flex items-center gap-2">
                        <Ticket className="w-6 h-6 text-indigo-600" />
                        Marketing y Cupones
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Genera códigos de descuento o campañas de envío gratis para los clientes.</p>
                </div>
                <Button onClick={() => { setNewCoupon({ codigo: "", descuento: "", limite_usos: "", fecha_expiracion: "", descripcion: "" }); setIsCModalOpen(true); }} className="w-full lg:w-auto bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Cupón
                </Button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Cupón</th>
                                <th className="px-6 py-4">Beneficio</th>
                                <th className="px-6 py-4">Condiciones</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginatedCoupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                                                <Tag className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 tracking-widest">{coupon.codigo}</p>
                                                <p className="text-xs text-slate-500 truncate max-w-[200px]">{coupon.descripcion || "Sin descripción"}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {coupon.descuento == 0 ? (
                                            <span className="font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md text-xs border border-emerald-200">
                                                Envío Gratis
                                            </span>
                                        ) : (
                                            <span className="font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md text-xs border border-amber-200">
                                                {coupon.descuento}% OFF
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="flex items-center gap-1.5 text-xs">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                {coupon.fecha_expiracion ? new Date(coupon.fecha_expiracion).toLocaleDateString() : 'Sin fecha límite'}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-xs">
                                                <Hash className="w-3.5 h-3.5 text-slate-400" />
                                                {coupon.limite_usos ? `Máx ${coupon.limite_usos} usos` : 'Usos ilimitados'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                         {coupon.activo ? (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                Activo
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                Pausado
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleToggleStatus(coupon.id, coupon.activo)}
                                                className={coupon.activo ? "text-amber-600 border-amber-200 hover:bg-amber-50" : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"}
                                            >
                                                <PowerOff className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteCoupon(coupon.id)}
                                                className="text-rose-600 border-rose-200 hover:bg-rose-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {coupons.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        No hay cupones creados aún.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {totalPages > 1 && (
                    <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                        <span className="text-sm text-slate-500">
                            Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, coupons.length)} de {coupons.length} cupones
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

            {/* Modal Creación Cupón */}
            {isCModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsCModalOpen(false)} />
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold font-heading text-slate-900">Crear Nuevo Cupón</h3>
                        </div>

                        <form onSubmit={handleCreateCoupon} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="codigo">Código del Cupón</Label>
                                <Input
                                    id="codigo"
                                    placeholder="Ej: VERANO2025"
                                    value={newCoupon.codigo}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, codigo: e.target.value.toUpperCase() })}
                                    required
                                    className="uppercase font-bold tracking-widest"
                                />
                                <p className="text-[11px] text-slate-500">Los espacios serán removidos automáticamente.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="descuento">Porcentaje de Descuento (%)</Label>
                                <div className="flex items-center gap-3">
                                    <Input
                                        id="descuento"
                                        type="number"
                                        min="0"
                                        max="100"
                                        placeholder="0"
                                        value={newCoupon.descuento}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, descuento: e.target.value })}
                                        className="w-24"
                                    />
                                    <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
                                        {newCoupon.descuento === "0" || !newCoupon.descuento ? '¡Será Envío Gratis!' : 'Descuento al subtotal'}
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-500">Deje en 0 para otorgar Envío Gratis.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="limite">Límite de usos</Label>
                                    <Input
                                        id="limite"
                                        type="number"
                                        min="1"
                                        placeholder="Ilimitado"
                                        value={newCoupon.limite_usos}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, limite_usos: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fecha">Vencimiento</Label>
                                    <Input
                                        id="fecha"
                                        type="date"
                                        value={newCoupon.fecha_expiracion}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, fecha_expiracion: e.target.value })}
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="desc">Descripción Interna</Label>
                                <Input
                                    id="desc"
                                    placeholder="Campaña del día de la madre"
                                    value={newCoupon.descripcion}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, descripcion: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <Button type="button" variant="outline" onClick={() => setIsCModalOpen(false)}>Cancelar</Button>
                                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Crear Cupón</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
