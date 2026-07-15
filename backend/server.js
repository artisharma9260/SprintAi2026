// /**
//  * SkillSprint AI — MERN Backend
//  * Express + Mongoose + JWT + Gemini (free tier)
//  */
// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");
// const { seedOpportunities } = require("./seed");

// const app = express();
// // const PORT = process.env.NODE_PORT || 8002;
// const PORT = process.env.PORT || process.env.NODE_PORT || 8002;

// app.use(cors({ origin: (process.env.CORS_ORIGINS || "*").split(","), credentials: true }));
// app.use(express.json({ limit: "10mb" }));

// // Routes (all mounted under /api)
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/profile", require("./routes/profile"));
// app.use("/api/opportunities", require("./routes/opportunities"));
// app.use("/api/applications", require("./routes/applications"));
// app.use("/api/ai", require("./routes/ai"));
// app.use("/api/github", require("./routes/github"));
// app.use("/api/dashboard", require("./routes/dashboard"));
// app.use("/api/notifications", require("./routes/notifications"));

// app.get("/api/", (_req, res) => res.json({ service: "SkillSprint AI", stack: "MERN", status: "ok" }));

// // Global error handler
// app.use((err, _req, res, _next) => {
//   console.error(err);
//   res.status(500).json({ detail: err.message || "Internal error" });
// });

// (async () => {
//   await connectDB();
//   const n = await seedOpportunities();
//   console.log(`Seeded ${n} opportunities (0 = already seeded)`);
//   app.listen(PORT, "0.0.0.0", () => console.log(`Node/Express listening on :${PORT}`));
// })().catch((e) => {
//   console.error("Startup failed:", e);
//   process.exit(1);
// });
/**
 * SkillSprint AI — MERN Backend
 * Express + Mongoose + JWT + Gemini
 */

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const { seedOpportunities } = require("./seed");

const app = express();

const PORT = process.env.PORT || process.env.NODE_PORT || 8002;

// ====================
// CORS Configuration
// ====================

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

console.log("Allowed CORS Origins:", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without origin (Postman, curl, mobile apps)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked Origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

// ====================
// Routes
// ====================

app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/opportunities", require("./routes/opportunities"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/ai", require("./routes/ai"));
app.use("/api/github", require("./routes/github"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/notifications", require("./routes/notifications"));

// ====================
// Health Check
// ====================

app.get("/api/", (_req, res) => {
  res.json({
    service: "SkillSprint AI",
    stack: "MERN",
    status: "ok",
  });
});

// ====================
// Global Error Handler
// ====================

app.use((err, _req, res, _next) => {
  console.error("Global Error:", err);

  res.status(500).json({
    detail: err.message || "Internal Server Error",
  });
});

// ====================
// Server Startup
// ====================

(async () => {
  try {
    await connectDB();

    const seeded = await seedOpportunities();

    console.log(
      `Seeded ${seeded} opportunities (0 = already seeded)`
    );

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Node/Express listening on :${PORT}`);
    });
  } catch (error) {
    console.error("Startup failed:", error);
    process.exit(1);
  }
})();