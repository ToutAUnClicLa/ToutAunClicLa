"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { updateMe, type Categoria } from '@/lib/pro/endpoints';
import { ProApiError } from '@/lib/pro/api';
import { useProAuth, type ProUser } from '@/contexts/ProAuthContext';
import { useTranslation } from '@/hooks/useTranslation';
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
  const { t, locale } = useTranslation();
  const p = proUser as ProUser;
  const [activeLang, setActiveLang] = useState<Lang>(p?.idioma_principal || 'fr');

  // Nombre de categoría/subcategoría en el idioma actual del visitante.
  const catName = (c: { nombre_fr: string; nombre_en: string; nombre_es: string }) =>
    locale === 'en' ? c.nombre_en : locale === 'es' ? c.nombre_es : c.nombre_fr;

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
      toast.success(t('pro.profileForm.saved'));
    } catch (err) {
      toast.error((err as ProApiError).message || t('pro.profileForm.saveError'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="divide-y divide-border">
      {/* Identidad */}
      <section className="space-y-4 pb-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="nombre">{t('pro.profileForm.firstNameLabel')}</Label>
            <Input id="nombre" {...register('nombre', { required: true })} />
          </div>
          <div>
            <Label htmlFor="apellido">{t('pro.profileForm.lastNameLabel')}</Label>
            <Input id="apellido" {...register('apellido')} />
          </div>
        </div>
        <div>
          <Label htmlFor="empresa">{t('pro.profileForm.companyLabel')}</Label>
          <Input
            id="empresa"
            {...register('empresa')}
            placeholder={t('pro.profileForm.companyPlaceholder')}
          />
        </div>
      </section>

      {/* Título y bio trilingües */}
      <section className="py-8">
        <h2 className="text-base font-semibold text-foreground">
          {t('pro.profileForm.titleBioHeading')}
        </h2>
        <p className="mb-3 mt-1 text-sm text-muted-foreground">
          {t('pro.profileForm.titleBioHint')}
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
              <Label htmlFor={`titulo_${l.code}`}>
                {t('pro.profileForm.titleLabel', { lang: l.label })}
              </Label>
              <Input
                id={`titulo_${l.code}`}
                {...register(`titulo_${l.code}` as keyof FormValues)}
                placeholder={
                  l.code === 'fr'
                    ? t('pro.profileForm.titlePlaceholderFr')
                    : t('pro.profileForm.titlePlaceholder')
                }
              />
            </div>
            <div>
              <Label htmlFor={`bio_${l.code}`}>
                {t('pro.profileForm.bioLabel', { lang: l.label })}
              </Label>
              <Textarea
                id={`bio_${l.code}`}
                {...register(`bio_${l.code}` as keyof FormValues)}
                placeholder={t('pro.profileForm.bioPlaceholder')}
              />
            </div>
          </div>
        ))}

        <div className="mt-4 max-w-xs">
          <Label htmlFor="idioma_principal">{t('pro.profileForm.primaryLangLabel')}</Label>
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
      <section className="space-y-4 py-8">
        <h2 className="text-base font-semibold text-foreground">
          {t('pro.profileForm.categoryHeading')}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="categoria_id">{t('pro.profileForm.categoryLabel')}</Label>
            <Select
              id="categoria_id"
              {...register('categoria_id', {
                onChange: () => setValue('subcategoria_id', ''),
              })}
            >
              <option value="">{t('pro.profileForm.selectPlaceholder')}</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {catName(c)}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="subcategoria_id">{t('pro.profileForm.subcategoryLabel')}</Label>
            <Select id="subcategoria_id" {...register('subcategoria_id')} disabled={!subcats.length}>
              <option value="">
                {subcats.length
                  ? t('pro.profileForm.selectPlaceholder')
                  : t('pro.profileForm.subcategoryPlaceholder')}
              </option>
              {subcats.map((s) => (
                <option key={s.id} value={s.id}>
                  {catName(s)}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </section>

      {/* Idiomas hablados */}
      <section className="py-8">
        <h2 className="text-base font-semibold text-foreground">
          {t('pro.profileForm.spokenHeading')}
        </h2>
        <p className="mb-3 mt-1 text-sm text-muted-foreground">
          {t('pro.profileForm.spokenHint')}
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
      <section className="space-y-4 py-8">
        <h2 className="text-base font-semibold text-foreground">
          {t('pro.profileForm.contactHeading')}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="telefono">{t('pro.profileForm.phoneLabel')}</Label>
            <Input id="telefono" {...register('telefono')} placeholder="+1 (514) …" />
          </div>
          <div>
            <Label htmlFor="ciudad">{t('pro.profileForm.cityLabel')}</Label>
            <Input id="ciudad" {...register('ciudad')} placeholder="Montréal" />
          </div>
        </div>
        <div>
          <Label htmlFor="sitio_web">{t('pro.profileForm.websiteLabel')}</Label>
          <Input id="sitio_web" type="url" {...register('sitio_web')} placeholder="https://…" />
        </div>
      </section>

      <div className="flex justify-end pt-6">
        <Button type="submit" loading={isSubmitting}>
          {t('pro.profileForm.save')}
        </Button>
      </div>
    </form>
  );
}
