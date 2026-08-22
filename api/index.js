// Root-level Vercel Serverless Function entrypoint.
// Wraps the compiled Express app using serverless-http for Vercel.
const serverless = require("serverless-http");

// Lazy-load and cache the Express app to avoid cold-start overhead.
// Vercel injects environment variables automatically for Serverless Functions.
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

module.exports = async (req, res) => {
  console.log("[SERVERLESS] Handler invoked:", req.method, req.url);

  // Vercel warm-up ping
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
    return handler(req, res);
  } catch (error) {
    console.error("[SERVERLESS] Handler error:", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Serverless function internal error", details: error.message }));
  }
};
