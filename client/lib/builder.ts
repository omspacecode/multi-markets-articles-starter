export const BUILDER_API_KEY = import.meta.env.VITE_PUBLIC_BUILDER_KEY as string;

export const MODELS = {
  homepage: "country-homepage",
  article: "news-article",
  banner: "audience-banner",
} as const;

export const MODEL_IDS: Record<keyof typeof MODELS, string> = {
  homepage: "a3e9dc84446f4398a07a74fe099ef9c0",
  article: "0d9be7f5074b47b1a07f9f4fd8737b86",
  banner: "4032a423b4204ed88b66a400ed99bae9",
};

export const builderContentUrl = (contentId: string) =>
  `https://builder.io/content/${contentId}`;

export const builderModelUrl = (modelId: string) =>
  `https://builder.io/models/${modelId}`;

export const BUILDER_DOCS = {
  targeting: "https://www.builder.io/c/docs/targeting",
  customTargeting: "https://www.builder.io/c/docs/custom-targeting-attributes",
  personalization: "https://www.builder.io/c/docs/targeting-cheatsheet",
  roles: "https://www.builder.io/c/docs/guides/roles-and-permissions",
  customRoles: "https://www.builder.io/c/docs/custom-roles",
  componentsOnly: "https://www.builder.io/c/docs/guides/components-only-mode",
  governance: "https://www.builder.io/c/docs/content-governance",
  registerComponents: "https://www.builder.io/c/docs/custom-components-setup",
  contentApi: "https://www.builder.io/c/docs/content-api",
  webhooks: "https://www.builder.io/c/docs/webhooks",
} as const;
