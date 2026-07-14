import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, MapPin, Calendar, IndianRupee, Sparkles, Target, CheckCircle2, XCircle, Lightbulb, Bookmark } from "lucide-react";
import { toast } from "sonner";

export default function OpportunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [analysis, setAnalysis] = useState(null);
  const [gap, setGap] = useState(null);

  const { data: opp } = useQuery({ queryKey: ["opportunity", id], queryFn: async () => (await api.get(`/opportunities/${id}`)).data });

  const eligibility = useMutation({
    mutationFn: async () => (await api.post(`/opportunities/${id}/eligibility`)).data,
    onSuccess: (d) => setAnalysis(d),
    onError: () => toast.error("Analysis failed"),
  });
  const skillGap = useMutation({
    mutationFn: async () => (await api.post("/ai/skill-gap", { opportunity_id: id })).data,
    onSuccess: (d) => setGap(d),
    onError: () => toast.error("Skill gap failed"),
  });
  const saveApp = useMutation({
    mutationFn: async (status) => (await api.post("/applications", { opportunity_id: id, status })).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["applications"] }); toast.success("Saved to Applications"); },
  });

  if (!opp) return <div className="text-neutral-500">Loading…</div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <Button variant="ghost" onClick={() => navigate(-1)} className="rounded-full" data-testid="back-btn">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </Button>

      <div className="glass-strong rounded-3xl p-8">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center text-3xl">{opp.logo || "✨"}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="chip chip-lavender capitalize">{opp.type}</span>
              <span className="chip chip-coral">{opp.difficulty}</span>
              {opp.tags?.slice(0, 3).map((t) => <span key={t} className="chip">{t}</span>)}
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mt-3">{opp.title}</h1>
            <div className="text-neutral-600 mt-1">{opp.company}</div>
            <div className="flex flex-wrap gap-4 text-sm text-neutral-700 mt-3">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {opp.location}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Deadline {opp.deadline}</span>
              {opp.stipend && <span className="flex items-center gap-1"><IndianRupee className="w-4 h-4" /> {opp.stipend}</span>}
              {opp.duration && <span>⏱ {opp.duration}</span>}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button className="rounded-full btn-coral border-0" onClick={() => eligibility.mutate()} disabled={eligibility.isPending} data-testid="analyze-btn">
            <Target className="w-4 h-4 mr-1" /> {eligibility.isPending ? "Analyzing..." : "AI Eligibility Analysis"}
          </Button>
          <Button variant="outline" className="rounded-full" onClick={() => skillGap.mutate()} disabled={skillGap.isPending} data-testid="skill-gap-btn">
            <Lightbulb className="w-4 h-4 mr-1" /> {skillGap.isPending ? "Analyzing..." : "Skill Gap"}
          </Button>
          <Button variant="outline" className="rounded-full" onClick={() => saveApp.mutate("saved")} data-testid="save-btn">
            <Bookmark className="w-4 h-4 mr-1" /> Save
          </Button>
          <Button className="rounded-full bg-neutral-900 text-white hover:bg-neutral-800" onClick={() => { saveApp.mutate("applied"); navigate("/app/assistant"); }} data-testid="apply-btn">
            <Sparkles className="w-4 h-4 mr-1" /> Smart Apply
          </Button>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <div className="overline">Description</div>
          <p className="mt-2 text-neutral-700 leading-relaxed">{opp.description}</p>
          <div className="mt-6">
            <div className="overline">Required Skills</div>
            <div className="mt-2 flex flex-wrap gap-1.5">{opp.required_skills.map((s) => <span key={s} className="chip chip-coral">{s}</span>)}</div>
          </div>
          <div className="mt-6">
            <div className="overline">Eligibility</div>
            <ul className="mt-2 space-y-1 text-sm text-neutral-700">
              {opp.eligibility?.map((e, i) => <li key={i} className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> {e}</li>)}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          {analysis && (
            <div className="glass rounded-2xl p-6" data-testid="analysis-panel">
              <div className="overline">AI Eligibility</div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold">{analysis.match_score}%</span>
                <span className="text-sm text-neutral-500">match</span>
              </div>
              <Progress value={analysis.match_score} className="mt-2 h-2" />
              <p className="text-sm text-neutral-600 mt-3">{analysis.summary}</p>
              {analysis.strengths?.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs font-semibold text-emerald-700 mb-1">Strengths</div>
                  <ul className="space-y-1 text-sm">{analysis.strengths.map((s, i) => <li key={i} className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> {s}</li>)}</ul>
                </div>
              )}
              {analysis.missing_skills?.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs font-semibold text-rose-700 mb-1">Missing</div>
                  <ul className="space-y-1 text-sm">{analysis.missing_skills.map((s, i) => <li key={i} className="flex gap-2"><XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" /> {s}</li>)}</ul>
                </div>
              )}
            </div>
          )}
          {gap && (
            <div className="glass rounded-2xl p-6" data-testid="gap-panel">
              <div className="overline">Skill Gap</div>
              <div className="mt-3 space-y-2">
                {gap.learning_priorities?.slice(0, 5).map((p, i) => (
                  <div key={i} className="text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`chip ${p.priority === "High" ? "chip-coral" : p.priority === "Medium" ? "chip-gold" : "chip-sage"}`}>{p.priority}</span>
                      <span className="font-medium">{p.skill}</span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-1">{p.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
