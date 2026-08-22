module.exports = async (req, res) => {
  res.status(200).json({ ok: "pong", timestamp: new Date().toISOString() });
};
