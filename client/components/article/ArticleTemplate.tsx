import { useMemo } from "react";
import DOMPurify from "dompurify";
import { Link } from "react-router-dom";
import { Avatar, Breadcrumb } from "antd";
import { ExportOutlined, PictureOutlined } from "@ant-design/icons";
import { SolutionMarker } from "@/components/guide/SolutionMarker";
import { useGuide } from "@/context/guide-context";
import type { NewsArticle } from "@/lib/articles";
import { builderContentUrl } from "@/lib/builder";
import { COUNTRIES, initialsOf, type CountryCode } from "@/lib/demo-data";
import { formatDate, readingMinutes } from "@/lib/format";
import { sizedImage } from "@/lib/images";
import { AudienceLine, CategoryPill } from "./ArticleMeta";

const TEMPLATE_FIELDS = ["Title", "Excerpt", "Hero image", "Category", "Countries", "Target groups", "Author", "Body", "Featured"];

function TemplateNote({ articleId }: { articleId: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow text-ink-400">How this page is built</p>
        <SolutionMarker topic="templates" />
      </div>
      <p className="mt-3 font-display text-[26px] leading-[1.1] text-ink">One fixed template, filled from nine fields.</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-500">
        Authors fill in the News article form in Builder. Layout, typography and spacing live in code, so they can't
        change per article.
      </p>
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {TEMPLATE_FIELDS.map((field) => (
          <li key={field} className="rounded-md bg-sand-100 px-2 py-1 font-mono text-[11px] text-ink-600">
            {field}
          </li>
        ))}
      </ul>
      {articleId && (
        <a
          href={builderContentUrl(articleId)}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-pine-700 hover:underline"
        >
          Open this article in Builder <ExportOutlined className="text-xs" />
        </a>
      )}
    </div>
  );
}

interface ArticleTemplateProps {
  article: NewsArticle;
  country: CountryCode;
  /** Shows placeholders for empty fields while an author is still writing. */
  preview?: boolean;
}

export function ArticleTemplate({ article, country, preview = false }: ArticleTemplateProps) {
  const { markersVisible } = useGuide();
  const html = useMemo(() => DOMPurify.sanitize(article.body || ""), [article.body]);
  const countryName = COUNTRIES[country].name;

  return (
    <article className="pb-4 pt-8 md:pt-12">
      <div className="relay-container">
        <div className="mx-auto max-w-3xl animate-fade-up">
          <Breadcrumb
            items={[
              { title: <Link to={`/${country}`}>{countryName} homepage</Link> },
              { title: "News" },
              { title: article.category },
            ]}
          />
          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-ink-500">
            <CategoryPill category={article.category} />
            <span>{formatDate(article.publishedAt)}</span>
            <span className="text-ink-300">·</span>
            <span>{readingMinutes(article.body)} min read</span>
          </div>
          <h1 className="mt-5 font-display text-[44px] leading-[1] tracking-[-0.02em] text-ink sm:text-[60px] md:text-[72px]">
            {article.title || <span className="text-ink-300">{preview ? "Start with a title…" : "Untitled"}</span>}
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-ink-500">
            {article.excerpt || (preview && <span className="text-ink-300">The excerpt appears here and on the carousel.</span>)}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-y border-border py-4">
            <div className="flex items-center gap-3">
              <Avatar size={40} style={{ backgroundColor: "#0F4C3F", fontWeight: 600 }}>
                {article.author ? initialsOf(article.author) : "?"}
              </Avatar>
              <div>
                <p className="text-sm font-medium text-ink">{article.author || "Author name"}</p>
                <p className="text-xs text-ink-500">Relay Internal Communications</p>
              </div>
            </div>
            <AudienceLine groups={article.targetGroups} countries={article.countries} className="sm:items-end" />
          </div>
        </div>
      </div>

      <div className="relay-container mt-10">
        <figure className="mx-auto max-w-5xl">
          {article.heroImage ? (
            <img
              src={sizedImage(article.heroImage, 2000)}
              alt=""
              className="aspect-[16/9] w-full rounded-[28px] object-cover"
            />
          ) : (
            <div className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-[28px] border border-dashed border-ink-300 bg-white/60 text-ink-400">
              <PictureOutlined className="text-3xl" />
              <span className="text-sm">Hero image</span>
            </div>
          )}
        </figure>
      </div>

      <div className="relay-container mt-12">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
          {html ? (
            <div className="article-body max-w-[680px]" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <p className="article-body text-ink-300">The article body appears here.</p>
          )}
          {markersVisible && (
            <aside className="lg:sticky lg:top-36 lg:self-start">
              <TemplateNote articleId={article.id} />
            </aside>
          )}
        </div>
      </div>
    </article>
  );
}
