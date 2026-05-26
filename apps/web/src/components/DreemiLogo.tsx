interface DreemiLogoProps {
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export function DreemiLogo({ size = "md", showIcon = true }: DreemiLogoProps) {
  const textClass =
    size === "sm"
      ? "text-lg"
      : size === "lg"
        ? "text-3xl"
        : "text-xl";

  const iconClass =
    size === "sm"
      ? "text-sm"
      : size === "lg"
        ? "text-2xl"
        : "text-base";

  return (
    <span className="inline-flex items-center gap-1.5">
      {showIcon && <span className={iconClass} aria-hidden>🌙</span>}
      <span
        className={`${textClass} font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent`}
      >
        Dreemi
      </span>
    </span>
  );
}
