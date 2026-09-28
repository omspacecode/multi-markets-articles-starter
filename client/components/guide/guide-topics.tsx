import type { ReactNode } from "react";
import { BUILDER_DOCS, MODEL_IDS, builderModelUrl } from "@/lib/builder";
import type { MarkerTopic } from "@/context/guide-context";

export interface GuideOption {
  option: string;
  bestFor: string;
  howItWorks: string;
  inDemo: string;
}

export interface GuideTopic {
  heard: string;
  answer: string;
  tryIt: ReactNode[];
  setup: { title: string; description: ReactNode }[];
  worthKnowing?: ReactNode[];
  options?: GuideOption[];
  code: { title: string; code: string };
  links: { label: string; href: string }[];
}

export interface Requirement {
  heard: string;
  recommendation: string;
  inDemo: string;
  topic?: MarkerTopic;
}

const Code = ({ children }: { children: ReactNode }) => <code className="inline-code">{children}</code>;

const MODEL_LINKS = {
  article: { label: "Model: bestseller-demo-article", href: builderModelUrl(MODEL_IDS.article) },
  service: { label: "Model: bestseller-demo-service", href: builderModelUrl(MODEL_IDS.service) },
  template: { label: "Model: bestseller-demo-article-template", href: builderModelUrl(MODEL_IDS.template) },
};

export const OVERVIEW_GOAL =
  "Show every signed-in customer the articles and services for their markets, let editors tag markets without code, preview in the real design, and approve content before it goes live.";

export const REQUIREMENTS: Requirement[] = [
  {
    heard: "Page, section and data models; custom components in the editor",
    recommendation:
      "Data models for articles and services, because they carry the market field. A section model for the article design, built from registered components. Page models aren't needed yet.",
    inDemo: "The three models in the footer",
    topic: "editing",
  },
  {
    heard: "Different articles and services per market. Markets aren't languages: Germany and Austria are separate",
    recommendation: 'A Markets multi-select on each model, queried with data.markets $in [market, "global"]. Language stays a separate dimension.',
    inDemo: "Germany and Austria show different services and articles",
    topic: "markets",
  },
  {
    heard: "Some customers belong to several markets; a page per market breaks down",
    recommendation: "Tag one entry with several markets and run one query per active market. No page per market combination.",
    inDemo: "Winterlieferungen and SEPA direct debit appear on both DE and AT",
    topic: "markets",
  },
  {
    heard: "Markets are known at login from company name or customer group",
    recommendation: "Resolve markets[] from the session. The market field is the only bridge; no user-to-article binding.",
    inDemo: "Customer markets control and the data-flow strip",
    topic: "markets",
  },
  {
    heard: "A market tab switcher in code, hidden for single-market customers",
    recommendation: "Tabs render only with two or more markets. The active market lives in app state. Reuse the navigation bar.",
    inDemo: "Untick down to one market and the tabs disappear",
    topic: "tabs",
  },
  {
    heard: "Editors add markets to each entry without code",
    recommendation: "A required multi-select (Tags with Enum options) with readable labels and helper text.",
    inDemo: "Open any article or service in Builder",
    topic: "editing",
  },
  {
    heard: "Side-by-side preview in the predefined design",
    recommendation: "A dynamic preview URL opens /articles/<slug>, which renders the draft through the template and updates as you type.",
    inDemo: "Type in Builder and watch the preview",
    topic: "editing",
  },
  {
    heard: "Draft, review and approval before content goes public",
    recommendation: "Rules and Workflows under Content Governance. Only published entries reach the Content API.",
    inDemo: "Drafts never show on the site",
    topic: "publishing",
  },
  {
    heard: "New articles should show up quickly (previous call)",
    recommendation: "A newest-first feed that refreshes itself. In production, a publish webhook refreshes the More backend cache.",
    inDemo: "Publish, and a new slide appears with a notification",
    topic: "publishing",
  },
  {
    heard: "Recent ServiceNow claims on the homepage (previous call)",
    recommendation: "A registered component that calls a More backend endpoint, so ServiceNow credentials stay server-side.",
    inDemo: "Covered in this guide",
    topic: "editing",
  },
  {
    heard: "Dev work first, content setup second",
    recommendation: "See the suggested path below.",
    inDemo: "This overview",
  },
];

