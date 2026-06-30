"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { updateMe, type Categoria } from '@/lib/pro/endpoints';
import { ProApiError } from '@/lib/pro/api';
import { useProAuth, type ProUser } from '@/contexts/ProAuthContext';
import { Button } from '@/components/pro/ui/button';
import { Input } from '@/components/pro/ui/input';
import { Label } from '@/components/pro/ui/label';
import { Textarea } from '@/components/pro/ui/textarea';
import { Select } from '@/components/pro/ui/select';
import { cn } from '@/lib/utils';

type Lang = 'fr' | 'en' | 'es';

const LANGS: { code: Lang; label: string }[] = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
];

const SPOKEN: { code: string; label: string }[] = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' },
  { code: 'ar', label: 'العربية' },
  { code: 'zh', label: '中文' },
];

interface FormValues {
  nombre: string;
  apellido: string;
  empresa: string;
  telefono: string;
  sitio_web: string;
  ciudad: string;
  idioma_principal: Lang;
  titulo_fr: string;
  titulo_en: string;
  titulo_es: string;
  bio_fr: string;
  bio_en: string;
  bio_es: string;
  categoria_id: string;
  subcategoria_id: string;
  idiomas_hablados: string[];
}

export function ProfileForm({ categorias }: { categorias: Categoria[] }) {
  const { proUser, refresh } = useProAuth();
  const p = proUser as ProUser;
  const [activeLang, setActiveLang] = useState<Lang>(p?.idioma_principal || 'fr');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      nombre: p?.nombre || '',
      apellido: p?.apellido || '',
      empresa: p?.empresa || '',
      telefono: p?.telefono || '',
      sitio_web: p?.sitio_web || '',
      ciudad: p?.ciudad || '',
      idioma_principal: p?.idioma_principal || 'fr',
      titulo_fr: p?.titulo_fr || '',
      titulo_en: p?.titulo_en || '',
      titulo_es: p?.titulo_es || '',
      bio_fr: p?.bio_fr || '',
      bio_en: p?.bio_en || '',
      bio_es: p?.bio_es || '',
      categoria_id: p?.categoria_id || '',
      subcategoria_id: p?.subcategoria_id || '',
      idiomas_hablados: p?.idiomas_hablados || [],
    },
  });

  const categoriaId = watch('categoria_id');
  const idiomas = watch('idiomas_hablados') || [];
  const subcats = categorias.find((c) => c.id === categoriaId)?.subcategorias || [];

  const toggleIdioma = (code: string) => {
    const next = idiomas.includes(code)
      ? idiomas.filter((i) => i !== code)
      : [...idiomas, code];
    setValue('idiomas_hablados', next, { shouldDirty: true });
  };

  const onSubmit = async (values: FormValues) => {
    // categoria/subcategoria: '' no es UUID válido -> enviar null
    const payload = {
      ...values,
      categoria_id: values.categoria_id || null,
      subcategoria_id: values.subcategoria_id || null,
    };
    try {
      await updateMe(payload);
      await refresh();
      toast.success('Perfil actualizado.');
    } catch (err) {
      toast.error((err as ProApiError).message || 'No se pudo guardar.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Identidad */}
      <section className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" {...register('nombre', { required: true })} />
          </div>
          <div>
            <Label htmlFor="apellido">Apellido</Label>
            <Input id="apellido" {...register('apellido')} />
          </div>
        </div>
        <div>
          <Label htmlFor="empresa">Empresa</Label>
          <Input id="empresa" {...register('empresa')} placeholder="Opcional" />
        </div>
      </section>

      {/* Título y bio trilingües */}
      <section>
        <h2 className="text-base font-semibold text-foreground">Título y biografía</h2>
        <p className="mb-3 mt-1 text-sm text-muted-foreground">
          Completa al menos tu idioma principal. Los demás se muestran según el visitante.
        </p>

        <div className="mb-4 inline-flex rounded-[10px] border border-border p-1">
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setActiveLang(l.code)}
              className={cn(
                'rounded-[7px] px-3 py-1.5 text-sm font-medium transition-colors',
                activeLang === l.code
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {l.label}
            </button>
          ))}
        </div>

        {LANGS.map((l) => (
          <div key={l.code} className={cn('space-y-4', activeLang === l.code ? '' : 'hidden')}>
            <div>
              <Label htmlFor={`titulo_${l.code}`}>Título ({l.label})</Label>
              <Input
                id={`titulo_${l.code}`}
                {...register(`titulo_${l.code}` as keyof FormValues)}
                placeholder={l.code === 'fr' ? 'Courtière immobilière' : 'Tu título profesional'}
              />
            </div>
            <div>
              <Label htmlFor={`bio_${l.code}`}>Biografía ({l.label})</Label>
              <Textarea
                id={`bio_${l.code}`}
                {...register(`bio_${l.code}` as keyof FormValues)}
                placeholder="Cuéntales a tus clientes quién eres y qué ofreces."
              />
            </div>
          </div>
        ))}

        <div className="mt-4 max-w-xs">
          <Label htmlFor="idioma_principal">Idioma principal (fallback)</Label>
          <Select id="idioma_principal" {...register('idioma_principal')}>
            {LANGS.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </Select>
        </div>
      </section>

      {/* Clasificación */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-foreground">Categoría</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="categoria_id">Categoría</Label>
            <Select
              id="categoria_id"
              {...register('categoria_id', {
                onChange: () => setValue('subcategoria_id', ''),
              })}
            >
              <option value="">Selecciona…</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre_es}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="subcategoria_id">Subcategoría</Label>
            <Select id="subcategoria_id" {...register('subcategoria_id')} disabled={!subcats.length}>
              <option value="">{subcats.length ? 'Selecciona…' : 'Elige una categoría'}</option>
              {subcats.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre_es}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </section>

      {/* Idiomas hablados */}
      <section>
        <h2 className="text-base font-semibold text-foreground">Idiomas que hablas</h2>
        <p className="mb-3 mt-1 text-sm text-muted-foreground">
          Tus clientes podrán filtrar por idioma en el directorio.
        </p>
        <div className="flex flex-wrap gap-2">
          {SPOKEN.map((l) => {
            const active = idiomas.includes(l.code);
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => toggleIdioma(l.code)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-sm transition-colors',
                  active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:text-foreground',
                )}
              >
                {l.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Contacto */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-foreground">Contacto</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="telefono">Teléfono</Label>
            <Input id="telefono" {...register('telefono')} placeholder="+1 (514) …" />
          </div>
          <div>
            <Label htmlFor="ciudad">Ciudad</Label>
            <Input id="ciudad" {...register('ciudad')} placeholder="Montréal" />
          </div>
        </div>
        <div>
          <Label htmlFor="sitio_web">Sitio web</Label>
          <Input id="sitio_web" type="url" {...register('sitio_web')} placeholder="https://…" />
        </div>
      </section>

      <div className="flex justify-end">
        <Button type="submit" loading={isSubmitting}>
          Guardar cambios
        </Button>
      </div>
    </form>
  );
}
