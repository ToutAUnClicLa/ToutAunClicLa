"use client";

import { useEffect, useState } from "react";
import { superAdminService } from "@/lib/services/superAdmin";
import { Loader2, Users, Search, ShieldAlert, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/common/ui/input";
import { Button } from "@/components/common/ui/button";

export default function SuperAdminUsuarios() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await superAdminService.getAllUsers();
            setUsers(data);
        } catch (error: any) {
            toast.error(error.message || "Error al cargar usuarios");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleBlock = async (id: string, currentlyBlocked: boolean) => {
        try {
            const action = currentlyBlocked ? 'unblock' : 'block';
            await superAdminService.toggleUserBlock(id, action);
            toast.success(`Cuenta ${action === 'block' ? 'bloqueada' : 'desbloqueada'} exitosamente`);
            fetchUsers();
        } catch (error: any) {
            toast.error(error.message || "Error al actualizar estado");
        }
    };

    const filteredUsers = users.filter(user => 
        (user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (user.correo_electronico?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (user.telefono?.includes(searchTerm) || '')
    );

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1); // Reset page on search
    }, [searchTerm]);

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
                        <Users className="w-6 h-6 text-indigo-600" />
                        Gestión de Clientes
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Supervisa y administra las cuentas de todos los usuarios registrados</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Buscar por nombre, correo o teléfono..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 bg-white border-slate-200"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Usuario</th>
                                <th className="px-6 py-4">Contacto</th>
                                <th className="px-6 py-4">Registro</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginatedUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                                                <span className="font-bold text-indigo-600">
                                                    {user.nombre?.charAt(0).toUpperCase() || '?'}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">{user.nombre}</p>
                                                <p className="text-xs text-slate-500 capitalize">{user.rol}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium">{user.correo_electronico}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{user.telefono || 'Sin teléfono'}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(user.fecha_creacion).toLocaleDateString('es-ES', {
                                            year: 'numeric', month: 'short', day: 'numeric'
                                        })}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.cuenta_bloqueada ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                                                Bloqueado
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                Activo
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {user.rol !== 'admin' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleToggleBlock(user.id, user.cuenta_bloqueada)}
                                                className={user.cuenta_bloqueada ? "text-emerald-600 border-emerald-200 hover:bg-emerald-50" : "text-amber-600 border-amber-200 hover:bg-amber-50"}
                                            >
                                                {user.cuenta_bloqueada ? <ShieldCheck className="w-4 h-4 mr-2" /> : <ShieldAlert className="w-4 h-4 mr-2" />}
                                                {user.cuenta_bloqueada ? "Desbloquear" : "Bloquear"}
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        No se encontraron usuarios que coincidan con la búsqueda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                        <span className="text-sm text-slate-500">
                            Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, filteredUsers.length)} de {filteredUsers.length} usuarios
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
        </div>
    );
}
