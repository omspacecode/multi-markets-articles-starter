import { queryOptions } from "@tanstack/react-query";
import { fetchEntries, fetchOneEntry, type BuilderContent } from "@builder.io/sdk-react";
import { BUILDER_API_KEY, FRESH, MODELS } from "./builder";
import type { MarketCode } from "./markets";

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  heroImage: string;
  body: string;
  markets: string[];
  featured: boolean;
  publishedAt: number | null;
  isDraft: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
  markets: string[];
  order: number;
}

const toStrings = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

// Date fields hold a number when written through the API and a date string when picked in the editor.
function toTimestamp(value: unknown): number | null {
  if (typeof value === "number") return value;
  if (typeof value !== "string" || !value) return null;
  const time = Date.parse(value);
  return Number.isNaN(time) ? null : time;
}

export function toArticle(content: BuilderContent): Article {
  const data = content.data ?? {};
  return {
    id: content.id ?? "",
    title: data.title ?? "",
    slug: data.slug ?? "",
    summary: data.summary ?? "",
    heroImage: data.heroImage ?? "",
    body: data.body ?? "",
    markets: toStrings(data.markets),
    featured: Boolean(data.featured),
    publishedAt: toTimestamp(data.publishedDate) ?? content.firstPublished ?? null,
    isDraft: content.published === "draft",
  };
}

function toService(content: BuilderContent): Service {
  const data = content.data ?? {};
  return {
    id: content.id ?? "",
    title: data.title ?? "",
    description: data.description ?? "",
    icon: data.icon ?? "",
    link: data.link ?? "",
    markets: toStrings(data.markets),
    order: typeof data.order === "number" ? data.order : 99,
  };
}

export const articlePath = (article: Pick<Article, "slug" | "id">) =>
  `/articles/${encodeURIComponent(article.slug || article.id)}`;

/** The only link between a customer and content: entries tagged with the active market or "All markets". */
export const marketQuery = (market: MarketCode) => ({ "data.markets": { $in: [market, "global"] } });

const byNewest = (a: Article, b: Article) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0);

export async function fetchArticles(market: MarketCode): Promise<Article[]> {
  const results = await fetchEntries({
    model: MODELS.article,
    apiKey: BUILDER_API_KEY,
    query: marketQuery(market),
    sort: { createdDate: -1 },
    limit: 24,
    ...FRESH,
  });
  return results.map(toArticle).sort(byNewest);
}

export async function fetchArticle(slugOrId: string, includeUnpublished = false): Promise<Article | null> {
  const fetchBy = (query: Record<string, string>) =>
    fetchOneEntry({ model: MODELS.article, apiKey: BUILDER_API_KEY, query, includeUnpublished, ...FRESH });
  const content = (await fetchBy({ "data.slug": slugOrId })) ?? (await fetchBy({ id: slugOrId }));
  return content ? toArticle(content) : null;
}

export async function fetchServices(market: MarketCode): Promise<Service[]> {
  const results = await fetchEntries({
    model: MODELS.service,
    apiKey: BUILDER_API_KEY,
    query: marketQuery(market),
    limit: 24,
    ...FRESH,
  });
  return results.map(toService).sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export const fetchTemplate = () => fetchOneEntry({ model: MODELS.template, apiKey: BUILDER_API_KEY, ...FRESH });

export const articlesQuery = (market: MarketCode) =>
  queryOptions({ queryKey: ["articles", market], queryFn: () => fetchArticles(market) });

export const servicesQuery = (market: MarketCode) =>
  queryOptions({ queryKey: ["services", market], queryFn: () => fetchServices(market) });

export const templateQuery = queryOptions({ queryKey: ["article-template"], queryFn: fetchTemplate });
