import type { RequestHandler } from "express";

// TEMPORARY: lets a sandboxed browser reach Builder and the image hosts during verification. Remove afterwards.
const ALLOWED_HOSTS = new Set(["cdn.builder.io", "picsum.photos", "fastly.picsum.photos"]);

export const handleVerifyProxy: RequestHandler = async (req, res) => {
  let url: URL;
  try {
    url = new URL(String(req.query.url));
  } catch {
    res.status(400).end();
    return;
  }

  for (let hop = 0; hop < 4; hop++) {
    if (url.protocol !== "https:" || !ALLOWED_HOSTS.has(url.hostname)) {
      res.status(403).end();
      return;
    }
    const upstream = await fetch(url, { redirect: "manual" });
    const location = upstream.headers.get("location");
    if (upstream.status >= 300 && upstream.status < 400 && location) {
      url = new URL(location, url);
      continue;
    }
    res.status(upstream.status);
    res.setHeader("content-type", upstream.headers.get("content-type") ?? "application/octet-stream");
    res.setHeader("cache-control", "no-store");
    res.send(Buffer.from(await upstream.arrayBuffer()));
    return;
  }
  res.status(508).end();
};
