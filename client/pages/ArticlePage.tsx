import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Content, isEditing, isPreviewing, subscribeToEditor, type BuilderContent } from "@builder.io/sdk-react";
import { Button, Result, Skeleton } from "antd";
import { EyeOutlined, ExportOutlined } from "@ant-design/icons";
import {
  ArticleBody,
  ArticleContext,
  ArticleHero,
  RelatedArticles,
  articleTemplateComponents,
} from "@/builder/article-template";
import { SolutionMarker } from "@/components/guide/SolutionMarker";
import { useGuide } from "@/context/guide-context";
import { useMarkets } from "@/context/market-context";
import { BUILDER_API_KEY, MODELS, builderContentUrl } from "@/lib/builder";
import { articlesQuery, fetchArticle, templateQuery, toArticle, type Article } from "@/lib/content";

function ArticleSkeleton() {
  return (
    <div className="more-container pt-12">
      <div className="mx-auto max-w-3xl">
        <Skeleton active title={{ width: "90%" }} paragraph={{ rows: 5 }} />
      </div>
      <div className="mx-auto mt-10 aspect-[16/9] max-w-5xl animate-pulse rounded-[28px] bg-sand-200" />
    </div>
  );
}

function BuilderLink({ id, children }: { id: string; children: string }) {
  return (
    <a
      href={builderContentUrl(id)}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 font-medium text-pine-700 hover:bg-pine-50"
    >
      {children} <ExportOutlined className="text-[10px]" />
    </a>
  );
}

function ArticleBar({ article, template }: { article: Article; template: BuilderContent | null | undefined }) {
  const { markersVisible } = useGuide();
  if (!article.isDraft && !markersVisible) return null;

  return (
    <div className="more-container flex flex-wrap items-center gap-2 pt-6 text-xs">
      {article.isDraft && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-coral-500 px-3 py-1 font-semibold text-white">
          <EyeOutlined /> Draft preview · not live yet
        </span>
      )}
      {markersVisible && (
        <>
          <SolutionMarker topic="editing" />
          <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-ink-300 bg-white/70 px-3 py-1 font-mono text-[11px] text-ink-500">
            <span className="h-1.5 w-1.5 rounded-full bg-pine-400" />
            fields: {MODELS.article} · design: {MODELS.template}
          </span>
          {article.id && <BuilderLink id={article.id}>Edit article</BuilderLink>}
          {template?.id && <BuilderLink id={template.id}>Edit template</BuilderLink>}
        </>
      )}
    </div>
  );
}

function TemplateContent({ template }: { template: BuilderContent | null | undefined }) {
  return (
    <Content
      model={MODELS.template}
      content={template ?? null}
      apiKey={BUILDER_API_KEY}
      customComponents={articleTemplateComponents}
    />
  );
}

export default function ArticlePage() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const inBuilder = isEditing() || isPreviewing();
  const overrideId = inBuilder
    ? new URLSearchParams(window.location.search).get(`builder.overrides.${MODELS.article}`)
    : null;
  const [editorContent, setEditorContent] = useState<BuilderContent | null>(null);
  const [subscribed, setSubscribed] = useState(!inBuilder);

  // The SDK announces a single model to the editor per page, so subscribe before the template's <Content> mounts.
  useEffect(() => {
    if (!inBuilder) return;
    const unsubscribe = subscribeToEditor({
      model: MODELS.article,
      apiKey: BUILDER_API_KEY,
      callback: setEditorContent,
    });
    setSubscribed(true);
    return unsubscribe;
  }, [inBuilder]);

  const articleKey = overrideId ?? slug;
  const { data: fetched, isLoading } = useQuery({
    queryKey: ["article", articleKey],
    queryFn: () => fetchArticle(articleKey, inBuilder),
  });
  const { data: template, isLoading: templateLoading } = useQuery(templateQuery);
  const article = editorContent ? toArticle(editorContent) : fetched;

  useEffect(() => {
    if (article?.title) document.title = `${article.title} · More`;
  }, [article?.title]);

  if (!article && !isLoading && !inBuilder) {
    return (
      <div className="more-container py-16">
        <Result
          status="404"
          title="Article not found"
          subTitle="It may have been unpublished in Builder, or the link is out of date."
          extra={
            <Button type="primary" onClick={() => navigate("/")}>
              Back to the homepage
            </Button>
          }
        />
      </div>
    );
  }

  if (!article || templateLoading || !subscribed) return <ArticleSkeleton />;

  return (
    <article className="pb-4">
      <ArticleBar article={article} template={template} />
      <ArticleContext.Provider value={article}>
        {template ? (
          <TemplateContent template={template} />
        ) : (
          <>
            <ArticleHero />
            <ArticleBody />
            <RelatedArticles />
          </>
        )}
      </ArticleContext.Provider>
    </article>
  );
}

export function TemplatePreviewPage() {
  const { activeMarket } = useMarkets();
  const { data: articles, isLoading } = useQuery(articlesQuery(activeMarket));
  const { data: template, isLoading: templateLoading } = useQuery(templateQuery);
  const sample = articles?.[0] ?? null;

  useEffect(() => {
    document.title = "Article template · More";
  }, []);

  if (isLoading || templateLoading) return <ArticleSkeleton />;

  return (
    <article className="pb-4">
      <div className="more-container pt-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-ink-300 bg-white/70 px-3 py-1 text-xs text-ink-500">
          <span className="h-1.5 w-1.5 rounded-full bg-pine-400" />
          Article template preview · sample: {sample?.title ?? "no published article yet"}
        </span>
      </div>
      <ArticleContext.Provider value={sample}>
        <TemplateContent template={template} />
      </ArticleContext.Provider>
    </article>
  );
}
