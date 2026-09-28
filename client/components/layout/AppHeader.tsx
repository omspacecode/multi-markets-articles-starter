import { Button } from "antd";
import { ReadOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Logo } from "@/components/brand/Logo";
import { SolutionMarker } from "@/components/guide/SolutionMarker";
import { useGuide } from "@/context/guide-context";
import { CustomerMarkets } from "./CustomerMarkets";
import { MarketTabs } from "./MarketTabs";

export function AppHeader() {
  const { openGuide } = useGuide();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="more-container flex h-16 items-center gap-3">
        <Link to="/" aria-label="More homepage" className="shrink-0">
          <Logo />
        </Link>
        <span className="ml-1 hidden rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-ink-500 lg:inline-flex">
          Builder.io solution demo
        </span>
        <div className="ml-auto flex items-center gap-2">
          <SolutionMarker topic="tabs" className="hidden sm:inline-flex" />
          <CustomerMarkets />
          <Button icon={<ReadOutlined />} onClick={() => openGuide()} aria-label="Open solution guide">
            <span className="hidden sm:inline">Solution guide</span>
          </Button>
        </div>
      </div>
      <MarketTabs />
    </header>
  );
}
