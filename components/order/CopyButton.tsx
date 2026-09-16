"use client";

import { useState } from "react";

export function CopyButton({ value, label = "Salin" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        } catch {
          // Clipboard bisa diblokir browser; teksnya tetap terlihat di layar.
        }
      }}
      className="rounded-lg border-[1.5px] border-green bg-white px-2.5 py-1 text-xs font-bold text-green-d transition-colors hover:bg-mint"
    >
      {copied ? "Tersalin!" : label}
    </button>
  );
}
