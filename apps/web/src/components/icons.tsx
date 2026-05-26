const iconBase = "inline-block shrink-0";

export function IconBook({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      className={`${iconBase} ${className}`}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconSparkle({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      className={`${iconBase} ${className}`}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </svg>
  );
}

export function IconGlobe({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      className={`${iconBase} ${className}`}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function IconHeart({
  className = "h-5 w-5",
  filled = false,
}: {
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      className={`${iconBase} ${className}`}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      aria-hidden
    >
      <path
        d="M12 21s-7-4.35-9.5-8.5C.5 9.5 2.5 5 7 5c2 0 3.5 1.5 5 3 1.5-1.5 3-3 5-3 4.5 0 6.5 4.5 4.5 7.5C19 16.65 12 21 12 21z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconEye({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={`${iconBase} ${className}`}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function IconEyeOff({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={`${iconBase} ${className}`}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-8-10-8a18.45 18.45 0 0 1 5.06-6.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M2 2l20 20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconCopy({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={`${iconBase} ${className}`} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function IconMail({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={`${iconBase} ${className}`} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function IconPrinter({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={`${iconBase} ${className}`} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 9V2h12v7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="6" y="14" width="12" height="8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function IconShare({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={`${iconBase} ${className}`}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M18 8a3 3 0 1 0-2.83-4M6 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm12 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM8.59 13.51l6.83 3.98M15.42 6.51l-6.82 3.98"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
