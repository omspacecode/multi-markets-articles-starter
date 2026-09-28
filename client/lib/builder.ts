export const BUILDER_API_KEY = import.meta.env.VITE_PUBLIC_BUILDER_KEY as string;

export const MODELS = {
  article: "bestseller-demo-article",
  service: "bestseller-demo-service",
  template: "bestseller-demo-article-template",
} as const;

export const MODEL_IDS: Record<keyof typeof MODELS, string> = {
  article: "9b49e61d4b4c430bb994bbe9c02499be",
  service: "c480045a247e4bd4818fc1177f16e896",
  template: "93be88d52e1a4dcaa63e835b896a1afc",
};

// Demo only: skips Builder's CDN cache so a publish shows up on the next poll. Don't ship this (see guide → Approval & publishing).
export const FRESH = { options: { cachebust: true } };

export const builderContentUrl = (contentId: string) => `https://builder.io/content/${contentId}`;

export const builderModelUrl = (modelId: string) => `https://builder.io/models/${modelId}`;

export const BUILDER_DOCS = {
  models: "https://www.builder.io/c/docs/models-intro",
  dataModels: "https://www.builder.io/c/docs/models-data",
  customFields: "https://www.builder.io/c/docs/custom-fields",
  querying: "https://www.builder.io/c/docs/querying",
  contentApi: "https://www.builder.io/c/docs/content-api",
  writeApi: "https://www.builder.io/c/docs/write-api",
  previewDataModels: "https://www.builder.io/c/docs/previewing-data-models",
  dynamicPreviewUrls: "https://www.builder.io/c/docs/dynamic-preview-urls",
  registerComponents: "https://www.builder.io/c/docs/custom-components-setup",
  governance: "https://www.builder.io/c/docs/content-governance",
  webhooks: "https://www.builder.io/c/docs/webhooks",
  customTargeting: "https://www.builder.io/c/docs/custom-targeting-attributes",
} as const;
