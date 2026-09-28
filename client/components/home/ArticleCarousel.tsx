import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Alert, App, Button, Carousel, Empty, Skeleton, type CarouselRef } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined, StarFilled, ThunderboltFilled } from "@ant-design/icons";
import { cn } from "@/lib/utils";
import { Flag } from "@/components/brand/Flag";
import { MarketTags } from "@/components/brand/MarketTags";
import { SolutionMarker } from "@/components/guide/SolutionMarker";
import { useMarkets } from "@/context/market-context";
import { useNow } from "@/hooks/use-now";
import { articlePath, articlesQuery, type Article } from "@/lib/content";
import { formatRelative, readingMinutes, secondsAgo } from "@/lib/format";
import { sizedImage } from "@/lib/images";
import { MARKET_LABELS } from "@/lib/markets";

const MAX_SLIDES = 8;
const AUTOPLAY_MS = 7000;
const REFRESH_SECONDS = 10;

function LiveBadge({ checkedAt }: { checkedAt: number }) {
  const now = useNow(1000);
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-ink-600 ring-1 ring-border">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-coral-500 animate-live-ping" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-coral-500" />
      </span>
      Updates automatically
      <span className="text-ink-400">
        · checked {checkedAt ? `${secondsAgo(checkedAt, now)}s ago` : "now"} · every {REFRESH_SECONDS}s
      </span>
    </span>
  );
}

function Slide({ article, fresh, eager }: { article: Article; fresh: boolean; eager: boolean }) {
  const href = articlePath(article);
  return (
    <div className="px-px">
      <article className="grid overflow-hidden rounded-[28px] bg-white shadow-soft ring-1 ring-black/[0.03] lg:min-h-[440px] lg:grid-cols-[1.3fr_1fr]">
        <Link
          to={href}
          tabIndex={-1}
          aria-hidden="true"
          className="group relative block h-60 overflow-hidden bg-sand-200 sm:h-80 lg:h-auto"
        >
          {article.heroImage && (
            <img
              src={sizedImage(article.heroImage, 1400)}
              alt=""
              loading={eager ? "eager" : "lazy"}
              className="absolute inset-0 h-full w-full object-cover transition duration-[1200ms] group-hover:scale-[1.03]"
            />
          )}
          <span className="absolute left-5 top-5 flex flex-wrap gap-2">
            {article.featured && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-ink shadow-sm">
                <StarFilled className="text-coral-500" /> Featured
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
            <span>{formatRelative(article.publishedAt)}</span>
            <span className="text-ink-300">·</span>
            <span>{readingMinutes(article.body)} min read</span>
          </div>
          <h3 className="mt-5 font-display text-[32px] leading-[1.03] tracking-[-0.01em] text-ink md:text-[40px]">
            <Link to={href} className="transition hover:text-pine-700">
              {article.title}
            </Link>
          </h3>
          <p className="mt-4 line-clamp-3 text-[15px] leading-relaxed text-ink-500">{article.summary}</p>
          <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-8">
            <MarketTags markets={article.markets} />
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

export function ArticleCarousel() {
  const { activeMarket } = useMarkets();
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const carouselRef = useRef<CarouselRef>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const seenIds = useRef<Set<string> | null>(null);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [freshIds, setFreshIds] = useState<string[]>([]);

  const { data, isLoading, isError, refetch, dataUpdatedAt } = useQuery({
    ...articlesQuery(activeMarket),
    refetchInterval: REFRESH_SECONDS * 1000,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const articles = useMemo(() => data?.slice(0, MAX_SLIDES) ?? [], [data]);
  const total = articles.length;
  const activeIndex = Math.min(current, Math.max(total - 1, 0));
  const marketName = MARKET_LABELS[activeMarket];

  useEffect(() => {
    seenIds.current = null;
    setFreshIds([]);
    setCurrent(0);
  }, [activeMarket]);

  // Anything missing from this market's first result was published while the page was open.
  useEffect(() => {
    if (!data) return;
    if (!seenIds.current) {
      seenIds.current = new Set(data.map((a) => a.id));
      return;
    }
    const seen = seenIds.current;
    const added = data.filter((a) => !seen.has(a.id));
    if (!added.length) return;

    added.forEach((a) => seen.add(a.id));
    setFreshIds((ids) => [...ids, ...added.map((a) => a.id)]);
    const first = added[0];
    const index = data.findIndex((a) => a.id === first.id);
    if (index < MAX_SLIDES) window.setTimeout(() => carouselRef.current?.goTo(index), 60);

    const key = `article-${first.id}`;
    notification.open({
      key,
      title: "New article published",
      description: (
        <div>
          <p className="font-medium text-ink">{first.title}</p>
          <p className="mt-1 text-xs text-ink-500">
            Added to the {MARKET_LABELS[activeMarket]} feed automatically. No homepage edit needed.
          </p>
        </div>
      ),
      icon: <ThunderboltFilled style={{ color: "#FF5C39" }} />,
      duration: 10,
      actions: (
        <Button
          type="primary"
          size="small"
          onClick={() => {
            notification.destroy(key);
            navigate(articlePath(first));
          }}
        >
          Read it
        </Button>
      ),
    });
  }, [data, activeMarket, navigate, notification]);

  useEffect(() => {
    if (paused || total < 2) return;
    const id = window.setTimeout(() => carouselRef.current?.next(), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [activeIndex, paused, total, cycle]);

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

  return (
    <section
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
            <LiveBadge checkedAt={dataUpdatedAt} />
            <SolutionMarker topic="publishing" withLabel />
          </div>
          <p className="eyebrow mt-5 flex items-center gap-2 text-ink-500">
            <Flag code={activeMarket} /> {marketName}
          </p>
          <h1 className="mt-2 font-display text-[40px] leading-none tracking-[-0.01em] text-ink md:text-[54px]">
            Latest news
          </h1>
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
        <div className="grid overflow-hidden rounded-[28px] bg-white shadow-soft lg:min-h-[440px] lg:grid-cols-[1.3fr_1fr]">
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
                No articles for {marketName} yet.
                <br />
                Publish one in Builder tagged {marketName} or All markets, and it appears here automatically.
              </span>
            }
          />
        </div>
      ) : (
        <>
          <Carousel
            key={activeMarket}
            ref={carouselRef}
            effect="fade"
            dots={false}
            infinite
            beforeChange={(_, next) => setCurrent(next)}
          >
            {articles.map((article, i) => (
              <Slide key={article.id} article={article} fresh={freshIds.includes(article.id)} eager={i === 0} />
            ))}
          </Carousel>

          {total > 1 && (
            <div
              ref={stripRef}
              className="relative mt-4 grid auto-cols-[minmax(230px,1fr)] grid-flow-col gap-3 overflow-x-auto pb-1 [scrollbar-width:none]"
            >
              {articles.map((article, i) => {
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
                    <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-sand-200">
                      {article.heroImage && (
                        <img src={sizedImage(article.heroImage, 160)} alt="" className="h-full w-full object-cover" loading="lazy" />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-medium text-ink-400">
                        {formatRelative(article.publishedAt)}
                        {freshIds.includes(article.id) && <span className="text-coral-600"> · New</span>}
                        {article.featured && <span className="text-coral-600"> · Featured</span>}
                      </span>
                      <span className="line-clamp-2 text-[13px] font-medium leading-snug text-ink">{article.title}</span>
                    </span>
                    {active && (
                      <span
                        key={`${activeIndex}-${cycle}`}
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-coral-500"
                        style={{
                          animation: `carousel-progress ${AUTOPLAY_MS}ms linear forwards`,
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
