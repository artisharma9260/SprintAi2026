const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_EXPIRY = "30d";

const signToken = (userId) => jwt.sign({ user_id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY });

const authRequired = (req, res, next) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return res.status(401).json({ detail: "Missing or invalid token" });
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.user_id;
    next();
  } catch (e) {
    res.status(401).json({ detail: "Invalid or expired token" });
  }
};

module.exports = { signToken, authRequired };
