import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Sparkles, CheckCircle2, XCircle, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export default function Resume() {
  const [role, setRole] = useState("");
  const [result, setResult] = useState(null);
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: async () => (await api.get("/profile")).data });

  const analyze = useMutation({
    mutationFn: async () => (await api.post("/ai/analyze-resume", { resume_text: profile?.resume_text || "", target_role: role })).data,
    onSuccess: (d) => { setResult(d); toast.success("Resume analyzed"); },
    onError: (e) => toast.error(e.response?.data?.detail || "Analysis failed"),
  });

  const hasResume = !!profile?.resume_text;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <div className="overline">AI Resume Intelligence</div>
        <h1 className="font-display text-3xl font-bold tracking-tight mt-1">Boost your ATS score</h1>
        <p className="text-neutral-600 mt-1 text-sm">Upload your resume in the Passport tab, then analyze here.</p>
      </div>

      <div className="glass-strong rounded-3xl p-6 md:p-8">
        <div className="grid md:grid-cols-[1fr_auto] gap-4 items-end">
          <div>
            <Label>Target role (optional)</Label>
            <Input className="rounded-xl h-11 mt-1" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Frontend Intern, ML Research Intern" data-testid="resume-role" />
          </div>
          <Button className="rounded-full btn-coral border-0 h-11 px-6" onClick={() => analyze.mutate()} disabled={!hasResume || analyze.isPending} data-testid="analyze-resume-btn">
            <Sparkles className="w-4 h-4 mr-1" /> {analyze.isPending ? "Analyzing..." : "Analyze Resume"}
          </Button>
        </div>
        {!hasResume && <p className="text-sm text-orange-600 mt-3">Add resume text in Passport → Documents first.</p>}
      </div>

      {result && (
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="glass rounded-2xl p-6">
            <div className="overline">ATS Score</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-5xl font-bold">{result.ats_score}</span>
              <span className="text-sm text-neutral-500">/ 100</span>
            </div>
            <Progress value={result.ats_score} className="mt-3 h-2" />
            <p className="text-sm text-neutral-600 mt-3">{result.summary}</p>
          </div>

          <div className="glass rounded-2xl p-6 lg:col-span-2">
            <div className="overline">Improvements</div>
            <ul className="mt-3 space-y-2 text-sm">
              {(result.improvements || []).map((imp, i) => (
                <li key={i} className="flex gap-2"><TrendingUp className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" /> {imp}</li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="overline">Strengths</div>
            <ul className="mt-3 space-y-2 text-sm">
              {(result.strengths || []).map((s, i) => <li key={i} className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> {s}</li>)}
            </ul>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="overline">Missing Keywords</div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {(result.missing_keywords || []).map((k, i) => <span key={i} className="chip chip-coral">{k}</span>)}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="overline">Skill Recommendations</div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {(result.skill_recommendations || []).map((k, i) => <span key={i} className="chip chip-lavender">{k}</span>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
