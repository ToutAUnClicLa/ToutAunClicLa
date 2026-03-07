"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/common/ui/input";
import { Button } from "@/components/common/ui/button";
import { Label } from "@/components/common/ui/label";
import { ShieldAlert, Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

export default function SuperAdminLoginPage() {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await login({ email, password });
            toast.success(t('portals.adminLogin.loginSuccess'));
            // Force a hard reload to ensure the layout middleware captures the newly set local storage token
            window.location.href = "/admin";
        } catch (error: any) {
            toast.error(error.message || t('portals.adminLogin.loginError'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-slate-900 to-indigo-900 skew-y-6 transform -translate-y-32 -z-10 shadow-2xl"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100">
                    <div className="p-10 space-y-8">
                        {/* Header */}
                        <div className="text-center space-y-3">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-900 shadow-xl shadow-slate-900/20 mb-4 transform -rotate-3 hover:rotate-3 transition-transform duration-300">
                                <ShieldAlert className="w-10 h-10 text-white" />
                            </div>
                            <h1 className="text-3xl font-black font-heading text-slate-900 tracking-tight">
                                {t('portals.adminLogin.title')}
                            </h1>
                            <p className="text-slate-500 font-medium text-sm">
                                {t('portals.adminLogin.subtitle')}
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-semibold ml-1">{t('portals.adminLogin.emailLabel')}</Label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-900 transition-colors">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-11 h-14 rounded-2xl bg-slate-50 border-slate-200 focus-visible:ring-slate-900 focus-visible:border-slate-900 font-medium transition-all"
                                            placeholder={t('portals.adminLogin.emailPlaceholder')}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-semibold ml-1">{t('portals.adminLogin.passwordLabel')}</Label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-900 transition-colors">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <Input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-11 h-14 rounded-2xl bg-slate-50 border-slate-200 focus-visible:ring-slate-900 focus-visible:border-slate-900 font-medium transition-all"
                                            placeholder={t('portals.adminLogin.passwordPlaceholder')}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 text-base font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5"
                            >
                                {isLoading ? (
                                    <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> {t('portals.adminLogin.verifying')}</>
                                ) : (
                                    t('portals.adminLogin.loginButton')
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
