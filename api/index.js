// Root-level Vercel Serverless Function entrypoint.
// Directly bridges Vercel's Node.js ServerResponse to the Express app
// without serverless-http, to avoid event-loop incompatibilities.
const http = require("http");

let cachedApp = null;
let cachedServer = null;

const getApp = () => {
  if (!cachedApp) {
    try {
      const { createApp } = require("../backend/dist/server");
      cachedApp = createApp();
    } catch (e) {
      console.error("[SERVERLESS] Failed to create app:", e);
      throw e;
    }
  }
  return cachedApp;
};

const getServer = () => {
  if (!cachedServer) {
    cachedServer = http.createServer(getApp());
  }
  return cachedServer;
};

module.exports = (req, res) => {
  console.log("[SERVERLESS] Incoming request:", req.method, req.url);

  // Vercel warm-up ping
  if (req.headers["x-vercel-warmer"]) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Warmed up");
    return;
  }

  try {
    const server = getServer();
    server.emit("request", req, res);
  } catch (error) {
    console.error("[SERVERLESS] Handler error:", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Internal server error", details: error.message }));
  }
};
