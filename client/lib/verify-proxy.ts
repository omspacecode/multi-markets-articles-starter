// TEMPORARY: opt in with ?verifyProxy so a sandboxed browser can reach Builder and the image hosts. Remove after verification.
const params = new URLSearchParams(window.location.search);
const enabled = params.has("verifyProxy") || window.sessionStorage.getItem("verifyProxy") === "1";
const injectAfterSeconds = Number(params.get("verifyInject") ?? 0);
const loadedAt = Date.now();

const HOSTS = ["https://cdn.builder.io/", "https://picsum.photos/"];
const shouldProxy = (url: string) => HOSTS.some((host) => url.startsWith(host));
const viaProxy = (url: string) => `/__verify-proxy?url=${encodeURIComponent(url)}`;

const simulatedArticle = () => ({
  id: "verify-simulated-article",
  published: "published",
  firstPublished: loadedAt,
  data: {
    title: "Simulated: Neue Retourenetiketten ab Dezember",
    slug: "verify-simulated-article",
    summary: "Injected by the temporary verification proxy to test the new-article notification.",
    markets: ["de", "at"],
    heroImage: "",
    body: "<p>Simulated article.</p>",
    featured: false,
    publishedDate: Date.now(),
  },
});

if (enabled) {
  window.sessionStorage.setItem("verifyProxy", "1");
  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    if (url.includes("cdn.builder.io/api/v1/track")) return new Response(null, { status: 204 });
    if (!shouldProxy(url)) return originalFetch(input, init);

    const response = await originalFetch(viaProxy(url), init);
    const inject =
      injectAfterSeconds > 0 &&
      Date.now() - loadedAt > injectAfterSeconds * 1000 &&
      url.includes("/api/v3/content/bestseller-demo-article?") &&
      !url.includes("data.slug");
    if (!inject) return response;

    const json = await response.json();
    json.results = [simulatedArticle(), ...(json.results ?? [])];
    return new Response(JSON.stringify(json), { status: 200, headers: { "content-type": "application/json" } });
  };

  const rewrite = (img: HTMLImageElement) => {
    const src = img.getAttribute("src");
    if (src && shouldProxy(src)) img.setAttribute("src", viaProxy(src));
  };

  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.target instanceof HTMLImageElement) rewrite(mutation.target);
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLImageElement) rewrite(node);
        if (node instanceof HTMLElement) node.querySelectorAll("img").forEach(rewrite);
      });
    }
  }).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ["src"] });
}
