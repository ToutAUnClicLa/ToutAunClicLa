"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { restaurantAdminService } from "@/lib/services/restaurant";
import { countryFlags } from "@/lib/services/restaurants";
import { Loader2, Store, UploadCloud, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import { Label } from "@/components/common/ui/label";
import { Textarea } from "@/components/common/ui/textarea";
import { superAdminService } from "@/lib/services/superAdmin";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/common/ui/alert-dialog";

const DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

interface RestaurantProfileFormProps {
    restauranteId?: number; // Optional. If provided, pulls as Super Admin. Otherwise pulls as Restaurant Admin.
}

export default function RestaurantProfileForm({ restauranteId }: RestaurantProfileFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [profile, setProfile] = useState<any>({
        nombre: "",
        Descripcion: "",
        Imagen: "",
        disponible: true,
        nacionalidades: [],
        dias_abiertos: []
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, [restauranteId]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            let data;
            
            // Si viene el ID, usamos el servicio de Super Admin que abstrae la búsqueda
            if (restauranteId) {
                data = await superAdminService.getRestaurantProfile(restauranteId);
            } else {
                // Si no, usamos el servicio de Restaurant en base al token
                data = await restaurantAdminService.getProfile();
            }

            // Asegurar que haya un formato base para todos los días
            const processedDias = DAYS.map((_, index) => {
                const d = data.dias_abiertos?.find((i: any) => i.dia === index);
                return d || { dia: index, abierto: false, hora_apertura: "12:00", hora_cierre: "21:00" };
            });

            setProfile({
                ...data,
                dias_abiertos: processedDias
            });
        } catch (error) {
            console.error(error);
            toast.error("Error al cargar perfil");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (restauranteId) {
                 // Hack for superadmin directly saving into the endpoint specifying ID
                 await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500/api/v1'}/restaurants/profile?restauranteId=${restauranteId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    },
                    body: JSON.stringify(profile)
                 });
                 // To-Do: Abstract this beautifully into superAdmin.ts later, making a rapid fix to save time.
            } else {
                 await restaurantAdminService.updateProfile(profile);
            }
            toast.success("Perfil actualizado con éxito");
        } catch (error) {
            console.error(error);
            toast.error("Hubo un error al guardar");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteRestaurant = async () => {
        if (deleteConfirmText !== profile.nombre) {
            toast.error("El nombre no coincide. Operación cancelada.");
            return;
        }

        setIsDeleting(true);
        try {
            if (restauranteId) {
                await superAdminService.deleteRestaurant(restauranteId);
                toast.success("Restaurante eliminado permanentemente");
                router.push('/admin/restaurantes');
            } else {
                await restaurantAdminService.deleteOwnRestaurant();
                toast.success("Tu cuenta y restaurante han sido eliminados");
                localStorage.removeItem('auth_token');
                router.push('/restaurante/login');
            }
        } catch (error: any) {
            toast.error(error.message || "Error al eliminar el restaurante");
            setIsDeleting(false);
        }
    };

    const handleDayChange = (index: number, field: string, value: any) => {
        const newDias = [...profile.dias_abiertos];
        newDias[index] = { ...newDias[index], [field]: value };
        setProfile({ ...profile, dias_abiertos: newDias });
    };

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
            const result = await restaurantAdminService.uploadImage(file);
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSave} className="space-y-6 sm:space-y-8 pb-10">
            {/* Basic Info */}
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-5 sm:p-8 space-y-6 sm:space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 z-0"></div>
                <div className="relative z-10 flex items-center gap-3 sm:gap-4 border-b border-slate-100 pb-4 sm:pb-5">
                    <div className="p-2 sm:p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                        <Store className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900">Información General</h2>
                </div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8">
                    <div className="space-y-3">
                        <Label className="text-slate-700 font-semibold">Nombre del Restaurante</Label>
                        <Input
                            value={profile.nombre || ""}
                            onChange={(e) => setProfile({ ...profile, nombre: e.target.value })}
                            required
                            className="rounded-xl border-slate-200 focus-visible:ring-indigo-100 focus-visible:border-indigo-400"
                        />
                    </div>
                    <div className="space-y-3 flex flex-col justify-end">
                        <Label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                            <input
                                type="checkbox"
                                checked={profile.disponible}
                                onChange={(e) => setProfile({ ...profile, disponible: e.target.checked })}
                                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            <span className="font-semibold text-slate-900">Restaurante Abierto y Visible</span>
                        </Label>
                    </div>
                </div>

                <div className="relative z-10 space-y-3">
                    <Label className="text-slate-700 font-semibold">Descripción del Negocio</Label>
                    <Textarea
                        rows={3}
                        value={profile.Descripcion || ""}
                        onChange={(e) => setProfile({ ...profile, Descripcion: e.target.value })}
                        className="rounded-xl border-slate-200 focus-visible:ring-indigo-100 focus-visible:border-indigo-400 resize-none"
                    />
                </div>

                <div className="relative z-10 space-y-3">
                    <Label className="text-slate-700 font-semibold mb-2 block">Nacionalidades (Especialidad)</Label>
                    <div className="flex flex-wrap gap-2 p-4 bg-slate-50/50 border border-slate-200/60 rounded-2xl">
                        {Object.entries(countryFlags).map(([pais, bandera]) => {
                            const isSelected = (profile.nacionalidades || []).includes(pais);
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
                    <p className="text-xs text-slate-500 ml-1">Selecciona los países que representan la comida de tu restaurante.</p>
                </div>

                <div className="relative z-10 space-y-3">
                    <Label className="text-slate-700 font-semibold mb-2 block">Logotipo / Imagen de Portada</Label>
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
                            <div className="relative">
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
                                            Subir Nuevo Archivo
                                        </>
                                    )}
                                </Button>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                                Solo se permite cargar archivos en formato JPG, PNG o WEBP. Medida recomendada 800x800px.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Horario de Operación */}
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-5 sm:p-8 space-y-5 sm:space-y-6">
                <div className="flex items-center gap-3 sm:gap-4 border-b border-slate-100 pb-4 sm:pb-5">
                    <div className="p-2 sm:p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                        <Store className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900">Horario de Operación</h2>
                        <p className="text-slate-500 text-xs sm:text-sm mt-1">Configura qué días y a qué horas están disponibles los servicios.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {profile.dias_abiertos && profile.dias_abiertos.map((dia: any, index: number) => (
                        <div key={index} className="flex flex-col gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 relative overflow-hidden">
                            <Label className="flex items-center gap-3 cursor-pointer z-10 w-full relative">
                                <input
                                    type="checkbox"
                                    checked={dia.abierto}
                                    onChange={(e) => handleDayChange(index, 'abierto', e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                                />
                                <span className={`font-semibold ${dia.abierto ? 'text-slate-900' : 'text-slate-500'}`}>
                                    {DAYS[index]}
                                </span>
                            </Label>
                            
                            <div className={`flex gap-2 items-center z-10 relative transition-opacity ${dia.abierto ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                                <Input
                                    type="time"
                                    value={dia.hora_apertura}
                                    onChange={(e) => handleDayChange(index, 'hora_apertura', e.target.value)}
                                    className="h-9 text-sm w-full focus-visible:ring-indigo-200 bg-white"
                                />
                                <span className="text-slate-400 font-medium">-</span>
                                <Input
                                    type="time"
                                    value={dia.hora_cierre}
                                    onChange={(e) => handleDayChange(index, 'hora_cierre', e.target.value)}
                                    className="h-9 text-sm w-full focus-visible:ring-indigo-200 bg-white"
                                />
                            </div>
                            
                            {!dia.abierto && (
                                <div className="absolute inset-0 bg-slate-100/50 backdrop-blur-[1px] z-0 pointer-events-none" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Zona de Peligro */}
            <div className="bg-red-50/50 rounded-3xl border border-red-100 p-5 sm:p-8 space-y-5 sm:space-y-6">
                <div className="flex items-center gap-3 sm:gap-4 border-b border-red-100 pb-4 sm:pb-5">
                    <div className="p-2 sm:p-2.5 bg-red-100 text-red-600 rounded-xl">
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-red-900">Zona de Peligro</h2>
                        <p className="text-red-500 text-xs sm:text-sm mt-1">Acciones irreversibles para este restaurante.</p>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900">Eliminar Restaurante</h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-md flex-1">
                            Una vez eliminado, se borrarán todos sus productos, configuración de cuenta y estadísticas de manera permanente. Esta acción no se puede deshacer.
                        </p>
                    </div>
                    
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="shrink-0">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Eliminar Restaurante
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="w-[90vw] sm:w-[32rem]">
                            <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Se eliminará permanentemente la cuenta, productos y toda la información asociada a <strong className="text-slate-900">{profile.nombre}</strong>.
                                    <br/><br/>
                                    Por favor, escribe el nombre del restaurante exacto para confirmar:
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="my-2">
                                <Input 
                                    placeholder={profile.nombre}
                                    value={deleteConfirmText}
                                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                                    className="border-red-200 focus-visible:ring-red-500"
                                />
                            </div>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setDeleteConfirmText("")}>Cancelar</AlertDialogCancel>
                                <Button 
                                    variant="destructive" 
                                    disabled={deleteConfirmText !== profile.nombre || isDeleting}
                                    onClick={handleDeleteRestaurant}
                                >
                                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                                    Sí, eliminar permanentemente
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
                <Button type="submit" disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm px-8 h-12 flex items-center gap-2">
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Guardar Cambios del Perfil
                </Button>
            </div>
        </form>
    );
}
