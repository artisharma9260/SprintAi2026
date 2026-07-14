// const express = require("express");
// const { Opportunity } = require("../models");
// const { authRequired } = require("../middleware/auth");
// const { analyzeEligibility } = require("../utils/ai");
// const { Profile } = require("../models");

// const router = express.Router();

// router.get("/", async (req, res) => {
//   const q = {};
//   const { type, search, difficulty } = req.query;
//   if (type && type !== "all") q.type = type;
//   if (difficulty && difficulty !== "all") q.difficulty = difficulty;
//   if (search) {
//     q.$or = [
//       { title: { $regex: search, $options: "i" } },
//       { company: { $regex: search, $options: "i" } },
//       { tags: { $regex: search, $options: "i" } },
//     ];
//   }
//   const items = await Opportunity.find(q).limit(200);
//   res.json(items.map((i) => i.toJSON()));
// });

// router.get("/:id", async (req, res) => {
//   const opp = await Opportunity.findById(req.params.id);
//   if (!opp) return res.status(404).json({ detail: "Opportunity not found" });
//   res.json(opp.toJSON());
// });

// router.post("/:id/eligibility", authRequired, async (req, res) => {
//   try {
//     const opp = await Opportunity.findById(req.params.id);
//     if (!opp) return res.status(404).json({ detail: "Opportunity not found" });
//     const profile = (await Profile.findOne({ user_id: req.userId })) || {};
//     const result = await analyzeEligibility(profile.toJSON ? profile.toJSON() : profile, opp.toJSON());
//     res.json(result);
//   } catch (e) {
//     res.status(500).json({ detail: e.message });
//   }
// });

// module.exports = router;
const express = require("express");
const { Opportunity } = require("../models");
const { authRequired } = require("../middleware/auth");
const { analyzeEligibility, discoverOpportunities } = require("../utils/ai");
const { Profile } = require("../models");

const router = express.Router();

// Uses Gemini + live Google Search grounding to find real, currently open
// opportunities and upserts them into MongoDB tagged source: "ai".
router.post("/discover", authRequired, async (req, res) => {
  try {
    const { criteria = "" } = req.body || {};
    const found = await discoverOpportunities(criteria);

    let created = 0;
    let updated = 0;
    const saved = [];

    for (const item of found) {
      if (!item || !item.title || !item.apply_url) continue;
      const filter = { apply_url: item.apply_url };
      const doc = {
        title: item.title,
        company: item.company || "",
        type: item.type || "internship",
        location: item.location || "Remote",
        deadline: item.deadline || "Rolling",
        stipend: item.stipend || "",
        difficulty: item.difficulty || "Intermediate",
        duration: item.duration || "",
        description: item.description || "",
        required_skills: Array.isArray(item.required_skills) ? item.required_skills : [],
        eligibility: Array.isArray(item.eligibility) ? item.eligibility : [],
        tags: Array.isArray(item.tags) ? item.tags : [],
        apply_url: item.apply_url,
        source: "ai",
      };
      const existing = await Opportunity.findOne(filter);
      const result = await Opportunity.findOneAndUpdate(filter, { $set: doc }, { upsert: true, new: true });
      if (existing) updated++; else created++;
      saved.push(result.toJSON());
    }

    res.json({ found: found.length, created, updated, items: saved });
  } catch (e) {
    console.error("Opportunity discovery error:", e);
    res.status(500).json({ detail: e.message });
  }
});

router.get("/", async (req, res) => {
  const q = {};
  const { type, search, difficulty } = req.query;
  if (type && type !== "all") q.type = type;
  if (difficulty && difficulty !== "all") q.difficulty = difficulty;
  if (search) {
    q.$or = [
      { title: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
  }
  const items = await Opportunity.find(q).limit(200);
  res.json(items.map((i) => i.toJSON()));
});

router.get("/:id", async (req, res) => {
  const opp = await Opportunity.findById(req.params.id);
  if (!opp) return res.status(404).json({ detail: "Opportunity not found" });
  res.json(opp.toJSON());
});

router.post("/:id/eligibility", authRequired, async (req, res) => {
  try {
    const opp = await Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ detail: "Opportunity not found" });
    const profile = (await Profile.findOne({ user_id: req.userId })) || {};
    const result = await analyzeEligibility(profile.toJSON ? profile.toJSON() : profile, opp.toJSON());
    res.json(result);
  } catch (e) {
    res.status(500).json({ detail: e.message });
  }
});

module.exports = router;

