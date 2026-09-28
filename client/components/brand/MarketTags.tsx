import { GlobalOutlined } from "@ant-design/icons";
import { cn } from "@/lib/utils";
import { MARKET_LABELS, isMarketCode } from "@/lib/markets";
import { Flag } from "./Flag";

export function MarketTags({ markets, className }: { markets: string[]; className?: string }) {
  if (!markets.length) {
    return <span className={cn("text-xs text-ink-400", className)}>No markets yet</span>;
  }

  return (
    <span className={cn("flex flex-wrap items-center gap-1.5", className)} aria-label="Markets">
      {markets.map((code) => (
        <span
          key={code}
          className="inline-flex items-center gap-1.5 rounded-full bg-sand-100 px-2 py-0.5 text-[11px] font-medium text-ink-600 ring-1 ring-border"
        >
          {isMarketCode(code) ? <Flag code={code} className="h-2.5 w-3.5" /> : <GlobalOutlined className="text-ink-400" />}
          {MARKET_LABELS[code] ?? code}
        </span>
      ))}
    </span>
  );
}
