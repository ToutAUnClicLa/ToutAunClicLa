import Link from 'next/link';
import { cookies } from 'next/headers';
import { ProLogo } from '@/components/pro/ProLogo';
import { BackButton } from '@/components/pro/ui/back-button';
import { getProT, validLang } from '@/lib/pro/i18n';

export default function ProAuthLayout({ children }: { children: React.ReactNode }) {
  const lang = validLang(cookies().get('preferred-language')?.value);
  const t = getProT(lang).header;

  return (
    <div className="pro-hero-bg pro-auth-bg relative flex min-h-[100dvh] flex-col items-center justify-center px-4 py-12 pb-36">
      <div className="absolute left-4 top-6 sm:left-6">
        <BackButton href="/pro" label={t.backHome} />
      </div>

      <Link
        href="/pro"
        className="mb-8 rounded-lg"
      >
        <ProLogo />
      </Link>
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-[var(--shadow-sm)] sm:p-8">
        {children}
      </div>
    </div>
  );
}
