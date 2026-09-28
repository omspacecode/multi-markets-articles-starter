import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Alert, App, Button, Carousel, Empty, Skeleton, type CarouselRef } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined, PushpinFilled, ThunderboltFilled } from "@ant-design/icons";
import { cn } from "@/lib/utils";
import { AudienceLine, CategoryPill } from "@/components/article/ArticleMeta";
import { SolutionMarker } from "@/components/guide/SolutionMarker";
import { useViewer } from "@/context/viewer";
import { useNow } from "@/hooks/use-now";
import { fetchArticles, type NewsArticle } from "@/lib/articles";
import { COUNTRIES, TARGET_GROUP_LABELS } from "@/lib/demo-data";
import { formatRelative, readingMinutes, secondsAgo } from "@/lib/format";
import { sizedImage } from "@/lib/images";
import { reportLiveStatus } from "@/lib/live-status";

export interface ArticleCarouselProps {
  title?: string;
  maxArticles?: number;
  category?: string;
  matchTargetGroup?: boolean;
  autoplaySeconds?: number;
  refreshSeconds?: number;
}

const clamp = (value: number | undefined, min: number, max: number, fallback: number) =>
  Math.min(max, Math.max(min, Number.isFinite(value) ? Number(value) : fallback));

function LiveBadge({ checkedAt, refreshSeconds }: { checkedAt: number; refreshSeconds: number }) {
  const now = useNow(1000);
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-ink-600 ring-1 ring-border">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-coral-500 animate-live-ping" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-coral-500" />
      </span>
      Updates automatically
      <span className="text-ink-400">
        · checked {checkedAt ? `${secondsAgo(checkedAt, now)}s ago` : "now"} · every {refreshSeconds}s
      </span>
    </span>
  );
}

function Slide({ article, country, fresh, eager }: { article: NewsArticle; country: string; fresh: boolean; eager: boolean }) {
  const href = `/${country}/articles/${article.id}`;
  return (
    <div className="px-px">
      <article className="grid overflow-hidden rounded-[28px] bg-white shadow-soft ring-1 ring-black/[0.03] lg:min-h-[460px] lg:grid-cols-[1.3fr_1fr]">
        <Link to={href} tabIndex={-1} aria-hidden="true" className="group relative block h-60 overflow-hidden sm:h-80 lg:h-auto">
          <img
            src={sizedImage(article.heroImage, 1400)}
            alt=""
            loading={eager ? "eager" : "lazy"}
            className="absolute inset-0 h-full w-full object-cover transition duration-[1200ms] group-hover:scale-[1.03]"
          />
          <span className="absolute left-5 top-5 flex flex-wrap gap-2">
            {article.featured && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-ink shadow-sm">
                <PushpinFilled className="text-coral-500" /> Pinned
              </span>
            )}
            {fresh && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-coral-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                <ThunderboltFilled /> Just published
              </span>
            )}
          </span>
        </Link>
        <div className="flex flex-col p-6 sm:p-8 md:p-10">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-ink-500">
            <CategoryPill category={article.category} />
            <span>{readingMinutes(article.body)} min read</span>
            <span className="text-ink-300">·</span>
            <span>{formatRelative(article.publishedAt)}</span>
          </div>
          <h3 className="mt-5 font-display text-[32px] leading-[1.03] tracking-[-0.01em] text-ink md:text-[42px]">
            <Link to={href} className="transition hover:text-pine-700">
              {article.title}
            </Link>
          </h3>
          <p className="mt-4 line-clamp-3 text-[15px] leading-relaxed text-ink-500">{article.excerpt}</p>
          <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-8">
            <AudienceLine groups={article.targetGroups} countries={article.countries} />
            <Link
              to={href}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-pine-700"
            >
              Read article <ArrowRightOutlined />
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}

