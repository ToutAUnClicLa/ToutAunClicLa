import { ProApiError } from './api';

const BY_CODE: Record<string, string> = {
  'Invalid credentials': 'pro.auth.login.error',
  'Account not verified': 'pro.auth.login.needsVerification',
  'Pro already exists': 'pro.auth.register.exists',
  'Invalid code': 'pro.auth.verify.verifyError',
  'Code expired': 'pro.auth.resetPassword.expired',
  'Invalid reset code': 'pro.auth.resetPassword.invalidCode',
  'Social authentication account': 'pro.auth.forgotPassword.socialHint',
};

export function proAuthErrorKey(err: unknown, fallback: string): string {
  if (!(err instanceof ProApiError) || !err.data || typeof err.data !== 'object') {
    return fallback;
  }
  const code = (err.data as { error?: string }).error;
  return (code && BY_CODE[code]) || fallback;
}
