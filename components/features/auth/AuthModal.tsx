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
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      password: '',
      confirmPassword: ''
    });
    setError(null);
    setVerificationCode('');
    setAcceptTerms(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [mode]);

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
      if (error.message.includes('not verified') || error.message.includes('verify')) {
        setMode('verification');
        setError('Debes verificar tu email antes de iniciar sesión');
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
        description: 'Revisa tu email para verificar tu cuenta'
      });

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
      <DialogContent className="sm:max-w-md">
        <div className="flex items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {dialogTitle}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {mode === 'verification' ? (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Ingresa el código de 6 dígitos enviado a tu email
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="verification-code">Código de verificación</Label>
                <Input
                  id="verification-code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={isLoading || verificationCode.length !== 6}
                >
                  {isLoading ? 'Verificando...' : 'Verificar'}
                </Button>
              </div>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="text-sm"
                >
                  Reenviar código
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Email field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="tu@email.com"
                    className="pl-10"
                    required
                    autoFocus={mode === 'login' || mode === 'register'}
                  />
                </div>
              </div>

              {/* Campos adicionales para registro */}
              {mode === 'register' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="nombre"
                        name="nombre"
                        type="text"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        placeholder="Tu nombre completo"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono (opcional)</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        placeholder="+1 234 567 8900"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Password field */}
              {(mode === 'login' || mode === 'register') && (
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Tu contraseña"
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Confirm password field for register */}
              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirma tu contraseña"
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Terms acceptance for register */}
              {mode === 'register' && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="acceptTerms" className="text-sm">
                    Acepto los{' '}
                    <a href="/terminos" className="text-blue-600 hover:underline">
                      términos y condiciones
                    </a>
                  </Label>
                </div>
              )}

              {/* Submit button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Cargando...' : 
                 mode === 'login' ? 'Iniciar Sesión' : 
                 mode === 'register' ? 'Crear Cuenta' : 
                 'Enviar'}
              </Button>

              {/* Mode switching */}
              <div className="text-center space-y-2">
                {mode === 'login' ? (
                  <>
                    <p className="text-sm text-gray-600">
                      ¿No tienes cuenta?{' '}
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setMode('register')}
                        className="p-0 h-auto text-blue-600 hover:underline"
                      >
                        Regístrate aquí
                      </Button>
                    </p>
                  </>
                ) : mode === 'register' ? (
                  <p className="text-sm text-gray-600">
                    ¿Ya tienes cuenta?{' '}
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setMode('login')}
                      className="p-0 h-auto text-blue-600 hover:underline"
                    >
                      Inicia sesión aquí
                    </Button>
                  </p>
                ) : null}
              </div>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
