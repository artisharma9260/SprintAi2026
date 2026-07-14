const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { Profile, Opportunity } = require("../models");
const { authRequired } = require("../middleware/auth");

const router = express.Router();

router.get("/", authRequired, async (req, res) => {
  const profile = await Profile.findOne({ user_id: req.userId });
  const opps = await Opportunity.find({}).limit(3);
  const now = new Date().toISOString();
  const notes = opps.map((o) => ({
    id: uuidv4(),
    type: "new_opportunity",
    title: `New match: ${o.title}`,
    message: `${o.company} • Deadline ${o.deadline}`,
    read: false,
    created_at: now,
  }));
  if ((profile?.resume_score || 0) < 70) {
    notes.push({
      id: uuidv4(),
      type: "resume_tip",
      title: "Boost your Resume Score",
      message: "Run Resume Intelligence to get personalized ATS improvements.",
      read: false,
      created_at: now,
    });
  }
  res.json(notes);
});

module.exports = router;
