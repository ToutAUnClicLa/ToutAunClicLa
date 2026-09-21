import Image from 'next/image';
import { cn } from '@/lib/utils';

export function ProLogo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 font-semibold tracking-tight', className)}>
      <Image
        src="/logoaunclic.svg"
        alt="Tout À Un Clic Là"
        width={32}
        height={32}
        className="h-8 w-8 shrink-0"
      />
      <span className="whitespace-nowrap text-sm text-foreground sm:text-base">
        Tout À Un Clic Là
      </span>
      <span className="rounded-md bg-accent px-1.5 py-0.5 text-xs font-semibold text-accent-foreground">
        Pro
      </span>
    </span>
  );
}
