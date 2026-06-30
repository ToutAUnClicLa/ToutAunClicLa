import Link from 'next/link';
import { ProLogo } from '@/components/pro/ProLogo';
import { BackButton } from '@/components/pro/ui/back-button';

export default function ProAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="absolute left-4 top-6 sm:left-6">
        <BackButton href="/pro" label="Inicio" />
      </div>

      <Link href="/pro" className="mb-8">
        <ProLogo />
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
