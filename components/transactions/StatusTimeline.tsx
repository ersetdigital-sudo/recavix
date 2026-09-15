import { cn } from "@/lib/cn";
import type { TransactionStep } from "@/types";

export function StatusTimeline({
  steps,
  done,
}: {
  steps: TransactionStep[];
  done: number;
}) {
  return (
    <div>
      {steps.map((step, index) => {
        const complete = index < done;
        const isLast = index === steps.length - 1;

        return (
          <div key={`${step.label}-${index}`} className="flex items-stretch gap-3">
            <div className="flex flex-col items-center self-stretch">
              <div
                className={cn(
                  "grid h-6 w-6 flex-none place-items-center rounded-full text-xs text-white",
                  complete ? "bg-green-d" : "bg-[#cbd8c6]",
                )}
              >
                {complete ? "✓" : index + 1}
              </div>
              {!isLast && <div className="my-1 w-0.5 flex-1 bg-[#dfe8db]" />}
            </div>
            <div className="pb-4">
              <div
                className={cn(
                  "text-sm font-semibold",
                  !complete && "opacity-50",
                )}
              >
                {step.label}
              </div>
              <div className="text-xs opacity-60">{step.time}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
