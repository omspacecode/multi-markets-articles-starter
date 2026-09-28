import { fetchEntries, fetchOneEntry, type BuilderContent } from "@builder.io/sdk-react";
import { BUILDER_API_KEY, MODELS } from "./builder";

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  heroImage: string;
  category: string;
  countries: string[];
  targetGroups: string[];
  author: string;
  body: string;
  featured: boolean;
  publishedAt: number | null;
}

export interface ArticleFilter {
  country: string;
  /** `null` shows articles for every target group. */
  targetGroup: string | null;
  category?: string;
  limit?: number;
}

const pluck = (list: unknown, key: string): string[] =>
  Array.isArray(list)
    ? list.map((item) => (item as Record<string, unknown>)?.[key]).filter((v): v is string => typeof v === "string")
    : [];

export function toArticle(content: BuilderContent): NewsArticle {
  const data = content.data ?? {};
  const createdDate = (content as { createdDate?: number }).createdDate;
  return {
    id: content.id ?? "",
    title: data.title ?? "",
    excerpt: data.excerpt ?? "",
    heroImage: data.heroImage ?? "",
    category: data.category ?? "News",
    countries: pluck(data.countries, "country"),
    targetGroups: pluck(data.targetGroups, "group"),
    author: data.author ?? "",
    body: data.body ?? "",
    featured: Boolean(data.featured),
    publishedAt: content.firstPublished ?? createdDate ?? null,
  };
}

export function buildArticleQuery({ country, targetGroup, category }: ArticleFilter) {
  const query: Record<string, unknown> = {
    "data.countries.country": { $in: [country, "global"] },
  };
  if (targetGroup) {
    query["data.targetGroups.group"] = { $in: [targetGroup, "all"] };
  }
  if (category && category !== "All") {
    query["data.category"] = category;
  }
  return query;
}

/** Featured articles are pinned first; everything else is newest first. */
export const sortArticles = (articles: NewsArticle[]) =>
  [...articles].sort(
    (a, b) => Number(b.featured) - Number(a.featured) || (b.publishedAt ?? 0) - (a.publishedAt ?? 0),
  );

export async function fetchArticles(filter: ArticleFilter): Promise<NewsArticle[]> {
  const limit = filter.limit ?? 8;
  const results = await fetchEntries({
    model: MODELS.article,
    apiKey: BUILDER_API_KEY,
    query: buildArticleQuery(filter),
    sort: { createdDate: -1 },
    limit: Math.max(limit, 12),
    cacheSeconds: 5,
    staleCacheSeconds: 10,
  });
  return sortArticles((results ?? []).map(toArticle)).slice(0, limit);
}

export async function fetchArticle(id: string): Promise<NewsArticle | null> {
  const content = await fetchOneEntry({
    model: MODELS.article,
    apiKey: BUILDER_API_KEY,
    query: { id },
  });
  return content ? toArticle(content) : null;
}
