import "./global.css";

import { createRoot } from "react-dom/client";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { App as AntApp, ConfigProvider } from "antd";
import enGB from "antd/locale/en_GB";
import { AppLayout } from "@/components/layout/AppLayout";
import { GuideProvider } from "@/context/guide-context";
import { MarketProvider } from "@/context/market-context";
import { moreTheme } from "@/lib/theme";
import ArticlePage, { TemplatePreviewPage } from "./pages/ArticlePage";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError(error, query) {
      console.error("[More] Query failed", query.queryKey, error);
    },
  }),
  defaultOptions: {
    queries: { staleTime: 10_000, refetchOnWindowFocus: false, retry: 1 },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ConfigProvider theme={moreTheme} locale={enGB}>
        <AntApp notification={{ placement: "bottomRight" }}>
          <MarketProvider>
            <GuideProvider>
              <Routes>
                <Route element={<AppLayout />}>
                  <Route index element={<Home />} />
                  <Route path="articles/:slug" element={<ArticlePage />} />
                  <Route path="preview/article-template" element={<TemplatePreviewPage />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </GuideProvider>
          </MarketProvider>
        </AntApp>
      </ConfigProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
