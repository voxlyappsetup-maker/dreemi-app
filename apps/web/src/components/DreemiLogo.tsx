interface DreemiLogoProps {
  size?: "sm" | "md" | "lg";
}

export function DreemiLogo({ size = "md" }: DreemiLogoProps) {
  const textClass =
    size === "sm"
      ? "text-lg"
      : size === "lg"
        ? "text-3xl"
        : "text-xl";

  return (
    <span
      className={`${textClass} font-extrabold tracking-tight bg-gradient-to-r from-violet-600 via-purple-500 to-violet-700 bg-clip-text text-transparent`}
      style={{ fontFamily: "var(--font-nunito), var(--font-inter), sans-serif", letterSpacing: "-0.5px" }}
    >
      Dreemi
    </span>
  );
}
