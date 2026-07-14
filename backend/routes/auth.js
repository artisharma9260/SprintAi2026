const express = require("express");
const bcrypt = require("bcryptjs");
const { User, Profile } = require("../models");
const { signToken, authRequired } = require("../middleware/auth");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ detail: "Missing fields" });
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ detail: "Email already registered" });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name: name.trim(), email: email.toLowerCase(), password_hash: hash });
    // Create empty profile with name
    const profile = new Profile({ user_id: user._id });
    profile.personal.name = name.trim();
    await profile.save();
    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, created_at: user.createdAt } });
  } catch (e) {
    res.status(500).json({ detail: e.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ detail: "Invalid credentials" });
    }
    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, created_at: user.createdAt } });
  } catch (e) {
    res.status(500).json({ detail: e.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  res.json({ message: "If the email exists, a reset link has been sent." });
});

router.get("/me", authRequired, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ detail: "User not found" });
  res.json({ id: user._id, name: user.name, email: user.email, created_at: user.createdAt });
});

module.exports = router;
