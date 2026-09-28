import { Tabs } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { Flag } from "@/components/brand/Flag";
import { useMarkets } from "@/context/market-context";
import { MARKET_LABELS, type MarketCode } from "@/lib/markets";

export function MarketTabs() {
  const { customerMarkets, activeMarket, setActiveMarket } = useMarkets();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (customerMarkets.length < 2) return null;

  const select = (key: string) => {
    setActiveMarket(key as MarketCode);
    if (pathname !== "/") navigate("/");
  };

  return (
    <div className="border-t border-border/70">
      <div className="more-container">
        <Tabs
          className="more-market-tabs"
          activeKey={activeMarket}
          onTabClick={select}
          items={customerMarkets.map((code) => ({
            key: code,
            label: (
              <span className="inline-flex items-center gap-2">
                <Flag code={code} />
                {MARKET_LABELS[code]}
              </span>
            ),
          }))}
        />
      </div>
    </div>
  );
}
