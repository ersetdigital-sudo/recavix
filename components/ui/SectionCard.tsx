import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface SectionCardProps {
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "article" | "aside";
}

/** White rounded panel with the signature stacked-paper shadow. */
export function SectionCard({
  children,
  className,
  as: Tag = "section",
}: SectionCardProps) {
  return (
    <Tag
      className={cn(
        "card-shadow rounded-2xl border border-mint-2 bg-white p-5",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