export function ArticleCarousel({
  title = "Latest news",
  maxArticles,
  category = "All",
  matchTargetGroup = true,
  autoplaySeconds,
  refreshSeconds,
}: ArticleCarouselProps) {
  const { country, targetGroup } = useViewer();
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const carouselRef = useRef<CarouselRef>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const seenIds = useRef<Set<string> | null>(null);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [freshIds, setFreshIds] = useState<string[]>([]);

  const group = matchTargetGroup ? targetGroup : null;
  const limit = clamp(maxArticles, 3, 12, 8);
  const autoplayMs = clamp(autoplaySeconds, 3, 30, 7) * 1000;
  const refreshSec = clamp(refreshSeconds, 5, 300, 15);
  const filterKey = `${country}|${group}|${category}|${limit}`;

  const { data: articles, isLoading, isError, refetch, dataUpdatedAt } = useQuery({
    queryKey: ["articles", country, group, category, limit],
    queryFn: () => fetchArticles({ country, targetGroup: group, category, limit }),
    refetchInterval: refreshSec * 1000,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const total = articles?.length ?? 0;
  const activeIndex = Math.min(current, Math.max(total - 1, 0));

  useEffect(() => {
    seenIds.current = null;
    setFreshIds([]);
    setCurrent(0);
  }, [filterKey]);

  // Anything that wasn't in the first result for this filter was published while the page was open.
  useEffect(() => {
    if (!articles) return;
    if (!seenIds.current) {
      seenIds.current = new Set(articles.map((a) => a.id));
      return;
    }
    const seen = seenIds.current;
    const added = articles.filter((a) => !seen.has(a.id));
    if (!added.length) return;

    added.forEach((a) => seen.add(a.id));
    setFreshIds((ids) => [...ids, ...added.map((a) => a.id)]);
    const first = added[0];
    window.setTimeout(() => carouselRef.current?.goTo(articles.findIndex((a) => a.id === first.id)), 60);

    const key = `article-${first.id}`;
    notification.open({
      key,
      title: "New article published",
      description: (
        <div>
          <p className="font-medium text-ink">{first.title}</p>
          <p className="mt-1 text-xs text-ink-500">
            Added to the {COUNTRIES[country].name} carousel automatically. No homepage edit needed.
          </p>
        </div>
      ),
      icon: <ThunderboltFilled style={{ color: "#FF5C39" }} />,
      placement: "bottomRight",
      duration: 10,
      actions: (
        <Button
          type="primary"
          size="small"
          onClick={() => {
            notification.destroy(key);
            navigate(`/${country}/articles/${first.id}`);
          }}
        >
          Read it
        </Button>
      ),
    });
  }, [articles, country, navigate, notification]);

  useEffect(() => {
    if (!articles) return;
    reportLiveStatus({
      carousel: {
        count: articles.length,
        checkedAt: dataUpdatedAt,
        country,
        targetGroup: group,
        refreshSeconds: refreshSec,
        newestTitle: articles[0]?.title,
      },
    });
  }, [articles, dataUpdatedAt, country, group, refreshSec]);

  useEffect(() => {
    if (paused || total < 2) return;
    const id = window.setTimeout(() => carouselRef.current?.next(), autoplayMs);
    return () => window.clearTimeout(id);
  }, [activeIndex, paused, total, autoplayMs, cycle]);

  // Scroll only the strip, never the page, so autoplay can't move a reader who scrolled away.
  useEffect(() => {
    const strip = stripRef.current;
    const item = strip?.children[activeIndex] as HTMLElement | undefined;
    if (!strip || !item) return;
    const itemRight = item.offsetLeft + item.offsetWidth;
    if (item.offsetLeft < strip.scrollLeft) {
      strip.scrollTo({ left: item.offsetLeft, behavior: "smooth" });
    } else if (itemRight > strip.scrollLeft + strip.clientWidth) {
      strip.scrollTo({ left: itemRight - strip.clientWidth, behavior: "smooth" });
    }
  }, [activeIndex]);

  const countryName = COUNTRIES[country].name;
  const audience = group ? TARGET_GROUP_LABELS[group] : "all target groups";

  return (
    <section
      data-tour="carousel"
      className="py-8 md:py-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        setCycle((c) => c + 1);
      }}
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <LiveBadge checkedAt={dataUpdatedAt} refreshSeconds={refreshSec} />
            <SolutionMarker topic="carousel" withLabel />
          </div>
          <h2 className="mt-4 font-display text-[40px] leading-none tracking-[-0.01em] text-ink md:text-[54px]">{title}</h2>
        </div>
        {total > 1 && (
          <div className="flex items-center gap-2">
            <span className="mr-2 font-mono text-xs tabular-nums text-ink-500">
              {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <Button
              shape="circle"
              size="large"
              icon={<ArrowLeftOutlined />}
              onClick={() => carouselRef.current?.prev()}
              aria-label="Previous article"
            />
            <Button
              shape="circle"
              size="large"
              icon={<ArrowRightOutlined />}
              onClick={() => carouselRef.current?.next()}
              aria-label="Next article"
            />
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid overflow-hidden rounded-[28px] bg-white shadow-soft lg:min-h-[460px] lg:grid-cols-[1.3fr_1fr]">
          <div className="h-60 animate-pulse bg-sand-200 sm:h-80 lg:h-auto" />
          <div className="p-8 md:p-10">
            <Skeleton active title={{ width: "80%" }} paragraph={{ rows: 5 }} />
          </div>
        </div>
      ) : isError ? (
        <Alert
          type="error"
          showIcon
          title="Couldn't load articles from Builder"
          description="Check the connection and the public API key, then try again."
          action={
            <Button size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      ) : total === 0 ? (
        <div className="flex min-h-[320px] items-center justify-center rounded-[28px] border border-dashed border-ink-300/70 bg-white/60 p-10">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-ink-500">
                No articles for {countryName} · {audience} yet.
                <br />
                Publish one in Builder and it appears here automatically.
              </span>
            }
          />
        </div>
      ) : (
        <>
          <Carousel
            key={filterKey}
            ref={carouselRef}
            effect="fade"
            dots={false}
            infinite
            beforeChange={(_, next) => setCurrent(next)}
          >
            {articles!.map((article, i) => (
              <Slide
                key={article.id}
                article={article}
                country={country}
                fresh={freshIds.includes(article.id)}
                eager={i === 0}
              />
            ))}
          </Carousel>

          {total > 1 && (
            <div
              ref={stripRef}
              className="relative mt-4 grid auto-cols-[minmax(230px,1fr)] grid-flow-col gap-3 overflow-x-auto pb-1 [scrollbar-width:none]"
            >
              {articles!.map((article, i) => {
                const active = i === activeIndex;
                return (
                  <button
                    key={article.id}
                    type="button"
                    onClick={() => carouselRef.current?.goTo(i)}
                    aria-label={`Show article ${i + 1}: ${article.title}`}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "relative flex items-center gap-3 overflow-hidden rounded-2xl p-2 pr-3 text-left ring-1 transition",
                      active ? "bg-white shadow-soft ring-ink/15" : "bg-white/55 ring-transparent hover:bg-white",
                    )}
                  >
                    <img
                      src={sizedImage(article.heroImage, 160)}
                      alt=""
                      className="h-12 w-12 shrink-0 rounded-xl object-cover"
                      loading="lazy"
                    />
                    <span className="min-w-0">
                      <span className="block text-[11px] font-medium text-ink-400">
                        {article.category}
                        {freshIds.includes(article.id) && <span className="text-coral-600"> · New</span>}
                        {article.featured && <span className="text-coral-600"> · Pinned</span>}
                      </span>
                      <span className="line-clamp-2 text-[13px] font-medium leading-snug text-ink">{article.title}</span>
                    </span>
                    {active && (
                      <span
                        key={`${activeIndex}-${cycle}`}
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-coral-500"
                        style={{
                          animation: `relay-progress ${autoplayMs}ms linear forwards`,
                          animationPlayState: paused ? "paused" : "running",
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}
    </section>
  );
}
