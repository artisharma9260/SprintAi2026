// const mongoose = require("mongoose");
// const { v4: uuidv4 } = require("uuid");

// // ============ User ============
// const userSchema = new mongoose.Schema(
//   {
//     _id: { type: String, default: uuidv4 },
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true, lowercase: true },
//     password_hash: { type: String, required: true },
//   },
//   { timestamps: true, _id: false }
// );
// userSchema.virtual("id").get(function () { return this._id; });
// userSchema.set("toJSON", { virtuals: true, versionKey: false, transform: (_d, r) => { delete r._id; delete r.password_hash; return r; } });

// // ============ Profile ============
// const projectSchema = new mongoose.Schema({
//   id: { type: String, default: uuidv4 },
//   title: String,
//   description: { type: String, default: "" },
//   tech_stack: { type: [String], default: [] },
//   github_url: { type: String, default: "" },
//   live_url: { type: String, default: "" },
//   source: { type: String, default: "manual" },
// }, { _id: false });

// const achievementSchema = new mongoose.Schema({
//   id: { type: String, default: uuidv4 },
//   title: String,
//   type: { type: String, default: "certification" },
//   issuer: { type: String, default: "" },
//   date: { type: String, default: "" },
//   description: { type: String, default: "" },
// }, { _id: false });

// const profileSchema = new mongoose.Schema(
//   {
//     _id: { type: String, default: uuidv4 },
//     user_id: { type: String, required: true, unique: true },
//     personal: {
//       name: { type: String, default: "" },
//       phone: { type: String, default: "" },
//       location: { type: String, default: "" },
//       bio: { type: String, default: "" },
//       avatar_url: { type: String, default: "" },
//     },
//     academic: {
//       college: { type: String, default: "" },
//       degree: { type: String, default: "" },
//       branch: { type: String, default: "" },
//       year: { type: String, default: "" },
//       cgpa: { type: String, default: "" },
//       graduation_year: { type: String, default: "" },
//     },
//     skills: {
//       languages: { type: [String], default: [] },
//       frameworks: { type: [String], default: [] },
//       tools: { type: [String], default: [] },
//       soft_skills: { type: [String], default: [] },
//     },
//     projects: { type: [projectSchema], default: [] },
//     achievements: { type: [achievementSchema], default: [] },
//     social: {
//       github: { type: String, default: "" },
//       linkedin: { type: String, default: "" },
//       portfolio: { type: String, default: "" },
//       twitter: { type: String, default: "" },
//     },
//     career_goals: { type: String, default: "" },
//     resume_base64: { type: String, default: "" },
//     resume_filename: { type: String, default: "" },
//     resume_text: { type: String, default: "" },
//     resume_score: { type: Number, default: 0 },
//   },
//   { timestamps: true, _id: false }
// );
// profileSchema.virtual("id").get(function () { return this._id; });
// profileSchema.set("toJSON", { virtuals: true, versionKey: false, transform: (_d, r) => { delete r._id; return r; } });

// // ============ Opportunity ============
// const opportunitySchema = new mongoose.Schema(
//   {
//     _id: { type: String, default: uuidv4 },
//     title: String,
//     company: String,
//     type: String,
//     location: { type: String, default: "Remote" },
//     deadline: String,
//     stipend: { type: String, default: "" },
//     difficulty: { type: String, default: "Intermediate" },
//     duration: { type: String, default: "" },
//     description: { type: String, default: "" },
//     required_skills: { type: [String], default: [] },
//     eligibility: { type: [String], default: [] },
//     tags: { type: [String], default: [] },
//     logo: { type: String, default: "" },
//     apply_url: { type: String, default: "" },
//     source: { type: String, default: "seed" }, // "seed" (sample data) or "ai" (discovered live via Gemini search)
//   },
//   { timestamps: true, _id: false }
// );
// opportunitySchema.virtual("id").get(function () { return this._id; });
// opportunitySchema.set("toJSON", { virtuals: true, versionKey: false, transform: (_d, r) => { delete r._id; return r; } });

