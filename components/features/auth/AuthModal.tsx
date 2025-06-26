"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle, User, Eye, EyeOff, Phone, X } from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { Input } from '@/components/common/ui/input';
import { Label } from '@/components/common/ui/label';
import { Dialog, DialogContent, DialogTitle } from '@/components/common/ui/dialog';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { checkEmailExists } from '@/lib/services/auth';
import { getPendingVerificationEmail, clearPendingVerificationEmail } from '@/lib/services/auth';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgotPassword' | 'verification';
  redirectUrl?: string;
  onLoginSuccess?: () => void; // Nuevo callback para éxito de login
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login', redirectUrl, onLoginSuccess }: AuthModalProps) {
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
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

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
    setVerificationCode('');
  }, [mode]);

  // Restablecer los estados cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      
      // Si estamos en modo verificación, intentar recuperar el email pendiente
      const pendingEmail = getPendingVerificationEmail();
      setFormData({
        nombre: '',
        email: pendingEmail || '',
        telefono: '',
        password: '',
        confirmPassword: ''
      });
      setError(null);
      setEmailChecked(false);
      setEmailExists(false);
      setAcceptTerms(false);
      setRememberMe(false);
      setVerificationCode('');
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
        setError('Este email ya está registrado');
        return false;
      }

      // En modo login y forgotPassword, el email debería existir
      if ((mode === 'login' || mode === 'forgotPassword') && !exists) {
        setError('Email no registrado');
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
    // Validación común para todos los modos excepto verificación
    if (mode !== 'verification') {
      if (!formData.email) {
        setError('Email requerido');
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
    }

    // Validaciones específicas por modo
    if (mode === 'register') {
      if (!formData.nombre) {
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

    if (mode === 'login' && !formData.password) {
      setError('Contraseña requerida');
      return false;
    }

    if (mode === 'verification' && (!verificationCode || verificationCode.length !== 6)) {
      setError('Ingresa el código de 6 dígitos');
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
      } else if (mode === 'verification') {
        await handleVerification();
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Error general');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      await login({ email: formData.email, password: formData.password });
      
      // Cerrar modal inmediatamente
      onClose();
      
      // Ejecutar callback si existe
      onLoginSuccess?.();
      
      // Navegar si hay redirectUrl
      if (redirectUrl) {
        router.push(redirectUrl);
      }
    } catch (err: any) {
      console.error('Error de login:', err);
      
      if (err.message.includes('verificación')) {
        setError(err.message);
        
        const shouldResend = window.confirm(
          '¿Deseas que reenviemos el correo de verificación?'
        );
        
        if (shouldResend) {
          try {
            await resendVerification(formData.email);
          } catch (resendError) {
            console.error('Error al reenviar verificación:', resendError);
          }
        }
      } else {
        throw err;
      }
    }
  };

  const handleRegister = async () => {
    try {
      await register({
        email: formData.email,
        password: formData.password,
        nombre: formData.nombre,
        telefono: formData.telefono || undefined
      });
      
      // Cambiar a modo verificación
      setMode('verification');
      toast.success('Cuenta creada correctamente. Ingresa el código que enviamos a tu correo.');
    } catch (err: any) {
      console.error('Error de registro:', err);
      throw err;
    }
  };

  const handleForgotPassword = async () => {
    try {
      // Esta funcionalidad debe ser implementada en tu backend
      console.warn('Reset password: Esta funcionalidad debe ser implementada en el backend');
      toast.success('Si el correo existe, recibirás instrucciones para restablecer tu contraseña.');
      setMode('login');
    } catch (err: any) {
      console.error('Error al resetear contraseña:', err);
      throw err;
    }
  };

  const handleVerification = async () => {
    try {
      // Usar el email del formulario o el email pendiente almacenado
      const emailToVerify = formData.email || getPendingVerificationEmail();
      
      if (!emailToVerify) {
        setError('No se encontró el email para verificar. Por favor, regístrate nuevamente.');
        return;
      }
      
      await verifyEmail(verificationCode, emailToVerify);
      
      // Limpiar el email pendiente después de verificación exitosa
      clearPendingVerificationEmail();
      
      toast.success('Email verificado correctamente. ¡Bienvenido!');
      onClose();
      
      // Pequeño delay para asegurar que el estado se actualice antes de navegar
      setTimeout(() => {
        if (redirectUrl) {
          router.push(redirectUrl);
        }
      }, 100);
    } catch (err: any) {
      console.error('Error de verificación:', err);
      throw err;
    }
  };

  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      
      // Usar el email del formulario o el email pendiente almacenado
      const emailToResend = formData.email || getPendingVerificationEmail();
      
      if (!emailToResend) {
        setError('No se encontró el email para reenviar. Por favor, regístrate nuevamente.');
        return;
      }
      
      await resendVerification(emailToResend);
      toast.success('Código reenviado correctamente');
    } catch (err: any) {
      console.error('Error al reenviar código:', err);
      toast.error('Error al reenviar código');
    } finally {
      setIsLoading(false);
    }
  };

  const dialogTitle = mode === 'login' ? 'Iniciar Sesión' : 
                     mode === 'register' ? 'Crear Cuenta' : 
                     mode === 'verification' ? 'Verificar Email' :
                     'Recuperar Contraseña';

  return (
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
                    {mode === 'login' ? 'Bienvenido de vuelta' : 
                     mode === 'register' ? 'Únete a nuestra comunidad' :
                     mode === 'verification' ? 'Verifica tu cuenta' :
                     'Recupera tu cuenta'}
                  </h2>
                  <p className="text-indigo-100 text-base leading-relaxed">
                    {mode === 'login' ? 'Accede a tu cuenta para continuar comprando' : 
                     mode === 'register' ? 'Crea tu cuenta y disfruta de todos los beneficios' :
                     mode === 'verification' ? 'Ingresa el código que enviamos a tu correo' :
                     'Te ayudaremos a recuperar el acceso a tu cuenta'}
                  </p>
                </div>
                
                {/* Características destacadas */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center space-x-3 text-indigo-100">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-sm lg:text-base">Envío rápido y seguro</span>
                  </div>
                  <div className="flex items-center space-x-3 text-indigo-100">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-sm lg:text-base">Productos auténticos</span>
                  </div>
                  <div className="flex items-center space-x-3 text-indigo-100">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-sm lg:text-base">Soporte 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha: Formulario */}
          <div className="w-full md:w-1/2 lg:w-[58%] flex flex-col">
            {/* Header móvil - Solo visible en móvil */}
            <div className="md:hidden relative flex-shrink-0 py-3 px-4 border-b bg-white">
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
                    {mode === 'login' ? 'Accede a tu cuenta' : 
                     mode === 'register' ? 'Crea tu nueva cuenta' :
                     mode === 'verification' ? 'Verifica tu email' :
                     'Recupera tu contraseña'}
                  </p>
                </div>
              </div>
            </div>

            {/* Header desktop - Solo visible en desktop */}
            <div className="hidden md:block flex-shrink-0 py-4 px-5 lg:px-6 border-b bg-white">
              <div className="text-center space-y-1">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 leading-tight">
                  {dialogTitle}
                </h3>
                <p className="text-sm lg:text-base text-gray-600 leading-snug">
                  {mode === 'login' ? 'Ingresa tus datos para continuar' : 
                   mode === 'register' ? 'Completa los datos para crear tu cuenta' :
                   mode === 'verification' ? 'Ingresa el código de verificación' :
                   'Ingresa tu email para recuperar tu contraseña'}
                </p>
              </div>
            </div>

            {/* Body con scroll */}
            <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-5 sm:py-4 md:px-5 md:py-4 lg:px-6 lg:py-5">
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-700 p-2.5 rounded-xl text-sm flex items-start gap-2.5 border border-red-200">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-medium">{error}</span>
                  </div>
                )}

                {/* Campos de verificación */}
                {mode === 'verification' && (
                  <div className="space-y-4">
                    <div className="text-center space-y-2">
                      <p className="text-sm text-gray-600">
                        Enviamos un código de 6 dígitos a:
                      </p>
                      <p className="font-medium text-gray-900">{formData.email}</p>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="verificationCode" className="text-sm font-semibold text-gray-800 block">
                        Código de verificación
                      </Label>
                      <Input
                        id="verificationCode"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="text-center text-lg tracking-widest h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                        placeholder="123456"
                        maxLength={6}
                      />
                    </div>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleResendCode}
                        className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                        disabled={isLoading}
                      >
                        Reenviar código
                      </button>
                    </div>
                  </div>
                )}

                {/* Campos para otros modos */}
                {mode !== 'verification' && (
                  <>
                    {mode === 'register' && (
                      <div className="space-y-1.5">
                        <Label htmlFor="nombre" className="text-sm font-semibold text-gray-800 block">
                          Nombre completo
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            className="pl-10 pr-4 h-9 sm:h-10 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg
                                     bg-gray-50 focus:bg-white transition-all duration-200"
                            placeholder="Tu nombre completo"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-800 block">
                        Correo electrónico
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-10 pr-4 h-9 sm:h-10 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg
                                   bg-gray-50 focus:bg-white transition-all duration-200"
                          placeholder="tu@email.com"
                        />
                      </div>
                    </div>

                    {mode === 'register' && (
                      <div className="space-y-1.5">
                        <Label htmlFor="telefono" className="text-sm font-semibold text-gray-800 block">
                          Teléfono (opcional)
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="telefono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleInputChange}
                            className="pl-10 pr-4 h-9 sm:h-10 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg
                                     bg-gray-50 focus:bg-white transition-all duration-200"
                            placeholder="+1234567890"
                          />
                        </div>
                      </div>
                    )}

                    {(mode === 'login' || mode === 'register') && (
                      <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-sm font-semibold text-gray-800 block">
                          Contraseña
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleInputChange}
                            className="pl-10 pr-12 h-9 sm:h-10 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg
                                     bg-gray-50 focus:bg-white transition-all duration-200"
                            placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : 'Tu contraseña'}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    )}

                    {mode === 'register' && (
                      <div className="space-y-1.5">
                        <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-800 block">
                          Confirmar contraseña
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="pl-10 pr-12 h-9 sm:h-10 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg
                                     bg-gray-50 focus:bg-white transition-all duration-200"
                            placeholder="Repite tu contraseña"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
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
                          Acepto los términos y condiciones y la política de privacidad
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
                            className="h-4 w-4 text-blue-600 border border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                          />
                          <label htmlFor="rememberMe" className="text-sm text-gray-700 cursor-pointer">
                            Recuérdame
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={() => setMode('forgotPassword')}
                          className="text-sm text-blue-600 hover:text-blue-500 font-medium self-start sm:self-auto"
                        >
                          ¿Olvidaste tu contraseña?
                        </button>
                      </div>
                    )}
                  </>
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
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Procesando...
                    </span>
                  ) : (
                    <span className="text-sm sm:text-base font-semibold">
                      {mode === 'login' ? 'Iniciar Sesión' : 
                       mode === 'register' ? 'Crear Cuenta' : 
                       mode === 'verification' ? 'Verificar Código' :
                       'Enviar Instrucciones'}
                    </span>
                  )}
                </Button>

                {/* Separador - Solo para login y register */}
                {(mode === 'login' || mode === 'register') && (
                  <div className="relative my-4 sm:my-5">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs sm:text-sm">
                      <span className="px-2 bg-white text-gray-500">o continúa con</span>
                    </div>
                  </div>
                )}

                {/* Login con Google - Solo para login y register */}
                {(mode === 'login' || mode === 'register') && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-10 sm:h-11 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 
                               flex items-center justify-center gap-2 font-medium text-sm text-gray-700
                               rounded-lg transition-all duration-200 focus:ring-4 focus:ring-gray-200 shadow-sm hover:shadow-md
                               transform hover:scale-[1.02] active:scale-[0.98]"
                    onClick={() => {
                      toast.info('Autenticación con Google no disponible temporalmente');
                    }}
                    disabled={isLoading}
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
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
              <div className="mt-4 sm:mt-5 text-center text-xs sm:text-sm">
                {mode === 'login' ? (
                  <p className="text-gray-600">
                    ¿No tienes cuenta?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus-visible:underline transition-colors"
                    >
                      Crear cuenta
                    </button>
                  </p>
                ) : mode === 'register' ? (
                  <p className="text-gray-600">
                    ¿Ya tienes cuenta?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus-visible:underline transition-colors"
                    >
                      Iniciar sesión
                    </button>
                  </p>
                ) : mode === 'verification' ? (
                  <p className="text-gray-600">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus-visible:underline transition-colors"
                    >
                      Volver al login
                    </button>
                  </p>
                ) : (
                  <p>
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus-visible:underline transition-colors"
                    >
                      Volver al login
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
