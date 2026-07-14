import React, { useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Github as GithubIcon, Star, Users, GitBranch, ExternalLink } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function GithubIntel() {
  const [uname, setUname] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    const clean = uname.trim().replace(/^.*github\.com\//, "").replace(/\/$/, "");
    if (!clean) return toast.error("Enter GitHub username");
    setLoading(true);
    try {
      const { data } = await api.get(`/github/${clean}`);
      setData(data);
    } catch (e) {
      toast.error(e.response?.data?.detail || "GitHub fetch failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <div className="overline">GitHub Intelligence</div>
        <h1 className="font-display text-3xl font-bold tracking-tight mt-1">Your Developer Score</h1>
        <p className="text-neutral-600 mt-1 text-sm">Analyze public repos, languages, and contributions to boost your profile.</p>
      </div>

      <div className="glass-strong rounded-3xl p-6 flex flex-col md:flex-row gap-3">
        <Input className="rounded-xl h-11 flex-1" value={uname} onChange={(e) => setUname(e.target.value)} placeholder="GitHub username (e.g., torvalds)" data-testid="gh-username" />
        <Button className="rounded-full btn-coral border-0 h-11 px-6" onClick={analyze} disabled={loading} data-testid="gh-analyze">
          <GithubIcon className="w-4 h-4 mr-1" /> {loading ? "Analyzing..." : "Analyze"}
        </Button>
      </div>

      {data && (
        <div className="space-y-4">
          <div className="glass-strong rounded-3xl p-6 flex flex-col md:flex-row md:items-center gap-4">
            <img src={data.avatar} alt="" className="w-20 h-20 rounded-2xl" />
            <div className="flex-1">
              <div className="font-display text-2xl font-bold">{data.name || data.username}</div>
              <div className="text-neutral-600 text-sm">@{data.username} {data.company && `• ${data.company}`}</div>
              {data.bio && <p className="text-sm text-neutral-600 mt-1">{data.bio}</p>}
              <a href={data.profile_url} target="_blank" rel="noreferrer" className="text-sm text-orange-600 hover:underline mt-1 inline-flex items-center gap-1">View on GitHub <ExternalLink className="w-3 h-3" /></a>
            </div>
            <div className="text-center md:text-right">
              <div className="overline">Developer Score</div>
              <div className="font-display text-5xl font-bold gradient-text">{data.developer_score}</div>
              <Progress value={data.developer_score} className="mt-2 h-2 w-40" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="glass rounded-2xl p-5">
              <div className="overline">Public Repos</div>
              <div className="font-display text-3xl font-bold mt-1">{data.public_repos}</div>
            </div>
            <div className="glass rounded-2xl p-5">
              <div className="overline">Total Stars</div>
              <div className="font-display text-3xl font-bold mt-1 flex items-center gap-2"><Star className="w-6 h-6 text-yellow-500" /> {data.total_stars}</div>
            </div>
            <div className="glass rounded-2xl p-5">
              <div className="overline">Followers</div>
              <div className="font-display text-3xl font-bold mt-1 flex items-center gap-2"><Users className="w-6 h-6 text-purple-500" /> {data.followers}</div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="overline">Language Portfolio</div>
            <div className="flex flex-wrap gap-2 mt-3">
              {data.languages.map((l) => <span key={l.name} className="chip chip-lavender">{l.name} <span className="opacity-60">×{l.count}</span></span>)}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="overline">Top Repositories</div>
            <div className="mt-3 divide-y divide-neutral-100">
              {data.top_repos.map((r) => (
                <a key={r.name} href={r.url} target="_blank" rel="noreferrer" className="py-3 flex items-center justify-between hover:bg-neutral-50 rounded-lg px-2 transition-colors">
                  <div>
                    <div className="font-semibold">{r.name} {r.language && <span className="chip ml-2">{r.language}</span>}</div>
                    <div className="text-sm text-neutral-500 line-clamp-1">{r.description || "No description"}</div>
                  </div>
                  <div className="flex gap-4 text-sm text-neutral-600">
                    <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" /> {r.stars}</span>
                    <span className="flex items-center gap-1"><GitBranch className="w-4 h-4" /> {r.forks}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
