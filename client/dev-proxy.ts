// TEMP-VERIFY-PROXY
const REWRITES: [string, string][] = [
  ["https://cdn.builder.io/", "/__builder-cdn/"],
  ["https://images.pexels.com/", "/__pexels/"],
];
const rewrite = (url: string) =>
  REWRITES.reduce((acc, [from, to]) => (acc.startsWith(from) ? to + acc.slice(from.length) : acc), url);

const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();

if (params.has("__proxy")) {
  const nativeFetch = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) =>
    nativeFetch(typeof input === "string" ? rewrite(input) : input instanceof URL ? rewrite(input.href) : input, init);
}

if (params.has("__probe")) console.warn("[verify] probe", window.location.search);

const hideId = params.get("__hide");
if (hideId) {
  const innerFetch = window.fetch;
  let hidden = false;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const response = await innerFetch(input, init);
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    if (hidden || !url.includes("/content/news-article")) return response;
    const json = await response.clone().json();
    if (!json.results?.some((r: { id: string }) => r.id === hideId)) return response;
    hidden = true;
    json.results = json.results.filter((r: { id: string }) => r.id !== hideId);
    console.warn(`[verify] hid ${hideId} from first article response`);
    window.setTimeout(() => {
      console.warn("[verify] refocus after hide");
      window.dispatchEvent(new Event("visibilitychange"));
    }, 400);
    return new Response(JSON.stringify(json), { headers: { "content-type": "application/json" } });
  };
}

const refocusAt = params.get("__refocus");
if (refocusAt) {
  window.setTimeout(() => {
    console.warn("[verify] simulating tab refocus");
    window.dispatchEvent(new Event("visibilitychange"));
  }, Number(refocusAt));
}

const scrollTo = params.get("__scroll");
if (scrollTo) window.setTimeout(() => window.scrollTo(0, Number(scrollTo)), 1800);

const persona = params.get("__persona");
if (persona) window.localStorage.setItem("relay.persona", persona);

const clicks = params.getAll("__click");
const start = Number(params.get("__delay") ?? 2500);
clicks.forEach((selector, index) => {
  window.setTimeout(() => {
    const el = document.querySelector<HTMLElement>(selector);
    console.warn(`[verify] click ${selector} -> ${el ? "ok" : "NOT FOUND"}`);
    el?.click();
  }, start + index * 1200);
});
