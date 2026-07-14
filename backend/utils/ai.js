// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
// const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-flash-latest";

// const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// async function ask(systemInstruction, prompt) {
//   const model = genAI.getGenerativeModel({ model: MODEL_NAME, systemInstruction });
//   const result = await model.generateContent(prompt);
//   return (result.response.text() || "").trim();
// }

// function extractJSON(text) {
//   const fenced = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
//   let candidate = fenced ? fenced[1] : null;
//   if (!candidate) {
//     const s = text.indexOf("{");
//     const e = text.lastIndexOf("}");
//     if (s !== -1 && e > s) candidate = text.slice(s, e + 1);
//   }
//   if (!candidate) return {};
//   try { return JSON.parse(candidate); } catch { return {}; }
// }

// function profileSummary(p = {}) {
//   const per = p.personal || {}, ac = p.academic || {}, sk = p.skills || {};
//   const projects = p.projects || [], achievements = p.achievements || [], social = p.social || {};
//   const lines = [
//     `Name: ${per.name || ""}`,
//     `Location: ${per.location || ""}`,
//     `Bio: ${per.bio || ""}`,
//     `College: ${ac.college || ""} | Degree: ${ac.degree || ""} ${ac.branch || ""} | Year: ${ac.year || ""} | CGPA: ${ac.cgpa || ""}`,
//     `Languages: ${(sk.languages || []).join(", ")}`,
//     `Frameworks: ${(sk.frameworks || []).join(", ")}`,
//     `Tools: ${(sk.tools || []).join(", ")}`,
//     `Soft Skills: ${(sk.soft_skills || []).join(", ")}`,
//   ];
//   if (projects.length) {
//     lines.push("Projects:");
//     projects.slice(0, 6).forEach((pr) => {
//       lines.push(`  - ${pr.title || ""}: ${(pr.description || "").slice(0, 180)} (tech: ${(pr.tech_stack || []).join(", ")})`);
//     });
//   }
//   if (achievements.length) lines.push("Achievements: " + achievements.slice(0, 6).map((a) => a.title || "").join("; "));
//   lines.push(`GitHub: ${social.github || ""} | LinkedIn: ${social.linkedin || ""} | Portfolio: ${social.portfolio || ""}`);
//   if (p.career_goals) lines.push(`Career Goals: ${p.career_goals}`);
//   if (p.resume_text) lines.push(`Resume excerpt: ${(p.resume_text || "").slice(0, 1500)}`);
//   return lines.join("\n");
// }

// function opportunitySummary(o = {}) {
//   return (
//     `Title: ${o.title || ""} at ${o.company || ""}\n` +
//     `Type: ${o.type || ""} | Location: ${o.location || ""} | Deadline: ${o.deadline || ""}\n` +
//     `Description: ${o.description || ""}\n` +
//     `Required Skills: ${(o.required_skills || []).join(", ")}\n` +
//     `Eligibility: ${(o.eligibility || []).join(", ")}`
//   );
// }

// async function analyzeEligibility(profile, opp) {
//   const system =
//     "You are an expert career coach. Analyze how well a student matches an opportunity. " +
//     "Return ONLY valid JSON with keys: match_score (0-100 integer), summary (short string), " +
//     "strengths (array of short strings), missing_skills (array of short strings), " +
//     "recommendations (array of short strings).";
//   const prompt = `STUDENT PROFILE:\n${profileSummary(profile)}\n\nOPPORTUNITY:\n${opportunitySummary(opp)}\n\nReturn JSON only.`;
//   const raw = await ask(system, prompt);
//   const data = extractJSON(raw);
//   const out = Object.keys(data).length
//     ? data
//     : { match_score: 60, summary: "Analysis unavailable", strengths: [], missing_skills: [], recommendations: [] };
//   out.match_score = parseInt(out.match_score || 60, 10);
//   return out;
// }

