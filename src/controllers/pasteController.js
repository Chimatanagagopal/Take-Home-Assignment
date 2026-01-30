const Paste = require("../models/Paste");
const { nanoid } = require("nanoid");

function now(req) {
  if (process.env.TEST_MODE === "1" && req.headers["x-test-now-ms"]) {
    return new Date(Number(req.headers["x-test-now-ms"]));
  }
  return new Date();
}

exports.createPaste = async (req, res) => {
  const { content, ttl_seconds, max_views } = req.body;

  if (!content || typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ error: "Invalid content" });
  }

  if (ttl_seconds && ttl_seconds < 1) {
    return res.status(400).json({ error: "Invalid ttl_seconds" });
  }

  if (max_views && max_views < 1) {
    return res.status(400).json({ error: "Invalid max_views" });
  }

  const expiresAt = ttl_seconds
    ? new Date(Date.now() + ttl_seconds * 1000)
    : null;

  const pasteId = nanoid(10);

  const paste = await Paste.create({
    pasteId,
    content,
    expiresAt,
    maxViews: max_views ?? null
  });

  res.status(201).json({
    id: paste.pasteId,
    url: `${req.protocol}://${req.get("host")}/p/${paste.pasteId}`
  });
};

exports.getPaste = async (req, res) => {
  const paste = await Paste.findOne({ pasteId: req.params.id });
  if (!paste) return res.status(404).json({ error: "Not found" });

  const current = now(req);

  if (
    (paste.expiresAt && paste.expiresAt <= current) ||
    (paste.maxViews && paste.views >= paste.maxViews)
  ) {
    return res.status(404).json({ error: "Not found" });
  }

  paste.views += 1;
  await paste.save();

  res.json({
    content: paste.content,
    remaining_views: paste.maxViews
      ? paste.maxViews - paste.views
      : null,
    expires_at: paste.expiresAt
  });
};

exports.renderPaste = async (req, res) => {
  const paste = await Paste.findOne({ pasteId: req.params.id });
  if (!paste) return res.sendStatus(404);

  paste.views += 1;
  await paste.save();

  res.send(`<pre>${escapeHtml(paste.content)}</pre>`);
};

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[m]);
}