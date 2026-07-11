"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { restaurantAdminService } from "@/lib/services/restaurant";
import {
    Store,
    PackageSearch,
    ShoppingCart,
    BarChart3,
    LogOut,
    Settings,
    Menu,
    X
} from "lucide-react";
import { RealtimeOrderListener } from "@/components/common/RealtimeOrderListener";

export default function RestaurantLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Si estamos en la página de login, no verificar token ni mostrar sidebar
        if (pathname === "/restaurante/login") {
            setLoading(false);
            return;
        }

        const checkAuth = async () => {
            try {
                const token = localStorage.getItem("restaurant_token");
                if (!token) throw new Error("No token");

                const session = await restaurantAdminService.getSession();
                setUser(session.user);
            } catch (error) {
                localStorage.removeItem("restaurant_token");
                router.replace("/restaurante/login");
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [pathname, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <div className="w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
            </div>
        );
    }

    // No sidebar on login logic handled by conditionally rendering it or just checking path
    if (pathname === "/restaurante/login") {
        return <>{children}</>;
    }

    if (!user) return null;

    const handleLogout = () => {
        localStorage.removeItem("restaurant_token");
        router.push("/restaurante/login");
    };

    const navItems = [
        { label: "Estadísticas", href: "/restaurante/estadisticas", icon: BarChart3 },
        { label: "Pedidos", href: "/restaurante/pedidos", icon: ShoppingCart },
        { label: "Productos", href: "/restaurante/productos", icon: PackageSearch },
        { label: "Perfil", href: "/restaurante/perfil", icon: Store },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Real-time Order Notifications (Filtered by Restaurant) */}
            <RealtimeOrderListener role="restaurant" restauranteId={user.restauranteId} />

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 flex flex-col
                transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-40
                ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 border border-indigo-200/50 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                        {user.imagen ? (
                            <img src={user.imagen} alt={user.nombre} className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                            <Store className="w-6 h-6" />
                        )}
                    </div>
                    <div className="overflow-hidden flex flex-col justify-center">
                        <h2 className="font-black text-sm text-slate-900 truncate tracking-tight uppercase">{user.nombre || user.username}</h2>
                        <p className="text-[10px] text-indigo-600 truncate font-bold tracking-widest uppercase mt-0.5">Control Center</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Menú Principal</p>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-inset ring-indigo-100"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                            >
                                <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all duration-200 shadow-sm"
                    >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:ml-64 relative h-full transition-all duration-300 overflow-hidden">
                {/* Mobile Header */}
                <div className="lg:hidden bg-white/90 backdrop-blur-xl border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
                            <Store className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-sm tracking-widest uppercase bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">Centro de Control</span>
                            <span className="text-[9px] font-bold text-indigo-600 tracking-widest uppercase">Admin Partners</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-sm"
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 lg:p-10 scroll-smooth">
                    <div className="max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
}
