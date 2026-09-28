import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { MARKET_CODES, isMarketCode, type MarketCode } from "@/lib/markets";

const STORAGE_KEY = "more.markets";

interface MarketState {
  /** Stand-in for the markets More resolves at login from the company or customer group. */
  customerMarkets: MarketCode[];
  /** Always one of customerMarkets. */
  activeMarket: MarketCode;
}

const DEFAULT_STATE: MarketState = { customerMarkets: [...MARKET_CODES], activeMarket: "de" };

function normalize(markets: unknown[], active: unknown): MarketState | null {
  const customerMarkets = MARKET_CODES.filter((code) => markets.includes(code));
  if (!customerMarkets.length) return null;
  return {
    customerMarkets,
    activeMarket: isMarketCode(active) && customerMarkets.includes(active) ? active : customerMarkets[0],
  };
}

function readStoredState(): MarketState {
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
    return (Array.isArray(stored?.customerMarkets) && normalize(stored.customerMarkets, stored.activeMarket)) || DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

interface MarketContextValue extends MarketState {
  setActiveMarket: (market: MarketCode) => void;
  setCustomerMarkets: (markets: MarketCode[]) => void;
}

const MarketContext = createContext<MarketContextValue | null>(null);

export function MarketProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(readStoredState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setActiveMarket = useCallback((market: MarketCode) => {
    setState((prev) => (prev.customerMarkets.includes(market) ? { ...prev, activeMarket: market } : prev));
  }, []);

  const setCustomerMarkets = useCallback((markets: MarketCode[]) => {
    setState((prev) => normalize(markets, prev.activeMarket) ?? prev);
  }, []);

  const value = useMemo(
    () => ({ ...state, setActiveMarket, setCustomerMarkets }),
    [state, setActiveMarket, setCustomerMarkets],
  );

  return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>;
}

export function useMarkets() {
  const context = useContext(MarketContext);
  if (!context) throw new Error("useMarkets must be used inside <MarketProvider>");
  return context;
}
