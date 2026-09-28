import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#0F4C3F" />
      <path
        d="M9 22.5V10l7 8.5 7-8.5v12.5"
        fill="none"
        stroke="#F7F4EE"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-8 w-8 shrink-0" />
      <span className="font-display text-[28px] leading-none tracking-tight text-ink">
        More<span className="text-coral-500">.</span>
      </span>
    </span>
  );
}
