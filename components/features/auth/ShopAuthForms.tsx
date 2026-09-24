"use client";

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/common/ui/button';
import { Input } from '@/components/common/ui/input';
import { Label } from '@/components/common/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { forgotPassword, resetPassword } from '@/lib/services/auth';
import { forgotPath, loginPath, registerPath, resetPath, safeNext, verifyPath } from '@/lib/shop-auth';
import { shopChrome } from '@/lib/shop-theme';
import { cn } from '@/lib/utils';

const ACCENT = 'bg-[var(--shop-purple)] hover:bg-[var(--shop-purple-hover)] text-white';
const FIELD =
  'h-11 bg-white border-[var(--shop-hairline)] text-[var(--shop-ink)] focus-visible:ring-[var(--shop-purple)]';

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password: string, min = 6) {
  return password.length >= min && /[a-zA-Z]/.test(password) && /\d/.test(password);
}

function ErrorBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export function ShopAuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white text-[var(--shop-ink)] h-screen flex items-center">
      <div className="mx-auto w-full max-w-md px-4 py-10 sm:py-14">
        <div className="flex items-start gap-3 sm:gap-4">
          <img
            src="/icons/logo.png"
            alt=""
            width={56}
            height={56}
            className="mt-0.5 h-12 w-12 shrink-0 object-contain sm:h-14 sm:w-14"
          />
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
            {description ? (
              <p className="mt-2 text-sm leading-relaxed text-[var(--shop-muted)]">{description}</p>
            ) : null}
          </div>
        </div>
        <div className="mt-8 space-y-6">{children}</div>
      </div>
    </div>
  );
}

function GoogleButton({
  label,
  next,
  disabled,
}: {
  label: string;
  next?: string | null;
  disabled?: boolean;
}) {
  const { initiateGoogleAuth } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled || loading}
      onClick={async () => {
        try {
          setLoading(true);
          await initiateGoogleAuth(safeNext(next));
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : t('auth.googleAuthError');
          toast.error(message);
          setLoading(false);
        }
      }}
      className={cn(
        'h-11 w-full border-[var(--shop-hairline)] text-[var(--shop-ink)] hover:bg-gray-50',
        shopChrome.focus
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
      )}
      <span className="ml-2">{label}</span>
    </Button>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [show, setShow] = useState(false);
  const { t } = useTranslation();
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium text-[var(--shop-ink)]">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(FIELD, 'pr-11')}
          autoComplete={id.includes('new') ? 'new-password' : 'current-password'}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-[var(--shop-muted)] hover:text-[var(--shop-ink)]"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? t('auth.hidePassword') : t('auth.showPassword')}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

export function ShopLoginForm({ next }: { next?: string | null }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { login, isAuthenticated, isLoading: authBoot } = useAuth();
  const dest = safeNext(next);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authBoot && isAuthenticated) router.replace(dest);
  }, [authBoot, isAuthenticated, dest, router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !validateEmail(email.trim())) {
      setError(t('auth.emailInvalid'));
      return;
    }
    if (!password) {
      setError(t('auth.passwordRequired'));
      return;
    }
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      toast.success(t('auth.welcomeMessage'), { description: t('auth.loginSuccessDescription') });
      router.replace(dest);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('auth.loginError');
      if (/verif|verify/i.test(message)) {
        router.push(verifyPath(email.trim(), dest));
        return;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" autoComplete="on">
      <ErrorBanner message={error} />
      <GoogleButton label={t('auth.continueWithGoogle')} next={dest} disabled={loading} />
      <div className="relative py-1 text-center text-xs text-[var(--shop-muted)]">
        <span className="bg-white px-2">{t('auth.orText')}</span>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="login-email">{t('auth.email')}</Label>
        <Input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('auth.emailPlaceholder')}
          className={FIELD}
          autoComplete="email"
        />
      </div>
      <PasswordField
        id="login-password"
        label={t('auth.password')}
        value={password}
        onChange={setPassword}
        placeholder={t('auth.passwordPlaceholder')}
      />
      <div className="text-right">
        <Link
          href={forgotPath(email.trim() || null)}
          className={cn('text-sm font-medium text-[var(--shop-purple)] hover:underline', shopChrome.focus)}
        >
          {t('auth.forgotPassword')}
        </Link>
      </div>
      <Button type="submit" disabled={loading} className={cn('h-11 w-full', ACCENT, shopChrome.focus)}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('auth.loginButton')}
      </Button>
      <p className="text-center text-sm text-[var(--shop-muted)]">
        {t('auth.noAccount')}{' '}
        <Link href={registerPath(dest)} className="font-medium text-[var(--shop-purple)] hover:underline">
          {t('auth.signUp')}
        </Link>
      </p>
    </form>
  );
}

