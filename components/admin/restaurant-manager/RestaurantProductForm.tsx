"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { restaurantAdminService } from "@/lib/services/restaurant";
import { API_CONFIG } from "@/lib/config/api";
import { Loader2, UploadCloud, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import { Label } from "@/components/common/ui/label";
import { Textarea } from "@/components/common/ui/textarea";

interface RestaurantProductFormProps {
    restauranteId?: number; // Used by SuperAdmin
    initialProduct?: any;
    onCancelPath: string; // Used to know where to redirect after saving or cancelling
}

export default function RestaurantProductForm({ restauranteId, initialProduct, onCancelPath }: RestaurantProductFormProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "100",
        imagen_principal: "",
        dias_disponibles: [0, 1, 2, 3, 4, 5, 6],
        tps: 5,
        tvq: 9.975,
        tax_free: false
    });

    useEffect(() => {
        if (initialProduct) {
            setFormData({
                nombre: initialProduct.nombre || "",
                descripcion: initialProduct.descripcion || "",
                precio: initialProduct.precio || "",
                stock: initialProduct.stock !== undefined ? String(initialProduct.stock) : "100",
                imagen_principal: initialProduct.imagen_principal || "",
                dias_disponibles: initialProduct.dias_disponibles || [0, 1, 2, 3, 4, 5, 6],
                tps: initialProduct.TPS ?? 5,
                tvq: initialProduct.TVQ ?? 9.975,
                tax_free: initialProduct.TPS === 0 && initialProduct.TVQ === 0
            });
        }
    }, [initialProduct]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const result = await restaurantAdminService.uploadImage(file);
            setFormData({ ...formData, imagen_principal: result.url });
            toast.success("Imagen subida con éxito");
        } catch (error) {
            console.error(error);
            toast.error("Error al subir la imagen");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload: any = {
                ...formData,
                precio: parseFloat(formData.precio),
                stock: parseInt(formData.stock) || 0,
                TPS: formData.tax_free ? 0 : Number(formData.tps),
                TVQ: formData.tax_free ? 0 : Number(formData.tvq)
            };
            delete payload.tps;
            delete payload.tvq;
            delete payload.tax_free;

            if (restauranteId) {
                // Super Admin context
                const url = initialProduct 
                    ? `${API_CONFIG.BASE_URL}/restaurants/products/${initialProduct.id}?restauranteId=${restauranteId}`
                    : `${API_CONFIG.BASE_URL}/restaurants/products?restauranteId=${restauranteId}`;
                
                await fetch(url, {
                    method: initialProduct ? 'PUT' : 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}` 
                    },
                    body: JSON.stringify(payload)
                });
            } else {
                // Internal Restaurant context
                if (initialProduct) {
                    await restaurantAdminService.updateProduct(initialProduct.id, payload);
                } else {
                    await restaurantAdminService.createProduct(payload);
                }
            }
            toast.success(initialProduct ? "Producto actualizado" : "Producto creado");
            router.push(onCancelPath);
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Hubo un error al guardar");
        } finally {
            setLoading(false);
        }
    };

    const toggleDay = (dayIndex: number) => {
        const currentDays = formData.dias_disponibles;
        if (currentDays.includes(dayIndex)) {
            setFormData({ ...formData, dias_disponibles: currentDays.filter((d: number) => d !== dayIndex) });
        } else {
            setFormData({ ...formData, dias_disponibles: [...currentDays, dayIndex].sort() });
        }
    };

    const DAYS_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    return (
        <div className="bg-white rounded-3xl w-full shadow-sm overflow-hidden border border-slate-200/60 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                <div>
                    <h2 className="text-xl font-bold font-heading text-slate-900 tracking-tight">{initialProduct ? "Editar Producto" : "Nuevo Producto"}</h2>
                    <p className="text-xs text-slate-500 mt-1">Completa todos los campos obligatorios del inventario.</p>
                </div>
                <Button variant="ghost" onClick={() => router.push(onCancelPath)} className="h-10 rounded-xl px-4 font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 transition-colors flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Descartar
                </Button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 max-w-4xl max-h-max mx-auto w-full">
                <form id="productForm" onSubmit={handleSave} className="space-y-8">
                    <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold">Foto Principal</Label>
                        <div className="flex items-center gap-4 p-4 border rounded-2xl bg-slate-50/50">
                            {formData.imagen_principal && (
                                <img src={formData.imagen_principal} alt="Preview" className="w-24 h-24 rounded-xl object-cover border shadow-sm" />
                            )}
                            <div className="flex-1">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/jpeg, image/png, image/webp"
                                    onChange={handleImageUpload}
                                />
                                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="w-full bg-white h-12 border-slate-200 shadow-sm rounded-xl font-medium flex gap-2 text-indigo-600 hover:text-indigo-700 hover:border-indigo-200 hover:bg-indigo-50 transition-colors">
                                    {uploading ? <Loader2 className="w-5 h-5 animate-spin shrink-0" /> : <UploadCloud className="w-5 h-5 shrink-0" />}
                                    <span className="truncate">Cargar Archivo Local (.png, .jpg, .webp)</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <Label className="text-slate-700 font-semibold text-lg">Información General</Label>
                        <div className="space-y-2">
                            <Label className="text-slate-600 font-medium">Nombre del Plato o Producto</Label>
                            <Input
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                required
                                className="h-12 rounded-xl border-slate-200"
                                placeholder="Ej. Hamburguesa Clásica"
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                        <div className="space-y-2">
                            <Label className="text-slate-700 font-semibold">Precio de Venta</Label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={formData.precio}
                                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                                    required
                                    className="h-12 pl-8 rounded-xl border-slate-200"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label className="text-slate-700 font-semibold">Stock Inicial</Label>
                            <Input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                required
                                className="h-12 rounded-xl border-slate-200"
                                placeholder="Ej. 100"
                            />
                        </div>
                    </div>

                    <div className="space-y-6 pt-2 border-t border-slate-100">
                        <Label className="text-slate-700 font-semibold text-lg">Impuestos y Retenciones</Label>
                        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-colors">
                            <input
                                type="checkbox"
                                id="tax_free"
                                checked={formData.tax_free}
                                onChange={(e) => setFormData({ ...formData, tax_free: e.target.checked })}
                                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                            />
                            <div className="flex flex-col cursor-pointer" onClick={() => setFormData({ ...formData, tax_free: !formData.tax_free })}>
                                <Label htmlFor="tax_free" className="text-slate-800 font-bold m-0 cursor-pointer text-base">Marcar como Producto Libre de Impuestos (Tax Free)</Label>
                                <span className="text-sm text-slate-500 font-medium mt-0.5">Si está marcado, se ignorarán los valores de impuestos y se aplicará 0%.</span>
                            </div>
                        </div>

                        {!formData.tax_free && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-semibold">Impuesto TPS (%)</Label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            step="0.001"
                                            value={formData.tps}
                                            onChange={(e) => setFormData({ ...formData, tps: Number(e.target.value) })}
                                            required
                                            className="h-12 pr-8 rounded-xl border-slate-200"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">%</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-semibold">Impuesto TVQ (%)</Label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            step="0.001"
                                            value={formData.tvq}
                                            onChange={(e) => setFormData({ ...formData, tvq: Number(e.target.value) })}
                                            required
                                            className="h-12 pr-8 rounded-xl border-slate-200"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">%</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="space-y-2 pt-4 border-t border-slate-100">
                        <Label className="text-slate-700 font-semibold text-lg">Descripción Resumida</Label>
                        <Textarea
                            value={formData.descripcion}
                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                            className="rounded-xl border-slate-200 resize-none min-h-[120px] text-base"
                            placeholder="Explica detalladamente qué incluye este plato o producto, características especiales, etc..."
                        />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100 bg-slate-50/30 p-4 -mx-6 px-6 sm:mx-0 sm:px-4 sm:rounded-2xl">
                        <Label className="text-slate-700 font-semibold block text-lg">Días de Disponibilidad</Label>
                        <div className="flex flex-wrap gap-2">
                            {DAYS_NAMES.map((name, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => toggleDay(index)}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors
                                        ${formData.dias_disponibles.includes(index) 
                                            ? 'bg-indigo-600 text-white shadow-md' 
                                            : 'bg-white border text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-slate-500">Puedes remover los días en los que el plato no esté disponible si es estacional o tiene rotación semanal.</p>
                    </div>
                </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50/80 shrink-0 flex justify-end gap-4">
                <Button variant="outline" onClick={() => router.push(onCancelPath)} className="h-12 rounded-xl px-6 font-semibold shadow-sm w-full md:w-auto">
                    {initialProduct ? "Cancelar Edición" : "Descartar"}
                </Button>
                <Button disabled={loading} type="submit" form="productForm" className="h-12 w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm px-8 font-semibold tracking-wide">
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {initialProduct ? "Guardar Cambios" : "Confirmar e Insertar al Menú"}
                </Button>
            </div>
        </div>
    );
}
