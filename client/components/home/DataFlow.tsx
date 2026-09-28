import { useQuery } from "@tanstack/react-query";
import { ArrowRightOutlined } from "@ant-design/icons";
import { SolutionMarker } from "@/components/guide/SolutionMarker";
import { useMarkets } from "@/context/market-context";
import { articlesQuery, servicesQuery } from "@/lib/content";
import { MARKET_LABELS } from "@/lib/markets";

export function DataFlow() {
  const { customerMarkets, activeMarket } = useMarkets();
  const { data: articles } = useQuery(articlesQuery(activeMarket));
  const { data: services } = useQuery(servicesQuery(activeMarket));

  const steps = [
    {
      label: "Markets from login",
      value: `[${customerMarkets.map((code) => `"${code}"`).join(", ")}]`,
      note: "From company or customer group",
    },
    {
      label: "Active tab",
      value: `"${activeMarket}"`,
      note: customerMarkets.length > 1 ? MARKET_LABELS[activeMarket] : `${MARKET_LABELS[activeMarket]} · no tabs needed`,
    },
    {
      label: "Query to Builder",
      value: `data.markets $in ["${activeMarket}", "global"]`,
      note: "Same query for articles and services",
    },
    {
      label: "Returned",
      value: `${articles?.length ?? "…"} articles · ${services?.length ?? "…"} services`,
      note: "No page per market or combination",
    },
  ];

  return (
    <section aria-label="How this page picks content" className="mt-6 rounded-2xl bg-pine-700 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow flex items-center gap-2 text-coral-300">
          <span className="h-1.5 w-1.5 rounded-full bg-coral-400" /> How this page picks content
        </p>
        <SolutionMarker topic="markets" />
      </div>
      <ol className="mt-3 grid gap-2 md:grid-cols-4">
        {steps.map((step, i) => (
          <li key={step.label} className="relative rounded-xl bg-white/[0.07] p-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-pine-200">
              {i + 1}. {step.label}
            </p>
            <code className="mt-1.5 block break-words font-mono text-[12.5px] text-white">{step.value}</code>
            <p className="mt-1 text-xs text-pine-200">{step.note}</p>
            {i < steps.length - 1 && (
              <ArrowRightOutlined
                aria-hidden="true"
                className="absolute -right-[11px] top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-pine-700 p-[3px] text-[10px] text-coral-300 md:block"
              />
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
