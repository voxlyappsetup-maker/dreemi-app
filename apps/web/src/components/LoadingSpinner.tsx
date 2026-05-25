export function LoadingSpinner({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16">
      <div className="relative">
        <div
          className="h-16 w-16 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600"
          role="status"
          aria-label={label}
        />
        <div className="absolute inset-0 flex animate-pulse items-center justify-center text-xl">
          ✨
        </div>
      </div>
      <p className="max-w-xs text-center text-sm font-medium text-slate-600">{label}</p>
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 animate-pulse rounded-full bg-violet-400"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>
    </div>
  );
}
