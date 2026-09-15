import type { ReactNode } from "react";

import { SectionCard } from "@/components/ui/SectionCard";

interface StepCardProps {
  step: number;
  title: string;
  children: ReactNode;
}

export function StepCard({ step, title, children }: StepCardProps) {
  return (
    <SectionCard>
      <h2 className="mb-4 flex items-center gap-2 text-[19px] font-extrabold">
        <span
          aria-hidden
          className="grid h-[26px] w-[26px] flex-none place-items-center rounded-full bg-green-d text-sm font-bold text-white"
        >
          {step}
        </span>
        {title}
      </h2>
      {children}
    </SectionCard>
  );
}
