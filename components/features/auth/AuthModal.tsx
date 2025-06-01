"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle, User, Eye, EyeOff, Phone, X } from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { Input } from '@/components/common/ui/input';
import { Label } from '@/components/common/ui/label';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/common/ui/dialog';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signInWithGoogle, 
  resetPassword,
  checkEmailExists
} from '@/lib/database/auth';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgotPassword';
  redirectUrl?: string;
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login', redirectUrl }: AuthModalProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [mode, setMode] = useState(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  // State para el checkbox de términos y condiciones
  const [acceptTerms, setAcceptTerms] = useState(false);
  // State para el checkbox de "Recuérdame"
  const [rememberMe, setRememberMe] = useState(false);

  // Restablecer los estados cuando cambia el modo
  useEffect(() => {
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      password: '',
      confirmPassword: ''
    });
    setError(null);
    setEmailChecked(false);
    setEmailExists(false);
    setAcceptTerms(false);
    setRememberMe(false);
  }, [mode]);

  // Restablecer los estados cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        password: '',
        confirmPassword: ''
      });
      setError(null);
      setEmailChecked(false);
      setEmailExists(false);
      setAcceptTerms(false);
      setRememberMe(false);
    }
  }, [isOpen, initialMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);

    // Si es el campo de email, reiniciamos la validación
    if (name === 'email') {
      setEmailChecked(false);
      setEmailExists(false);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    // Mínimo 6 caracteres, al menos una letra y un número
    return password.length >= 6 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
  };

  const checkEmail = async () => {
    if (!formData.email || !validateEmail(formData.email)) {
      setError(t('auth.emailInvalid') as string);
      return false;
    }

    try {
      setIsLoading(true);
      const exists = await checkEmailExists(formData.email);
      setEmailChecked(true);
      setEmailExists(exists);

      // En modo registro, el email no debería existir
      if (mode === 'register' && exists) {
        setError(t('auth.emailAlreadyExists') as string);
        return false;
      }

      // En modo login y forgotPassword, el email debería existir
      if ((mode === 'login' || mode === 'forgotPassword') && !exists) {
        setError(t('auth.emailNotRegistered') as string);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error al verificar email:', error);
      setError(t('auth.errorCheckingEmail') as string);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = async (): Promise<boolean> => {
    // Validación común para todos los modos
    if (!formData.email) {
      setError(t('auth.emailRequired') as string);
      return false;
    }

    if (!validateEmail(formData.email)) {
      setError(t('auth.emailInvalid') as string);
      return false;
    }

    // Comprobación de email existente (solo si no se ha verificado ya)
    if (!emailChecked) {
      const isEmailValid = await checkEmail();
      if (!isEmailValid) return false;
    }

    // Validaciones específicas por modo
    if (mode === 'register') {
      if (!formData.nombre) {
        setError(t('auth.nameRequired') as string);
        return false;
      }

      if (!formData.password) {
        setError(t('auth.passwordRequired') as string);
        return false;
      }

      if (!validatePassword(formData.password)) {
        setError(t('auth.passwordInvalid') as string);
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError(t('auth.passwordsMismatch') as string);
        return false;
      }                      // Validar que se hayan aceptado los términos y condiciones
                      if (!acceptTerms) {
                        setError(t('auth.acceptTermsRequired') as string);
                        return false;
                      }
    }

    if (mode === 'login' && !formData.password) {
      setError(t('auth.passwordRequired') as string);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError(null);
      
      const isValid = await validateForm();
      if (!isValid) {
        setIsLoading(false);
        return;
      }

      if (mode === 'login') {
        await handleLogin();
      } else if (mode === 'register') {
        await handleRegister();
      } else if (mode === 'forgotPassword') {
        await handleForgotPassword();
      }      } catch (err: any) {
        console.error('Auth error:', err);
        setError(err.message || t('auth.generalError'));
      } finally {
        setIsLoading(false);
      }
  };

  const handleLogin = async () => {
    try {
      const result = await signInWithEmail({
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        toast.success(t('auth.welcomeBack'));
        onClose();
        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.refresh();
        }
      }
    } catch (err: any) {
      console.error('Error de login:', err);
      
      // Manejo mejorado de errores con la nueva API de seguridad
      if (err.message.includes('Cuenta bloqueada')) {
        setError('Tu cuenta ha sido bloqueada por múltiples intentos fallidos. Contacta al soporte.');
      } else if (err.message.includes('verificación') || err.message.includes('verifica')) {
        setError(err.message);
        
        // Ofrecer reenvío de verificación
        const shouldResend = window.confirm(
          '¿Deseas que reenviemos el correo de verificación?'
        );
        
        if (shouldResend) {
          try {
            const response = await fetch('/api/auth/resend-verification', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: formData.email }),
            });
            
            if (response.ok) {
              toast.success('Correo de verificación reenviado');
            } else {
              const errorData = await response.json();
              toast.error(errorData.error || 'Error al reenviar verificación');
            }
          } catch (resendError) {
            console.error('Error al reenviar verificación:', resendError);
            toast.error('Error al reenviar el correo de verificación');
          }
        }
      } else {
        setError(err.message || t('auth.generalError'));
      }
    }
  };

  const handleRegister = async () => {
    try {
      const result = await signUpWithEmail({
        email: formData.email,
        password: formData.password,
        nombre: formData.nombre,
        telefono: formData.telefono || undefined
      });
      
      if (result.success) {
        toast.success('Cuenta creada correctamente. Revisa tu correo para verificar tu cuenta.');
        onClose();
        // Opcional: cambiar a modo login después del registro
        // setMode('login');
      }
    } catch (err: any) {
      console.error('Error de registro:', err);
      setError(err.message || t('auth.generalError'));
    }
  };

  const handleForgotPassword = async () => {
    try {
      await resetPassword(formData.email);
      toast.success(t('auth.passwordResetSent'));
      setMode('login');
    } catch (err: any) {
      console.error('Error al resetear contraseña:', err);
      setError(err.message || t('auth.generalError'));
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      const { error } = await signInWithGoogle();
      if (error) throw error;
      toast.success(t('auth.redirecting'));
      onClose();
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.refresh();
      }
    } catch (err: any) {
      console.error('Google auth error:', err);
      setError(t('auth.googleAuthError'));
    } finally {
      setIsLoading(false);
    }
  };

  const dialogTitle = mode === 'login' ? t('auth.loginTitle') : 
                     mode === 'register' ? t('auth.registerTitle') : 
                     t('auth.forgotPasswordTitle');

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          className="w-[95vw] max-w-[95vw] sm:max-w-[380px] md:max-w-[740px] lg:max-w-[800px] xl:max-w-[860px] p-0 m-0 
                     fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                     h-auto max-h-[88vh] sm:max-h-[82vh] md:max-h-[85vh] overflow-hidden 
                     bg-white rounded-xl sm:rounded-2xl shadow-2xl border-0
                     [&>button:last-child]:hidden"
        >
          <DialogTitle className="sr-only">{dialogTitle}</DialogTitle>
          
          {/* Botón de cerrar global */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 top-3 sm:right-4 sm:top-4 rounded-full h-8 w-8 sm:h-9 sm:w-9
                      flex items-center justify-center hover:bg-gray-100 transition-colors z-20
                      border border-gray-200 hover:border-gray-300 shadow-sm"
            onClick={onClose}
            aria-label={t('auth.closeModal')}
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
          </Button>
          
          {/* Container principal */}
          <div className="flex h-full max-h-[88vh] sm:max-h-[82vh] md:max-h-[85vh] overflow-hidden">
            {/* Columna izquierda: Brand & Descripción - Solo visible en desktop */}
            <div className="hidden md:flex md:w-1/2 lg:w-[42%] bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 relative">
              {/* Patrón de fondo decorativo */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-8 left-8 w-16 h-16 bg-white rounded-full"></div>
                <div className="absolute top-24 right-12 w-10 h-10 bg-white rounded-full"></div>
                <div className="absolute bottom-16 left-12 w-12 h-12 bg-white rounded-full"></div>
                <div className="absolute bottom-8 right-16 w-6 h-6 bg-white rounded-full"></div>
              </div>
              
              {/* Contenido de la columna izquierda */}
              <div className="relative z-10 flex flex-col justify-center px-6 lg:px-8 py-6">
                <div className="space-y-4">
                  {/* Logo y marca */}
                  <div className="flex items-center space-x-3">
                    <div className="bg-white rounded-full w-20 h-20 lg:w-24 lg:h-24 shadow-lg flex items-center justify-end pr-1">
                      <motion.img 
                        src="/logoaunclic.svg" 
                        alt="Logo A un clic" 
                        className="h-16 w-16 lg:h-20 lg:w-20 filter drop-shadow-lg" 
                        width="80"
                        height="80"
                      />
                    </div>
                    <div className="text-white">
                      <div className="text-base font-medium">Tout À Un</div>
                      <div className="text-xl lg:text-2xl font-bold">Clic là</div>
                    </div>
                  </div>
                  
                  {/* Título dinámico */}
                  <div className="space-y-2">
                    <h2 className="text-xl lg:text-2xl font-bold text-white leading-tight">
                      {mode === 'login' ? t('auth.welcomeBack') : 
                       mode === 'register' ? t('auth.joinOurCommunity') :
                       t('auth.resetPasswordTitle')}
                    </h2>
                    <p className="text-indigo-100 text-base leading-relaxed">
                      {mode === 'login' ? t('auth.loginDescriptionExtended') : 
                       mode === 'register' ? t('auth.registerDescriptionExtended') :
                       t('auth.forgotPasswordDescriptionExtended')}
                    </p>
                  </div>
                  
                  {/* Características destacadas */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center space-x-3 text-indigo-100">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-sm lg:text-base">{t('auth.feature1')}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-indigo-100">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-sm lg:text-base">{t('auth.feature2')}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-indigo-100">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-sm lg:text-base">{t('auth.feature3')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha: Formulario */}
            <div className="w-full md:w-1/2 lg:w-[58%] flex flex-col">
              {/* Header móvil - Solo visible en móvil */}
              <div className="md:hidden relative flex-shrink-0 py-3 px-4 border-b bg-white">
                {/* Logo y Título móvil */}
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="bg-white rounded-full p-3 shadow-lg flex items-center justify-end pr-2">
                    <motion.img 
                      src="/logoaunclic.svg" 
                      alt="Logo A un clic" 
                      className="h-12 w-12 sm:h-14 sm:w-14 filter drop-shadow-lg flex-shrink-0" 
                      width="56"
                      height="56"
                    />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                      {dialogTitle}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 max-w-xs mx-auto leading-snug">
                      {mode === 'login' ? t('auth.loginDescription') : 
                       mode === 'register' ? t('auth.registerDescription') :
                       t('auth.forgotPasswordDescription')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Header desktop - Solo visible en desktop */}
              <div className="hidden md:block flex-shrink-0 py-4 px-5 lg:px-6 border-b bg-white">
                <div className="text-center space-y-1">
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 leading-tight">
                    {mode === 'login' ? t('auth.loginFormTitle') : 
                     mode === 'register' ? t('auth.registerFormTitle') :
                     t('auth.forgotPasswordFormTitle')}
                  </h3>
                  <p className="text-sm lg:text-base text-gray-600 leading-snug">
                    {mode === 'login' ? t('auth.loginFormDescription') : 
                     mode === 'register' ? t('auth.registerFormDescription') :
                     t('auth.forgotPasswordFormDescription')}
                  </p>
                </div>
              </div>

              {/* Body con scroll */}
              <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-5 sm:py-4 md:px-5 md:py-4 lg:px-6 lg:py-5">
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">                {error && (
                  <div className="bg-red-50 text-red-700 p-2.5 rounded-xl text-sm flex items-start gap-2.5 border border-red-200">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-medium">{error}</span>
                  </div>
                )}

                {/* Campos de registro y login */}
                {mode !== 'forgotPassword' && (
                  <>
                    {mode === 'register' && (
                      <div className="space-y-1.5">
                        <Label htmlFor="nombre" className="text-sm font-semibold text-gray-800 block">
                          {t('auth.fullName')}
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                            <User className="h-4 w-4" />
                          </div>
                          <Input
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            className="pl-10 pr-4 h-9 sm:h-10 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg
                                     bg-gray-50 focus:bg-white transition-all duration-200"
                            placeholder={t('auth.fullNamePlaceholder')}
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-800 block">
                        {t('auth.email')}
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                          <Mail className="h-4 w-4" />
                        </div>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-10 pr-4 h-9 sm:h-10 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg
                                   bg-gray-50 focus:bg-white transition-all duration-200"
                          placeholder={t('auth.emailPlaceholder')}
                        />
                      </div>
                    </div>

                    {mode === 'register' && (
                      <div className="space-y-1.5">
                        <Label htmlFor="telefono" className="text-sm font-semibold text-gray-800 block">
                          {t('auth.phone')}
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                            <Phone className="h-4 w-4" />
                          </div>
                          <Input
                            id="telefono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleInputChange}
                            className="pl-10 pr-4 h-9 sm:h-10 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg
                                     bg-gray-50 focus:bg-white transition-all duration-200"
                            placeholder={t('auth.phonePlaceholder')}
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <Label htmlFor="password" className="text-sm font-semibold text-gray-800 block">
                        {t('auth.password')}
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                          <Lock className="h-4 w-4" />
                        </div>
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleInputChange}
                          className="pl-10 pr-12 h-9 sm:h-10 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg
                                   bg-gray-50 focus:bg-white transition-all duration-200"
                          placeholder={mode === 'register' ? t('auth.passwordRegisterPlaceholder') : t('auth.passwordPlaceholder')}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-transparent h-full w-10"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {mode === 'register' && (
                      <div className="space-y-1.5">
                        <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-800 block">
                          {t('auth.confirmPassword')}
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                            <Lock className="h-4 w-4" />
                          </div>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="pl-10 pr-12 h-9 sm:h-10 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg
                                     bg-gray-50 focus:bg-white transition-all duration-200"
                            placeholder={t('auth.confirmPasswordPlaceholder')}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-transparent h-full w-10"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label={showConfirmPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Checkbox de términos y condiciones (solo en registro) */}
                    {mode === 'register' && (
                      <div className="flex items-start space-x-2.5 pt-1">
                        <input
                          id="acceptTerms"
                          type="checkbox"
                          checked={acceptTerms}
                          onChange={(e) => setAcceptTerms(e.target.checked)}
                          className="mt-1 h-4 w-4 text-blue-600 border border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                        />
                        <label htmlFor="acceptTerms" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                          {t('auth.acceptTerms') as string}{' '}
                          <a 
                            href="/terminos" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-500 underline font-medium transition-colors"
                          >
                            {t('auth.termsAndConditions') as string}
                          </a>
                          {' '}{t('auth.and') as string}{' '}
                          <a 
                            href="/politicas" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-500 underline font-medium transition-colors"
                          >
                            {t('auth.privacyPolicy') as string}
                          </a>
                        </label>
                      </div>
                    )}

                    {/* Área de "Recuérdame" y "Olvidé mi contraseña" (solo en login) */}
                    {mode === 'login' && (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
                        <div className="flex items-center space-x-2">
                          <input
                            id="rememberMe"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="h-4 w-4 text-blue-600 border border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer
                                     bg-gray-50 checked:bg-blue-600 transition-all duration-200"
                          />
                          <label htmlFor="rememberMe" className="text-sm text-gray-700 cursor-pointer">
                            {t('auth.rememberMe') as string}
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={() => setMode('forgotPassword')}
                          className="text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus-visible:underline transition-colors
                                   self-start sm:self-auto"
                        >
                          {t('auth.forgotPassword')}
                        </button>
                      </div>
                    )}
                  </>
                )}

                {/* Campo para recuperar contraseña */}
                {mode === 'forgotPassword' && (
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-800 block">
                      {t('auth.email')}
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                        <Mail className="h-4 w-4" />
                      </div>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 pr-4 h-9 sm:h-10 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg
                                 bg-gray-50 focus:bg-white transition-all duration-200"
                        placeholder={t('auth.emailPlaceholder')}
                      />
                    </div>
                  </div>
                )}

                {/* Botón de envío */}
                <Button 
                  type="submit" 
                  className="w-full h-10 sm:h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base
                           rounded-lg transition-all duration-300 focus:ring-4 focus:ring-blue-200 shadow-md hover:shadow-lg
                           transform hover:scale-[1.02] active:scale-[0.98] border-0"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-sm sm:text-base">
                        {mode === 'login' ? t('auth.loggingIn') : 
                         mode === 'register' ? t('auth.creatingAccount') : 
                         t('auth.sendingLink')}
                      </span>
                    </span>
                  ) : (
                    <span className="text-sm sm:text-base font-semibold">
                      {mode === 'login' ? t('auth.loginButton') : 
                       mode === 'register' ? t('auth.registerButton') : 
                       t('auth.forgotPasswordButton')}
                    </span>
                  )}
                </Button>

                {/* Separador */}
                {mode !== 'forgotPassword' && (
                  <div className="relative my-4 sm:my-5">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-xs sm:text-sm">
                      <span className="px-3 bg-white text-gray-500 font-medium">{t('auth.orContinueWith')}</span>
                    </div>
                  </div>
                )}

                {/* Login con Google */}
                {mode !== 'forgotPassword' && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-10 sm:h-11 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 
                               flex items-center justify-center gap-2 font-medium text-sm text-gray-700
                               rounded-lg transition-all duration-200 focus:ring-4 focus:ring-gray-200 shadow-sm hover:shadow-md
                               transform hover:scale-[1.02] active:scale-[0.98]"
                    onClick={handleGoogleAuth}
                    disabled={isLoading}
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                      <path d="M17.64 9.20455C17.64 8.56637 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4" />
                      <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853" />
                      <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957273C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z" fill="#FBBC05" />
                      <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335" />
                    </svg>
                    <span>{t('auth.continueWithGoogle')}</span>
                  </Button>
                )}
              </form>

              {/* Footer */}
              <div className="mt-4 sm:mt-5 text-center text-xs sm:text-sm">
                {mode === 'login' ? (
                  <p className="text-gray-600">
                    {t('auth.noAccount')}{' '}
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus-visible:underline transition-colors"
                    >
                      {t('auth.signUp')}
                    </button>
                  </p>
                ) : mode === 'register' ? (
                  <p className="text-gray-600">
                    {t('auth.alreadyHaveAccount')}{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus-visible:underline transition-colors"
                    >
                      {t('auth.signIn')}
                    </button>
                  </p>
                ) : (
                  <p>
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus-visible:underline transition-colors"
                    >
                      {t('auth.backToLogin')}
                    </button>
                  </p>
                )}
              </div>
            </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}