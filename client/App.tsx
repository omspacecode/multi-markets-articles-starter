import "./global.css";

import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { App as AntApp, ConfigProvider } from "antd";
import enGB from "antd/locale/en_GB";
import { AppLayout } from "@/components/layout/AppLayout";
import { GuideProvider } from "@/context/guide-context";
import { PersonaProvider, usePersona } from "@/context/persona-context";
import { relayTheme } from "@/lib/theme";
import ArticlePage from "./pages/ArticlePage";
import ArticlePreview from "./pages/ArticlePreview";
import CountryHome from "./pages/CountryHome";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 10_000, refetchOnWindowFocus: false, retry: 1 },
  },
});

function HomeRedirect() {
  const { persona } = usePersona();
  return <Navigate to={`/${persona.countries[0]}`} replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ConfigProvider theme={relayTheme} locale={enGB}>
        <AntApp notification={{ placement: "bottomRight" }}>
          <PersonaProvider>
            <GuideProvider>
              <Routes>
                <Route element={<AppLayout />}>
                  <Route index element={<HomeRedirect />} />
                  <Route path="preview/news-article" element={<ArticlePreview />} />
                  <Route path=":country" element={<CountryHome />} />
                  <Route path=":country/articles/:articleId" element={<ArticlePage />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </GuideProvider>
          </PersonaProvider>
        </AntApp>
      </ConfigProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
