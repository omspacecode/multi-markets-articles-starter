import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { setClientUserAttributes } from "@builder.io/sdk-react";
import { DemoTour } from "@/components/guide/DemoTour";
import { SolutionGuide } from "@/components/guide/SolutionGuide";
import { usePersona } from "@/context/persona-context";
import { useRouteCountry } from "@/context/viewer";
import { AppFooter } from "./AppFooter";
import { AppHeader } from "./AppHeader";

export function AppLayout() {
  const { persona } = usePersona();
  const routeCountry = useRouteCountry();
  const { pathname } = useLocation();
  const country = routeCountry ?? persona.countries[0];

  // Keeps Builder's client-side targeting (personalization containers, tracking) in sync with the viewer.
  useEffect(() => {
    setClientUserAttributes({ targetGroup: persona.targetGroup, country });
  }, [persona.targetGroup, country]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <AppFooter />
      <SolutionGuide />
      <DemoTour />
    </div>
  );
}
