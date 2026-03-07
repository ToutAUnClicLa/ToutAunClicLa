"use client";

import { useState, useRef } from "react";
import { superAdminService } from "@/lib/services/superAdmin";
import { countryFlags } from "@/lib/services/restaurants";
import { Loader2, Store, UploadCloud, X, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import { Label } from "@/components/common/ui/label";
import { Textarea } from "@/components/common/ui/textarea";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NuevoRestaurantePage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profile, setProfile] = useState<any>({
        nombre: "",
        Descripcion: "",
        Imagen: "",
        nacionalidades: []
    });

    const toggleNacionalidad = (pais: string) => {
        const current = profile.nacionalidades || [];
        if (current.includes(pais)) {
            setProfile({ ...profile, nacionalidades: current.filter((n: string) => n !== pais) });
        } else {
            setProfile({ ...profile, nacionalidades: [...current, pais] });
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const result = await superAdminService.uploadImage(file);
            setProfile({ ...profile, Imagen: result.url });
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
        setSaving(true);
        try {
            await superAdminService.createRestaurant(profile);
            toast.success("Restaurante creado con éxito");
            router.push("/admin/restaurantes");
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Hubo un error al crear el restaurante");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/admin/restaurantes">
                    <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 rounded-full border-slate-200">
                        <ArrowLeft className="w-4 h-4 text-slate-600" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold font-heading text-slate-900 tracking-tight">Crear Nuevo Restaurante</h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">Llena los datos básicos. Luego podrás asignarle credenciales desde la lista principal.</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-5 sm:p-8 space-y-6 sm:space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 z-0"></div>
                
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                    <div className="space-y-3">
                        <Label className="text-slate-700 font-semibold">Nombre del Restaurante <span className="text-red-500">*</span></Label>
                        <Input
                            value={profile.nombre}
                            onChange={(e) => setProfile({ ...profile, nombre: e.target.value })}
                            required
                            placeholder="Ej. L'Arepa Express"
                            className="rounded-xl border-slate-200 focus-visible:ring-indigo-100 focus-visible:border-indigo-400"
                        />
                    </div>
                </div>

                <div className="relative z-10 space-y-3">
                    <Label className="text-slate-700 font-semibold">Descripción del Negocio</Label>
                    <Textarea
                        rows={3}
                        value={profile.Descripcion}
                        onChange={(e) => setProfile({ ...profile, Descripcion: e.target.value })}
                        placeholder="Breve historia o estilo del restaurante..."
                        className="rounded-xl border-slate-200 focus-visible:ring-indigo-100 focus-visible:border-indigo-400 resize-none"
                    />
                </div>

                <div className="relative z-10 space-y-3">
                    <Label className="text-slate-700 font-semibold mb-2 block">Nacionalidades (Especialidad)</Label>
                    <div className="flex flex-wrap gap-2 p-4 bg-slate-50/50 border border-slate-200/60 rounded-2xl">
                        {Object.entries(countryFlags).map(([pais, bandera]) => {
                            const isSelected = profile.nacionalidades.includes(pais);
                            return (
                                <button
                                    key={pais}
                                    type="button"
                                    onClick={() => toggleNacionalidad(pais)}
                                    className={`
                                        flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border
                                        ${isSelected 
                                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm shadow-indigo-100/50' 
                                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                                        }
                                    `}
                                >
                                    <span className="text-base">{bandera}</span>
                                    {pais}
                                    {isSelected && <X className="w-3.5 h-3.5 ml-1 opacity-60 hover:opacity-100" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="relative z-10 space-y-3">
                    <Label className="text-slate-700 font-semibold mb-2 block">Imagen de Portada / Logo</Label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
                        {profile.Imagen ? (
                            <img
                                src={profile.Imagen}
                                alt="Restaurant preview"
                                className="w-32 h-32 object-cover rounded-2xl border shadow-sm"
                            />
                        ) : (
                            <div className="w-32 h-32 flex flex-col items-center justify-center bg-white border border-dashed border-slate-300 rounded-2xl text-slate-400">
                                <Store className="w-8 h-8 mb-2 opacity-50" />
                                <span className="text-[10px] font-semibold uppercase tracking-wider">No Imagen</span>
                            </div>
                        )}
                        <div className="space-y-4 w-full">
                            <div className="relative max-w-sm">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/jpeg, image/png, image/webp"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={uploading}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-white"
                                >
                                    {uploading ? (
                                        <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                                    ) : (
                                        <>
                                            <UploadCloud className="w-4 h-4 text-slate-500" />
                                            Subir Archivo
                                        </>
                                    )}
                                </Button>
                            </div>
                            <p className="text-xs text-slate-500 max-w-sm">Solo imágenes JPG, PNG o WEBP.</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 pt-4 flex justify-end">
                    <Button 
                        type="submit" 
                        disabled={saving || !profile.nombre} 
                        className="bg-indigo-600 hover:bg-indigo-700 h-11 px-8 rounded-xl font-semibold w-full sm:w-auto text-base"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Crear Restaurante"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
