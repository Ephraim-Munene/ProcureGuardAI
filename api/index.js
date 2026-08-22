// Root-level Vercel Serverless Function entrypoint.
// Imports the compiled Express app from the backend and wraps it for Vercel.
const serverless = require("serverless-http");
const { createApp } = require("../backend/dist/server");

const app = createApp();

module.exports = async (req, res) => {
  // Vercel warm-up ping
  if (req.headers["x-vercel-warmer"]) {
    return res.status(200).send("Warmed up");
  }

  return serverless(app)(req, res);
};
