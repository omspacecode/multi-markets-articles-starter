import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // TEMP-VERIFY-PROXY
  const proxyTo = (origin: string): express.RequestHandler => async (req, res) => {
    const upstream = await fetch(`${origin}${req.url}`);
    res.status(upstream.status);
    res.type(upstream.headers.get("content-type") ?? "application/octet-stream");
    res.send(Buffer.from(await upstream.arrayBuffer()));
  };
  app.use("/__builder-cdn", proxyTo("https://cdn.builder.io"));
  app.use("/__pexels", proxyTo("https://images.pexels.com"));

  return app;
}