// // ============ Application ============
// const applicationSchema = new mongoose.Schema(
//   {
//     _id: { type: String, default: uuidv4 },
//     user_id: { type: String, required: true },
//     opportunity_id: { type: String, required: true },
//     status: { type: String, default: "saved" },
//     notes: { type: String, default: "" },
//     generated_content: { type: Object, default: {} },
//   },
//   { timestamps: true, _id: false }
// );
// applicationSchema.virtual("id").get(function () { return this._id; });
// applicationSchema.set("toJSON", { virtuals: true, versionKey: false, transform: (_d, r) => { delete r._id; return r; } });

// module.exports = {
//   User: mongoose.model("User", userSchema),
//   Profile: mongoose.model("Profile", profileSchema),
//   Opportunity: mongoose.model("Opportunity", opportunitySchema),
//   Application: mongoose.model("Application", applicationSchema),
// };
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

// ============ User ============
const userSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password_hash: { type: String, required: true },
  },
  { timestamps: true, _id: false }
);
userSchema.virtual("id").get(function () { return this._id; });
userSchema.set("toJSON", { virtuals: true, versionKey: false, transform: (_d, r) => { delete r._id; delete r.password_hash; return r; } });

// ============ Profile ============
const projectSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  title: String,
  description: { type: String, default: "" },
  tech_stack: { type: [String], default: [] },
  github_url: { type: String, default: "" },
  live_url: { type: String, default: "" },
  source: { type: String, default: "manual" },
}, { _id: false });

const achievementSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  title: String,
  type: { type: String, default: "certification" },
  issuer: { type: String, default: "" },
  date: { type: String, default: "" },
  description: { type: String, default: "" },
}, { _id: false });

const profileSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    user_id: { type: String, required: true, unique: true },
    personal: {
      name: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      bio: { type: String, default: "" },
      avatar_url: { type: String, default: "" },
    },
    academic: {
      college: { type: String, default: "" },
      degree: { type: String, default: "" },
      branch: { type: String, default: "" },
      year: { type: String, default: "" },
      cgpa: { type: String, default: "" },
      graduation_year: { type: String, default: "" },
    },
    skills: {
      languages: { type: [String], default: [] },
      frameworks: { type: [String], default: [] },
      tools: { type: [String], default: [] },
      soft_skills: { type: [String], default: [] },
    },
    projects: { type: [projectSchema], default: [] },
    achievements: { type: [achievementSchema], default: [] },
    social: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      portfolio: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },
    career_goals: { type: String, default: "" },
    resume_base64: { type: String, default: "" },
    resume_filename: { type: String, default: "" },
    resume_text: { type: String, default: "" },
    resume_score: { type: Number, default: 0 },
  },
  { timestamps: true, _id: false }
);
profileSchema.virtual("id").get(function () { return this._id; });
profileSchema.set("toJSON", { virtuals: true, versionKey: false, transform: (_d, r) => { delete r._id; return r; } });

// ============ Opportunity ============
const opportunitySchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    title: String,
    company: String,
    type: String,
    location: { type: String, default: "Remote" },
    deadline: String,
    stipend: { type: String, default: "" },
    difficulty: { type: String, default: "Intermediate" },
    duration: { type: String, default: "" },
    description: { type: String, default: "" },
    required_skills: { type: [String], default: [] },
    eligibility: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    logo: { type: String, default: "" },
    apply_url: { type: String, default: "" },
    source: { type: String, default: "seed" }, // "seed" (sample data) or "ai" (discovered live via Gemini search)
  },
  { timestamps: true, _id: false }
);
opportunitySchema.virtual("id").get(function () { return this._id; });
opportunitySchema.set("toJSON", { virtuals: true, versionKey: false, transform: (_d, r) => { delete r._id; return r; } });

// ============ Application ============
const applicationSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    user_id: { type: String, required: true },
    opportunity_id: { type: String, required: true },
    status: { type: String, default: "saved" },
    notes: { type: String, default: "" },
    generated_content: { type: Object, default: {} },
  },
  { timestamps: true, _id: false }
);
applicationSchema.virtual("id").get(function () { return this._id; });
applicationSchema.set("toJSON", { virtuals: true, versionKey: false, transform: (_d, r) => { delete r._id; return r; } });

module.exports = {
  User: mongoose.model("User", userSchema),
  Profile: mongoose.model("Profile", profileSchema),
  Opportunity: mongoose.model("Opportunity", opportunitySchema),
  Application: mongoose.model("Application", applicationSchema),
};

