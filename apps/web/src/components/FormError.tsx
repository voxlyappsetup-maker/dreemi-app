export function FormError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="animate-[fadeIn_0.3s_ease] rounded-2xl border border-red-100 bg-red-50/90 px-4 py-3 text-sm text-red-700"
    >
      {message}
    </div>
  );
}