export const SUGGESTED_PATH: { owner: string; title: string; description: ReactNode }[] = [
  {
    owner: "Dev",
    title: "Resolve markets at login",
    description: "Return the customer's market codes on the session, from the company name or customer group More already has.",
  },
  {
    owner: "Dev",
    title: "Add the market tabs",
    description: "Reuse the navigation bar, hide it for single-market customers and keep the active market in app state.",
  },
  {
    owner: "Dev",
    title: "Query Builder by market",
    description: (
      <>
        Add <Code>{'data.markets: { $in: [activeMarket, "global"] }'}</Code> to the article and service queries, and check
        the market data flows through.
      </>
    ),
  },
  {
    owner: "Content",
    title: "Add the Markets field to existing models",
    description: "Add the multi-select, copy existing values across, then hide the old field once it's signed off.",
  },
  {
    owner: "Content",
    title: "Tag entries and switch on approval",
    description: "Content creators tag each entry with its markets; the approval rule applies before anything is published.",
  },
];

export const OPEN_DECISIONS: string[] = [
  'The final market code list, and whether to add regional groups (e.g. DACH, Nordics) next to "All markets".',
  "Language handling: localized fields, or one entry per language.",
  'The multi-market feed: active tab only, or also an "All my markets" view.',
  "The approval matrix per market, and the Rules and Workflows setup (depends on plan availability).",
  "The freshness target: the CDN's stale-while-revalidate, or a backend cache refreshed by a publish webhook.",
  "Which existing models get the Markets field, and how their entries are migrated.",
];

export const RESOURCES: { label: string; href: string }[] = [
  { label: "Intro to models", href: BUILDER_DOCS.models },
  { label: "Data models", href: BUILDER_DOCS.dataModels },
  { label: "Custom fields", href: BUILDER_DOCS.customFields },
  { label: "Querying cheatsheet", href: BUILDER_DOCS.querying },
  { label: "Content API", href: BUILDER_DOCS.contentApi },
  { label: "Live preview for data models", href: BUILDER_DOCS.previewDataModels },
  { label: "Dynamic preview URLs", href: BUILDER_DOCS.dynamicPreviewUrls },
  { label: "Register custom components", href: BUILDER_DOCS.registerComponents },
  { label: "Rules and Workflows", href: BUILDER_DOCS.governance },
  { label: "Webhooks", href: BUILDER_DOCS.webhooks },
  { label: "Write API", href: BUILDER_DOCS.writeApi },
  { label: "Custom targeting attributes", href: BUILDER_DOCS.customTargeting },
];

