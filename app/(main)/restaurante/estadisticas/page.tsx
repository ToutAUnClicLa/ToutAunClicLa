"use client";

import { useEffect, useState } from "react";
import { restaurantAdminService } from "@/lib/services/restaurant";
import { Loader2, DollarSign, Store, ShoppingBag, BarChart2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function EstadisticasPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<'week' | 'month' | 'year' | 'all'>('week');

    useEffect(() => {
        fetchStats();
    }, [period]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const data = await restaurantAdminService.getStats(period);
            setStats(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            // Formatear la fecha para que se vea más amigable
            const dateStr = new Date(label + 'T00:00:00').toLocaleDateString('es-ES', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });
            const formattedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

            return (
                <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex flex-col gap-1.5 z-50">
                    <p className="font-semibold text-slate-500 text-xs tracking-wide uppercase">{formattedDate}</p>
                    <p className="text-indigo-600 font-black text-lg tracking-tight">
                        Ventas: ${Number(payload[0].value).toFixed(2)}
                    </p>
                    {payload[0].payload.orders !== undefined && (
                        <p className="text-emerald-500 font-semibold text-sm">
                            {payload[0].payload.orders} Productos Vendidos
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <div>
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold font-heading text-slate-900 tracking-tight">Estadísticas Generales</h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">Resumen de ventas y actividad comercial de tu restaurante</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-3xl border border-slate-200/60 shadow-sm flex items-center gap-4 sm:gap-6 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-100 text-emerald-600 flex items-center justify-center rounded-xl sm:rounded-2xl shadow-sm shrink-0">
                        <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-slate-500 text-[10px] lg:text-xs font-bold uppercase tracking-widest mb-0.5 sm:mb-1">Ingresos</p>
                        <h3 className="text-xl sm:text-2xl lg:text-4xl font-black font-heading text-slate-900 tracking-tight truncate pb-1">
                            ${Number(stats?.totalSales || 0).toFixed(2)}
                        </h3>
                    </div>
                </div>

                <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-3xl border border-slate-200/60 shadow-sm flex items-center gap-4 sm:gap-6 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-100 text-indigo-600 flex items-center justify-center rounded-xl sm:rounded-2xl shadow-sm shrink-0">
                        <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-slate-500 text-[10px] lg:text-xs font-bold uppercase tracking-widest mb-0.5 sm:mb-1">Total Pedidos</p>
                        <h3 className="text-xl sm:text-2xl lg:text-4xl font-black font-heading text-slate-900 tracking-tight truncate pb-1">
                            {stats?.totalOrdersCount || 0}
                        </h3>
                    </div>
                </div>

                <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-3xl border border-slate-200/60 shadow-sm flex items-center gap-4 sm:gap-6 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-100 text-amber-600 flex items-center justify-center rounded-xl sm:rounded-2xl shadow-sm shrink-0">
                        <Store className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-slate-500 text-[10px] lg:text-xs font-bold uppercase tracking-widest mb-0.5 sm:mb-1">En Preparación</p>
                        <h3 className="text-xl sm:text-2xl lg:text-4xl font-black font-heading text-slate-900 tracking-tight truncate pb-1">
                            {stats?.pendingOrdersCount || 0}
                        </h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/60 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow col-span-1 md:col-span-3">
                    <div className="w-full">
                        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 sm:mb-8 gap-4">
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900 tracking-tight pb-1">Evolución de Ventas Principales</h3>
                                <p className="text-slate-500 text-xs sm:text-sm">Progreso diario de los ingresos para el intervalo seleccionado</p>
                            </div>
                            <div className="w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 -mx-1 px-1 xl:mx-0 xl:px-0">
                                <div className="flex gap-1.5 bg-slate-50/80 p-1.5 rounded-2xl border border-slate-100/80 w-max xl:w-auto">
                                    {['week', 'month', 'year', 'all'].map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setPeriod(p as any)}
                                            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap ${period === p ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50 scale-100' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 scale-95 hover:scale-100 border border-transparent'}`}
                                        >
                                            {p === 'week' ? 'Sem. Pasada' : p === 'month' ? 'Mes' : p === 'year' ? 'Año' : 'Historico'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="h-[250px] sm:h-80 w-full relative pb-6 pt-2">
                            {stats?.chartData && stats.chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                                        <defs>
                                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>

                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }}
                                            dy={15}
                                            tickFormatter={(value) => {
                                                const date = new Date(value + 'T00:00:00'); // Tratar como hora local para evitar offset
                                                return `${date.getDate()}/${date.getMonth() + 1}`;
                                            }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }}
                                            dx={-10}
                                            tickFormatter={(value) => `$${value}`}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorTotal)" activeDot={{ r: 8, fill: '#4f46e5', stroke: '#fff', strokeWidth: 3 }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                    <BarChart2 className="w-12 h-12 mb-3 opacity-30 text-indigo-400" />
                                    <p className="font-medium text-slate-500">No hay información suficiente sobre ventas en este preciso punto.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
