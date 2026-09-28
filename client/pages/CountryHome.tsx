import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Content, fetchOneEntry, isEditing, type BuilderContent } from "@builder.io/sdk-react";
import { Alert, Button, Result, Skeleton } from "antd";
import { ExportOutlined } from "@ant-design/icons";
import { allComponents } from "@/builder/registry";
import { ArticleCarousel } from "@/builder/components/ArticleCarousel";
import { useGuide } from "@/context/guide-context";
import { usePersona } from "@/context/persona-context";
import { CountryOverrideProvider } from "@/context/viewer";
import { BUILDER_API_KEY, MODELS, builderContentUrl } from "@/lib/builder";
import { COUNTRIES, isCountryCode, type CountryCode } from "@/lib/demo-data";
import { reportLiveStatus } from "@/lib/live-status";
import NotFound from "./NotFound";

/** In Builder's editor the preview may load /dk while the Sweden entry is open; follow the entry's own targeting. */
function countryFromTargeting(entry: BuilderContent | null | undefined): CountryCode | null {
  const rules = (entry as { query?: { property?: string; value?: unknown }[] } | null | undefined)?.query;
  const rule = rules?.find((q) => q.property === "urlPath");
  const value = Array.isArray(rule?.value) ? rule?.value[0] : rule?.value;
  const code = typeof value === "string" ? value.replace(/^\//, "") : null;
  return isCountryCode(code) ? code : null;
}

function HomeSkeleton() {
  return (
    <div className="grid gap-10 pt-12 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <Skeleton active title={{ width: "70%" }} paragraph={{ rows: 4 }} />
      </div>
      <div className="aspect-[4/3] animate-pulse rounded-[28px] bg-sand-200 lg:col-span-5" />
    </div>
  );
}

export default function CountryHome() {
  const { country: param } = useParams();
  const { persona } = usePersona();
  const { markersVisible } = useGuide();
  const country = isCountryCode(param) ? param : null;
  const editing = isEditing();

  const { data: entry, isLoading, isError, refetch } = useQuery({
    queryKey: ["homepage", country, persona.targetGroup],
    queryFn: () =>
      fetchOneEntry({
        model: MODELS.homepage,
        apiKey: BUILDER_API_KEY,
        userAttributes: { urlPath: `/${country}`, targetGroup: persona.targetGroup },
      }),
    enabled: !!country,
  });

  useEffect(() => {
    if (!country || isLoading) return;
    reportLiveStatus({ homepage: { id: entry?.id, name: entry?.name, urlPath: `/${country}`, found: !!entry } });
    document.title = `${entry?.data?.seoTitle ?? `Relay ${COUNTRIES[country].name}`} · Homepage`;
  }, [entry, isLoading, country]);

  if (!country) return <NotFound />;

  const effectiveCountry = countryFromTargeting(entry) ?? country;
  const countryName = COUNTRIES[country].name;

  return (
    <CountryOverrideProvider value={effectiveCountry}>
      <div className="relay-container">
        {markersVisible && entry?.id && (
          <div className="flex flex-wrap items-center gap-2 pt-6 text-xs">
            <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-ink-300 bg-white/70 px-3 py-1 font-mono text-[11px] text-ink-500">
              <span className="h-1.5 w-1.5 rounded-full bg-pine-400" />
              country-homepage · "{entry.name}" · urlPath is /{effectiveCountry}
            </span>
            <a
              href={builderContentUrl(entry.id)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 font-medium text-pine-700 hover:bg-pine-50"
            >
              Edit in Builder <ExportOutlined className="text-[10px]" />
            </a>
          </div>
        )}

        {isLoading ? (
          <HomeSkeleton />
        ) : isError ? (
          <div className="py-16">
            <Alert
              type="error"
              showIcon
              title="Couldn't load this homepage from Builder"
              action={
                <Button size="small" onClick={() => refetch()}>
                  Retry
                </Button>
              }
            />
          </div>
        ) : entry || editing ? (
          <Content
            model={MODELS.homepage}
            content={entry ?? null}
            apiKey={BUILDER_API_KEY}
            customComponents={allComponents}
          />
        ) : (
          <>
            <Result
              status="info"
              title={`No homepage published for ${countryName} yet`}
              subTitle={`Create a Country homepage entry in Builder and target it to /${country}. Until then, the latest articles still show below.`}
            />
            <ArticleCarousel title={`Latest from ${countryName}`} />
          </>
        )}
      </div>
    </CountryOverrideProvider>
  );
}
