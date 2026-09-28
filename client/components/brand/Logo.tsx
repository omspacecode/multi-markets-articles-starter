import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#0F4C3F" />
      <path
        d="M10.5 23.5V8.5h6a4.25 4.25 0 0 1 0 8.5h-6M15.6 17l6 6.5"
        fill="none"
        stroke="#F7F4EE"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24.6" cy="8.4" r="2.5" fill="#FF5C39" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-8 w-8 shrink-0" />
      <span className="font-display text-[28px] leading-none tracking-tight text-ink">Relay</span>
    </span>
  );
}
