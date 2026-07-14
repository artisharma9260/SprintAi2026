import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Copy, Wand2 } from "lucide-react";
import { toast } from "sonner";

const TYPES = [
  { key: "cover_letter", label: "Cover Letter" },
  { key: "sop", label: "Statement of Purpose" },
  { key: "motivation", label: "Motivation Letter" },
  { key: "scholarship_essay", label: "Scholarship Essay" },
  { key: "tell_us_about_yourself", label: "Tell Us About Yourself" },
  { key: "why_select_you", label: "Why Should We Select You?" },
  { key: "project_description", label: "Project Description" },
];

export default function AiAssistant() {
  const [type, setType] = useState("cover_letter");
  const [oppId, setOppId] = useState("");
  const [extra, setExtra] = useState("");
  const [output, setOutput] = useState("");

  const { data: opps = [] } = useQuery({ queryKey: ["opportunities-all"], queryFn: async () => (await api.get("/opportunities")).data });

  const generate = useMutation({
    mutationFn: async () => (await api.post("/ai/generate", { opportunity_id: oppId || null, content_type: type, extra_context: extra })).data,
    onSuccess: (d) => { setOutput(d.content); toast.success("Content generated"); },
    onError: () => toast.error("Generation failed"),
  });

  const copy = () => { navigator.clipboard.writeText(output); toast.success("Copied to clipboard"); };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <div className="overline">AI Application Assistant</div>
        <h1 className="font-display text-3xl font-bold tracking-tight mt-1">Generate application content</h1>
        <p className="text-neutral-600 mt-1 text-sm">Powered by your Universal Student Passport.</p>
      </div>

      <div className="glass-strong rounded-3xl p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Content Type</Label>
            <select className="mt-1 w-full h-11 rounded-xl border border-neutral-200 px-3 bg-white" value={type} onChange={(e) => setType(e.target.value)} data-testid="ai-type">
              {TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <Label>Opportunity (optional)</Label>
            <select className="mt-1 w-full h-11 rounded-xl border border-neutral-200 px-3 bg-white" value={oppId} onChange={(e) => setOppId(e.target.value)} data-testid="ai-opp">
              <option value="">— Generic / no opportunity —</option>
              {opps.map((o) => <option key={o.id} value={o.id}>{`${o.title} — ${o.company}`}</option>)}
            </select>
          </div>
        </div>
        <div>
          <Label>Extra context (optional)</Label>
          <Textarea className="rounded-xl mt-1" rows={2} value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="Any additional details you want AI to highlight..." data-testid="ai-extra" />
        </div>
        <div className="flex justify-end">
          <Button className="rounded-full btn-coral border-0 h-11 px-6" onClick={() => generate.mutate()} disabled={generate.isPending} data-testid="ai-generate-btn">
            <Sparkles className="w-4 h-4 mr-1" /> {generate.isPending ? "Generating..." : "Generate"}
          </Button>
        </div>
      </div>

      {output && (
        <div className="glass-strong rounded-3xl p-6" data-testid="ai-output">
          <div className="flex items-center justify-between mb-3">
            <div className="overline flex items-center gap-2"><Wand2 className="w-4 h-4 text-orange-500" /> AI Output</div>
            <Button variant="outline" size="sm" onClick={copy} className="rounded-full"><Copy className="w-3 h-3 mr-1" /> Copy</Button>
          </div>
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-800 font-[Manrope]">{output}</div>
        </div>
      )}
    </div>
  );
}
