const express = require("express");
const { fetchGitHubProfile } = require("../utils/github");

const router = express.Router();

router.get("/:username", async (req, res) => {
  try {
    const data = await fetchGitHubProfile(req.params.username);
    res.json(data);
  } catch (e) {
    res.status(e.status || 502).json({ detail: e.message || "GitHub error" });
  }
});

module.exports = router;
