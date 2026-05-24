export function LoadingSpinner({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary"
        role="status"
        aria-label={label}
      />
      <p className="text-muted text-sm">{label}</p>
    </div>
  );
}
