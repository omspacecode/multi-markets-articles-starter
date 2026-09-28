import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SolutionGuide } from "@/components/guide/SolutionGuide";
import { AppFooter } from "./AppFooter";
import { AppHeader } from "./AppHeader";

export function AppLayout() {
  const { pathname } = useLocation();

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
    </div>
  );
}
