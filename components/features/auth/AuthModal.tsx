"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  AlertCircle, 
  User, 
  Eye, 
  EyeOff, 
  Phone, 
  X, 
  Shield, 
  CheckCircle, 
  Sparkles,
  Loader2
} from 'lucide-react';
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
  initialMode?: 'login' | 'register' | 'forgotPassword' | 'resetPassword' | 'verification';
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
  const { login, register, verifyEmail, resendVerification, initiateGoogleAuth } = useAuth();
  
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
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // Restablecer los estados cuando cambia el modo
  useEffect(() => {
    if (mode === 'verification') {
      // Mantener el email del formulario actual para verificación
      const currentEmail = formData.email || localStorage.getItem('pending_verification_email') || '';
      setFormData(prev => ({
        nombre: '',
        email: currentEmail,
        telefono: '',
        password: '',
        confirmPassword: ''
      }));
    } else if (mode === 'forgotPassword') {
      // Mantener solo el email para forgot password
      setResetEmail(formData.email || '');
    } else if (mode === 'resetPassword') {
      // Mantener el email para reset password
      const currentEmail = resetEmail || formData.email || '';
      setResetEmail(currentEmail);
    }
    setError(null);
    setVerificationCode('');
    setResetCode('');
    setNewPassword('');
    setConfirmNewPassword('');
    setAcceptTerms(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowNewPassword(false);
    setShowConfirmNewPassword(false);
    // Solo resetear showEmailForm si no estamos en modo registro
    if (mode !== 'register') {
      setShowEmailForm(false);
    }
  }, [mode]);

  // Restablecer al abrir/cerrar modal
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    } else {
      // Resetear todo cuando se cierra el modal
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        password: '',
        confirmPassword: ''
      });
      setError(null);
      setIsLoading(false);
      setVerificationCode('');
      setResetCode('');
      setResetEmail('');
      setNewPassword('');
      setConfirmNewPassword('');
      setAcceptTerms(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
      setShowNewPassword(false);
      setShowConfirmNewPassword(false);
      setShowEmailForm(false);
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
        setError(t('auth.enterSixDigitCode'));
        return false;
      }
      return true;
    }

    // Validación para modo forgot password
    if (mode === 'forgotPassword') {
      if (!resetEmail?.trim()) {
        setError(t('auth.emailRequired'));
        return false;
      }

      if (!validateEmail(resetEmail.trim())) {
        setError(t('auth.emailInvalid'));
        return false;
      }
      return true;
    }

    // Validación para modo reset password
    if (mode === 'resetPassword') {
      if (!resetCode || resetCode.length !== 6) {
        setError(t('auth.enterSixDigitCode'));
        return false;
      }

      if (!newPassword) {
        setError(t('auth.passwordRequired'));
        return false;
      }

      if (!validatePassword(newPassword)) {
        setError(t('auth.passwordInvalid'));
        return false;
      }

      if (newPassword !== confirmNewPassword) {
        setError(t('auth.passwordsMismatch'));
        return false;
      }

      return true;
    }

    // Validación común para todos los modos excepto verificación, forgot y reset
    if (!formData.email?.trim()) {
      setError(t('auth.emailRequired'));
      return false;
    }

    if (!validateEmail(formData.email.trim())) {
      setError(t('auth.emailInvalid'));
      return false;
    }

    // Para modo registro, hacer validación más estricta
    if (mode === 'register') {
      if (!formData.nombre?.trim()) {
        setError(t('auth.nameRequired'));
        return false;
      }

      if (!formData.password) {
        setError(t('auth.passwordRequired'));
        return false;
      }

      if (!validatePassword(formData.password)) {
        setError(t('auth.passwordInvalid'));
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError(t('auth.passwordsMismatch'));
        return false;
      }

      if (!acceptTerms) {
        setError(t('auth.acceptTermsRequired'));
        return false;
      }
    }

    // Para modo login
    if (mode === 'login') {
      if (!formData.password) {
        setError(t('auth.passwordRequired'));
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
      } else if (mode === 'forgotPassword') {
        await handleForgotPassword();
      } else if (mode === 'resetPassword') {
        await handleResetPassword();
      }
    } catch (err: any) {
      console.error('Error en handleSubmit:', err);
      setError(err.message || t('auth.generalError'));
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

      toast.success(t('auth.welcomeMessage'), {
        description: t('auth.loginSuccessDescription')
      });

      onClose();
      onLoginSuccess?.();

      if (redirectUrl) {
        router.push(redirectUrl);
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      
      if (error.message.includes('not verified') || error.message.includes('verificación') || error.message.includes('verify')) {
        localStorage.setItem('pending_verification_email', formData.email.trim());
        setMode('verification');
        setError(t('auth.accountRequiresVerification'));
        return;
      }
      
      setError(error.message || t('auth.loginError'));
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

      toast.success(t('auth.registrationSuccess'), {
        description: t('auth.verificationCodeSent')
      });

      localStorage.setItem('pending_verification_email', formData.email.trim());
      setMode('verification');
      setError(null);
    } catch (error: any) {
      console.error('Error en registro:', error);
      
      if (error.message.includes('already exists') || error.message.includes('ya existe')) {
        setError(t('auth.emailAlreadyExists'));
        return;
      }
      
      setError(error.message || t('auth.registrationError'));
    }
  };

  const handleVerification = async () => {
    try {
      const emailToVerify = formData.email.trim() || localStorage.getItem('pending_verification_email') || '';
      
      if (!emailToVerify) {
        setError(t('auth.emailNotFoundForVerification'));
        return;
      }

      const response = await verifyEmail(verificationCode, emailToVerify);

      toast.success(t('auth.verificationSuccess'), {
        description: t('auth.accountVerifiedCorrectly')
      });

      localStorage.removeItem('pending_verification_email');
      onClose();
      onLoginSuccess?.();

      if (redirectUrl) {
        router.push(redirectUrl);
      }
    } catch (error: any) {
      console.error('Error en verificación:', error);
      setError(error.message || t('auth.invalidVerificationCode'));
    }
  };

  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      const emailToResend = formData.email.trim() || localStorage.getItem('pending_verification_email') || '';

      if (!emailToResend) {
        setError(t('auth.emailNotFoundForResend'));
        return;
      }

      await resendVerification(emailToResend);
      toast.success(t('auth.codeResent'), {
        description: t('auth.checkEmailForNewCode')
      });
    } catch (error: any) {
      console.error('Error al reenviar código:', error);
      setError(error.message || t('auth.resendCodeError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      if (!resetEmail.trim()) {
        setError(t('auth.emailRequired'));
        return;
      }

      if (!validateEmail(resetEmail.trim())) {
        setError(t('auth.emailInvalid'));
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resetEmail.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.error === 'Social authentication account') {
          throw new Error(t('auth.socialAuthNoReset'));
        }
        throw new Error(data.message || t('auth.sendResetCodeError'));
      }

      toast.success(t('auth.resetCodeSent'), {
        description: t('auth.resetCodeSentDescription')
      });

      setMode('resetPassword');
      setError(null);
    } catch (error: any) {
      console.error('Error en forgot password:', error);
      setError(error.message || t('auth.sendResetCodeError'));
    }
  };

  const handleResetPassword = async () => {
    try {
      if (!resetCode || resetCode.length !== 6) {
        setError(t('auth.enterSixDigitCode'));
        return;
      }

      if (!newPassword) {
        setError(t('auth.passwordRequired'));
        return;
      }

      if (!validatePassword(newPassword)) {
        setError(t('auth.passwordInvalid'));
        return;
      }

      if (newPassword !== confirmNewPassword) {
        setError(t('auth.passwordsMismatch'));
        return;
      }

      if (newPassword.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: resetEmail.trim(),
          code: resetCode,
          newPassword: newPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'Invalid reset code') {
          throw new Error(t('auth.invalidResetCode'));
        } else if (data.error === 'Code expired') {
          throw new Error(t('auth.resetCodeExpired'));
        }
        throw new Error(data.message || t('auth.resetPasswordError'));
      }

      toast.success(t('auth.passwordResetSuccess'), {
        description: t('auth.passwordResetSuccessDescription')
      });

      // Cambiar a modo login después de 1.5 segundos
      setTimeout(() => {
        setMode('login');
        setFormData(prev => ({
          ...prev,
          email: resetEmail,
          password: ''
        }));
      }, 1500);

    } catch (error: any) {
      console.error('Error en reset password:', error);
      setError(error.message || t('auth.resetPasswordError'));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Usar el contexto de autenticación para iniciar Google OAuth
      await initiateGoogleAuth();
      
      // La redirección se maneja automáticamente en initiateGoogleAuth
      // No llegamos a este punto porque el usuario es redirigido
    } catch (error: any) {
      console.error('Error en Google Auth:', error);
      setError(error.message || t('auth.googleAuthError'));
      toast.error(error.message || t('auth.googleAuthError'));
    } finally {
      setIsLoading(false);
    }
  };

  const getModalTitle = () => {
    switch (mode) {
      case 'login':
        return t('auth.loginTitle');
      case 'register':
        return t('auth.registerTitle');
      case 'verification':
        return t('auth.verificationTitle');
      case 'forgotPassword':
        return t('auth.forgotPasswordTitle');
      case 'resetPassword':
        return t('auth.resetPasswordTitle');
      default:
        return t('auth.loginTitle');
    }
  };

  const getModalDescription = () => {
    switch (mode) {
      case 'login':
        return t('auth.loginDescription');
      case 'register':
        return t('auth.createFreeAccount');
      case 'verification':
        return t('auth.verifyYourEmail');
      case 'forgotPassword':
        return t('auth.resetPasswordDescription');
      case 'resetPassword':
        return t('auth.enterResetCode');
      default:
        return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(mode === 'verification' || mode === 'resetPassword') ? undefined : onClose}>
      <DialogContent className="sm:max-w-[420px] max-w-[92vw] max-h-[92vh] sm:max-h-[90vh] p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-xl sm:rounded-2xl">
        {/* Header con gradiente moderno */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-3 sm:px-4 py-3 sm:py-4 text-white rounded-t-xl sm:rounded-t-2xl">
          {/* Decoraciones de fondo */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-pink-600/20 rounded-t-xl sm:rounded-t-2xl"></div>
          <div className="absolute top-1 right-1 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-1 left-1 w-12 h-12 bg-white/5 rounded-full blur-lg"></div>
          
          <div className="relative">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-white/10 rounded-lg sm:rounded-xl backdrop-blur-sm">
                  {mode === 'verification' ? (
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  ) : mode === 'register' ? (
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  ) : mode === 'forgotPassword' || mode === 'resetPassword' ? (
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  ) : (
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  )}
                </div>
                <div>
                  <DialogTitle className="text-lg sm:text-xl font-bold text-white">
                    {getModalTitle()}
                  </DialogTitle>
                </div>
              </div>
              {/* Solo mostrar botón de cerrar si NO está en modo verification o resetPassword */}
              {mode !== 'verification' && mode !== 'resetPassword' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl transition-all duration-200"
                >
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              )}
            </div>
            
            <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed">
              {getModalDescription()}
            </p>
          </div>
        </div>

        {/* Contenido del formulario */}
        <div className="px-3 sm:px-4 py-3 sm:py-4 max-h-[calc(92vh-100px)] sm:max-h-[calc(90vh-120px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4" autoComplete="off">
            {/* Error message */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-3 p-3 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {mode === 'verification' ? (
                <motion.div
                  key="verification"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 sm:space-y-5"
                >
                  {/* Verification content */}
                  <div className="text-center space-y-3 sm:space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl sm:rounded-2xl shadow-lg">
                      <Mail className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">{t('auth.checkYourEmail')}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-xs sm:max-w-sm mx-auto">
                        {t('auth.verificationInstructions')}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="verification-code" className="text-xs sm:text-sm font-semibold text-gray-700">
                      {t('auth.verificationCodeLabel')}
                    </Label>
                    <Input
                      id="verification-code"
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="000000"
                      maxLength={6}
                      className="text-center text-xl sm:text-2xl tracking-wider font-mono h-12 sm:h-14 bg-gray-50 border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl transition-all duration-200"
                      autoFocus
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-10 sm:h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
                    disabled={isLoading || verificationCode.length !== 6}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                        <span>{t('auth.verifying')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span>{t('auth.verifyButton')}</span>
                      </div>
                    )}
                  </Button>

                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      onClick={handleResendCode}
                      disabled={isLoading}
                      className="text-xs sm:text-sm text-gray-600 hover:text-indigo-600 font-medium"
                    >
                      {t('auth.resendCode')}
                    </Button>
                  </div>
                </motion.div>
              ) : mode === 'forgotPassword' ? (
                <motion.div
                  key="forgotPassword"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 sm:space-y-5"
                >
                  {/* Forgot Password content */}
                  <div className="text-center space-y-3 sm:space-y-4">
                    <div className="space-y-1.5 sm:space-y-2">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">{t('auth.resetPasswordTitle')}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-xs sm:max-w-sm mx-auto">
                        {t('auth.resetPasswordFormDescription')}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="reset-email" className="text-xs sm:text-sm font-semibold text-gray-700">
                      {t('auth.email')}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                      <Input
                        id="reset-email"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder={t('auth.emailPlaceholder')}
                        className="pl-9 sm:pl-11 h-10 sm:h-12 bg-gray-50 border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl transition-all duration-200 text-sm sm:text-base"
                        autoFocus
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {t('auth.resetPasswordFormDescription')}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-10 sm:h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                        <span>{t('auth.sendingResetCode')}</span>
                      </div>
                    ) : (
                      <span>{t('auth.sendResetCodeButton')}</span>
                    )}
                  </Button>

                  <div className="text-center pt-3 sm:pt-4 border-t border-gray-100">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setMode('login')}
                      className="text-xs sm:text-sm text-gray-600 hover:text-indigo-600 font-medium"
                    >
                      {t('auth.backToLogin')}
                    </Button>
                  </div>
                </motion.div>
              ) : mode === 'resetPassword' ? (
                <motion.div
                  key="resetPassword"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 sm:space-y-5"
                >
                  {/* Reset Password content */}
                  <div className="text-center space-y-3 sm:space-y-4">
                    <div className="space-y-1.5 sm:space-y-2">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">{t('auth.resetCodeInstructions')}</h3>
                      <p className="text-xs text-gray-500">
                        {t('auth.resetSendTo')} <span className="font-semibold text-gray-700">{resetEmail}</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="reset-code" className="text-xs sm:text-sm font-semibold text-gray-700">
                      {t('auth.resetCodeLabel')}
                    </Label>
                    <Input
                      id="reset-code"
                      type="text"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      placeholder="000000"
                      maxLength={6}
                      className="text-center text-xl sm:text-2xl tracking-wider font-mono h-12 sm:h-14 bg-gray-50 border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl transition-all duration-200"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="new-password" className="text-xs sm:text-sm font-semibold text-gray-700">
                      {t('auth.newPasswordLabel')}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                      <Input
                        id="new-password"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder={t('auth.newPasswordPlaceholder')}
                        className="pl-9 sm:pl-11 pr-9 sm:pr-11 h-10 sm:h-12 bg-gray-50 border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl transition-all duration-200 text-sm sm:text-base"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-gray-100 rounded-lg"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="confirm-new-password" className="text-xs sm:text-sm font-semibold text-gray-700">
                      {t('auth.confirmNewPasswordLabel')}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                      <Input
                        id="confirm-new-password"
                        type={showConfirmNewPassword ? 'text' : 'password'}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder={t('auth.confirmNewPasswordPlaceholder')}
                        className="pl-9 sm:pl-11 pr-9 sm:pr-11 h-10 sm:h-12 bg-gray-50 border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl transition-all duration-200 text-sm sm:text-base"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-gray-100 rounded-lg"
                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                      >
                        {showConfirmNewPassword ? (
                          <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-10 sm:h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
                    disabled={isLoading || resetCode.length !== 6 || !newPassword || !confirmNewPassword}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                        <span>{t('auth.resettingPassword')}</span>
                      </div>
                    ) : (
                      <span>{t('auth.resetPasswordButton')}</span>
                    )}
                  </Button>

                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setMode('forgotPassword')}
                      disabled={isLoading}
                      className="text-xs sm:text-sm text-gray-600 hover:text-indigo-600 font-medium"
                    >
                      {t('auth.backToResetForm')}
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 sm:space-y-4"
                >
                  {/* Registro con opciones iniciales */}
                  {mode === 'register' && !showEmailForm ? (
                    <div className="space-y-4 sm:space-y-5">

                      {/* Opción Google */}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleGoogleLogin}
                        className="w-full h-12 sm:h-14 bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md text-gray-700 font-semibold rounded-xl transition-all duration-200 text-sm sm:text-base shadow-sm group"
                      >
                        <div className="flex items-center gap-3">
                          <svg className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          <span className="text-sm sm:text-base transition-colors duration-200">
                            {t('auth.continueWithGoogleRegister')}
                          </span>
                        </div>
                      </Button>

                      {/* Separador */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs sm:text-sm">
                          <span className="bg-white px-3 sm:px-4 text-gray-500 font-medium">{t('auth.orText')}</span>
                        </div>
                      </div>

                      {/* Opción Email */}
                      <Button
                        type="button"
                        onClick={() => setShowEmailForm(true)}
                        className="w-full h-12 sm:h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base group"
                      >
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-200 group-hover:scale-110" />
                          <span className="text-sm sm:text-base transition-colors duration-200">
                            {t('auth.registerWithEmail')}
                          </span>
                        </div>
                      </Button>

                      {/* Link para login */}
                      <div className="text-center pt-4 border-t border-gray-100">
                        <p className="text-xs sm:text-sm text-gray-600">
                          {t('auth.alreadyHaveAccount')}{' '}
                          <Button
                            type="button"
                            variant="link"
                            onClick={() => setMode('login')}
                            className="p-0 h-auto text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors duration-200 text-xs sm:text-sm"
                          >
                            {t('auth.loginButton')}
                          </Button>
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Formulario completo para login o registro con email */
                    <div className="space-y-2 sm:space-y-4">
                      {/* Botón de regreso para registro con email */}
                      {mode === 'register' && showEmailForm && (
                        <div className="flex items-center gap-2 pb-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowEmailForm(false)}
                            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span >{t('common.back')}</span>
                          </Button>
                        </div>
                      )}

                      {/* Google Login Button - Solo para login */}
                      {mode === 'login' && (
                        <div className="space-y-2.5 sm:space-y-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleGoogleLogin}
                            className="w-full h-10 sm:h-12 bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md text-gray-700 font-semibold rounded-xl transition-all duration-200 text-sm sm:text-base shadow-sm group"
                          >
                            <div className="flex items-center gap-2 sm:gap-3">
                              <svg className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                              </svg>
                              <span className="text-sm sm:text-base transition-colors duration-200">
                                {t('auth.continueWithGoogle')}
                              </span>
                            </div>
                          </Button>

                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-xs sm:text-sm">
                              <span className="bg-white px-3 sm:px-4 text-gray-500 font-medium">{t('auth.orText')}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Email field */}
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label htmlFor="email" className="text-xs sm:text-sm font-semibold text-gray-700">
                          {t('auth.email')}
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                          <Input
                            id="email"
                            name="email"
                            type="text"
                            inputMode="email"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder={t('auth.emailPlaceholder')}
                            className="pl-9 sm:pl-11 h-10 sm:h-12 bg-gray-50 border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl transition-all duration-200 text-sm sm:text-base"
                            required
                            autoFocus={mode === 'login' || (mode === 'register' && showEmailForm)}
                          />
                        </div>
                      </div>

                      {/* Register specific fields */}
                      {mode === 'register' && showEmailForm && (
                        <>
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="nombre" className="text-xs sm:text-sm font-semibold text-gray-700">
                              {t('auth.fullName')}
                            </Label>
                            <div className="relative">
                              <User className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                              <Input
                                id="nombre"
                                name="nombre"
                                type="text"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                placeholder={t('auth.fullNamePlaceholder')}
                                className="pl-9 sm:pl-11 h-10 sm:h-12 bg-gray-50 border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl transition-all duration-200 text-sm sm:text-base"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5 sm:space-y-2">
                            <Label htmlFor="telefono" className="text-xs sm:text-sm font-semibold text-gray-700">
                              {t('auth.phone')}
                            </Label>
                            <div className="relative">
                              <Phone className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                              <Input
                                id="telefono"
                                name="telefono"
                                type="tel"
                                value={formData.telefono}
                                onChange={handleInputChange}
                                placeholder={t('auth.phonePlaceholder')}
                                className="pl-9 sm:pl-11 h-10 sm:h-12 bg-gray-50 border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl transition-all duration-200 text-sm sm:text-base"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {/* Password field */}
                      {(mode === 'login' || (mode === 'register' && showEmailForm)) && (
                        <div className="space-y-1.5 sm:space-y-2">
                          <Label htmlFor="password" className="text-xs sm:text-sm font-semibold text-gray-700">
                            {t('auth.password')}
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                            <Input
                              id="password"
                              name="password"
                              type={showPassword ? 'text' : 'password'}
                              value={formData.password}
                              onChange={handleInputChange}
                              placeholder={t('auth.passwordPlaceholder')}
                              className="pl-9 sm:pl-11 pr-9 sm:pr-11 h-10 sm:h-12 bg-gray-50 border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl transition-all duration-200 text-sm sm:text-base"
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-gray-100 rounded-lg"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Confirm password for register */}
                      {mode === 'register' && showEmailForm && (
                        <div className="space-y-1.5 sm:space-y-2">
                          <Label htmlFor="confirmPassword" className="text-xs sm:text-sm font-semibold text-gray-700">
                            {t('auth.confirmPassword')}
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              placeholder={t('auth.confirmPasswordPlaceholder')}
                              className="pl-9 sm:pl-11 pr-9 sm:pr-11 h-10 sm:h-12 bg-gray-50 border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl transition-all duration-200 text-sm sm:text-base"
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-gray-100 rounded-lg"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Terms acceptance for register */}
                      {mode === 'register' && showEmailForm && (
                        <div className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-indigo-50/30 rounded-lg sm:rounded-xl border border-gray-200">
                          <input
                            type="checkbox"
                            id="acceptTerms"
                            checked={acceptTerms}
                            onChange={(e) => setAcceptTerms(e.target.checked)}
                            className="mt-0.5 sm:mt-1 h-3.5 w-3.5 sm:h-4 sm:w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-2"
                          />
                          <Label htmlFor="acceptTerms" className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                            {t('auth.acceptTerms')}{' '}
                            <a href="/terminos" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors duration-200">
                              {t('auth.termsAndConditions')}
                            </a>{' '}
                            {t('auth.and')}{' '}
                            <a href="/politicas" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors duration-200">
                              {t('auth.privacyPolicy')}
                            </a>
                          </Label>
                        </div>
                      )}

                      {/* Submit button */}
                      {(mode === 'login' || (mode === 'register' && showEmailForm)) && (
                        <Button 
                          type="submit" 
                          className="w-full h-10 sm:h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base mt-4 sm:mt-6" 
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                              <span className="text-sm sm:text-base">{t('auth.processing')}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              {mode === 'login' ? (
                                <>
                                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                                  <span className="text-sm sm:text-base">{t('auth.loginButton')}</span>
                                </>
                              ) : mode === 'register' ? (
                                <>
                                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                                  <span className="text-sm sm:text-base">{t('auth.registerButton')}</span>
                                </>
                              ) : (
                                <span className="text-sm sm:text-base">{t('auth.forgotPasswordButton')}</span>
                              )}
                            </div>
                          )}
                        </Button>
                      )}

                      {/* Mode switching for login */}
                      {mode === 'login' && (
                        <div className="text-center pt-3 sm:pt-4 border-t border-gray-100">
                          <p className="text-xs sm:text-sm text-gray-600">
                            {t('auth.noAccount')}{' '}
                            <Button
                              type="button"
                              variant="link"
                              onClick={() => setMode('register')}
                              className="p-0 h-auto text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors duration-200 text-xs sm:text-sm"
                            >
                              {t('auth.signUp')}
                            </Button>
                          </p>
                        </div>
                      )}

                      {/* Forgot password for login */}
                      {mode === 'login' && (
                        <div className="text-center">
                          <Button
                            type="button"
                            variant="link"
                            onClick={() => setMode('forgotPassword')}
                            className="text-xs sm:text-sm text-gray-500 hover:text-indigo-600 font-medium transition-colors duration-200"
                          >
                            {t('auth.forgotPassword')}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
