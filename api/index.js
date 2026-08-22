// Root-level Vercel Serverless Function entrypoint.
// Wraps the compiled Express app using serverless-http for Vercel.
const serverless = require("serverless-http");

// Lazy-load and cache the Express app to avoid cold-start overhead.
// Vercel injects environment variables automatically for Serverless Functions.
let cachedApp = null;

const getApp = () => {
  if (cachedApp) return cachedApp;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createApp } = require("../backend/dist/server");
  cachedApp = createApp();
  return cachedApp;
};

module.exports = async (req, res) => {
  // Vercel warm-up ping
  if (req.headers["x-vercel-warmer"]) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Warmed up");
    return;
  }

  const app = getApp();
  return serverless(app)(req, res);
};
