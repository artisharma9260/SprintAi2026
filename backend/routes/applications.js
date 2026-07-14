const express = require("express");
const { Application, Opportunity } = require("../models");
const { authRequired } = require("../middleware/auth");

const router = express.Router();

router.get("/", authRequired, async (req, res) => {
  const apps = await Application.find({ user_id: req.userId });
  const results = [];
  for (const a of apps) {
    const opp = await Opportunity.findById(a.opportunity_id);
    const j = a.toJSON();
    j.opportunity = opp ? opp.toJSON() : {};
    results.push(j);
  }
  res.json(results);
});

router.post("/", authRequired, async (req, res) => {
  const { opportunity_id, status = "saved", notes = "" } = req.body;
  const existing = await Application.findOne({ user_id: req.userId, opportunity_id });
  if (existing) return res.json(existing.toJSON());
  const app = await Application.create({ user_id: req.userId, opportunity_id, status, notes });
  res.json(app.toJSON());
});

router.put("/:id", authRequired, async (req, res) => {
  const update = {};
  ["status", "notes", "generated_content"].forEach((k) => { if (req.body[k] !== undefined) update[k] = req.body[k]; });
  const app = await Application.findOneAndUpdate(
    { _id: req.params.id, user_id: req.userId },
    { $set: update },
    { new: true }
  );
  if (!app) return res.status(404).json({ detail: "Application not found" });
  res.json(app.toJSON());
});

router.delete("/:id", authRequired, async (req, res) => {
  const app = await Application.findOneAndDelete({ _id: req.params.id, user_id: req.userId });
  if (!app) return res.status(404).json({ detail: "Application not found" });
  res.json({ ok: true });
});

module.exports = router;
