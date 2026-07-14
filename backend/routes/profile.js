const express = require("express");
const { Profile } = require("../models");
const { authRequired } = require("../middleware/auth");

const router = express.Router();

router.get("/", authRequired, async (req, res) => {
  let profile = await Profile.findOne({ user_id: req.userId });
  if (!profile) profile = await Profile.create({ user_id: req.userId });
  res.json(profile.toJSON());
});

router.put("/", authRequired, async (req, res) => {
  const update = { ...req.body };
  delete update.user_id;
  delete update._id;
  delete update.id;
  const profile = await Profile.findOneAndUpdate(
    { user_id: req.userId },
    { $set: update },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  res.json(profile.toJSON());
});

module.exports = router;
