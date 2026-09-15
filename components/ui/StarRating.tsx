import { cn } from "@/lib/cn";

interface StarRatingProps {
  value?: number;
  max?: number;
  className?: string;
}

export function StarRating({ value = 5, max = 5, className }: StarRatingProps) {
  const filled = Math.max(0, Math.min(value, max));

  return (
    <span
      role="img"
      aria-label={`Rating ${filled} dari ${max}`}
      className={cn("text-xs tracking-[1px] text-amber", className)}
    >
      {"★".repeat(filled)}
      <span className="opacity-30">{"★".repeat(max - filled)}</span>
    </span>
  );
}
