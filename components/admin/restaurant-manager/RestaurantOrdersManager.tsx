"use client";

import { useEffect, useState } from "react";
import { restaurantAdminService } from "@/lib/services/restaurant";
import { API_CONFIG } from "@/lib/config/api";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Loader2, Receipt, Search, Filter } from "lucide-react";
import { Input } from "@/components/common/ui/input";

interface RestaurantOrdersManagerProps {
    restauranteId?: number;
}

export default function RestaurantOrdersManager({ restauranteId }: RestaurantOrdersManagerProps) {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("todos");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchOrders();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [restauranteId, currentPage, searchTerm, statusFilter]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            let responseData;

            if (restauranteId) {
                const queryParams = new URLSearchParams({
                    restauranteId: restauranteId.toString(),
                    page: currentPage.toString(),
                    limit: itemsPerPage.toString(),
                    ...(searchTerm ? { search: searchTerm } : {}),
                    ...(statusFilter !== 'todos' ? { status: statusFilter } : {})
                });
                const res = await fetch(`${API_CONFIG.BASE_URL}/restaurants/orders?${queryParams.toString()}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
                });
                responseData = await res.json();
            } else {
                responseData = await restaurantAdminService.getOrders(currentPage, itemsPerPage, searchTerm, statusFilter);
            }

            setOrders(responseData.orders || []);
            setTotalPages(responseData.totalPages || 1);
            setTotalItems(responseData.total || 0);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pendiente":
                return <span className="bg-amber-50 text-amber-700 border border-amber-200/60 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider">Pendiente</span>;
            case "procesando":
                return <span className="bg-blue-50 text-blue-700 border border-blue-200/60 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider">Procesando</span>;
            case "enviado":
                return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider">En Camino</span>;
            case "entregado":
                return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider">Entregado</span>;
            case "cancelado":
                return <span className="bg-red-50 text-red-700 border border-red-200/60 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider">Cancelado</span>;
            default:
                return <span className="bg-slate-50 text-slate-700 border border-slate-200/60 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider">{status}</span>;
        }
    };

    if (loading && orders.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold font-heading text-slate-900 tracking-tight">Bandeja de Pedidos {restauranteId && "(Modo Admin Local)"}</h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">Gestiona y haz seguimiento a los pedidos de tus clientes</p>
                </div>
            </div>

            <div className="bg-white shadow-sm flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl gap-4 border border-slate-200/60">
                <div className="relative w-full sm:max-w-xs transition-all duration-200 focus-within:ring-2 focus-within:ring-indigo-100 rounded-lg">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Buscar por # o cliente..."
                        className="pl-9 bg-slate-50/50 border-slate-200 focus-visible:bg-white focus-visible:border-indigo-300"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
                <div className="relative w-full sm:w-auto">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Filter className="w-4 h-4 text-slate-400" />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full sm:w-auto appearance-none pl-9 pr-10 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 shadow-sm rounded-xl hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors cursor-pointer"
                    >
                        <option value="todos">Todos los estados</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="procesando">Procesando</option>
                        <option value="enviado">En Camino</option>
                        <option value="entregado">Entregado</option>
                        <option value="cancelado">Cancelado</option>
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>

            <div className="space-y-4 relative">
                {loading && orders.length > 0 && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10 w-full h-full rounded-2xl">
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                    </div>
                )}
                {orders.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Receipt className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">No hay pedidos registrados</h3>
                        <p className="text-slate-500 mt-1 max-w-sm mx-auto">Aún no has recibido pedidos o ninguno coincide con tu criterio de búsqueda actual.</p>
                    </div>
                ) : (
                    orders.map((order) => {
                        const itemCount = order.items.reduce((acc: number, item: any) => acc + item.cantidad, 0);

                        return (
                            <div key={order.id} className="bg-white rounded-2xl border border-slate-200/60 p-6 flex flex-col lg:flex-row gap-6 transition-all duration-300 hover:border-indigo-200 hover:shadow-md group">
                                <div className="flex-1 space-y-4 sm:space-y-5">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-100 pb-3 sm:pb-4">
                                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                            <span className="font-mono text-xs sm:text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">#ORD-{String(order.id).padStart(6, '0')}</span>
                                            {getStatusBadge(order.estado)}
                                        </div>
                                        <span className="text-xs sm:text-sm font-medium text-slate-500 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 hidden sm:block" />
                                            {format(new Date(order.fecha_pedido), "dd MMM yyyy, h:mm a", { locale: es })}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Nombre del Cliente</h4>
                                            <p className="font-semibold text-slate-900">{order.usuarios?.nombre || 'Cliente Anónimo'}</p>
                                        </div>

                                        <div>
                                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 sm:mb-1.5">Resumen Contable</h4>
                                            <p className="font-bold text-base sm:text-lg text-indigo-600">${Number(order.restaurant_total).toFixed(2)}</p>
                                            <p className="text-xs sm:text-sm font-medium text-slate-500">{itemCount} artículo(s) totales</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full lg:w-80 bg-slate-50/50 rounded-xl p-4 sm:p-5 border border-slate-100 shrink-0 mt-4 lg:mt-0">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 sm:mb-4">Artículos Solicitados</h4>
                                    <ul className="space-y-4">
                                        {order.items.map((item: any, idx: number) => (
                                            <li key={idx} className="flex gap-4 items-start">
                                                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0 shadow-sm">
                                                    {item.producto?.imagen_principal ? (
                                                        <img src={item.producto.imagen_principal} alt={item.producto.nombre} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                            <Receipt className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-slate-900 leading-tight" title={item.producto?.nombre}>
                                                        <span className="text-indigo-600 mr-1">{item.cantidad}x</span>
                                                        {item.producto?.nombre}
                                                    </p>
                                                    <p className="text-xs font-medium text-slate-500 mt-1">${Number(item.precio_unitario).toFixed(2)} c/u</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })
                )}

                {totalPages > 1 && (
                    <div className="mt-8 p-4 border-t border-slate-100 flex items-center justify-between bg-white rounded-2xl shadow-sm">
                        <span className="text-sm text-slate-500 font-medium">
                            Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} pedidos
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