// async function analyzeResume(resumeText, targetRole = "") {
//   const system =
//     "You are an ATS resume evaluator. Analyze the resume and return ONLY valid JSON with keys: " +
//     "ats_score (0-100 integer), summary (string), strengths (array), missing_keywords (array), " +
//     "improvements (array of specific bullet suggestions), skill_recommendations (array).";
//   const prompt = `TARGET ROLE: ${targetRole || "general software/tech"}\n\nRESUME TEXT:\n${(resumeText || "").slice(0, 6000)}\n\nReturn JSON only.`;
//   const raw = await ask(system, prompt);
//   const data = extractJSON(raw);
//   const out = Object.keys(data).length
//     ? data
//     : { ats_score: 65, summary: "Analysis unavailable", strengths: [], missing_keywords: [], improvements: [], skill_recommendations: [] };
//   out.ats_score = parseInt(out.ats_score || 65, 10);
//   return out;
// }

// async function skillGap(profile, opp) {
//   const system =
//     "You are a learning path advisor. Compare student skills to opportunity requirements. " +
//     "Return ONLY valid JSON with keys: current_skills (array), missing_skills (array), " +
//     "learning_priorities (array of {skill, priority: 'High'|'Medium'|'Low', reason}), " +
//     "resources (array of {title, url, type: 'course'|'doc'|'video'}).";
//   const prompt = `STUDENT PROFILE:\n${profileSummary(profile)}\n\nOPPORTUNITY:\n${opportunitySummary(opp)}\n\nReturn JSON only.`;
//   const raw = await ask(system, prompt);
//   const data = extractJSON(raw);
//   return Object.keys(data).length
//     ? data
//     : { current_skills: [], missing_skills: [], learning_priorities: [], resources: [] };
// }

// async function generateApplicationContent(profile, opp, contentType, extraContext = "") {
//   const labels = {
//     cover_letter: "a personalized cover letter (~300 words)",
//     sop: "a Statement of Purpose (~500 words)",
//     motivation: "a motivation letter (~350 words)",
//     scholarship_essay: "a scholarship essay (~500 words)",
//     tell_us_about_yourself: "a compelling 'Tell us about yourself' response (~250 words)",
//     why_select_you: "a 'Why should we select you?' response (~250 words)",
//     project_description: "an impactful project description for this application (~200 words)",
//   };
//   const label = labels[contentType] || "an application response";
//   const system =
//     "You are an elite application writing coach. Write in first person, warm and professional, " +
//     "authentic and specific. Reference the student's actual skills and projects. Avoid clichés.";
//   const oppBlock = opp && Object.keys(opp).length ? opportunitySummary(opp) : "General application.";
//   const prompt =
//     `Write ${label} for the following:\n\n` +
//     `STUDENT PROFILE:\n${profileSummary(profile)}\n\n` +
//     `OPPORTUNITY:\n${oppBlock}\n\n` +
//     `ADDITIONAL CONTEXT: ${extraContext || "none"}\n\n` +
//     `Write the final content only, no preamble.`;
//   return (await ask(system, prompt)).trim();
// }

// module.exports = { analyzeEligibility, analyzeResume, skillGap, generateApplicationContent };
const { GoogleGenerativeAI } = require("@google/generative-ai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-flash-latest";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function ask(systemInstruction, prompt) {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME, systemInstruction });
  const result = await model.generateContent(prompt);
  return (result.response.text() || "").trim();
}

function extractJSON(text) {
  const fenced = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  let candidate = fenced ? fenced[1] : null;
  if (!candidate) {
    const s = text.indexOf("{");
    const e = text.lastIndexOf("}");
    if (s !== -1 && e > s) candidate = text.slice(s, e + 1);
  }
  if (!candidate) return {};
  try { return JSON.parse(candidate); } catch { return {}; }
}

