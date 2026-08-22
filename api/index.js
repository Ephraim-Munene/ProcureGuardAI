// Root-level Vercel Serverless Function entrypoint.
// Directly bridges Vercel's Node.js ServerResponse to the Express app
// without serverless-http, to avoid event-loop incompatibilities.
const http = require("http");

let cachedApp = null;
let cachedServer = null;

const getApp = () => {
  if (!cachedApp) {
    const { createApp } = require("../backend/dist/server");
    cachedApp = createApp();
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
  if (req.headers["x-vercel-warmer"]) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Warmed up");
    return;
  }

  const server = getServer();
  server.emit("request", req, res);
};
