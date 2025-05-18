"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthModal from '@/components/auth/AuthModal';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(true);
  
  useEffect(() => {
    // Verificar si hay parámetros de autenticación en la URL
    const error = searchParams.get('error');
    const auth = searchParams.get('auth');
    const email = searchParams.get('email');
    
    if (error) {
      let errorMessage = 'Error durante la autenticación';
      if (error === 'No_authorization_code') {
        errorMessage = 'No se recibió código de autorización';
      } else if (error.includes('Email not confirmed')) {
        errorMessage = 'El email no ha sido confirmado. Por favor, verifica tu correo electrónico.';
      } else {
        errorMessage = decodeURIComponent(error);
      }
      toast.error(errorMessage);
    }
    
    if (auth === 'success') {
      toast.success('¡Has iniciado sesión correctamente!');
      router.push('/');
    }
  }, [searchParams, router]);
  
  const handleClose = () => {
    setIsOpen(false);
    router.push('/');
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <AuthModal 
        isOpen={isOpen} 
        onClose={handleClose} 
        initialMode="login" 
        redirectUrl="/"
      />
    </div>
  );
} 