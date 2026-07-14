const axios = require("axios");

async function fetchGitHubProfile(rawUsername) {
  const username = String(rawUsername).replace(/[^a-zA-Z0-9_-]/g, "");
  if (!username) throw { status: 400, message: "Invalid username" };

  const userResp = await axios.get(`https://api.github.com/users/${username}`, { timeout: 10000, validateStatus: () => true });
  if (userResp.status !== 200) throw { status: 404, message: "GitHub user not found" };
  const user = userResp.data;

  const reposResp = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { timeout: 10000, validateStatus: () => true });
  const repos = reposResp.status === 200 ? reposResp.data : [];

  const langCounts = {};
  const topRepos = [];
  repos.slice(0, 50).forEach((r) => {
    if (r.language) langCounts[r.language] = (langCounts[r.language] || 0) + 1;
    topRepos.push({
      name: r.name,
      description: r.description || "",
      stars: r.stargazers_count || 0,
      forks: r.forks_count || 0,
      language: r.language,
      url: r.html_url,
      updated: r.updated_at,
    });
  });
  topRepos.sort((a, b) => b.stars - a.stars);
  const totalStars = topRepos.reduce((s, r) => s + r.stars, 0);
  const publicRepos = user.public_repos || 0;
  const followers = user.followers || 0;

  const score = Math.min(
    100,
    Math.floor(
      Math.min(publicRepos, 40) * 1.0 +
        Math.min(totalStars, 200) * 0.15 +
        Math.min(followers, 500) * 0.05 +
        Math.min(Object.keys(langCounts).length, 8) * 3.0 +
        20
    )
  );

  return {
    username: user.login,
    name: user.name,
    avatar: user.avatar_url,
    bio: user.bio,
    location: user.location,
    company: user.company,
    blog: user.blog,
    public_repos: publicRepos,
    followers,
    following: user.following || 0,
    total_stars: totalStars,
    languages: Object.entries(langCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    top_repos: topRepos.slice(0, 10),
    developer_score: score,
    profile_url: user.html_url,
  };
}

module.exports = { fetchGitHubProfile };
