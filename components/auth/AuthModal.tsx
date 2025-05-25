"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle, User, Eye, EyeOff, Phone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signInWithGoogle, 
  resetPassword,
  checkEmailExists
} from '@/lib/supabase/auth';
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
      setError('Email inválido');
      return false;
    }

    try {
      setIsLoading(true);
      const exists = await checkEmailExists(formData.email);
      setEmailChecked(true);
      setEmailExists(exists);

      // En modo registro, el email no debería existir
      if (mode === 'register' && exists) {
        setError('Este email ya está registrado. Intenta iniciar sesión.');
        return false;
      }

      // En modo login y forgotPassword, el email debería existir
      if ((mode === 'login' || mode === 'forgotPassword') && !exists) {
        setError('Este email no está registrado. Intenta crear una cuenta.');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error al verificar email:', error);
      setError('Error al verificar email');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = async (): Promise<boolean> => {
    // Validación común para todos los modos
    if (!formData.email) {
      setError('El email es requerido');
      return false;
    }

    if (!validateEmail(formData.email)) {
      setError('Email inválido');
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
        setError('El nombre es requerido');
        return false;
      }

      if (!formData.password) {
        setError('La contraseña es requerida');
        return false;
      }

      if (!validatePassword(formData.password)) {
        setError('La contraseña debe tener al menos 6 caracteres, una letra y un número');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return false;
      }                      // Validar que se hayan aceptado los términos y condiciones
                      if (!acceptTerms) {
                        setError(t('auth.acceptTermsRequired') as string);
                        return false;
                      }
    }

    if (mode === 'login' && !formData.password) {
      setError('La contraseña es requerida');
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
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Ha ocurrido un error');
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
      
      if (!result.usuario) {
        throw new Error('No se pudo obtener la información del usuario');
      }
      
      toast.success('¡Bienvenido de vuelta!');
      onClose();
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.refresh();
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      
      // Manejo más eficiente de los errores
      if (err.message && (
          err.message.toLowerCase().includes('verificación') || 
          err.message.toLowerCase().includes('verifica')
      )) {
        // Error relacionado con verificación de cuenta
        setError(err.message);
        
        // Intentar sincronizar la verificación automáticamente primero
        try {
          setIsLoading(true);
          const syncResponse = await fetch('/api/auth/sync-verification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email }),
          });
          
          if (syncResponse.ok) {
            // Si se sincronizó correctamente, intentar iniciar sesión de nuevo
            toast.success('Estado de verificación actualizado. Intentando iniciar sesión...');
            
            try {
              const retryResult = await signInWithEmail({
                email: formData.email,
                password: formData.password
              });
              
              if (retryResult.usuario) {
                toast.success('¡Bienvenido de vuelta!');
                onClose();
                if (redirectUrl) {
                  router.push(redirectUrl);
                } else {
                  router.refresh();
                }
                return;
              }
            } catch (retryError) {
              console.error('Error al reintentar inicio de sesión:', retryError);
              // Continuamos con el flujo normal si el reintento falla
            }
          }
          
          // Si la sincronización falló o el reintento falló, preguntar por reenvío
          const shouldResend = window.confirm(
            "¿Deseas que enviemos un nuevo correo de verificación?"
          );
          
          if (shouldResend) {
            const response = await fetch('/api/auth/resend-verification', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: formData.email }),
            });
            
            if (response.ok) {
              toast.success('Nuevo correo de verificación enviado. Por favor, revisa tu bandeja de entrada.');
            } else {
              const errorData = await response.json();
              toast.error(errorData.error || 'Error al enviar el correo de verificación');
            }
          }
        } catch (syncError) {
          console.error('Error al sincronizar verificación:', syncError);
          toast.error('Hubo un problema al verificar tu cuenta. Por favor, intenta nuevamente.');
        } finally {
          setIsLoading(false);
        }
      } else if (err.message && err.message.includes('Invalid login credentials')) {
        // Credenciales inválidas
        setError('Credenciales inválidas. Verifica tu email y contraseña.');
      } else if (err.message && err.message.includes('Email not confirmed')) {
        // Email no confirmado (aunque no debería llegar aquí debido a las mejoras en auth.ts)
        setError('Tu cuenta necesita verificación. Por favor, revisa tu correo electrónico para completar el proceso de verificación.');
        
        // Ofrecer reenvío automáticamente
        try {
          setIsLoading(true);
          await fetch('/api/auth/resend-verification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email }),
          });
          toast.success('Hemos enviado un nuevo correo de verificación a tu email.');
        } catch (resendError) {
          console.error('Error al reenviar verificación:', resendError);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Otros errores
        setError(err.message || 'Ha ocurrido un error al iniciar sesión');
      }
    }
  };

  const handleRegister = async () => {
    const result = await signUpWithEmail({
      email: formData.email,
      password: formData.password,
      nombre: formData.nombre,
      telefono: formData.telefono || undefined
    });
    
    toast.success('Cuenta creada exitosamente. Por favor, verifica tu email.');
    onClose();
    if (redirectUrl) {
      router.push(redirectUrl);
    } else {
      router.refresh();
    }
  };

  const handleForgotPassword = async () => {
    await resetPassword(formData.email);
    toast.success('Se ha enviado un enlace a tu correo para restablecer tu contraseña');
    setMode('login');
  };

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      const { error } = await signInWithGoogle();
      if (error) throw error;
      toast.success('Redirigiendo...');
    } catch (err: any) {
      console.error('Google auth error:', err);
      setError('Error al iniciar sesión con Google');
    } finally {
      setIsLoading(false);
    }
  };

  const dialogTitle = mode === 'login' ? 'Iniciar Sesión' : 
                     mode === 'register' ? 'Crear Cuenta' : 
                     'Recuperar Contraseña';

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          className="w-[95vw] max-w-none sm:max-w-[420px] md:max-w-[440px] p-0 m-0 
                     fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                     h-auto max-h-[95vh] min-h-[500px] overflow-hidden 
                     bg-white rounded-lg shadow-2xl border-0
                     [&>button:last-child]:hidden"
        >
          <DialogTitle className="sr-only">{dialogTitle}</DialogTitle>
          
          {/* Container con scroll */}
          <div className="flex flex-col h-full max-h-[95vh] overflow-hidden">
            {/* Header fijo */}
            <div className="relative flex-shrink-0 py-4 px-4 sm:py-5 sm:px-6 text-center border-b bg-white">
              {/* Botón de cerrar */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 sm:right-3 sm:top-3 rounded-full h-8 w-8 
                          flex items-center justify-center hover:bg-gray-100 transition-colors"
                onClick={onClose}
                aria-label="Cerrar"
              >
                <X className="h-4 w-4 text-gray-600" />
              </Button>

              {/* Logo */}
              <div className="flex justify-center mb-3">
                <motion.img 
                  src="/logoaunclic.svg" 
                  alt="Logo A un clic" 
                  className="h-12 w-12 sm:h-14 sm:w-14 filter drop-shadow-md" 
                  width="56"
                  height="56"
                />
              </div>

              {/* Título y descripción */}
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{dialogTitle}</h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-xs mx-auto leading-tight">
                {mode === 'login' ? 'Bienvenido de vuelta a A un clic la' : 
                 mode === 'register' ? 'Únete a nuestra comunidad' :
                 'Te enviaremos un enlace para restablecer tu contraseña'}
              </p>
            </div>

            {/* Body con scroll */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">{/* ...existing code... */}
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2 border border-red-200">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span className="leading-tight">{error}</span>
                  </div>
                )}

                {/* Campos de registro y login */}
                {mode !== 'forgotPassword' && (
                  <>
                    {mode === 'register' && (
                      <div className="space-y-2">
                        <Label htmlFor="nombre" className="text-sm font-medium text-gray-700">
                          Nombre completo
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            <User className="h-4 w-4" />
                          </div>
                          <Input
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            className="pl-10 h-11 sm:h-12 text-base sm:text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Tu nombre completo"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Correo electrónico
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                          <Mail className="h-4 w-4" />
                        </div>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-10 h-11 sm:h-12 text-base sm:text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="tu@ejemplo.com"
                        />
                      </div>
                    </div>

                    {mode === 'register' && (
                      <div className="space-y-2">
                        <Label htmlFor="telefono" className="text-sm font-medium text-gray-700">
                          Teléfono (opcional)
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            <Phone className="h-4 w-4" />
                          </div>
                          <Input
                            id="telefono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleInputChange}
                            className="pl-10 h-11 sm:h-12 text-base sm:text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Tu número de teléfono"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Contraseña
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                          <Lock className="h-4 w-4" />
                        </div>
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleInputChange}
                          className="pl-10 pr-12 h-11 sm:h-12 text-base sm:text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder={mode === 'register' ? "Mínimo 6 caracteres" : "Tu contraseña"}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
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
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                          Confirmar contraseña
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            <Lock className="h-4 w-4" />
                          </div>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="pl-10 pr-12 h-11 sm:h-12 text-base sm:text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Repite tu contraseña"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
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
                      <div className="flex items-start space-x-3 pt-2">
                        <input
                          id="acceptTerms"
                          type="checkbox"
                          checked={acceptTerms}
                          onChange={(e) => setAcceptTerms(e.target.checked)}
                          className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <label htmlFor="acceptTerms" className="text-sm text-gray-600 leading-5">
                          {t('auth.acceptTerms') as string}{' '}
                          <a 
                            href="/terminos" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-500 underline font-medium"
                          >
                            {t('auth.termsAndConditions') as string}
                          </a>
                          {' '}{t('auth.and') as string}{' '}
                          <a 
                            href="/politicas" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-500 underline font-medium"
                          >
                            {t('auth.privacyPolicy') as string}
                          </a>
                        </label>
                      </div>
                    )}

                    {/* Área de "Recuérdame" y "Olvidé mi contraseña" (solo en login) */}
                    {mode === 'login' && (
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center space-x-2">
                          <input
                            id="rememberMe"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <label htmlFor="rememberMe" className="text-sm text-gray-600">
                            {t('auth.rememberMe') as string}
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={() => setMode('forgotPassword')}
                          className="text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus-visible:underline"
                        >
                          ¿Olvidaste tu contraseña?
                        </button>
                      </div>
                    )}
                  </>
                )}

                {/* Campo para recuperar contraseña */}
                {mode === 'forgotPassword' && (
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Correo electrónico
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                        <Mail className="h-4 w-4" />
                      </div>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 h-11 sm:h-12 text-base sm:text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="tu@ejemplo.com"
                      />
                    </div>
                  </div>
                )}

                {/* Botón de envío */}
                <Button 
                  type="submit" 
                  className="w-full h-12 sm:h-13 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base sm:text-sm
                           rounded-lg transition-colors duration-200 focus:ring-4 focus:ring-blue-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {mode === 'login' ? 'Iniciando sesión...' : 
                       mode === 'register' ? 'Creando cuenta...' : 
                       'Enviando enlace...'}
                    </span>
                  ) : (
                    <span>
                      {mode === 'login' ? 'Iniciar sesión' : 
                       mode === 'register' ? 'Crear cuenta' : 
                       'Enviar enlace'}
                    </span>
                  )}
                </Button>

                {/* Separador */}
                {mode !== 'forgotPassword' && (
                  <div className="relative my-5 sm:my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-white text-gray-500 font-medium">O continúa con</span>
                    </div>
                  </div>
                )}

                {/* Login con Google */}
                {mode !== 'forgotPassword' && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 sm:h-13 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 
                               flex items-center justify-center gap-3 font-medium text-base sm:text-sm
                               rounded-lg transition-all duration-200 focus:ring-4 focus:ring-gray-200"
                    onClick={handleGoogleAuth}
                    disabled={isLoading}
                  >
                    <svg width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                      <path d="M17.64 9.20455C17.64 8.56637 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4" />
                      <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853" />
                      <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957273C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z" fill="#FBBC05" />
                      <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335" />
                    </svg>
                    <span>Continuar con Google</span>
                  </Button>
                )}
              </form>

              {/* Footer */}
              <div className="mt-6 text-center text-sm">
                {mode === 'login' ? (
                  <p>
                    ¿No tienes una cuenta?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus-visible:underline"
                    >
                      Regístrate
                    </button>
                  </p>
                ) : mode === 'register' ? (
                  <p>
                    ¿Ya tienes una cuenta?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus-visible:underline"
                    >
                      Inicia sesión
                    </button>
                  </p>
                ) : (
                  <p>
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus-visible:underline"
                    >
                      Volver a inicio de sesión
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}