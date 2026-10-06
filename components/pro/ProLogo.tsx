import Image from 'next/image';
import { cn } from '@/lib/utils';

export function ProLogo({
  className,
  compact = false,
}: {
  className?: string;
  /** Landing: "Tout À Un" sobre "Clic Là", con Pro al lado. */
  compact?: boolean;
}) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 font-semibold tracking-tight sm:gap-2', className)}>
      <Image
        src="/icons/logo.png"
        alt=""
        width={32}
        height={32}
        className="h-8 w-8 shrink-0"
      />
      {compact ? (
        <span className="flex flex-col text-sm leading-tight text-foreground ">
          <span className="whitespace-nowrap">Tout À Un</span>
          <span className="whitespace-nowrap">Clic Là</span>
        </span>
      ) : (
        <span className="whitespace-nowrap text-sm text-foreground sm:text-base">
          Tout À Un Clic Là
        </span>
      )}
      <span className="shrink-0 rounded-md bg-accent px-1.5 py-0.5 text-xs font-semibold text-accent-foreground">
        Pro
      </span>
    </span>
  );
}
