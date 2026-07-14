import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Upload, User, GraduationCap, Wrench, Rocket, Award, Link2, Github } from "lucide-react";
import { toast } from "sonner";

function TagInput({ value = [], onChange, placeholder = "Add and press Enter", testid }) {
  const [text, setText] = useState("");
  const add = () => {
    const v = text.trim();
    if (v && !value.includes(v)) onChange([...value, v]);
    setText("");
  };
  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-2">
        {value.map((t) => (
          <span key={t} className="chip chip-lavender">
            {t}
            <button type="button" onClick={() => onChange(value.filter((x) => x !== t))} className="ml-1 opacity-60 hover:opacity-100">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          className="rounded-xl h-10"
          data-testid={testid}
        />
        <Button type="button" variant="outline" className="rounded-xl h-10" onClick={add}><Plus className="w-4 h-4" /></Button>
      </div>
    </div>
  );
}

export default function Passport() {
  const qc = useQueryClient();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => (await api.get("/profile")).data,
  });
  const [form, setForm] = useState(null);
  useEffect(() => { if (profile) setForm(JSON.parse(JSON.stringify(profile))); }, [profile]);

  const save = useMutation({
    mutationFn: async (payload) => (await api.put("/profile", payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Passport saved");
    },
    onError: () => toast.error("Save failed"),
  });

  if (isLoading || !form) return <div className="text-neutral-500">Loading passport…</div>;

  const set = (path, val) => {
    setForm((f) => {
      const c = { ...f };
      const parts = path.split(".");
      let ref = c;
      for (let i = 0; i < parts.length - 1; i++) {
        ref[parts[i]] = { ...ref[parts[i]] };
        ref = ref[parts[i]];
      }
      ref[parts[parts.length - 1]] = val;
      return c;
    });
  };

  const addProject = () => set("projects", [...(form.projects || []), { id: crypto.randomUUID(), title: "", description: "", tech_stack: [], github_url: "", live_url: "", source: "manual" }]);
  const updProject = (i, k, v) => {
    const arr = [...(form.projects || [])];
    arr[i] = { ...arr[i], [k]: v };
    set("projects", arr);
  };
  const delProject = (i) => set("projects", form.projects.filter((_, idx) => idx !== i));

  const addAch = () => set("achievements", [...(form.achievements || []), { id: crypto.randomUUID(), title: "", type: "certification", issuer: "", date: "", description: "" }]);
  const updAch = (i, k, v) => {
    const arr = [...(form.achievements || [])];
    arr[i] = { ...arr[i], [k]: v };
    set("achievements", arr);
  };
  const delAch = (i) => set("achievements", form.achievements.filter((_, idx) => idx !== i));

  const onResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { toast.error("Max 3MB"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      set("resume_base64", base64);
      set("resume_filename", file.name);
    };
    reader.readAsDataURL(file);
    // Also read as text (best-effort for text/pdf snippets)
    const tr = new FileReader();
    tr.onload = () => set("resume_text", (tr.result || "").toString().slice(0, 15000));
    tr.readAsText(file);
    toast.success("Resume loaded — click Save to store");
  };

  const importGitHub = async () => {
    const uname = form.social?.github?.trim().replace(/^.*github\.com\//, "").replace(/\/$/, "");
    if (!uname) return toast.error("Enter GitHub username first");
    try {
      const { data } = await api.get(`/github/${uname}`);
      const imported = data.top_repos.slice(0, 6).map((r) => ({
        id: crypto.randomUUID(), title: r.name, description: r.description || "", tech_stack: r.language ? [r.language] : [], github_url: r.url, live_url: "", source: "github",
      }));
      set("projects", [...(form.projects || []), ...imported]);
      // add languages to skills
      const langs = Array.from(new Set([...(form.skills?.languages || []), ...data.languages.slice(0, 8).map((l) => l.name)]));
      set("skills.languages", langs);
      toast.success(`Imported ${imported.length} projects from GitHub`);
    } catch (e) {
      toast.error(e.response?.data?.detail || "GitHub import failed");
    }
  };

  const onSave = () => save.mutate(form);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="overline">Universal Student Passport</div>
          <h1 className="font-display text-3xl font-bold tracking-tight mt-1">Your one-and-only profile</h1>
        </div>
        <Button className="rounded-full btn-coral border-0 h-10" onClick={onSave} disabled={save.isPending} data-testid="passport-save">
          {save.isPending ? "Saving..." : "Save Passport"}
        </Button>
      </div>

      <Tabs defaultValue="personal" className="glass rounded-2xl p-2">
        <TabsList className="bg-transparent flex-wrap h-auto gap-1">
          <TabsTrigger value="personal" data-testid="tab-personal"><User className="w-4 h-4 mr-1" /> Personal</TabsTrigger>
          <TabsTrigger value="academic" data-testid="tab-academic"><GraduationCap className="w-4 h-4 mr-1" /> Academic</TabsTrigger>
          <TabsTrigger value="skills" data-testid="tab-skills"><Wrench className="w-4 h-4 mr-1" /> Skills</TabsTrigger>
          <TabsTrigger value="projects" data-testid="tab-projects"><Rocket className="w-4 h-4 mr-1" /> Projects</TabsTrigger>
          <TabsTrigger value="achievements" data-testid="tab-achievements"><Award className="w-4 h-4 mr-1" /> Achievements</TabsTrigger>
          <TabsTrigger value="documents" data-testid="tab-documents"><Upload className="w-4 h-4 mr-1" /> Documents</TabsTrigger>
          <TabsTrigger value="social" data-testid="tab-social"><Link2 className="w-4 h-4 mr-1" /> Social</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="p-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label>Full Name</Label><Input className="rounded-xl h-10 mt-1" value={form.personal?.name || ""} onChange={(e) => set("personal.name", e.target.value)} data-testid="p-name" /></div>
            <div><Label>Phone</Label><Input className="rounded-xl h-10 mt-1" value={form.personal?.phone || ""} onChange={(e) => set("personal.phone", e.target.value)} data-testid="p-phone" /></div>
            <div><Label>Location</Label><Input className="rounded-xl h-10 mt-1" value={form.personal?.location || ""} onChange={(e) => set("personal.location", e.target.value)} data-testid="p-location" /></div>
            <div className="md:col-span-2"><Label>Short Bio</Label><Textarea className="rounded-xl mt-1" rows={3} value={form.personal?.bio || ""} onChange={(e) => set("personal.bio", e.target.value)} data-testid="p-bio" /></div>
            <div className="md:col-span-2"><Label>Career Goals</Label><Textarea className="rounded-xl mt-1" rows={3} value={form.career_goals || ""} onChange={(e) => set("career_goals", e.target.value)} data-testid="p-goals" placeholder="e.g. Land an SWE internship at a top product company by Summer 2027" /></div>
          </div>
        </TabsContent>

        <TabsContent value="academic" className="p-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label>College / University</Label><Input className="rounded-xl h-10 mt-1" value={form.academic?.college || ""} onChange={(e) => set("academic.college", e.target.value)} data-testid="a-college" /></div>
            <div><Label>Degree</Label><Input className="rounded-xl h-10 mt-1" value={form.academic?.degree || ""} onChange={(e) => set("academic.degree", e.target.value)} placeholder="B.Tech / M.Tech / B.Sc" /></div>
            <div><Label>Branch</Label><Input className="rounded-xl h-10 mt-1" value={form.academic?.branch || ""} onChange={(e) => set("academic.branch", e.target.value)} placeholder="Computer Science" /></div>
            <div><Label>Year</Label><Input className="rounded-xl h-10 mt-1" value={form.academic?.year || ""} onChange={(e) => set("academic.year", e.target.value)} placeholder="3rd Year" /></div>
            <div><Label>CGPA</Label><Input className="rounded-xl h-10 mt-1" value={form.academic?.cgpa || ""} onChange={(e) => set("academic.cgpa", e.target.value)} placeholder="8.6" /></div>
            <div><Label>Graduation Year</Label><Input className="rounded-xl h-10 mt-1" value={form.academic?.graduation_year || ""} onChange={(e) => set("academic.graduation_year", e.target.value)} placeholder="2027" /></div>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="p-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div><Label className="mb-2 block">Languages</Label><TagInput value={form.skills?.languages || []} onChange={(v) => set("skills.languages", v)} testid="s-languages" /></div>
            <div><Label className="mb-2 block">Frameworks & Libraries</Label><TagInput value={form.skills?.frameworks || []} onChange={(v) => set("skills.frameworks", v)} testid="s-frameworks" /></div>
            <div><Label className="mb-2 block">Tools & Platforms</Label><TagInput value={form.skills?.tools || []} onChange={(v) => set("skills.tools", v)} testid="s-tools" /></div>
            <div><Label className="mb-2 block">Soft Skills</Label><TagInput value={form.skills?.soft_skills || []} onChange={(v) => set("skills.soft_skills", v)} testid="s-soft" /></div>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-neutral-600">Add manually or import from GitHub (fill Social tab first)</div>
            <div className="flex gap-2">
              <Button variant="outline" className="rounded-xl h-9" onClick={importGitHub} data-testid="import-github-btn"><Github className="w-4 h-4 mr-1" /> Import GitHub</Button>
              <Button className="rounded-xl h-9 btn-coral border-0" onClick={addProject} data-testid="add-project-btn"><Plus className="w-4 h-4 mr-1" /> Add Project</Button>
            </div>
          </div>
          {(form.projects || []).map((p, i) => (
            <Card key={p.id} className="rounded-2xl border-neutral-100">
              <CardContent className="p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <Badge className={p.source === "github" ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-700"}>{p.source}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => delProject(i)}><X className="w-4 h-4" /></Button>
                </div>
                <Input className="rounded-xl h-10" placeholder="Title" value={p.title} onChange={(e) => updProject(i, "title", e.target.value)} />
                <Textarea className="rounded-xl" placeholder="Description" value={p.description} onChange={(e) => updProject(i, "description", e.target.value)} />
                <TagInput value={p.tech_stack} onChange={(v) => updProject(i, "tech_stack", v)} placeholder="Add tech" />
                <div className="grid md:grid-cols-2 gap-3">
                  <Input className="rounded-xl h-10" placeholder="GitHub URL" value={p.github_url} onChange={(e) => updProject(i, "github_url", e.target.value)} />
                  <Input className="rounded-xl h-10" placeholder="Live URL" value={p.live_url} onChange={(e) => updProject(i, "live_url", e.target.value)} />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="achievements" className="p-4 space-y-4">
          <div className="flex justify-end">
            <Button className="rounded-xl h-9 btn-coral border-0" onClick={addAch} data-testid="add-ach-btn"><Plus className="w-4 h-4 mr-1" /> Add Achievement</Button>
          </div>
          {(form.achievements || []).map((a, i) => (
            <Card key={a.id} className="rounded-2xl border-neutral-100">
              <CardContent className="p-5 space-y-3">
                <div className="flex justify-end"><Button variant="ghost" size="sm" onClick={() => delAch(i)}><X className="w-4 h-4" /></Button></div>
                <div className="grid md:grid-cols-2 gap-3">
                  <Input className="rounded-xl h-10" placeholder="Title" value={a.title} onChange={(e) => updAch(i, "title", e.target.value)} />
                  <select className="rounded-xl h-10 border border-neutral-200 px-3" value={a.type} onChange={(e) => updAch(i, "type", e.target.value)}>
                    <option value="certification">Certification</option>
                    <option value="award">Award</option>
                    <option value="hackathon">Hackathon</option>
                  </select>
                  <Input className="rounded-xl h-10" placeholder="Issuer" value={a.issuer} onChange={(e) => updAch(i, "issuer", e.target.value)} />
                  <Input className="rounded-xl h-10" placeholder="Date (e.g. 2025)" value={a.date} onChange={(e) => updAch(i, "date", e.target.value)} />
                </div>
                <Textarea className="rounded-xl" placeholder="Short description" value={a.description} onChange={(e) => updAch(i, "description", e.target.value)} />
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="documents" className="p-4 space-y-4">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-display text-lg font-semibold">Resume</div>
                <div className="text-xs text-neutral-500">Upload PDF, DOCX or TXT. Max 3MB. Stored as base64.</div>
                {form.resume_filename && <div className="mt-2 chip chip-sage">✓ {form.resume_filename}</div>}
              </div>
              <label className="cursor-pointer">
                <input type="file" className="hidden" accept=".pdf,.docx,.doc,.txt" onChange={onResumeUpload} data-testid="resume-upload-input" />
                <span className="inline-flex items-center gap-2 px-4 h-10 rounded-full btn-coral border-0 text-white text-sm font-medium">
                  <Upload className="w-4 h-4" /> Upload
                </span>
              </label>
            </div>
            <div className="mt-4">
              <Label>Or paste resume text (used for AI analysis)</Label>
              <Textarea className="rounded-xl mt-1" rows={6} value={form.resume_text || ""} onChange={(e) => set("resume_text", e.target.value)} placeholder="Paste your resume plain text here..." data-testid="resume-text" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="social" className="p-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label>GitHub username or URL</Label><Input className="rounded-xl h-10 mt-1" value={form.social?.github || ""} onChange={(e) => set("social.github", e.target.value)} placeholder="octocat" data-testid="s-github" /></div>
            <div><Label>LinkedIn</Label><Input className="rounded-xl h-10 mt-1" value={form.social?.linkedin || ""} onChange={(e) => set("social.linkedin", e.target.value)} placeholder="linkedin.com/in/..." /></div>
            <div><Label>Portfolio</Label><Input className="rounded-xl h-10 mt-1" value={form.social?.portfolio || ""} onChange={(e) => set("social.portfolio", e.target.value)} /></div>
            <div><Label>Twitter / X</Label><Input className="rounded-xl h-10 mt-1" value={form.social?.twitter || ""} onChange={(e) => set("social.twitter", e.target.value)} /></div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
