"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useProAuth } from '@/contexts/ProAuthContext';
import { ProApiError } from '@/lib/pro/api';
import { Button } from '@/components/pro/ui/button';
import { Input } from '@/components/pro/ui/input';
import { Label } from '@/components/pro/ui/label';

export default function ProRegisterPage() {
  const router = useRouter();
  const { register } = useProAuth();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ nombre, apellido: apellido || undefined, email, password });
      toast.success('Cuenta creada. Te enviamos un código por correo.');
      router.push(`/pro/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      toast.error((err as ProApiError).message || 'No se pudo crear la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Crear cuenta</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Empieza tu presencia profesional.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="apellido">Apellido</Label>
            <Input id="apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} />
          </div>
        </div>
        <div>
          <Label htmlFor="email">Correo</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nom@exemple.com"
          />
        </div>
        <div>
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
          />
        </div>
        <Button type="submit" loading={loading} className="w-full">
          Crear cuenta
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{' '}
        <Link href="/pro/login" className="font-medium text-primary hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}
