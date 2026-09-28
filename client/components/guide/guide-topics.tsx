import type { ReactNode } from "react";
import { BUILDER_DOCS, MODEL_IDS, builderModelUrl } from "@/lib/builder";
import type { TopicId } from "@/context/guide-context";

export interface GuideOption {
  option: string;
  bestFor: string;
  howItWorks: string;
  inDemo: string;
}

export interface GuideTopic {
  id: TopicId;
  question: string;
  answer: string;
  tryIt: ReactNode[];
  setup: { title: string; description: ReactNode }[];
  options?: GuideOption[];
  code: { title: string; code: string };
  links: { label: string; href: string }[];
}

const Code = ({ children }: { children: ReactNode }) => <code className="inline-code">{children}</code>;

export const GUIDE_TOPICS: Record<TopicId, GuideTopic> = {
  "target-groups": {
    id: "target-groups",
    question: "Target group – How do we set this up correctly, and what are the options?",
    answer:
      "Resolve each person's target group once, at login (SSO claim or HR data), and send it to Builder with every request. Builder can then filter on it at three levels: whole entries, blocks inside a page, and lists such as articles. Editors pick target groups from dropdowns, so nobody types free text.",
    tryIt: [
      <>Switch the signed-in person in the top right. Mette is in Store teams, Lars in Head office, Ingrid in Logistics and Katrin in Leadership.</>,
      <>The banner under the carousel changes. Each <b>Target group banner</b> entry has a required Target group field; the app shows the one for the viewer and falls back to "Everyone".</>,
      <>The carousel changes too. Every article has a required <b>Target groups</b> field, and the query only returns articles for the viewer's group or "Everyone".</>,
    ],
    setup: [
      {
        title: "Agree on one list of groups",
        description: (
          <>Keep it short and stable, e.g. <Code>store</Code>, <Code>office</Code>, <Code>logistics</Code>, <Code>leadership</Code>. Use the same values in SSO claims, targeting attributes and model fields.</>
        ),
      },
      {
        title: "Add a custom targeting attribute",
        description: (
          <>Space settings → Custom targeting attributes → add <Code>targetGroup</Code> (string, enum). This unlocks the Targeting button and Personalization containers for that attribute. It isn't configured in this space yet, so the demo filters on fields.</>
        ),
      },
      {
        title: "Send it with every request",
        description: (
          <>Pass <Code>userAttributes: {"{ targetGroup }"}</Code> to <Code>fetchOneEntry</Code> / <Code>fetchEntries</Code>, and call <Code>setClientUserAttributes()</Code> so client-side personalization can use it too. This demo already does both.</>
        ),
      },
      {
        title: "Target in the editor",
        description: (
          <>Entries: Targeting → targetGroup is Store teams. Blocks: wrap them in a Personalization container with one variant per group. Lists: add a required Target groups field and filter with <Code>$in</Code>.</>
        ),
      },
      {
        title: "Always keep a fallback",
        description: <>An untargeted entry (or the "Everyone" value) means a new or unknown group never sees an empty slot.</>,
      },
    ],
    options: [
      {
        option: "Entry targeting",
        bestFor: "Banners, landing pages, whole sections",
        howItWorks: "Targeting rules on the entry; the API returns the best match",
        inDemo: "Country homepages (by URL)",
      },
      {
        option: "Personalization container",
        bestFor: "One page where a few blocks differ per group",
        howItWorks: "Variants with rules inside one entry, edited visually",
        inDemo: "Supported by the SDK, not used",
      },
      {
        option: "Field-based filtering",
        bestFor: "Article feeds, carousels, search results",
        howItWorks: "Required list field plus a $in query",
        inDemo: "Carousel and target group banner",
      },
      {
        option: "Separate models or spaces",
        bestFor: "Audiences with nothing in common",
        howItWorks: "More governance overhead; rarely needed",
        inDemo: "Not needed",
      },
    ],
    code: {
      title: "TargetGroupBanner.tsx",
      code: `// The viewer's group comes from your SSO / HR profile
setClientUserAttributes({ targetGroup: user.targetGroup });

const banners = await fetchEntries({
  model: 'audience-banner',
  apiKey: BUILDER_API_KEY,
  query: { 'data.targetGroup': { $in: [user.targetGroup, 'all'] } },
  // Once targetGroup is a custom targeting attribute, the API
  // also applies entry targeting rules with this:
  userAttributes: { targetGroup: user.targetGroup },
});

const banner =
  banners.find((b) => b.data.targetGroup === user.targetGroup) ??
  banners.find((b) => b.data.targetGroup === 'all');`,
    },
    links: [
      { label: "Custom targeting attributes", href: BUILDER_DOCS.customTargeting },
      { label: "Targeting content", href: BUILDER_DOCS.targeting },
      { label: "Model: Target group banner", href: builderModelUrl(MODEL_IDS.banner) },
    ],
  },

  templates: {
    id: "templates",
    question:
      "Templates & user access – How do we create a fixed template, and how do we manage access so that users can only create and edit articles – without being able to change the overall structure and setup?",
    answer:
      "Make the article a structured model: a form with required fields, rendered by one template that lives in your code. Authors fill in the form and see a live preview, but the layout isn't editable in Builder, so it can't drift. Then use roles so authors can only work on articles, while the homepage structure stays with admins.",
    tryIt: [
      <>Open any article from the carousel. Every article renders through the same <Code>ArticleTemplate</Code> component; only the field values differ.</>,
      <>Open the <b>News article</b> model in Builder. Authors get a form with required fields, dropdowns for category, countries and target groups, and a live preview of this template.</>,
      <>Homepage sections (hero, carousel, banner slot) are registered with <Code>requiredPermissions: ['editDesigns']</Code>, and the homepage model runs in components-only mode.</>,
    ],
    setup: [
      {
        title: "Create a data model for articles",
        description: (
          <>Fields: title, excerpt, hero image, category, countries, target groups, author, body and featured. Make them required and use dropdowns (enums) for anything that drives targeting.</>
        ),
      },
      {
        title: "Build one template in code",
        description: <>Render the fields in a single React component. Changing the design becomes a reviewed code change, not an editor action.</>,
      },
      {
        title: "Wire up live preview",
        description: (
          <>Set the model's preview URL to a route that calls <Code>subscribeToEditor()</Code>, so authors see the real template while they type. Here: <Code>/preview/news-article</Code>.</>
        ),
      },
      {
        title: "Assign roles",
        description: (
          <>The built-in Editor role works for simple setups. For strict separation, use Custom roles (Enterprise): an "Article author" role with create and edit on News article only, and read-only everywhere else. Add publish rights only if you don't use an approval workflow.</>
        ),
      },
      {
        title: "Lock the homepage",
        description: (
          <>Restrict components to models (<Code>models: ['country-homepage']</Code>), hide structural ones from non-designers (<Code>requiredPermissions</Code>) and turn on components-only mode. Optionally add approval workflows and locale-scoped roles.</>
        ),
      },
    ],
    code: {
      title: "builder/registry.ts",
      code: `// Structural homepage sections: only designers and developers can
// insert them, and only on the homepage model.
{
  component: ArticleCarousel,
  name: 'Article Carousel',
  models: ['country-homepage'],
  requiredPermissions: ['editDesigns'],
  inputs: [
    { name: 'maxArticles', type: 'number', defaultValue: 8 },
    { name: 'category', type: 'text', enum: ['All', 'News', 'People'] },
  ],
}

// Articles: data model + one template in code, with live preview
useEffect(() => subscribeToEditor({
  model: 'news-article',
  apiKey: BUILDER_API_KEY,
  callback: (content) => setArticle(toArticle(content)),
}), []);`,
    },
    links: [
      { label: "Roles and permissions", href: BUILDER_DOCS.roles },
      { label: "Custom roles", href: BUILDER_DOCS.customRoles },
      { label: "Components-only mode", href: BUILDER_DOCS.componentsOnly },
      { label: "Workflows and rules", href: BUILDER_DOCS.governance },
      { label: "Model: News article", href: builderModelUrl(MODEL_IDS.article) },
    ],
  },

  "multi-country": {
    id: "multi-country",
    question:
      "Multi-country setup – Some of our users operate across multiple countries. How can we configure this so that a tab is displayed at the top, allowing users to switch between countries and see a homepage tailored to the selected country?",
    answer:
      "Keep the countries each person works in on their profile and render one tab per country. Each tab is its own URL (/dk, /se, …), and each country has its own homepage entry in Builder, targeted to that URL. Everything inside the page, like the carousel and banners, receives the selected country, so the whole homepage follows the tab.",
    tryIt: [
      <>Switch to Lars: he works in four countries, so he gets four tabs. Ingrid only works in Norway, so she gets none.</>,
      <>Click through the tabs. Each one loads a different <b>Country homepage</b> entry, targeted with <Code>urlPath is /dk</Code>, <Code>/se</Code> and so on, with its own hero and local info.</>,
      <>The carousel filters articles by the selected country through the Countries field, including articles marked "All countries".</>,
    ],
    setup: [
      {
        title: "Put countries on the user profile",
        description: <>Read the user's countries from SSO or HR data. The first one is their home country and the default tab.</>,
      },
      {
        title: "One homepage entry per country",
        description: (
          <>Build the first one, duplicate it per country and adjust. Target each entry with <Code>urlPath is /dk</Code>, or with a custom <Code>country</Code> attribute.</>
        ),
      },
      {
        title: "Route per country",
        description: <>Use <Code>/:country</Code> routes so every tab can be linked, cached and bookmarked.</>,
      },
      {
        title: "Pass the country down",
        description: (
          <>Fetch with <Code>userAttributes: {"{ urlPath }"}</Code> and hand the country to your components, so the carousel and banners filter on it.</>
        ),
      },
      {
        title: "Add languages if you need them",
        description: <>Turn on localization for translated fields, and limit country editors to their own locale through role-based locale access.</>,
      },
    ],
    options: [
      {
        option: "URL targeting (urlPath)",
        bestFor: "Clean country URLs; the simplest native setup",
        howItWorks: "Entry targeted to /dk; urlPath is indexed for speed",
        inDemo: "Used for all four homepages",
      },
      {
        option: "Custom attribute country",
        bestFor: "Homepages not tied to a URL, or combined rules",
        howItWorks: "Add country in space settings, target entries on it",
        inDemo: "Needs a space setting",
      },
      {
        option: "Localization (locales)",
        bestFor: "Same structure with translated fields",
        howItWorks: "Localized fields per locale, locale-scoped roles",
        inDemo: "Works alongside either option",
      },
      {
        option: "One space per country",
        bestFor: "Fully independent teams or brands",
        howItWorks: "Separate content, users and settings",
        inDemo: "Heavier to govern",
      },
    ],
    code: {
      title: "CountryBar.tsx + CountryHome.tsx",
      code: `// Tabs come from the signed-in user's profile
const tabs = COUNTRY_CODES.filter((code) => user.countries.includes(code));

<Tabs
  activeKey={country}
  items={tabs.map((code) => ({ key: code, label: COUNTRIES[code].name }))}
  onChange={(code) => navigate(\`/\${code}\`)}
/>

// Builder returns the homepage entry targeted to this URL
const homepage = await fetchOneEntry({
  model: 'country-homepage',
  apiKey: BUILDER_API_KEY,
  userAttributes: { urlPath: \`/\${country}\`, targetGroup: user.targetGroup },
});`,
    },
    links: [
      { label: "Targeting content", href: BUILDER_DOCS.targeting },
      { label: "Content API: userAttributes", href: BUILDER_DOCS.contentApi },
      { label: "Model: Country homepage", href: builderModelUrl(MODEL_IDS.homepage) },
    ],
  },

  carousel: {
    id: "carousel",
    question:
      "Automatic carousel – How do we configure the carousel on the homepage so that it automatically updates with articles as they are being created?",
    answer:
      "Don't store slides in the homepage. Place an Article Carousel component whose settings are rules (how many, which category, featured first), and let it query the News article model at runtime for the selected country and target group. Publishing an article is all it takes; nobody edits the homepage.",
    tryIt: [
      <>In Builder, create a <b>News article</b> with Countries: Denmark (or All countries) and Target groups: Everyone, then publish it. Within about 15 seconds it appears here as the newest slide, with a notification.</>,
      <>Tick <b>Featured</b> on an article to pin it to the first slide.</>,
      <>Admins can change the carousel's rules (count, category, autoplay) in the homepage entry without touching code.</>,
    ],
    setup: [
      {
        title: "Register the carousel",
        description: <>Its inputs are rules, not slides: max articles, category, match target group and autoplay speed.</>,
      },
      {
        title: "Query at runtime",
        description: (
          <><Code>fetchEntries</Code> on <Code>news-article</Code> with country and target group filters, newest first. Featured articles are pinned in code.</>
        ),
      },
      {
        title: "Keep it fresh",
        description: (
          <>In a single-page app, poll and refetch on focus (every 15 seconds here). With server-rendered or static pages, add a Builder webhook on publish that revalidates the cached page.</>
        ),
      },
      {
        title: "Handle empty states",
        description: <>Show a helpful message when a country has no articles yet, so a new market never looks broken.</>,
      },
    ],
    options: [
      {
        option: "Automatic (query rules)",
        bestFor: "News that should appear immediately",
        howItWorks: "Component queries the article model at runtime",
        inDemo: "Used",
      },
      {
        option: "Hand-picked reference list",
        bestFor: "Campaigns where every slide is curated",
        howItWorks: "Reference field on the homepage",
        inDemo: "Every change needs a homepage edit",
      },
      {
        option: "Hybrid: featured + newest",
        bestFor: "Pin a few, automate the rest",
        howItWorks: "Featured field sorted first",
        inDemo: "Used (Featured field)",
      },
    ],
    code: {
      title: "ArticleCarousel.tsx",
      code: `const { data: articles } = useQuery({
  queryKey: ['articles', country, targetGroup, category],
  queryFn: () => fetchEntries({
    model: 'news-article',
    apiKey: BUILDER_API_KEY,
    query: {
      'data.countries.country': { $in: [country, 'global'] },
      'data.targetGroups.group': { $in: [targetGroup, 'all'] },
    },
    sort: { createdDate: -1 },
    limit: maxArticles,
  }),
  refetchInterval: 15_000, // picks up newly published articles
  refetchOnWindowFocus: true,
});`,
    },
    links: [
      { label: "Content API", href: BUILDER_DOCS.contentApi },
      { label: "Webhooks", href: BUILDER_DOCS.webhooks },
      { label: "Register custom components", href: BUILDER_DOCS.registerComponents },
      { label: "Model: News article", href: builderModelUrl(MODEL_IDS.article) },
    ],
  },
};
