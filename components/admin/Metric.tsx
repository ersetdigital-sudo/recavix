import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

interface MetricProps {
  label: string;
  value: string | number;
  icon: IconName;
  /** Class warna untuk kotak ikonnya. */
  tone?: string;
  hint?: string;
}

export function Metric({
  label,
  value,
  icon,
  tone = "bg-mint text-green-d",
  hint,
}: MetricProps) {
  return (
    <div className="card-shadow rounded-2xl border border-mint-2 bg-white p-5">
      <div className="flex items-center gap-3">
        <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-2xl", tone)}>
          <Icon name={icon} className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider opacity-60">{label}</p>
          <p className="font-display text-2xl font-black leading-tight">{value}</p>
          {hint ? <p className="truncate text-[11px] opacity-60">{hint}</p> : null}
        </div>
      </div>
    </div>
  );
}