export const GUIDE_TOPICS: Record<MarkerTopic, GuideTopic> = {
  markets: {
    heard:
      "Customers should see different articles and services per market. Markets are countries, not languages: Germany and Austria both speak German but are separate markets. Some customers belong to several markets.",
    answer:
      "Tag content, not pages. Add a Markets multi-select to the article and service models, and ask Builder at runtime for entries tagged with the active market or \"All markets\". One entry can serve several markets, so you never build a page per market or per market combination.",
    tryIt: [
      <>Switch between the Germany and Austria tabs. Both are German-speaking, but the services and articles differ.</>,
      <>
        The <b>Winterlieferungen</b> article and the <b>SEPA direct debit</b> tile are tagged Germany + Austria, so they
        appear on both tabs.
      </>,
      <>With markers on, the strip at the top of the homepage shows the flow: markets from login → query → results.</>,
    ],
    setup: [
      {
        title: "Agree on one market code list",
        description: (
          <>
            Use the same codes in the login data, the field's options and any targeting attribute: <Code>dk</Code>,{" "}
            <Code>de</Code>, <Code>at</Code>, <Code>nl</Code> and so on, plus <Code>global</Code> for "All markets".
          </>
        ),
      },
      {
        title: "Add a Markets field to each model",
        description: (
          <>
            Type <b>Tags</b> with Enum options, which is Builder's multi-select. Make it required and give each option a
            readable label. Here it's on <Code>bestseller-demo-article</Code> and <Code>bestseller-demo-service</Code>.
          </>
        ),
      },
      {
        title: "Query by the active market",
        description: (
          <>
            Filter every list with <Code>{'data.markets: { $in: [activeMarket, "global"] }'}</Code>. The API returns
            published entries only.
          </>
        ),
      },
      {
        title: "Migrate existing entries",
        description: (
          <>
            Add the new field, copy the values with the Write API, then hide the old field and remove it later. This demo
            copied <Code>market</Code> into <Code>markets</Code> on the nine existing articles and hid the old field.
          </>
        ),
      },
    ],
    options: [
      {
        option: "Markets field + query",
        bestFor: "Lists that grow: articles, services, FAQs",
        howItWorks: "Multi-select on the entry, $in query at runtime",
        inDemo: "Used",
      },
      {
        option: "Page per market",
        bestFor: "Markets with nothing in common",
        howItWorks: "One page targeted per market",
        inDemo: "Breaks down for multi-market customers",
      },
      {
        option: "Personalization container",
        bestFor: "One-off variants, e.g. a market-only campaign hero",
        howItWorks: "Variants inside one entry, picked by a targeting attribute",
        inDemo: "Not needed for lists",
      },
      {
        option: "Space per market",
        bestFor: "Fully independent teams",
        howItWorks: "Separate content, users and settings",
        inDemo: "Heavier to govern",
      },
    ],
    worthKnowing: [
      <>
        <b>Clean up the market list first.</b> Existing options in this space mix markets and languages (<Code>en</Code>,{" "}
        <Code>us</Code>, <Code>uk</Code>). Use country codes for markets and Builder locales for language.
      </>,
      <>
        <b>Cache-friendly by design.</b> One query per active market means at most about 20 distinct requests, which the
        CDN caches well. Keep user IDs and full customer lists out of the request.
      </>,
      <>
        <b>Tags with Enum is a true multi-select.</b> The older pattern, a list with an enum sub-field (used by this space's{" "}
        <Code>article</Code> model), allows duplicates and takes more clicks.
      </>,
    ],
    code: {
      title: "client/lib/content.ts",
      code: `// markets come from the session: company name or customer group
const articles = await fetchEntries({
  model: 'bestseller-demo-article',
  apiKey: BUILDER_API_KEY,
  query: { 'data.markets': { $in: [activeMarket, 'global'] } },
});

// Services use the same field and the same query
const services = await fetchEntries({
  model: 'bestseller-demo-service',
  apiKey: BUILDER_API_KEY,
  query: { 'data.markets': { $in: [activeMarket, 'global'] } },
});`,
    },
    links: [
      { label: "Custom fields", href: BUILDER_DOCS.customFields },
      { label: "Querying cheatsheet", href: BUILDER_DOCS.querying },
      { label: "Write API", href: BUILDER_DOCS.writeApi },
      MODEL_LINKS.article,
      MODEL_LINKS.service,
    ],
  },

  tabs: {
    heard:
      "A tab selector at the top lets customers switch market. It only shows when a customer has more than one market, and it's built in code, possibly reusing the existing navigation bar.",
    answer:
      "Keep the switcher in your code, fed by the markets More already knows at login. Render tabs only when there are two or more markets, and keep the active market in app state. Builder never needs to know who the customer is, only which market to query.",
    tryIt: [
      <>
        Open <b>Customer markets</b> in the header and untick down to one market: the tab row disappears.
      </>,
      <>Tick Germany and Austria again: the tabs come back, and switching tabs re-runs the Builder queries.</>,
      <>The active market is remembered like a session value; it isn't part of the URL.</>,
    ],
    setup: [
      {
        title: "Resolve markets at login",
        description: "From the company name or customer group, which More already has. Put the list of codes on the session.",
      },
      {
        title: "Render the tabs",
        description: (
          <>
            Reuse the navigation bar and render nothing when <Code>markets.length &lt; 2</Code>. Ant Design Tabs moves tabs
            that don't fit into a ··· menu; with 20 markets, a dropdown works too.
          </>
        ),
      },
      {
        title: "Keep the active market in app state",
        description: "Default to the customer's first market and remember the choice for the session.",
      },
      {
        title: "Pass it to every query",
        description: "Articles, services and related articles all use the same active market.",
      },
    ],
    worthKnowing: [
      <>No user-to-article binding: the market code is the only thing Builder sees.</>,
      <>
        An "All my markets" view is the same query with every market code in <Code>$in</Code>, if you want one later.
      </>,
      <>
        Personalization containers with customer-group attributes still suit one-off section variants, but not growing
        lists.
      </>,
    ],
    code: {
      title: "client/components/layout/MarketTabs.tsx",
      code: `export function MarketTabs() {
  const { customerMarkets, activeMarket, setActiveMarket } = useMarkets();

  // Single-market customers see no tabs at all
  if (customerMarkets.length < 2) return null;

  return (
    <Tabs
      activeKey={activeMarket}
      onTabClick={setActiveMarket}
      items={customerMarkets.map((code) => ({ key: code, label: MARKET_LABELS[code] }))}
    />
  );
}`,
    },
    links: [
      { label: "Querying cheatsheet", href: BUILDER_DOCS.querying },
      { label: "Custom targeting attributes", href: BUILDER_DOCS.customTargeting },
    ],
  },

  editing: {
    heard:
      "Editors add market values to each article or service without code, and preview it side by side in the predefined design before it goes live.",
    answer:
      "Articles and services are data entries: a form with required fields, including the Markets multi-select. The article design is a section model built from registered components, so every article looks the same. A dynamic preview URL opens the real article page next to the form, and it updates as you type, drafts included.",
    tryIt: [
      <>Open an article in Builder and pick markets from the multi-select. The preview next to the form updates as you type.</>,
      <>Create a new article and keep it as a draft: the preview renders it with a "Draft preview" badge, but the site doesn't show it.</>,
      <>
        Open the <b>Article template</b> entry and change Article Hero's layout. Every article follows; authors never touch
        the layout.
      </>,
    ],
    setup: [
      {
        title: "A data model for the content",
        description: (
          <>
            <Code>bestseller-demo-article</Code>: title, slug, markets, summary, hero image, rich-text body, featured and
            published date.
          </>
        ),
      },
      {
        title: "A section model for the design",
        description: (
          <>
            <Code>bestseller-demo-article-template</Code>, built from three registered components: Article Hero (layout),
            Article Body, and Related Articles (title, number of articles). <Code>models: [...]</Code> keeps them out of other
            models.
          </>
        ),
      },
      {
        title: "A dynamic preview URL",
        description: (
          <>
            Model → Preview URL → <Code>&lt;/&gt;</Code>, returning <Code>{"`${site}/articles/${content.data.slug}`"}</Code>.
            The page subscribes to editor updates with <Code>subscribeToEditor()</Code>.
          </>
        ),
      },
      {
        title: "Clear fields for editors",
        description: "Required fields, readable enum labels and helper text, so nobody needs to know the codes behind them.",
      },
    ],
    worthKnowing: [
      <>The template is one published entry. Change it once and every article follows.</>,
      <>
        Registered components can also show live data, such as recent ServiceNow claims, by calling a More backend endpoint
        so credentials stay server-side.
      </>,
    ],
    code: {
      title: "client/pages/ArticlePage.tsx",
      code: `// Live preview: the editor sends every keystroke to the page
useEffect(() => {
  if (!isEditing() && !isPreviewing()) return;
  return subscribeToEditor({
    model: 'bestseller-demo-article',
    apiKey: BUILDER_API_KEY,
    callback: (content) => setArticle(toArticle(content)),
  });
}, []);

// The article's fields, rendered through the published template
<ArticleContext.Provider value={article}>
  <Content
    model="bestseller-demo-article-template"
    content={template}
    apiKey={BUILDER_API_KEY}
    customComponents={articleTemplateComponents}
  />
</ArticleContext.Provider>`,
    },
    links: [
      { label: "Live preview for data models", href: BUILDER_DOCS.previewDataModels },
      { label: "Dynamic preview URLs", href: BUILDER_DOCS.dynamicPreviewUrls },
      { label: "Register custom components", href: BUILDER_DOCS.registerComponents },
      { label: "Intro to models", href: BUILDER_DOCS.models },
      MODEL_LINKS.template,
    ],
  },

  publishing: {
    heard:
      "Content needs draft, review and approval stages before it goes public. New articles should show up quickly once they're published.",
    answer:
      "Use Rules and Workflows under Content Governance: a workflow with review stages, and a rule on the article and service models that requires approval before publishing. Only published entries reach the Content API, so drafts never show in More. Once an article is approved and published, the feed picks it up by itself.",
    tryIt: [
      <>Create an article in Builder and leave it as a draft: it doesn't appear here.</>,
      <>
        Publish it: within about 10 seconds it becomes the newest slide on the tabs for its markets, with a notification.
      </>,
      <>Publishing from another browser tab? The page checks again as soon as you switch back.</>,
    ],
    setup: [
      {
        title: "Create a workflow",
        description: "Stages such as Draft → Review → Approved, and who may move content between them.",
      },
      {
        title: "Add an approval rule",
        description: (
          <>
            Scope it to <Code>bestseller-demo-article</Code> and <Code>bestseller-demo-service</Code> and pick the
            approvers. Everyone else sees <b>Request Approval</b> instead of publishing.
          </>
        ),
      },
      {
        title: "Approvers per market (optional)",
        description: "Narrow a rule with an advanced query, e.g. German and Austrian articles need the DACH lead's approval.",
      },
      {
        title: "Keep the feed fresh in production",
        description:
          "Let Builder's CDN serve stale-while-revalidate, or have a publish webhook tell the More backend to refresh its cache.",
      },
    ],
    worthKnowing: [
      <>
        Rules and Workflows need the governance entitlement (Enterprise). Confirm it's available for this space before the
        working session.
      </>,
      <>Test an advanced-query rule on the Markets field during the working session.</>,
      <>
        This demo skips the CDN cache (<Code>FRESH</Code> in <Code>client/lib/builder.ts</Code>) so publishes show up during
        the meeting. Builder's docs reserve <Code>cachebust</Code> for debugging and build-time requests, so don't ship it.
      </>,
    ],
    code: {
      title: "ArticleCarousel.tsx",
      code: `// Demo: check every 10 seconds and whenever the tab gets focus
const { data: articles } = useQuery({
  queryKey: ['articles', activeMarket],
  queryFn: () => fetchArticles(activeMarket),
  refetchInterval: 10_000,
  refetchOnWindowFocus: true,
});

// Production: Builder calls a webhook when content is published,
// and the More backend refreshes its cached market lists
app.post('/api/builder/published', async (req, res) => {
  await cache.refresh('articles');
  res.sendStatus(204);
});`,
    },
    links: [
      { label: "Rules and Workflows", href: BUILDER_DOCS.governance },
      { label: "Webhooks", href: BUILDER_DOCS.webhooks },
      { label: "Content API", href: BUILDER_DOCS.contentApi },
    ],
  },
};
