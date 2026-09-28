import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Alert, App, Button, Empty } from "antd";
import {
  AccountBookOutlined,
  AppstoreOutlined,
  CreditCardOutlined,
  ExceptionOutlined,
  InboxOutlined,
  RollbackOutlined,
  ShopOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { MarketTags } from "@/components/brand/MarketTags";
import { SolutionMarker } from "@/components/guide/SolutionMarker";
import { useMarkets } from "@/context/market-context";
import { servicesQuery } from "@/lib/content";
import { MARKET_LABELS } from "@/lib/markets";

const ICONS: Record<string, ReactNode> = {
  claims: <ExceptionOutlined />,
  invoice: <AccountBookOutlined />,
  parcel: <InboxOutlined />,
  showroom: <ShopOutlined />,
  truck: <TruckOutlined />,
  payment: <CreditCardOutlined />,
  returns: <RollbackOutlined />,
};

export function ServiceTiles() {
  const { activeMarket } = useMarkets();
  const { message } = App.useApp();
  const { data: services, isLoading, isError, refetch } = useQuery({
    ...servicesQuery(activeMarket),
    refetchOnWindowFocus: true,
  });

  return (
    <section className="py-8 md:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-ink-500">Services</p>
          <h2 className="mt-2 font-display text-[34px] leading-none tracking-[-0.01em] text-ink md:text-[42px]">
            Services for {MARKET_LABELS[activeMarket]}
          </h2>
        </div>
        <SolutionMarker topic="markets" withLabel />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-sand-200" />
          ))}
        </div>
      ) : isError ? (
        <Alert
          type="error"
          showIcon
          title="Couldn't load services from Builder"
          action={
            <Button size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      ) : !services?.length ? (
        <div className="rounded-2xl border border-dashed border-ink-300/70 bg-white/60 p-8">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No services for this market yet." />
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <li key={service.id}>
              <button
                type="button"
                onClick={() => message.info(`Demo: in More, this opens ${service.link || service.title}`)}
                className="flex h-full w-full flex-col rounded-2xl bg-white p-5 text-left shadow-soft ring-1 ring-black/[0.03] transition hover:-translate-y-0.5 hover:shadow-lift"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-pine-50 text-xl text-pine-700">
                  {ICONS[service.icon] ?? <AppstoreOutlined />}
                </span>
                <span className="mt-4 text-[15px] font-semibold text-ink">{service.title}</span>
                <span className="mt-1.5 text-sm leading-relaxed text-ink-500">{service.description}</span>
                <MarketTags markets={service.markets} className="mt-auto pt-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