export function ShopRegisterForm({ next }: { next?: string | null }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { register } = useAuth();
  const dest = safeNext(next);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [accept, setAccept] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!nombre.trim()) {
      setError(t('auth.nameRequired'));
      return;
    }
    if (!validateEmail(email.trim())) {
      setError(t('auth.emailInvalid'));
      return;
    }
    if (!validatePassword(password)) {
      setError(t('auth.passwordInvalid'));
      return;
    }
    if (password !== confirm) {
      setError(t('auth.passwordsMismatch'));
      return;
    }
    if (!accept) {
      setError(t('auth.acceptTermsRequired'));
      return;
    }
    setLoading(true);
    try {
      await register({
        email: email.trim(),
        password,
        nombre: nombre.trim(),
        telefono: telefono.trim() || undefined,
      });
      toast.success(t('auth.registrationSuccess'), { description: t('auth.verificationCodeSent') });
      router.push(verifyPath(email.trim(), dest));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('auth.registrationError');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <ErrorBanner message={error} />
      <GoogleButton label={t('auth.continueWithGoogleRegister')} next={dest} disabled={loading} />
      <div className="relative py-1 text-center text-xs text-[var(--shop-muted)]">
        <span className="bg-white px-2">{t('auth.orText')}</span>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="reg-name">{t('auth.fullName')}</Label>
        <Input id="reg-name" value={nombre} onChange={(e) => setNombre(e.target.value)} className={FIELD} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="reg-email">{t('auth.email')}</Label>
        <Input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={FIELD} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="reg-phone">{t('auth.phone')}</Label>
        <Input id="reg-phone" type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} className={FIELD} />
      </div>
      <PasswordField
        id="reg-password"
        label={t('auth.password')}
        value={password}
        onChange={setPassword}
        placeholder={t('auth.passwordRegisterPlaceholder')}
      />
      <PasswordField
        id="reg-confirm"
        label={t('auth.confirmPassword')}
        value={confirm}
        onChange={setConfirm}
        placeholder={t('auth.confirmPasswordPlaceholder')}
      />
      <label className="flex items-start gap-2 text-sm text-[var(--shop-ink)]">
        <input
          type="checkbox"
          checked={accept}
          onChange={(e) => setAccept(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-[var(--shop-hairline)] text-[var(--shop-purple)]"
        />
        <span>
          {t('auth.acceptTerms')}{' '}
          <Link href="/terminos" className="font-medium text-[var(--shop-purple)] hover:underline">
            {t('auth.termsAndConditions')}
          </Link>{' '}
          {t('auth.and')}{' '}
          <Link href="/politicas" className="font-medium text-[var(--shop-purple)] hover:underline">
            {t('auth.privacyPolicy')}
          </Link>
        </span>
      </label>
      <Button type="submit" disabled={loading} className={cn('h-11 w-full', ACCENT, shopChrome.focus)}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('auth.registerButton')}
      </Button>
      <p className="text-center text-sm text-[var(--shop-muted)]">
        {t('auth.alreadyHaveAccount')}{' '}
        <Link href={loginPath(dest)} className="font-medium text-[var(--shop-purple)] hover:underline">
          {t('auth.loginButton')}
        </Link>
      </p>
    </form>
  );
}

