const express = require("express");
const { Profile, Opportunity } = require("../models");
const { authRequired } = require("../middleware/auth");
const ai = require("../utils/ai");

const router = express.Router();

router.post("/generate", authRequired, async (req, res) => {
  try {
    const { opportunity_id, content_type, extra_context = "" } = req.body;
    const profile = await Profile.findOne({ user_id: req.userId });
    let opp = null;
    if (opportunity_id) opp = await Opportunity.findById(opportunity_id);
    const content = await ai.generateApplicationContent(
      profile ? profile.toJSON() : {},
      opp ? opp.toJSON() : {},
      content_type,
      extra_context
    );
    res.json({ content, content_type });
  } catch (e) {
    console.error("AI route error:", e);
    res.status(500).json({ detail: e.message });
  }
});

router.post("/analyze-resume", authRequired, async (req, res) => {
  try {
    let { resume_text, target_role = "" } = req.body;
    if (!resume_text) {
      const profile = await Profile.findOne({ user_id: req.userId });
      resume_text = profile?.resume_text || "";
    }
    if (!resume_text) return res.status(400).json({ detail: "No resume text available" });
    const result = await ai.analyzeResume(resume_text, target_role);
    await Profile.updateOne({ user_id: req.userId }, { $set: { resume_score: parseInt(result.ats_score || 0, 10) } });
    res.json(result);
  } catch (e) {
    console.error("AI route error:", e);
    res.status(500).json({ detail: e.message });
  }
});

router.post("/skill-gap", authRequired, async (req, res) => {
  try {
    const { opportunity_id } = req.body;
    const profile = await Profile.findOne({ user_id: req.userId });
    const opp = await Opportunity.findById(opportunity_id);
    if (!opp) return res.status(404).json({ detail: "Opportunity not found" });
    const result = await ai.skillGap(profile ? profile.toJSON() : {}, opp.toJSON());
    res.json(result);
  } catch (e) {
    console.error("AI route error:", e);
    res.status(500).json({ detail: e.message });
  }
});

module.exports = router;