function profileSummary(p = {}) {
  const per = p.personal || {}, ac = p.academic || {}, sk = p.skills || {};
  const projects = p.projects || [], achievements = p.achievements || [], social = p.social || {};
  const lines = [
    `Name: ${per.name || ""}`,
    `Location: ${per.location || ""}`,
    `Bio: ${per.bio || ""}`,
    `College: ${ac.college || ""} | Degree: ${ac.degree || ""} ${ac.branch || ""} | Year: ${ac.year || ""} | CGPA: ${ac.cgpa || ""}`,
    `Languages: ${(sk.languages || []).join(", ")}`,
    `Frameworks: ${(sk.frameworks || []).join(", ")}`,
    `Tools: ${(sk.tools || []).join(", ")}`,
    `Soft Skills: ${(sk.soft_skills || []).join(", ")}`,
  ];
  if (projects.length) {
    lines.push("Projects:");
    projects.slice(0, 6).forEach((pr) => {
      lines.push(`  - ${pr.title || ""}: ${(pr.description || "").slice(0, 180)} (tech: ${(pr.tech_stack || []).join(", ")})`);
    });
  }
  if (achievements.length) lines.push("Achievements: " + achievements.slice(0, 6).map((a) => a.title || "").join("; "));
  lines.push(`GitHub: ${social.github || ""} | LinkedIn: ${social.linkedin || ""} | Portfolio: ${social.portfolio || ""}`);
  if (p.career_goals) lines.push(`Career Goals: ${p.career_goals}`);
  if (p.resume_text) lines.push(`Resume excerpt: ${(p.resume_text || "").slice(0, 1500)}`);
  return lines.join("\n");
}

function opportunitySummary(o = {}) {
  return (
    `Title: ${o.title || ""} at ${o.company || ""}\n` +
    `Type: ${o.type || ""} | Location: ${o.location || ""} | Deadline: ${o.deadline || ""}\n` +
    `Description: ${o.description || ""}\n` +
    `Required Skills: ${(o.required_skills || []).join(", ")}\n` +
    `Eligibility: ${(o.eligibility || []).join(", ")}`
  );
}

async function analyzeEligibility(profile, opp) {
  const system =
    "You are an expert career coach. Analyze how well a student matches an opportunity. " +
    "Return ONLY valid JSON with keys: match_score (0-100 integer), summary (short string), " +
    "strengths (array of short strings), missing_skills (array of short strings), " +
    "recommendations (array of short strings).";
  const prompt = `STUDENT PROFILE:\n${profileSummary(profile)}\n\nOPPORTUNITY:\n${opportunitySummary(opp)}\n\nReturn JSON only.`;
  const raw = await ask(system, prompt);
  const data = extractJSON(raw);
  const out = Object.keys(data).length
    ? data
    : { match_score: 60, summary: "Analysis unavailable", strengths: [], missing_skills: [], recommendations: [] };
  out.match_score = parseInt(out.match_score || 60, 10);
  return out;
}

async function analyzeResume(resumeText, targetRole = "") {
  const system =
    "You are an ATS resume evaluator. Analyze the resume and return ONLY valid JSON with keys: " +
    "ats_score (0-100 integer), summary (string), strengths (array), missing_keywords (array), " +
    "improvements (array of specific bullet suggestions), skill_recommendations (array).";
  const prompt = `TARGET ROLE: ${targetRole || "general software/tech"}\n\nRESUME TEXT:\n${(resumeText || "").slice(0, 6000)}\n\nReturn JSON only.`;
  const raw = await ask(system, prompt);
  const data = extractJSON(raw);
  const out = Object.keys(data).length
    ? data
    : { ats_score: 65, summary: "Analysis unavailable", strengths: [], missing_keywords: [], improvements: [], skill_recommendations: [] };
  out.ats_score = parseInt(out.ats_score || 65, 10);
  return out;
}

async function skillGap(profile, opp) {
  const system =
    "You are a learning path advisor. Compare student skills to opportunity requirements. " +
    "Return ONLY valid JSON with keys: current_skills (array), missing_skills (array), " +
    "learning_priorities (array of {skill, priority: 'High'|'Medium'|'Low', reason}), " +
    "resources (array of {title, url, type: 'course'|'doc'|'video'}).";
  const prompt = `STUDENT PROFILE:\n${profileSummary(profile)}\n\nOPPORTUNITY:\n${opportunitySummary(opp)}\n\nReturn JSON only.`;
  const raw = await ask(system, prompt);
  const data = extractJSON(raw);
  return Object.keys(data).length
    ? data
    : { current_skills: [], missing_skills: [], learning_priorities: [], resources: [] };
}

