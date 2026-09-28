export const MARKET_CODES = ["dk", "de", "at", "nl"] as const;
export type MarketCode = (typeof MARKET_CODES)[number];

export const MARKET_LABELS: Record<string, string> = {
  dk: "Denmark",
  de: "Germany",
  at: "Austria",
  nl: "Netherlands",
  global: "All markets",
};

export const isMarketCode = (value: unknown): value is MarketCode =>
  (MARKET_CODES as readonly unknown[]).includes(value);