export function ShopForgotForm({ email: initialEmail }: { email?: string | null }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState(initialEmail?.trim() || '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateEmail(email.trim())) {
      setError(t('auth.emailInvalid'));
      return;
    }
    setLoading(true);
    try {
      await forgotPassword(email.trim());
      toast.success(t('auth.resetCodeSent'), { description: t('auth.resetCodeSentDescription') });
      router.push(resetPath(email.trim()));
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : '';
      if (raw === 'Social authentication account') {
        setError(t('auth.socialAuthNoReset'));
      } else {
        setError(raw || t('auth.sendResetCodeError'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <ErrorBanner message={error} />
      <div className="space-y-1.5">
        <Label htmlFor="forgot-email">{t('auth.email')}</Label>
        <Input
          id="forgot-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('auth.emailPlaceholder')}
          className={FIELD}
        />
        <p className="text-xs text-[var(--shop-muted)]">{t('auth.resetPasswordFormDescription')}</p>
      </div>
      <Button type="submit" disabled={loading} className={cn('h-11 w-full', ACCENT, shopChrome.focus)}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('auth.sendResetCodeButton')}
      </Button>
      <p className="text-center">
        <Link href="/login" className="text-sm font-medium text-[var(--shop-purple)] hover:underline">
          {t('auth.backToLogin')}
        </Link>
      </p>
    </form>
  );
}

export function ShopResetForm({ email: initialEmail }: { email?: string | null }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const email = initialEmail?.trim() || '';

  if (!email) {
    return (
      <div className="space-y-4 text-sm text-[var(--shop-muted)]">
        <p>{t('auth.emailRequired')}</p>
        <Link href={forgotPath()} className="font-medium text-[var(--shop-purple)] hover:underline">
          {t('auth.resetPasswordFormTitle')}
        </Link>
      </div>
    );
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (code.length !== 6) {
      setError(t('auth.enterSixDigitCode'));
      return;
    }
    if (!validatePassword(password, 8)) {
      setError(t('auth.passwordMin8'));
      return;
    }
    if (password !== confirm) {
      setError(t('auth.passwordsMismatch'));
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email, code, password);
      toast.success(t('auth.passwordResetSuccess'), {
        description: t('auth.passwordResetSuccessDescription'),
      });
      router.push('/login');
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : '';
      if (raw === 'Invalid reset code') setError(t('auth.invalidResetCode'));
      else if (raw === 'Code expired') setError(t('auth.resetCodeExpired'));
      else setError(raw || t('auth.resetPasswordError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <ErrorBanner message={error} />
      <p className="text-sm text-[var(--shop-muted)]">
        {t('auth.resetSendTo')} <span className="font-medium text-[var(--shop-ink)]">{email}</span>
      </p>
      <div className="space-y-1.5">
        <Label htmlFor="reset-code">{t('auth.resetCodeLabel')}</Label>
        <Input
          id="reset-code"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          maxLength={6}
          className={cn(FIELD, 'text-center font-mono text-xl tracking-widest')}
        />
      </div>
      <PasswordField
        id="reset-new"
        label={t('auth.newPasswordLabel')}
        value={password}
        onChange={setPassword}
        placeholder={t('auth.newPasswordPlaceholder')}
      />
      <PasswordField
        id="reset-confirm"
        label={t('auth.confirmNewPasswordLabel')}
        value={confirm}
        onChange={setConfirm}
        placeholder={t('auth.confirmNewPasswordPlaceholder')}
      />
      <Button
        type="submit"
        disabled={loading || code.length !== 6}
        className={cn('h-11 w-full', ACCENT, shopChrome.focus)}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('auth.resetPasswordButton')}
      </Button>
      <p className="text-center">
        <Link href={forgotPath()} className="text-sm font-medium text-[var(--shop-purple)] hover:underline">
          {t('auth.backToResetForm')}
        </Link>
      </p>
    </form>
  );
}

export function ShopVerifyForm({ email: initialEmail, next }: { email?: string | null; next?: string | null }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { verifyEmail, resendVerification } = useAuth();
  const dest = safeNext(next);
  const [email, setEmail] = useState((initialEmail || '').trim());
  const [ready, setReady] = useState(!!initialEmail?.trim());
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      const stored = localStorage.getItem('pending_verification_email') || '';
      if (stored) setEmail(stored);
    }
    setReady(true);
  }, [email]);

  if (!ready) {
    return <div className="h-24 animate-pulse rounded-lg bg-[var(--shop-canvas-muted)]" />;
  }

  if (!email) {
    return (
      <div className="space-y-4 text-sm text-[var(--shop-muted)]">
        <p>{t('auth.verifyEmailMissing')}</p>
        <Link href="/login" className="font-medium text-[var(--shop-purple)] hover:underline">
          {t('auth.backToLogin')}
        </Link>
      </div>
    );
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError(t('auth.enterSixDigitCode'));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await verifyEmail(code, email);
      localStorage.removeItem('pending_verification_email');
      toast.success(t('auth.verificationSuccess'), { description: t('auth.accountVerifiedCorrectly') });
      router.replace(dest);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('auth.invalidVerificationCode'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <ErrorBanner message={error} />
      <p className="text-sm text-[var(--shop-muted)]">
        {t('auth.verificationInstructions')}
        <br />
        <span className="font-medium text-[var(--shop-ink)]">{email}</span>
      </p>
      <Input
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
        placeholder="000000"
        maxLength={6}
        className={cn(FIELD, 'text-center font-mono text-xl tracking-widest')}
      />
      <Button
        type="submit"
        disabled={loading || code.length !== 6}
        className={cn('h-11 w-full', ACCENT, shopChrome.focus)}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('auth.verifyButton')}
      </Button>
      <button
        type="button"
        className="w-full text-center text-sm font-medium text-[var(--shop-purple)] hover:underline"
        disabled={loading}
        onClick={async () => {
          try {
            await resendVerification(email);
          } catch {
            /* Context already toasts */
          }
        }}
      >
        {t('auth.resendCode')}
      </button>
    </form>
  );
}
