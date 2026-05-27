interface DreemiLogoProps {
  size?: "sm" | "md" | "lg";
}

export function DreemiLogo({ size = "md" }: DreemiLogoProps) {
  const heightClass =
    size === "sm" ? "h-8" : size === "lg" ? "h-14" : "h-10";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/dreemi-logo.png"
      alt="Dreemi"
      className={`${heightClass} w-auto`}
      draggable={false}
    />
  );
}
