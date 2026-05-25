const STARS: { top: string; right: string; delay: string }[] = [
  { top: "12%", right: "18%", delay: "0s" },
  { top: "22%", right: "42%", delay: "0.8s" },
  { top: "8%", right: "65%", delay: "1.2s" },
  { top: "35%", right: "8%", delay: "0.4s" },
  { top: "45%", right: "78%", delay: "2s" },
  { top: "55%", right: "28%", delay: "1.6s" },
  { top: "18%", right: "88%", delay: "0.2s" },
  { top: "62%", right: "52%", delay: "2.4s" },
  { top: "72%", right: "15%", delay: "1s" },
  { top: "28%", right: "55%", delay: "3s" },
  { top: "48%", right: "92%", delay: "1.8s" },
  { top: "78%", right: "68%", delay: "0.6s" },
];

export function StarsBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute right-1/4 top-[15%] h-28 w-28 rounded-full bg-violet-400/20 blur-2xl" />
      <div className="absolute right-[70%] top-1/2 h-40 w-40 rounded-full bg-purple-400/15 blur-3xl" />
      {STARS.map((star) => (
        <span
          key={`${star.top}-${star.right}-${star.delay}`}
          className="absolute h-1.5 w-1.5 animate-pulse rounded-full bg-violet-500"
          style={{
            top: star.top,
            right: star.right,
            animationDelay: star.delay,
          }}
        />
      ))}
    </div>
  );
}
