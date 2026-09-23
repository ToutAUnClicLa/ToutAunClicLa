export function DirectorySkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex animate-pulse gap-4 rounded-xl border border-[var(--shop-hairline)] bg-white p-3 sm:p-4"
        >
          <div className="aspect-[4/5] w-24 shrink-0 rounded-xl bg-[var(--shop-canvas-muted)] sm:w-28" />
          <div className="flex min-w-0 flex-1 flex-col py-0.5">
            <div className="h-4 w-12 rounded-full bg-[var(--shop-canvas-muted)]" />
            <div className="mt-2 h-4 w-2/3 rounded bg-[var(--shop-canvas-muted)]" />
            <div className="mt-2 h-3 w-1/2 rounded bg-[var(--shop-canvas-muted)]" />
            <div className="mt-auto flex items-center gap-2 pt-3">
              <div className="h-3 w-16 rounded bg-[var(--shop-canvas-muted)]" />
              <div className="h-7 w-7 rounded-full bg-[var(--shop-canvas-muted)]" />
              <div className="h-7 w-7 rounded-full bg-[var(--shop-canvas-muted)]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
