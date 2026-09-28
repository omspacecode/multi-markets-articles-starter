import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchOneEntry,
  isEditing,
  isPreviewing,
  subscribeToEditor,
  type BuilderContent,
} from "@builder.io/sdk-react";
import { Button, Result } from "antd";
import { EyeOutlined, ExportOutlined } from "@ant-design/icons";
import { ArticleTemplate } from "@/components/article/ArticleTemplate";
import { usePersona } from "@/context/persona-context";
import { toArticle, type NewsArticle } from "@/lib/articles";
import { BUILDER_API_KEY, MODEL_IDS, MODELS, builderModelUrl } from "@/lib/builder";
import { isCountryCode } from "@/lib/demo-data";

const EMPTY_ARTICLE: NewsArticle = {
  id: "",
  title: "",
  excerpt: "",
  heroImage: "",
  category: "News",
  countries: [],
  targetGroups: [],
  author: "",
  body: "",
  featured: false,
  publishedAt: null,
};

export default function ArticlePreview() {
  const { persona } = usePersona();
  const navigate = useNavigate();
  const inBuilder = isEditing() || isPreviewing();
  const [content, setContent] = useState<BuilderContent | null>(null);

  useEffect(() => {
    if (!inBuilder) return;
    let cancelled = false;

    // The editor adds builder.overrides.<model>=<id>; the SDK forwards it, so this returns the entry being edited.
    if (window.location.search.includes(`builder.overrides.${MODELS.article}`)) {
      fetchOneEntry({ model: MODELS.article, apiKey: BUILDER_API_KEY }).then((entry) => {
        if (!cancelled && entry) setContent((existing) => existing ?? entry);
      });
    }

    const unsubscribe = subscribeToEditor({
      model: MODELS.article,
      apiKey: BUILDER_API_KEY,
      callback: (updated) => setContent(updated),
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [inBuilder]);

  if (!inBuilder) {
    return (
      <div className="relay-container py-16">
        <Result
          icon={<EyeOutlined className="!text-pine-700" />}
          title="Live preview for the News article model"
          subTitle="Builder loads this page while an author edits an article, and it updates as they type. Open any News article in Builder to see it in action."
          extra={[
            <Button
              key="model"
              type="primary"
              icon={<ExportOutlined />}
              href={builderModelUrl(MODEL_IDS.article)}
              target="_blank"
            >
              Open the News article model
            </Button>,
            <Button key="home" onClick={() => navigate(`/${persona.countries[0]}`)}>
              Back to the homepage
            </Button>,
          ]}
        />
      </div>
    );
  }

  const article = content ? toArticle(content) : EMPTY_ARTICLE;
  const country = article.countries.find(isCountryCode) ?? persona.countries[0];

  return <ArticleTemplate article={article} country={country} preview />;
}
