import type { ReactNode } from "react";
import { ExportOutlined } from "@ant-design/icons";
import { Flag } from "@/components/brand/Flag";
import { useViewer } from "@/context/viewer";
import type { TopicId } from "@/context/guide-context";
import { useNow } from "@/hooks/use-now";
import { builderContentUrl } from "@/lib/builder";
import { COUNTRIES, TARGET_GROUP_LABELS } from "@/lib/demo-data";
import { secondsAgo } from "@/lib/format";
import { useLiveStatus } from "@/lib/live-status";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-baseline sm:gap-4">
      <dt className="w-40 shrink-0 text-xs font-medium uppercase tracking-wide text-pine-200">{label}</dt>
      <dd className="min-w-0 text-sm text-white">{children}</dd>
    </div>
  );
}

const Mono = ({ children }: { children: ReactNode }) => (
  <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[12px] text-pine-100">{children}</code>
);

const EntryLink = ({ id, name }: { id?: string; name?: string }) =>
  id ? (
    <a
      href={builderContentUrl(id)}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
    >
      {name} <ExportOutlined className="text-[11px]" />
    </a>
  ) : (
    <span className="text-pine-200">Not loaded yet</span>
  );

export function TopicLiveStatus({ topic }: { topic: TopicId }) {
  const { persona, country, targetGroup } = useViewer();
  const status = useLiveStatus();
  const now = useNow(1000, topic === "carousel");

  let rows: ReactNode;
  if (topic === "target-groups") {
    rows = (
      <>
        <Row label="Signed in as">
          {persona.name} · <Mono>targetGroup: "{targetGroup}"</Mono>
        </Row>
        <Row label="Banner shown">
          <EntryLink id={status.banner?.id} name={status.banner?.name} />
          {status.banner && (
            <span className="ml-2 text-pine-200">
              {status.banner.isFallback ? "(fallback for everyone)" : `(Target group = ${TARGET_GROUP_LABELS[targetGroup]})`}
            </span>
          )}
        </Row>
        <Row label="Carousel">
          {status.carousel ? `${status.carousel.count} articles for ${TARGET_GROUP_LABELS[targetGroup]} or Everyone` : "Open a homepage to load it"}
        </Row>
      </>
    );
  } else if (topic === "templates") {
    rows = (
      <>
        <Row label="Article template">
          <Mono>client/components/article/ArticleTemplate.tsx</Mono>
        </Row>
        <Row label="Live preview route">
          <Mono>/preview/news-article</Mono> via <Mono>subscribeToEditor()</Mono>
        </Row>
        <Row label="Homepage editing">Components-only mode; structural sections need editDesigns</Row>
      </>
    );
  } else if (topic === "multi-country") {
    rows = (
      <>
        <Row label={`${persona.firstName}'s countries`}>
          <span className="flex flex-wrap items-center gap-3">
            {persona.countries.map((code) => (
              <span key={code} className="inline-flex items-center gap-1.5">
                <Flag code={code} /> {COUNTRIES[code].name}
              </span>
            ))}
          </span>
        </Row>
        <Row label="Homepage entry">
          <EntryLink id={status.homepage?.id} name={status.homepage?.name} />
          <span className="ml-2">
            <Mono>urlPath is /{country}</Mono>
          </span>
        </Row>
        <Row label="Tabs shown">
          {persona.countries.length > 1 ? `${persona.countries.length} tabs` : "None (one country only)"}
        </Row>
      </>
    );
  } else {
    const carousel = status.carousel;
    rows = carousel ? (
      <>
        <Row label="Last checked">
          <span className="inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-coral-400 animate-live-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-coral-400" />
            </span>
            {secondsAgo(carousel.checkedAt, now)}s ago · every {carousel.refreshSeconds}s
          </span>
        </Row>
        <Row label="Articles shown">
          {carousel.count} for {COUNTRIES[country].name} · {carousel.targetGroup ? TARGET_GROUP_LABELS[carousel.targetGroup] : "all groups"}
        </Row>
        {carousel.newestTitle && <Row label="First slide">{carousel.newestTitle}</Row>}
      </>
    ) : (
      <Row label="Carousel">Open a country homepage to start the live query</Row>
    );
  }

  return (
    <div className="rounded-2xl bg-pine-700 px-5 py-3">
      <div className="eyebrow flex items-center gap-2 py-2 text-coral-300">
        <span className="h-1.5 w-1.5 rounded-full bg-coral-400" /> Live in this demo
      </div>
      <dl className="divide-y divide-white/10">{rows}</dl>
    </div>
  );
}
