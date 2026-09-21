"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import { Label } from "@/components/common/ui/label";
import { toast } from "sonner";
import { Store, Loader2, Lock, User } from "lucide-react";
import { restaurantAdminService } from "@/lib/services/restaurant";
import { useTranslation } from "@/hooks/useTranslation";
import { motion } from "framer-motion";

export default function RestaurantLogin() {
    const { t } = useTranslation();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ username: "", password: "" });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await restaurantAdminService.login(formData);
            localStorage.setItem("restaurant_token", data.token);
            toast.success(t('portals.restaurantLogin.loginSuccess'));
            router.push("/restaurante/pedidos");
        } catch (error: any) {
            toast.error(error.message || t('portals.restaurantLogin.loginError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 z-0 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 z-0 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 backdrop-blur-xl bg-white/80">
                    <div className="p-10 space-y-8">
                        {/* Header */}
                        <div className="text-center space-y-3">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-600 shadow-xl shadow-indigo-600/20 mb-4 transform -rotate-3 hover:rotate-3 transition-transform duration-300">
                                <Store className="w-10 h-10 text-white drop-shadow-sm" />
                            </div>
                            <h1 className="text-3xl font-black font-heading text-slate-900 tracking-tight">
                                {t('portals.restaurantLogin.title')}
                            </h1>
                            <p className="text-slate-500 font-medium text-sm">
                                {t('portals.restaurantLogin.subtitle')}
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-semibold ml-1">{t('portals.restaurantLogin.usernameLabel')}</Label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <Input
                                            id="username"
                                            type="text"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            className="w-full pl-11 h-14 rounded-2xl bg-slate-50 border-slate-200 focus-visible:ring-indigo-600 focus-visible:border-indigo-600 font-medium transition-all"
                                            placeholder={t('portals.restaurantLogin.usernamePlaceholder')}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-semibold ml-1">{t('portals.restaurantLogin.passwordLabel')}</Label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full pl-11 h-14 rounded-2xl bg-slate-50 border-slate-200 focus-visible:ring-indigo-600 focus-visible:border-indigo-600 font-medium transition-all"
                                            placeholder={t('portals.restaurantLogin.passwordPlaceholder')}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-[0_8px_16px_-6px_rgba(79,70,229,0.5)] transition-all hover:-translate-y-0.5 mt-4 border border-indigo-500"
                            >
                                {loading ? (
                                    <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> {t('portals.restaurantLogin.verifying')}</>
                                ) : (
                                    t('portals.restaurantLogin.loginButton')
                                )}
                            </Button>
                        </form>
                    </div>
                    <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                            {t('portals.adminLogin.restrictedAccess')}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
