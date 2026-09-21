// Refleja el grid real: 2 columnas, card horizontal (foto 4:5 izquierda, info derecha).
export function DirectorySkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex animate-pulse gap-4 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4"
        >
          <div className="aspect-[4/5] w-24 shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800 sm:w-28" />
          <div className="flex min-w-0 flex-1 flex-col py-0.5">
            {/* pill de tier */}
            <div className="h-4 w-12 rounded-full bg-slate-100 dark:bg-slate-800" />
            {/* nombre */}
            <div className="mt-2 h-4 w-2/3 rounded bg-slate-100 dark:bg-slate-800" />
            {/* título · empresa */}
            <div className="mt-2 h-3 w-1/2 rounded bg-slate-100 dark:bg-slate-800" />
            {/* ciudad + redes */}
            <div className="mt-auto flex items-center gap-2 pt-3">
              <div className="h-3 w-16 rounded bg-slate-100 dark:bg-slate-800" />
              <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800" />
              <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
