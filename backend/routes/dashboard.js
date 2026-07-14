const express = require("express");
const { Profile, Application, Opportunity } = require("../models");
const { authRequired } = require("../middleware/auth");

const router = express.Router();

router.get("/stats", authRequired, async (req, res) => {
  const profile = await Profile.findOne({ user_id: req.userId });
  const apps = await Application.find({ user_id: req.userId });
  const opps = await Opportunity.find({});

  const now = new Date();
  let upcoming = 0;
  opps.forEach((o) => {
    const d = new Date(o.deadline);
    if (!isNaN(d)) {
      const diff = (d - now) / (1000 * 60 * 60 * 24);
      if (diff >= 0 && diff <= 14) upcoming += 1;
    }
  });

  const internships = opps.filter((o) => o.type === "internship").length;
  const hackathons = opps.filter((o) => o.type === "hackathon").length;
  const submitted = apps.filter((a) => a.status !== "saved").length;

  // Weekly activity
  const weekly = {};
  apps.forEach((a) => {
    if (a.createdAt) {
      const d = new Date(a.createdAt);
      const label = d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
      weekly[label] = (weekly[label] || 0) + 1;
    }
  });
  const activity = Object.entries(weekly).slice(-7).map(([date, count]) => ({ date, count }));

  const sk = profile?.skills || {};
  const skillCount =
    (sk.languages || []).length + (sk.frameworks || []).length + (sk.tools || []).length + (sk.soft_skills || []).length;
  let completeness = 0;
  if (profile?.personal?.name) completeness += 15;
  if (profile?.academic?.college) completeness += 15;
  if (skillCount >= 5) completeness += 20;
  if ((profile?.projects || []).length) completeness += 15;
  if (profile?.resume_text) completeness += 20;
  if (profile?.social?.github) completeness += 15;

  const statuses = ["saved", "applied", "assessment", "interview", "offer", "rejected"];
  const kanban_counts = Object.fromEntries(statuses.map((s) => [s, apps.filter((a) => a.status === s).length]));

  res.json({
    opportunity_score: Math.min(100, completeness),
    internship_matches: internships,
    hackathon_matches: hackathons,
    applications_submitted: submitted,
    upcoming_deadlines: upcoming,
    resume_score: profile?.resume_score || 0,
    activity,
    skill_growth: [
      { month: "Sep", skills: Math.max(0, skillCount - 5) },
      { month: "Oct", skills: Math.max(0, skillCount - 3) },
      { month: "Nov", skills: Math.max(0, skillCount - 2) },
      { month: "Dec", skills: Math.max(0, skillCount - 1) },
      { month: "Jan", skills: skillCount },
      { month: "Feb", skills: skillCount },
    ],
    kanban_counts,
  });
});

module.exports = router;