async function generateApplicationContent(profile, opp, contentType, extraContext = "") {
  const labels = {
    cover_letter: "a personalized cover letter (~300 words)",
    sop: "a Statement of Purpose (~500 words)",
    motivation: "a motivation letter (~350 words)",
    scholarship_essay: "a scholarship essay (~500 words)",
    tell_us_about_yourself: "a compelling 'Tell us about yourself' response (~250 words)",
    why_select_you: "a 'Why should we select you?' response (~250 words)",
    project_description: "an impactful project description for this application (~200 words)",
  };
  const label = labels[contentType] || "an application response";
  const system =
    "You are an elite application writing coach. Write in first person, warm and professional, " +
    "authentic and specific. Reference the student's actual skills and projects. Avoid clichés.";
  const oppBlock = opp && Object.keys(opp).length ? opportunitySummary(opp) : "General application.";
  const prompt =
    `Write ${label} for the following:\n\n` +
    `STUDENT PROFILE:\n${profileSummary(profile)}\n\n` +
    `OPPORTUNITY:\n${oppBlock}\n\n` +
    `ADDITIONAL CONTEXT: ${extraContext || "none"}\n\n` +
    `Write the final content only, no preamble.`;
  return (await ask(system, prompt)).trim();
}

// Finds real, current opportunities by actually searching the web (free,
// keyless — see utils/search.js), then asks Gemini to extract/structure only
// what's genuinely present in those search results. This avoids both (a)
// Gemini's paid Google Search grounding tool, and (b) generic/invented
// results from relying on the model's memory alone.
async function discoverOpportunities(criteria = "") {
  const { webSearch } = require("./search");

  const queries = criteria
    ? [`${criteria} apply`, `${criteria} registration open India students`]
    : [
        "internship for engineering students India 2026 apply now",
        "hackathon India 2026 registration open students",
        "scholarship India engineering students 2026 apply",
        "fellowship program India college students 2026",
      ];

  let allResults = [];
  for (const q of queries) {
    const r = await webSearch(q, 6);
    allResults = allResults.concat(r);
  }
  // De-duplicate by URL
  const seen = new Set();
  allResults = allResults.filter((r) => {
    if (seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });

  if (!allResults.length) {
    throw new Error(
      "Web search returned no results (the search step may be temporarily blocked or rate-limited) — try again in a moment."
    );
  }

  const snippetsBlock = allResults
    .map((r, i) => `[${i + 1}] ${r.title}\nURL: ${r.url}\nSnippet: ${r.snippet}`)
    .join("\n\n");

  const system =
    "You extract structured opportunity listings STRICTLY from the search results provided. " +
    "Do NOT invent opportunities, organizations, or URLs that are not present in the results below. " +
    "Skip any result that clearly is not a genuine internship/hackathon/scholarship/fellowship/" +
    "competition/research opportunity for students (e.g. skip news articles, blog posts, or unrelated " +
    "pages). Use the exact URL given for the matching result as apply_url — never alter or invent a URL. " +
    "If a field (like stipend or exact deadline) isn't stated in the snippet, use a reasonable placeholder " +
    "like \"See listing\" rather than guessing a specific number or date. " +
    "Return ONLY a JSON array (no markdown fences, no prose) where each item has exactly these keys: " +
    'title (string), company (string), ' +
    'type (one of "internship","hackathon","scholarship","fellowship","competition","research"), ' +
    'location (string), deadline (string), stipend (string, "" if not applicable), ' +
    'difficulty (one of "Beginner","Intermediate","Advanced"), duration (string), ' +
    'description (string, 1-2 sentences based on the snippet), required_skills (array of strings), ' +
    'eligibility (array of strings), tags (array of strings), apply_url (string, exact URL from results).';

  const prompt =
    `SEARCH RESULTS:\n\n${snippetsBlock}\n\n` +
    `Extract the real, genuine opportunities from the search results above as a JSON array. ` +
    `Only include results that are clearly actual opportunities for students — it's fine to return fewer ` +
    `than the number of search results if most aren't genuine opportunities.`;

  const raw = await ask(system, prompt);
  return extractJSONArray(raw);
}

function extractJSONArray(text) {
  const fenced = text.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
  let candidate = fenced ? fenced[1] : null;
  if (!candidate) {
    const s = text.indexOf("[");
    const e = text.lastIndexOf("]");
    if (s !== -1 && e > s) candidate = text.slice(s, e + 1);
  }
  if (!candidate) return [];
  try { return JSON.parse(candidate); } catch { return []; }
}

module.exports = { analyzeEligibility, analyzeResume, skillGap, generateApplicationContent, discoverOpportunities };

