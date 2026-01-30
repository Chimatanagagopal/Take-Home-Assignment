const router = require("express").Router();
const mongoose = require("mongoose");

router.get("/health", (req, res) => {
  res.json({ ok: mongoose.connection.readyState === 1 });
});

module.exports = router;