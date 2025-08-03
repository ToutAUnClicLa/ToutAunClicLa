"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, AlertCircle, User, Eye, EyeOff, Phone, X, Shield, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { Input } from '@/components/common/ui/input';
import { Label } from '@/components/common/ui/label';
import { Dialog, DialogContent, DialogTitle } from '@/components/common/ui/dialog';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgotPassword' | 'verification';
  redirectUrl?: string;
  onLoginSuccess?: () => void;
}

export default function AuthModal({ 
  isOpen, 
  onClose, 
  initialMode = 'login', 
  redirectUrl, 
  onLoginSuccess 
}: AuthModalProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { login, register, verifyEmail, resendVerification } = useAuth();
  
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
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  // Restablecer los estados cuando cambia el modo
  useEffect(() => {
    if (mode === 'verification') {
      // Mantener el email del formulario actual para verificación
      const currentEmail = formData.email || localStorage.getItem('pending_verification_email') || '';
      setFormData(prev => ({
        ...prev,
        email: currentEmail,
        // Limpiar otros campos pero mantener el email
        nombre: '',
        telefono: '',
        password: '',
        confirmPassword: ''
      }));
    } else {
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        password: '',
        confirmPassword: ''
      });
    }
    
    setError(null);
    setVerificationCode('');
    setAcceptTerms(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [mode, formData.email]);

  // Restablecer al abrir/cerrar modal
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    } else {
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen, initialMode]);

  // Validaciones
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6 && /[a-zA-Z]/.test(password) && /\d/.test(password);
  };

  const validateForm = (): boolean => {
    setError(null);
    
    // Validación para modo verificación
    if (mode === 'verification') {
      if (!verificationCode || verificationCode.length !== 6) {
        setError('Ingresa el código de 6 dígitos');
        return false;
      }
      return true;
    }

    // Validación común para todos los modos excepto verificación
    if (!formData.email?.trim()) {
      setError('Email requerido');
      return false;
    }

    if (!validateEmail(formData.email.trim())) {
      setError('Email inválido');
      return false;
    }

    // Para modo registro, hacer validación más estricta
    if (mode === 'register') {
      if (!formData.nombre?.trim()) {
        setError('Nombre requerido');
        return false;
      }

      if (!formData.password) {
        setError('Contraseña requerida');
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

      if (!acceptTerms) {
        setError('Debes aceptar los términos y condiciones');
        return false;
      }
    }

    // Para modo login
    if (mode === 'login') {
      if (!formData.password) {
        setError('Contraseña requerida');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError(null);
      
      const isValid = validateForm();
      if (!isValid) {
        setIsLoading(false);
        return;
      }

      if (mode === 'login') {
        await handleLogin();
      } else if (mode === 'register') {
        await handleRegister();
      } else if (mode === 'verification') {
        await handleVerification();
      }
    } catch (err: any) {
      console.error('Error en handleSubmit:', err);
      setError(err.message || 'Error general');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await login({
        email: formData.email.trim(),
        password: formData.password
      });

      toast.success('¡Bienvenido!', {
        description: 'Has iniciado sesión correctamente'
      });

      onClose();

      // Ejecutar callback de éxito si existe
      onLoginSuccess?.();

      // Redirigir si hay URL especificada
      if (redirectUrl) {
        router.push(redirectUrl);
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      
      // Si el usuario no está verificado, mostrar modal de verificación
      if (error.message.includes('not verified') || error.message.includes('verificación') || error.message.includes('verify')) {
        // Guardar el email para el proceso de verificación
        localStorage.setItem('pending_verification_email', formData.email.trim());
        setMode('verification');
        setError('Tu cuenta requiere verificación. Te enviamos un nuevo código a tu email.');
        return;
      }
      
      setError(error.message || 'Error al iniciar sesión');
    }
  };

  const handleRegister = async () => {
    try {
      const response = await register({
        email: formData.email.trim(),
        password: formData.password,
        nombre: formData.nombre.trim(),
        telefono: formData.telefono?.trim() || undefined
      });

      toast.success('¡Registro exitoso!', {
        description: 'Te enviamos un código de verificación a tu email'
      });

      // Guardar el email para el proceso de verificación
      localStorage.setItem('pending_verification_email', formData.email.trim());
      
      // Cambiar al modo de verificación
      setMode('verification');
      setError(null);
    } catch (error: any) {
      console.error('Error en registro:', error);
      
      // Manejar error de usuario existente
      if (error.message.includes('already exists') || error.message.includes('ya existe')) {
        setError('Este email ya está registrado. ¿Quieres iniciar sesión?');
        // Opcional: cambiar a modo login automáticamente
        // setTimeout(() => setMode('login'), 3000);
        return;
      }
      
      setError(error.message || 'Error al registrar usuario');
    }
  };

  const handleVerification = async () => {
    try {
      // Usar el email del formulario o el almacenado
      const emailToVerify = formData.email.trim() || localStorage.getItem('pending_verification_email') || '';
      
      if (!emailToVerify) {
        setError('No se encontró el email para verificar');
        return;
      }

      const response = await verifyEmail(verificationCode, emailToVerify);

      toast.success('¡Email verificado!', {
        description: 'Tu cuenta ha sido verificada correctamente'
      });

      // Limpiar email pendiente
      localStorage.removeItem('pending_verification_email');

      onClose();

      // Ejecutar callback de éxito si existe
      onLoginSuccess?.();

      // Redirigir si hay URL especificada
      if (redirectUrl) {
        router.push(redirectUrl);
      }
    } catch (error: any) {
      console.error('Error en verificación:', error);
      setError(error.message || 'Código de verificación inválido');
    }
  };

  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      const emailToResend = formData.email.trim() || localStorage.getItem('pending_verification_email') || '';
      
      if (!emailToResend) {
        setError('No se encontró el email para reenviar el código');
        return;
      }

      await resendVerification(emailToResend);
      toast.success('Código reenviado', {
        description: 'Revisa tu email para el nuevo código'
      });
    } catch (error: any) {
      console.error('Error al reenviar código:', error);
      setError(error.message || 'Error al reenviar código');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // TODO: Implementar login con Google
    toast.info('Próximamente', {
      description: 'El login con Google estará disponible pronto'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const dialogTitle = 
    mode === 'login' ? 'Iniciar Sesión' : 
    mode === 'register' ? 'Crear Cuenta' : 
    mode === 'verification' ? 'Verificar Email' :
    'Recuperar Contraseña';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[460px] max-w-[90vw] max-h-[95vh] p-0 overflow-hidden bg-white border-0 shadow-2xl">
        {/* Header con gradiente - ultra compacto */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-3 sm:px-4 py-2.5 sm:py-3 text-white">
          {/* Decoraciones de fondo */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-14 h-14 bg-white/5 rounded-full blur-xl"></div>
          
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="p-1 bg-white/10 rounded-md backdrop-blur-sm">
                  {mode === 'verification' ? (
                    <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                  ) : mode === 'register' ? (
                    <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                  ) : (
                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                  )}
                </div>
                <DialogTitle className="text-base sm:text-lg font-bold text-white">
                  {dialogTitle}
                </DialogTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 sm:h-7 sm:w-7 p-0 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </Button>
            </div>
            
            <p className="text-blue-100 mt-0.5 text-xs sm:text-sm">
              {mode === 'login' && 'Bienvenido de vuelta'}
              {mode === 'register' && 'Crea tu cuenta gratis'}
              {mode === 'verification' && 'Verifica tu email'}
            </p>
          </div>
        </div>

        {/* Contenido del formulario - con scroll si es necesario */}
        <div className="px-3 sm:px-4 py-2 sm:py-3 max-h-[calc(95vh-80px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-2.5">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 p-2 sm:p-2.5 text-xs sm:text-sm text-red-700 bg-red-50 rounded-lg border border-red-200"
                >
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="font-medium">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {mode === 'verification' ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 sm:space-y-3.5"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-1.5 sm:mb-2">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    Ingresa el código de 6 dígitos enviado a tu email
                  </p>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="verification-code" className="text-xs sm:text-sm font-medium text-gray-700">
                    Código de verificación
                  </Label>
                  <Input
                    id="verification-code"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    className="text-center text-base sm:text-lg tracking-widest font-mono h-8 sm:h-10 bg-gray-50 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg"
                    autoFocus
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-8 sm:h-9 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-xs sm:text-sm" 
                  disabled={isLoading || verificationCode.length !== 6}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent"></div>
                      Verificando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Verificar
                    </div>
                  )}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleResendCode}
                    disabled={isLoading}
                    className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 font-medium"
                  >
                    ¿No recibiste el código? Reenviar
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2 sm:space-y-2.5"
              >
                {/* Botón de Google */}
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleLogin}
                    className="w-full h-8 sm:h-9 bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 font-medium rounded-lg transition-all duration-200 text-xs sm:text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continuar con Google
                    </div>
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white px-2 text-gray-500">o</span>
                    </div>
                  </div>
                </div>

                {/* Email field */}
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs sm:text-sm font-medium text-gray-700">
                    Correo electrónico
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="tu@email.com"
                      className="pl-9 h-8 sm:h-9 bg-gray-50 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg transition-all duration-200 text-xs sm:text-sm"
                      required
                      autoFocus={mode === 'login' || mode === 'register'}
                    />
                  </div>
                </div>

                {/* Campos adicionales para registro */}
                {mode === 'register' && (
                  <>
                    <div className="space-y-1">
                      <Label htmlFor="nombre" className="text-xs sm:text-sm font-medium text-gray-700">
                        Nombre completo
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
                        <Input
                          id="nombre"
                          name="nombre"
                          type="text"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          placeholder="Tu nombre completo"
                          className="pl-9 h-8 sm:h-9 bg-gray-50 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg transition-all duration-200 text-xs sm:text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="telefono" className="text-xs sm:text-sm font-medium text-gray-700">
                        Teléfono <span className="text-gray-400 text-xs">(opcional)</span>
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
                        <Input
                          id="telefono"
                          name="telefono"
                          type="tel"
                          value={formData.telefono}
                          onChange={handleInputChange}
                          placeholder="+1 234 567 8900"
                          className="pl-9 h-8 sm:h-9 bg-gray-50 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg transition-all duration-200 text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Password field */}
                {(mode === 'login' || mode === 'register') && (
                  <div className="space-y-1">
                    <Label htmlFor="password" className="text-xs sm:text-sm font-medium text-gray-700">
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Tu contraseña"
                        className="pl-9 pr-9 h-8 sm:h-9 bg-gray-50 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg transition-all duration-200 text-xs sm:text-sm"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 p-0 hover:bg-gray-100 rounded-md"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-3 w-3 text-gray-400" />
                        ) : (
                          <Eye className="h-3 w-3 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Confirm password field for register */}
                {mode === 'register' && (
                  <div className="space-y-1">
                    <Label htmlFor="confirmPassword" className="text-xs sm:text-sm font-medium text-gray-700">
                      Confirmar contraseña
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirma tu contraseña"
                        className="pl-9 pr-9 h-8 sm:h-9 bg-gray-50 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg transition-all duration-200 text-xs sm:text-sm"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 p-0 hover:bg-gray-100 rounded-md"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-3 w-3 text-gray-400" />
                        ) : (
                          <Eye className="h-3 w-3 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Terms acceptance for register - ultra compacto */}
                {mode === 'register' && (
                  <div className="flex items-start space-x-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-0.5 h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-1"
                    />
                    <Label htmlFor="acceptTerms" className="text-xs text-gray-600 leading-tight">
                      Acepto los{' '}
                      <a href="/terminos" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                        términos y condiciones
                      </a>{' '}
                      y las{' '}
                      <a href="/politicas" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                        políticas de privacidad
                      </a>
                    </Label>
                  </div>
                )}

                {/* Submit button */}
                <Button 
                  type="submit" 
                  className="w-full h-8 sm:h-9 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-xs sm:text-sm mt-2" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent"></div>
                      Procesando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {mode === 'login' ? (
                        <>
                          <User className="h-3.5 w-3.5" />
                          Iniciar Sesión
                        </>
                      ) : mode === 'register' ? (
                        <>
                          <Sparkles className="h-3.5 w-3.5" />
                          Crear Cuenta
                        </>
                      ) : (
                        'Enviar'
                      )}
                    </div>
                  )}
                </Button>

                {/* Mode switching */}
                <div className="text-center pt-1 border-t border-gray-100">
                  {mode === 'login' ? (
                    <p className="text-xs sm:text-sm text-gray-600">
                      ¿No tienes cuenta?{' '}
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setMode('register')}
                        className="p-0 h-auto text-blue-600 hover:text-blue-700 font-medium hover:underline text-xs sm:text-sm"
                      >
                        Regístrate gratis
                      </Button>
                    </p>
                  ) : mode === 'register' ? (
                    <p className="text-xs sm:text-sm text-gray-600">
                      ¿Ya tienes cuenta?{' '}
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setMode('login')}
                        className="p-0 h-auto text-blue-600 hover:text-blue-700 font-medium hover:underline text-xs sm:text-sm"
                      >
                        Inicia sesión
                      </Button>
                    </p>
                  ) : null}
                </div>
              </motion.div>
            )}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
