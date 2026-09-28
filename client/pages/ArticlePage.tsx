import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button, Result, Skeleton } from "antd";
import { ArticleTemplate } from "@/components/article/ArticleTemplate";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import { fetchArticle } from "@/lib/articles";
import { isCountryCode } from "@/lib/demo-data";
import NotFound from "./NotFound";

export default function ArticlePage() {
  const { country, articleId = "" } = useParams();
  const navigate = useNavigate();

  const { data: article, isLoading, isError } = useQuery({
    queryKey: ["article", articleId],
    queryFn: () => fetchArticle(articleId),
    enabled: !!articleId,
  });

  useEffect(() => {
    if (article?.title) document.title = `${article.title} · Relay`;
  }, [article?.title]);

  if (!isCountryCode(country)) return <NotFound />;

  if (isLoading) {
    return (
      <div className="relay-container pt-12">
        <div className="mx-auto max-w-3xl">
          <Skeleton active title={{ width: "90%" }} paragraph={{ rows: 6 }} />
        </div>
        <div className="mx-auto mt-10 aspect-[16/9] max-w-5xl animate-pulse rounded-[28px] bg-sand-200" />
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="relay-container py-16">
        <Result
          status="404"
          title="Article not found"
          subTitle="It may have been unpublished in Builder, or the link is out of date."
          extra={
            <Button type="primary" onClick={() => navigate(`/${country}`)}>
              Back to the homepage
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <>
      <ArticleTemplate article={article} country={country} />
      <RelatedArticles country={country} excludeId={article.id} />
    </>
  );
}
