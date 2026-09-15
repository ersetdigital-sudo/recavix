"use client";

import { cn } from "@/lib/cn";

interface FilterRowProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function FilterRow({ label, checked, onChange }: FilterRowProps) {
  return (
    <label className={cn("filter-row", checked && "on")}>
      <input
        type="checkbox"
        className="chk"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}
