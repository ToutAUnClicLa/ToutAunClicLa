import { Suspense } from 'react';
import ForgotPasswordForm from './ForgotPasswordForm';

export default function ProForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
