import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProPageHeader({
  title,
  subtitle,
  className,
  leading,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  leading?: ReactNode;
}) {
  return (
    <div className={cn('mt-4', leading && 'flex items-center gap-3', className)}>
      {leading}
      <div className={leading ? 'min-w-0' : undefined}>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {subtitle ? <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{subtitle}</p> : null}
      </div>
    </div>
  );
}

export function ProEmptyState({
  icon: Icon,
  title,
  text,
  children,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  children?: ReactNode;
}) {
  return (
    <div className="pro-empty mt-8">
      <span className="pro-icon-tile">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <h2 className="mt-4 text-base font-semibold text-foreground">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{text}</p>
      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}
