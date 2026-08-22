// Root-level Vercel Serverless Function entrypoint.
// Wraps the compiled Express app using serverless-http for Vercel.
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import serverless from "serverless-http";

// Lazy-load and cache the Express app to avoid cold-start overhead.
let cachedApp = null;

const getApp = () => {
  if (cachedApp) {
    console.log("[SERVERLESS] Using cached Express app");
    return cachedApp;
  }
  console.log("[SERVERLESS] Initializing Express app for the first time...");
  const { createApp } = require("../backend/dist/server");
  cachedApp = createApp();
  console.log("[SERVERLESS] Express app initialized successfully");
  return cachedApp;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  console.log("[SERVERLESS] Handler invoked:", req.method, req.url);

  if (req.headers["x-vercel-warmer"]) {
    console.log("[SERVERLESS] Warm-up ping received");
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Warmed up");
    return;
  }

  try {
    const app = getApp();
    const handler = serverless(app);
    console.log("[SERVERLESS] About to invoke serverless-http handler");

    const result = await handler(req, res);
    console.log("[SERVERLESS] serverless-http handler returned:", typeof result);

    return result;
  } catch (error) {
    console.error("[SERVERLESS] Handler error:", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Serverless function internal error", details: error.message }));
  }
}
