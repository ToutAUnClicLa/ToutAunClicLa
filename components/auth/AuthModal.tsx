"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle, User, Eye, EyeOff, Phone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { toast } from 'sonner';
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
    }
  }, [isOpen, initialMode]);

  // Ocultar el botón X por defecto de Radix en el modal
  useEffect(() => {
    // Encuentra y oculta el botón de cierre por defecto de DialogContent
    if (isOpen) {
      const timer = setTimeout(() => {
        const closeButton = document.querySelector('[data-radix-popper-content-wrapper] [data-radix-dialog-close]');
        if (closeButton && closeButton instanceof HTMLElement) {
          closeButton.style.display = 'none';
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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
          className="max-w-[95vw] w-full xs:max-w-[400px] sm:max-w-[425px] p-0 overflow-hidden bg-white rounded-lg mx-auto my-4 h-auto max-h-[90vh] overflow-y-auto"
        >
          <DialogTitle className="sr-only">{dialogTitle}</DialogTitle>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="relative py-5 px-4 sm:p-6 text-center border-b">
              {/* Botón de cerrar personalizado */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-3 top-3 sm:right-4 sm:top-4 rounded-full h-8 w-8 sm:h-8 sm:w-8 flex items-center justify-center"
                onClick={onClose}
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="flex justify-center">
                <motion.img 
                  src="/logoaunclic.svg" 
                  alt="Logo A un clic" 
                  className="h-16 w-16 xs:h-[60px] xs:w-[60px] sm:h-[65px] sm:w-[65px] filter drop-shadow-md" 
                  width="88"
                  height="88"
                />
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mt-3">{dialogTitle}</h2>
              <p className="mt-1 text-sm text-gray-500 max-w-xs mx-auto">
                {mode === 'login' ? 'Bienvenido de vuelta a A un clic la' : 
                 mode === 'register' ? 'Únete a nuestra comunidad' :
                 'Te enviaremos un enlace para restablecer tu contraseña'}
              </p>
            </div>

            {/* Body */}
            <div className="p-4 xs:p-5 sm:p-6 flex-1">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Campos de registro y login */}
                {mode !== 'forgotPassword' && (
                  <>
                    {mode === 'register' && (
                      <div className="space-y-2">
                        <Label htmlFor="nombre" className="text-sm font-medium">
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
                            className="pl-10 h-10 xs:h-11 text-sm"
                            placeholder="Tu nombre completo"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
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
                          className="pl-10 h-10 xs:h-11 text-sm"
                          placeholder="tu@ejemplo.com"
                        />
                      </div>
                    </div>

                    {mode === 'register' && (
                      <div className="space-y-2">
                        <Label htmlFor="telefono" className="text-sm font-medium">
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
                            className="pl-10 h-10 xs:h-11 text-sm"
                            placeholder="Tu número de teléfono"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">
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
                          className="pl-10 pr-10 h-10 xs:h-11 text-sm"
                          placeholder={mode === 'register' ? "Mínimo 6 caracteres" : "Tu contraseña"}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
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
                        <Label htmlFor="confirmPassword" className="text-sm font-medium">
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
                            className="pl-10 pr-10 h-10 xs:h-11 text-sm"
                            placeholder="Repite tu contraseña"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
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
                  </>
                )}

                {/* Campo para recuperar contraseña */}
                {mode === 'forgotPassword' && (
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
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
                        className="pl-10 h-10 xs:h-11 text-sm"
                        placeholder="tu@ejemplo.com"
                      />
                    </div>
                  </div>
                )}

                {/* Olvidé mi contraseña (solo en login) */}
                {mode === 'login' && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setMode('forgotPassword')}
                      className="text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus-visible:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                )}

                {/* Botón de envío */}
                <Button 
                  type="submit" 
                  className="w-full h-10 xs:h-11 bg-blue-600 hover:bg-blue-700 text-white"
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
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">O continúa con</span>
                    </div>
                  </div>
                )}

                {/* Login con Google */}
                {mode !== 'forgotPassword' && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-10 xs:h-11 border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"
                    onClick={handleGoogleAuth}
                    disabled={isLoading}
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.64 9.20455C17.64 8.56637 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4" />
                      <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853" />
                      <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957273C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z" fill="#FBBC05" />
                      <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335" />
                    </svg>
                    <span>Google</span>
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