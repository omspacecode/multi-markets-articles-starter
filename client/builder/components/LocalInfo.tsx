import type { ComponentType } from "react";
import {
  BankOutlined,
  CalendarOutlined,
  CustomerServiceOutlined,
  HeartOutlined,
  InfoCircleOutlined,
  UserOutlined,
  WalletOutlined,
} from "@ant-design/icons";

const ICONS: Record<string, ComponentType> = {
  calendar: CalendarOutlined,
  user: UserOutlined,
  headset: CustomerServiceOutlined,
  building: BankOutlined,
  wallet: WalletOutlined,
  heart: HeartOutlined,
};

export const LOCAL_INFO_ICONS = Object.keys(ICONS);

export interface LocalInfoProps {
  title?: string;
  items?: { icon?: string; label?: string; value?: string }[];
}

export function LocalInfo({ title = "Good to know", items = [] }: LocalInfoProps) {
  return (
    <section className="py-8 md:py-10">
      <h2 className="font-display text-[36px] leading-none tracking-[-0.01em] text-ink md:text-[44px]">{title}</h2>
      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => {
          const Icon = ICONS[item.icon ?? ""] ?? InfoCircleOutlined;
          return (
            <div key={i} className="rounded-2xl border border-border bg-white p-5 transition hover:shadow-soft">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sand-100 text-lg text-pine-700">
                <Icon />
              </span>
              <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-400">{item.label}</p>
              <p className="mt-1.5 text-[15px] font-medium leading-snug text-ink">{item.value}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
