const axios = require("axios");

// Free web search via Serper.dev (official Google SERP API). Free tier:
// 2,500 queries, no credit card required. Sign up at https://serper.dev,
// copy the API key from the dashboard, and set SERPER_API_KEY in backend/.env.
//
// (Previously this scraped DuckDuckGo's HTML directly, but DuckDuckGo
// actively blocks that with a bot-check page — Serper is an official,
// reliable API instead.)
async function webSearch(query, maxResults = 6) {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "SERPER_API_KEY is not set. Get a free key (no credit card required) at https://serper.dev and add it to backend/.env"
    );
  }

  try {
    const resp = await axios.post(
      "https://google.serper.dev/search",
      { q: query, num: maxResults },
      { headers: { "X-API-KEY": apiKey, "Content-Type": "application/json" }, timeout: 10000 }
    );
    const organic = resp.data?.organic || [];
    const results = organic.slice(0, maxResults).map((r) => ({
      title: r.title || "",
      url: r.link || "",
      snippet: r.snippet || "",
    }));
    console.log(`Web search "${query}": found ${results.length} result(s)`);
    return results;
  } catch (e) {
    console.error(`Web search failed for query "${query}":`, e.response?.data || e.message);
    return [];
  }
}

module.exports = { webSearch };