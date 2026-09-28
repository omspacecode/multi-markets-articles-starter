import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Content, isEditing } from "@builder.io/sdk-react";
import { Skeleton } from "antd";
import { SolutionMarker } from "@/components/guide/SolutionMarker";
import { useGuide } from "@/context/guide-context";
import { useViewer } from "@/context/viewer";
import { fetchAudienceBanner } from "@/lib/banners";
import { BUILDER_API_KEY, MODELS } from "@/lib/builder";
import { reportLiveStatus } from "@/lib/live-status";
import { bannerComponents } from "../banner-components";

export interface TargetGroupBannerProps {
  label?: string;
}

export function TargetGroupBanner({ label = "For you" }: TargetGroupBannerProps) {
  const { country, targetGroup } = useViewer();
  const { markersVisible } = useGuide();
  const editing = isEditing();

  const { data: entry, isLoading } = useQuery({
    queryKey: ["audience-banner", targetGroup, country],
    queryFn: () => fetchAudienceBanner(targetGroup, country),
  });

  const matchedGroup = entry?.data?.targetGroup as string | undefined;
  const isFallback = !!entry && matchedGroup !== targetGroup;

  useEffect(() => {
    if (isLoading) return;
    reportLiveStatus({
      banner: entry ? { id: entry.id, name: entry.name, targetGroup: matchedGroup, isFallback } : undefined,
    });
  }, [entry, isLoading, matchedGroup, isFallback]);

  if (!isLoading && !entry && !editing) return null;

  return (
    <section data-tour="banner" className="py-8 md:py-10">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className="eyebrow text-ink-500">{label}</span>
        <SolutionMarker topic="target-groups" withLabel />
        {markersVisible && entry && (
          <span className="rounded-full border border-dashed border-ink-300 bg-white/70 px-2.5 py-0.5 font-mono text-[11px] text-ink-500">
            audience-banner · targetGroup = "{matchedGroup}"{isFallback ? " (fallback)" : ""}
          </span>
        )}
      </div>
      {isLoading ? (
        <div className="rounded-[28px] bg-white p-10">
          <Skeleton active paragraph={{ rows: 3 }} />
        </div>
      ) : (
        <Content
          model={MODELS.banner}
          content={entry ?? null}
          apiKey={BUILDER_API_KEY}
          customComponents={bannerComponents}
        />
      )}
    </section>
  );
}
