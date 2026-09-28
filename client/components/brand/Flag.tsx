import type { ReactElement } from "react";
import { cn } from "@/lib/utils";
import type { CountryCode } from "@/lib/demo-data";

const FLAGS: Record<CountryCode, ReactElement> = {
  dk: (
    <svg viewBox="0 0 37 28" preserveAspectRatio="xMidYMid slice">
      <rect width="37" height="28" fill="#C8102E" />
      <rect x="12" width="4" height="28" fill="#fff" />
      <rect y="12" width="37" height="4" fill="#fff" />
    </svg>
  ),
  se: (
    <svg viewBox="0 0 16 10" preserveAspectRatio="xMidYMid slice">
      <rect width="16" height="10" fill="#006AA7" />
      <rect x="5" width="2" height="10" fill="#FECC02" />
      <rect y="4" width="16" height="2" fill="#FECC02" />
    </svg>
  ),
  no: (
    <svg viewBox="0 0 22 16" preserveAspectRatio="xMidYMid slice">
      <rect width="22" height="16" fill="#BA0C2F" />
      <rect x="6" width="4" height="16" fill="#fff" />
      <rect y="6" width="22" height="4" fill="#fff" />
      <rect x="7" width="2" height="16" fill="#00205B" />
      <rect y="7" width="22" height="2" fill="#00205B" />
    </svg>
  ),
  de: (
    <svg viewBox="0 0 5 3" preserveAspectRatio="none">
      <rect width="5" height="1" y="0" fill="#000" />
      <rect width="5" height="1" y="1" fill="#DD0000" />
      <rect width="5" height="1" y="2" fill="#FFCE00" />
    </svg>
  ),
};

export function Flag({ code, className }: { code: CountryCode; className?: string }) {
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
