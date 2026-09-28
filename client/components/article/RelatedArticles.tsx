import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useViewer } from "@/context/viewer";
import { fetchArticles } from "@/lib/articles";
import { COUNTRIES, type CountryCode } from "@/lib/demo-data";
import { formatRelative } from "@/lib/format";
import { sizedImage } from "@/lib/images";

export function RelatedArticles({ country, excludeId }: { country: CountryCode; excludeId: string }) {
  const { targetGroup } = useViewer();
  const { data } = useQuery({
    queryKey: ["articles", country, targetGroup, "All", 4],
    queryFn: () => fetchArticles({ country, targetGroup, limit: 4 }),
  });

  const related = (data ?? []).filter((article) => article.id !== excludeId).slice(0, 3);
  if (!related.length) return null;

  return (
    <section className="relay-container mt-20">
      <div className="mx-auto max-w-5xl border-t border-border pt-12">
        <h2 className="font-display text-[36px] leading-none text-ink md:text-[44px]">
          More for you in {COUNTRIES[country].name}
        </h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((article) => (
            <Link key={article.id} to={`/${country}/articles/${article.id}`} className="group block">
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={sizedImage(article.heroImage, 800)}
                  alt=""
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <p className="mt-4 text-xs font-medium text-ink-500">
                {article.category} · {formatRelative(article.publishedAt)}
              </p>
              <h3 className="mt-2 font-display text-[24px] leading-[1.1] text-ink transition group-hover:text-pine-700">
                {article.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
