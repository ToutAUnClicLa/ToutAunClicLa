"use client";

import { cn } from '@/lib/utils';

function Bone({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-[var(--shop-hairline)]', className)} />;
}

function ItemRow() {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--shop-hairline)] bg-white">
      <div className="flex gap-3 p-3 sm:gap-4 sm:p-4">
        <Bone className="h-16 w-16 shrink-0 rounded-xl sm:h-20 sm:w-20 md:h-24 md:w-24" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1 space-y-2">
              <Bone className="h-5 w-3/4 max-w-xs" />
              <Bone className="h-3 w-24" />
              <Bone className="h-4 w-20" />
            </div>
            <Bone className="h-11 w-11 shrink-0 rounded-full" />
          </div>
          <div className="flex items-center justify-between">
            <Bone className="h-11 w-28 rounded-full" />
            <Bone className="h-5 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CartPageSkeleton() {
  return (
    <div
      className="bg-[var(--shop-canvas-muted)] text-[var(--shop-ink)]"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 rounded-xl border border-[var(--shop-hairline)] bg-white p-4 sm:mb-8 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <Bone className="h-11 w-11 shrink-0 rounded-full" />
                <Bone className="h-9 w-9 shrink-0 rounded-full" />
                <div className="min-w-0 space-y-2">
                  <Bone className="h-6 w-40 sm:h-7 sm:w-52" />
                  <Bone className="h-4 w-24" />
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden space-y-2 text-right sm:block">
                  <Bone className="ml-auto h-3 w-24" />
                  <Bone className="ml-auto h-7 w-28" />
                  <Bone className="ml-auto h-3 w-20" />
                </div>
                <Bone className="h-11 w-11 shrink-0 rounded-full" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            <div className="space-y-4 sm:space-y-6 lg:col-span-2">
              <div className="rounded-xl border border-[var(--shop-hairline)] bg-white p-3 sm:p-4">
                <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
                  <Bone className="h-9 w-9 shrink-0 rounded-full" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Bone className="h-5 w-28" />
                    <Bone className="h-3 w-20" />
                  </div>
                  <Bone className="h-6 w-20 rounded-full" />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <ItemRow />
                  <ItemRow />
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-20 rounded-xl border border-[var(--shop-hairline)] bg-white p-4 sm:top-24 sm:p-6">
                <div className="mb-4 flex items-center gap-2 sm:mb-6">
                  <Bone className="h-8 w-8 shrink-0 rounded-full" />
                  <Bone className="h-6 w-40" />
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between gap-8">
                      <Bone className="h-4 w-20" />
                      <Bone className="h-4 w-16" />
                    </div>
                  ))}
                  <Bone className="h-11 w-full rounded-full" />
                  <div className="flex items-center justify-between">
                    <Bone className="h-5 w-16" />
                    <Bone className="h-7 w-24" />
                  </div>
                </div>
                <div className="mt-4 space-y-3 border-t border-[var(--shop-hairline)] pt-4 sm:mt-6 sm:pt-6">
                  <Bone className="h-5 w-36" />
                  <Bone className="h-20 w-full rounded-xl" />
                  <Bone className="h-20 w-full rounded-xl" />
                </div>
                <div className="mt-4 space-y-3 border-t border-[var(--shop-hairline)] pt-4 sm:mt-6 sm:pt-6">
                  <Bone className="h-16 w-full rounded-xl" />
                  <Bone className="h-11 w-full rounded-xl" />
                </div>
                <div className="mt-4 space-y-3 border-t border-[var(--shop-hairline)] pt-4 sm:mt-6 sm:pt-6">
                  <Bone className="h-11 w-full rounded-full" />
                  <Bone className="h-11 w-full rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
