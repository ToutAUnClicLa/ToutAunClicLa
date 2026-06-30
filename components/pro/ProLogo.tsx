import { cn } from '@/lib/utils';

export function ProLogo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 font-semibold tracking-tight', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logoaunclic.svg" alt="Tout À Un Clic Là" className="h-8 w-8" />
      <span className="text-foreground">Tout À Un Clic Là</span>
      <span className="rounded-md bg-accent px-1.5 py-0.5 text-xs font-semibold text-accent-foreground">
        Pro
      </span>
    </span>
  );
}
