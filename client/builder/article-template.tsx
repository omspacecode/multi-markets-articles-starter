import { createContext, useContext, useMemo } from "react";
import DOMPurify from "dompurify";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PictureOutlined } from "@ant-design/icons";
import type { RegisteredComponent } from "@builder.io/sdk-react";
import { MarketTags } from "@/components/brand/MarketTags";
import { useMarkets } from "@/context/market-context";
import { MODELS } from "@/lib/builder";
import { articlePath, articlesQuery, type Article } from "@/lib/content";
import { formatDate, formatRelative, readingMinutes } from "@/lib/format";
import { sizedImage } from "@/lib/images";
import { MARKET_LABELS } from "@/lib/markets";
import { cn } from "@/lib/utils";

/** The article being shown; the template's components read their fields from here. */
export const ArticleContext = createContext<Article | null>(null);

function HeroImage({ src, className }: { src: string; className?: string }) {
  if (src) return <img src={sizedImage(src, 2000)} alt="" className={cn("w-full rounded-[28px] object-cover", className)} />;
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center gap-2 rounded-[28px] border border-dashed border-ink-300 bg-white/60 text-ink-400",
        className,
      )}
    >
      <PictureOutlined className="text-3xl" />
      <span className="text-sm">Hero image</span>
    </div>
  );
}

export function ArticleHero({ layout = "stacked" }: { layout?: "stacked" | "split" }) {
  const article = useContext(ArticleContext);
  if (!article) return null;

  const intro = (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-ink-400">
        <Link to="/" className="transition hover:text-ink">
          Home
        </Link>
        <span className="mx-1.5 text-ink-300">/</span>
        News
      </nav>
      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-ink-500">
        <MarketTags markets={article.markets} />
        <span>{formatDate(article.publishedAt)}</span>
        <span className="text-ink-300">·</span>
        <span>{readingMinutes(article.body)} min read</span>
      </div>
      <h1 className="mt-5 font-display text-[44px] leading-[1] tracking-[-0.02em] text-ink sm:text-[56px] md:text-[64px]">
        {article.title || <span className="text-ink-300">Untitled article</span>}
      </h1>
      {article.summary && <p className="mt-6 text-xl leading-relaxed text-ink-500">{article.summary}</p>}
    </>
  );

  if (layout === "split") {
    return (
      <header className="more-container grid items-center gap-10 pt-8 md:pt-12 lg:grid-cols-2 lg:gap-14">
        <div className="animate-fade-up">{intro}</div>
        <HeroImage src={article.heroImage} className="aspect-[4/3]" />
      </header>
    );
  }

  return (
    <header className="more-container pt-8 md:pt-12">
      <div className="mx-auto max-w-3xl animate-fade-up">{intro}</div>
      <HeroImage src={article.heroImage} className="mx-auto mt-10 aspect-[16/9] max-w-5xl" />
    </header>
  );
}

const containsHtml = (text: string) => /<[a-z][\s\S]*>/i.test(text);

export function ArticleBody() {
  const article = useContext(ArticleContext);
  const body = article?.body ?? "";
  // Older entries hold plain text from before `body` became a rich text field.
  const html = useMemo(() => (containsHtml(body) ? DOMPurify.sanitize(body) : null), [body]);
  if (!article) return null;

  const paragraphs = body
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="more-container mt-12">
      {html ? (
        <div className="article-body mx-auto max-w-[680px]" dangerouslySetInnerHTML={{ __html: html }} />
      ) : paragraphs.length ? (
        <div className="article-body mx-auto max-w-[680px]">
          {paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      ) : (
        <p className="article-body mx-auto max-w-[680px] text-ink-300">The article body appears here.</p>
      )}
    </div>
  );
}

export function RelatedArticles({ title, limit = 3 }: { title?: string; limit?: number }) {
  const article = useContext(ArticleContext);
  const { activeMarket } = useMarkets();
  const { data } = useQuery(articlesQuery(activeMarket));
  const count = Math.min(6, Math.max(1, Number(limit) || 3));
  const related = (data ?? []).filter((item) => item.id !== article?.id).slice(0, count);
  if (!related.length) return null;

  return (
    <section className="more-container mt-20">
      <div className="mx-auto max-w-5xl border-t border-border pt-12">
        <h2 className="font-display text-[36px] leading-none text-ink md:text-[44px]">
          {(title || "More for {market}").replace("{market}", MARKET_LABELS[activeMarket])}
        </h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <Link key={item.id} to={articlePath(item)} className="group block">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-sand-200">
                {item.heroImage && (
                  <img
                    src={sizedImage(item.heroImage, 800)}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                )}
              </div>
              <p className="mt-4 text-xs font-medium text-ink-500">{formatRelative(item.publishedAt)}</p>
              <h3 className="mt-2 font-display text-[24px] leading-[1.1] text-ink transition group-hover:text-pine-700">
                {item.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export const articleTemplateComponents: RegisteredComponent[] = [
  {
    component: ArticleHero,
    name: "Article Hero",
    models: [MODELS.template],
    inputs: [
      {
        name: "layout",
        type: "text",
        enum: [
          { label: "Image below the title", value: "stacked" },
          { label: "Image beside the title", value: "split" },
        ],
        defaultValue: "stacked",
        helperText: "Applies to every article.",
      },
    ],
  },
  {
    component: ArticleBody,
    name: "Article Body",
    models: [MODELS.template],
  },
  {
    component: RelatedArticles,
    name: "Related Articles",
    models: [MODELS.template],
    inputs: [
      {
        name: "title",
        type: "text",
        defaultValue: "More for {market}",
        helperText: "{market} becomes the reader's active market.",
      },
      { name: "limit", friendlyName: "Number of articles", type: "number", defaultValue: 3, min: 1, max: 6 },
    ],
  },
];
