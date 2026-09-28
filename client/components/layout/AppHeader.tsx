import { Button } from "antd";
import { CompassOutlined, ReadOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "@/components/brand/Logo";
import { useGuide } from "@/context/guide-context";
import { usePersona } from "@/context/persona-context";
import { useRouteCountry } from "@/context/viewer";
import { CountryBar } from "./CountryBar";
import { PersonaSwitcher } from "./PersonaSwitcher";

export function AppHeader() {
  const { persona } = usePersona();
  const { openGuide, setTourOpen } = useGuide();
  const routeCountry = useRouteCountry();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const home = `/${routeCountry ?? persona.countries[0]}`;

  const startTour = () => {
    const onHomepage = pathname === home;
    if (!onHomepage) navigate(home);
    window.setTimeout(() => setTourOpen(true), onHomepage ? 0 : 600);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="relay-container flex h-16 items-center gap-3">
        <Link to={home} aria-label="Relay homepage" className="shrink-0">
          <Logo />
        </Link>
        <span className="ml-1 hidden rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-ink-500 md:inline-flex">
          Builder.io solution demo
        </span>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <span className="hidden sm:inline-flex">
            <Button type="text" icon={<CompassOutlined />} onClick={startTour}>
              Tour
            </Button>
          </span>
          <Button icon={<ReadOutlined />} onClick={() => openGuide()} data-tour="guide" aria-label="Open solution guide">
            <span className="hidden sm:inline">Solution guide</span>
          </Button>
          <PersonaSwitcher />
        </div>
      </div>
      <div className="border-t border-border/70">
        <CountryBar />
      </div>
    </header>
  );
}
