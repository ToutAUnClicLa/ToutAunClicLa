"use client";

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

function initialsOf(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  const letters = (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
  return letters.toUpperCase() || '?';
}

export function ProAvatar({
  src,
  name,
  size = 40,
  pending = false,
  className,
}: {
  src?: string | null;
  name: string;
  size?: number;
  pending?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImg = !!src && !failed;

  return (
    <span
      className={cn('relative inline-flex shrink-0 overflow-hidden rounded-lg', className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {pending && !showImg ? (
        <span className="pro-skeleton absolute inset-0 rounded-lg" />
      ) : showImg ? (
        <>
          <span className="pro-skeleton absolute inset-0 rounded-lg" />
          <Image
            key={src}
            src={src}
            alt=""
            fill
            sizes={`${size}px`}
            className="object-cover"
            onError={() => setFailed(true)}
          />
        </>
      ) : (
        <span className="flex h-full w-full items-center justify-center bg-accent text-xs font-semibold text-accent-foreground">
          {initialsOf(name)}
        </span>
      )}
    </span>
  );
}
