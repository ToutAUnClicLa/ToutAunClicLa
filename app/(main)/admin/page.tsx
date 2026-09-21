"use client";

import { useEffect, useState } from "react";
import { superAdminService } from "@/lib/services/superAdmin";
import { Loader2, DollarSign, Store, ShoppingBag, Users as UsersIcon, TrendingUp, Calendar } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SuperAdminIndex() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<'week' | 'month' | 'year' | 'all'>('week');

    useEffect(() => {
        fetchStats();
    }, [period]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const data = await superAdminService.getStats(period);
            setStats(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const SalesTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const dateStr = new Date(label + 'T00:00:00').toLocaleDateString('es-ES', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });
            const formattedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

            return (
                <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex flex-col gap-1.5 z-50">
                    <p className="font-semibold text-slate-500 text-xs tracking-wide uppercase">{formattedDate}</p>
                    <p className="text-indigo-600 font-black text-lg tracking-tight">
                        Volumen C&apos;, ${Number(payload[0].value).toFixed(2)}
                    </p>
                    {payload[0].payload.orders !== undefined && (
                        <p className="text-emerald-500 font-semibold text-sm">
                            {payload[0].payload.orders} Pedidos
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    const UsersTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const dateStr = new Date(label + 'T00:00:00').toLocaleDateString('es-ES', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });
            const formattedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

            return (
                <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex flex-col gap-1.5 z-50">
                    <p className="font-semibold text-slate-500 text-xs tracking-wide uppercase">{formattedDate}</p>
                    <p className="text-amber-500 font-black text-lg tracking-tight">
                        {payload[0].value} Nuevos Usuarios
                    </p>
                </div>
            );
        }
        return null;
    };

    if (loading && !stats) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold font-heading text-slate-900 tracking-tight">Centro de Control</h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">Visión panorámica del rendimiento comercial en Tout au Clic</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-5 lg:p-6 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-100 text-emerald-600 flex items-center justify-center rounded-xl sm:rounded-2xl shadow-sm shrink-0">
                            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <span className="text-[10px] sm:text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> Neto
                        </span>
                    </div>
                    <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">Volumen Total</p>
                    <h3 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 tracking-tight truncate pb-1">
                        ${Number(stats?.totalSales || 0).toFixed(2)}
                    </h3>
                </div>

                <div className="bg-white p-5 lg:p-6 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-100 text-indigo-600 flex items-center justify-center rounded-xl sm:rounded-2xl shadow-sm shrink-0">
                            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                    </div>
                    <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">Pedidos Aprobados</p>
                    <h3 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 tracking-tight truncate pb-1">
                        {stats?.totalOrdersCount || 0}
                    </h3>
                </div>

                <div className="bg-white p-5 lg:p-6 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-100 text-rose-600 flex items-center justify-center rounded-xl sm:rounded-2xl shadow-sm shrink-0">
                            <UsersIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                    </div>
                    <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">Clientes App</p>
                    <h3 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 tracking-tight truncate pb-1">
                        {stats?.totalUsers || 0}
                    </h3>
                </div>

                <div className="bg-white p-5 lg:p-6 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-100 text-amber-600 flex items-center justify-center rounded-xl sm:rounded-2xl shadow-sm shrink-0">
                            <Store className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <span className="text-[10px] sm:text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                            De {stats?.restaurantsObj?.total || 0} totales
                        </span>
                    </div>
                    <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">Restaurantes Activos</p>
                    <h3 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 tracking-tight truncate pb-1">
                        {stats?.restaurantsObj?.active || 0}
                    </h3>
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-5 my-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 flex items-center justify-center rounded-xl">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <span className="font-bold text-slate-900 block text-sm">Visualizando Rango</span>
                        <span className="text-xs text-slate-500">Filtrado aplicado a gráficos</span>
                    </div>
                </div>
                <div className="flex flex-wrap sm:flex-nowrap bg-slate-100/80 p-1.5 rounded-2xl w-full sm:w-auto overflow-x-auto gap-1">
                    {[
                        { id: 'week', label: 'Semana' },
                        { id: 'month', label: 'Mensual' },
                        { id: 'year', label: 'Anual' },
                        { id: 'all', label: 'Histórico' }
                    ].map((p) => (
                        <button
                            key={p.id}
                            onClick={() => setPeriod(p.id as any)}
                            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${period === p.id ? 'bg-indigo-600 text-white shadow-md scale-100' : 'text-slate-500 hover:text-slate-800 hover:bg-white/60 scale-95 hover:scale-100'}`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Gráfico 1: Ventas */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow w-full flex flex-col">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold font-heading text-slate-900 tracking-tight pb-1">Flujo Transaccional</h3>
                            <p className="text-slate-500 text-sm">Volumen monetario facturado</p>
                        </div>
                        <div className="w-10 h-10 bg-indigo-50 flex items-center justify-center rounded-xl">
                            <TrendingUp className="w-5 h-5 text-indigo-600" />
                        </div>
                    </div>

                    <div className="w-full h-[220px] relative mt-2">
                        {loading && (
                            <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
                                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                            </div>
                        )}
                        {stats?.chartData && stats.chartData.length > 0 ? (
                            <div className="w-full h-full pb-8 pt-2">
                                <ResponsiveContainer width="100%" height={220}>
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
                                            tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
                                            dy={15}
                                            tickFormatter={(value) => {
                                                const date = new Date(value + 'T00:00:00');
                                                return `${date.getDate()}/${date.getMonth() + 1}`;
                                            }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
                                            tickFormatter={(value) => `$${value}`}
                                        />
                                        <Tooltip content={<SalesTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#6366f1"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorTotal)"
                                            activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 pb-10">
                                <TrendingUp className="w-10 h-10 mb-3 text-slate-300" />
                                <p className="font-medium text-sm text-center">No hay datos de ventas en este periodo</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Gráfico 2: Usuarios */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow w-full flex flex-col">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold font-heading text-slate-900 tracking-tight pb-1">Crecimiento de Usuarios</h3>
                            <p className="text-slate-500 text-sm">Registros creados diariamente</p>
                        </div>
                        <div className="w-10 h-10 bg-amber-50 flex items-center justify-center rounded-xl">
                            <UsersIcon className="w-5 h-5 text-amber-600" />
                        </div>
                    </div>

                    <div className="w-full h-[220px] relative mt-2">
                        {loading && (
                            <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
                                <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
                            </div>
                        )}
                        {stats?.chartData && stats.chartData.length > 0 ? (
                            <div className="w-full h-full pb-6">
                                <ResponsiveContainer width="100%" height={220}>
                                    <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                                        <defs>
                                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
                                            dy={15}
                                            tickFormatter={(value) => {
                                                const date = new Date(value + 'T00:00:00');
                                                return `${date.getDate()}/${date.getMonth() + 1}`;
                                            }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
                                            allowDecimals={false}
                                        />
                                        <Tooltip content={<UsersTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                        <Area
                                            type="monotone"
                                            dataKey="users"
                                            stroke="#f59e0b"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorUsers)"
                                            activeDot={{ r: 6, strokeWidth: 0, fill: '#d97706' }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 pb-10">
                                <UsersIcon className="w-10 h-10 mb-3 text-slate-300" />
                                <p className="font-medium text-sm text-center">No hay nuevos usuarios en este periodo</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
