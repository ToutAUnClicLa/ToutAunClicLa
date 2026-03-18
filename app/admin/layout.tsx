"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import * as authService from "@/lib/services/auth";
import { ShieldAlert, Store, Users, Home, Settings, Menu, X, Ticket, Receipt } from "lucide-react";
import { RealtimeOrderListener } from "@/components/common/RealtimeOrderListener";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (pathname === "/admin/login") {
            setLoading(false);
            return;
        }

        const checkAuth = async () => {
            try {
                const token = localStorage.getItem("auth_token");
                if (!token) throw new Error("No token");

                const { user } = await authService.getUserProfile();
                // Solo verificamos si el email tiene admin. El backend validará correctamente la lista final.
                if (user.email?.includes('admin') || user.email === 'aunclicla@gmail.com') {
                    setIsAdmin(true);
                } else {
                    router.replace("/admin/login");
                }
            } catch (error) {
                router.replace("/admin/login");
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
            </div>
        );
    }

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    if (!isAdmin) return null;

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Real-time Order Notifications */}
            <RealtimeOrderListener role="admin" />
            
            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 w-64 bg-[#0a0f1d] text-white border-r border-[#1a2235] flex flex-col
                transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-40
                ${isMobileMenuOpen ? 'translate-x-0 shadow-[0_0_40px_rgba(0,0,0,0.3)]' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 border-b border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                        <ShieldAlert className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-sm tracking-widest uppercase  bg-white bg-clip-text text-transparent">Tout A Un Clic La</span>
                        <span className="text-[10px] font-medium text-indigo-200 tracking-widest uppercase">Global Admin</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                    <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${pathname === '/admin' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                        <Home className="w-5 h-5" /> Dashboard Central
                    </Link>
                    <Link href="/admin/pedidos" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${pathname.includes('/admin/pedidos') ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                        <Receipt className="w-5 h-5" /> Bandeja de Pedidos
                    </Link>                    
                    <Link href="/admin/restaurantes" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${pathname.includes('/admin/restaurantes') ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                        <Store className="w-5 h-5" /> Restaurantes
                    </Link>
                    <Link href="/admin/usuarios" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${pathname.includes('/admin/usuarios') ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                        <Users className="w-5 h-5" /> Usuarios
                    </Link>
                    <Link href="/admin/cupones" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${pathname.includes('/admin/cupones') ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                        <Ticket className="w-5 h-5" /> Gestión Cupones
                    </Link>

                </nav>

                <div className="p-4 border-t border-white/5 space-y-1">
                    <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-slate-100 transition-colors">
                        <Home className="w-4 h-4" /> Volver a Tienda
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:ml-64 relative h-full transition-all duration-300 overflow-hidden bg-slate-50">
                {/* Mobile Header */}
                <div className="lg:hidden bg-white/90 backdrop-blur-xl border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
                            <ShieldAlert className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-sm tracking-widest uppercase bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">Tout A Un Clic</span>
                            <span className="text-[9px] font-bold text-indigo-600 tracking-widest uppercase">Global Admin</span>
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
                    <div className="max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
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
