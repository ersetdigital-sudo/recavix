import type { ReactNode } from "react";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start gap-3">
      <div className="min-w-0">
        <h1 className="font-display text-[26px] font-extrabold leading-tight text-green-dd">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 max-w-[70ch] text-sm leading-relaxed opacity-70">{description}</p>
        ) : null}
      </div>
      {action ? <div className="ml-auto">{action}</div> : null}
    </div>
  );
}
