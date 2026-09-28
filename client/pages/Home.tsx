import { useEffect } from "react";
import { ArticleCarousel } from "@/components/home/ArticleCarousel";
import { DataFlow } from "@/components/home/DataFlow";
import { ServiceTiles } from "@/components/home/ServiceTiles";
import { useGuide } from "@/context/guide-context";
import { useMarkets } from "@/context/market-context";
import { MARKET_LABELS } from "@/lib/markets";

export default function Home() {
  const { markersVisible } = useGuide();
  const { activeMarket } = useMarkets();

  useEffect(() => {
    document.title = `More · ${MARKET_LABELS[activeMarket]}`;
  }, [activeMarket]);

  return (
    <div className="more-container">
      {markersVisible && <DataFlow />}
      <ArticleCarousel />
      <ServiceTiles />
    </div>
  );
}
