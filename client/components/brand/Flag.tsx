import type { ReactElement } from "react";
import { cn } from "@/lib/utils";
import type { MarketCode } from "@/lib/markets";

const FLAGS: Record<MarketCode, ReactElement> = {
  dk: (
    <svg viewBox="0 0 37 28" preserveAspectRatio="xMidYMid slice">
      <rect width="37" height="28" fill="#C8102E" />
      <rect x="12" width="4" height="28" fill="#fff" />
      <rect y="12" width="37" height="4" fill="#fff" />
    </svg>
  ),
  de: (
    <svg viewBox="0 0 5 3" preserveAspectRatio="none">
      <rect width="5" height="1" fill="#000" />
      <rect width="5" height="1" y="1" fill="#DD0000" />
      <rect width="5" height="1" y="2" fill="#FFCE00" />
    </svg>
  ),
  at: (
    <svg viewBox="0 0 3 3" preserveAspectRatio="none">
      <rect width="3" height="3" fill="#C8102E" />
      <rect width="3" height="1" y="1" fill="#fff" />
    </svg>
  ),
  nl: (
    <svg viewBox="0 0 3 3" preserveAspectRatio="none">
      <rect width="3" height="1" fill="#AE1C28" />
      <rect width="3" height="1" y="1" fill="#fff" />
      <rect width="3" height="1" y="2" fill="#21468B" />
    </svg>
  ),
};

export function Flag({ code, className }: { code: MarketCode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-3.5 w-5 shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/10 [&>svg]:h-full [&>svg]:w-full",
        className,
      )}
      aria-hidden="true"
    >
      {FLAGS[code]}
    </span>
  );
}
