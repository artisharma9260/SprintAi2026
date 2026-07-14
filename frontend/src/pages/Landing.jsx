import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sparkles, Compass, FileText, Target, TrendingUp, ClipboardList,
  Github, ArrowRight, CheckCircle2, GraduationCap, Zap, Lightbulb
} from "lucide-react";

const features = [
  { icon: <GraduationCap className="w-6 h-6" />, title: "Universal Student Passport", desc: "One profile with your academics, skills, projects, resume & socials. Reuse it everywhere.", chip: "chip-coral" },
  { icon: <Compass className="w-6 h-6" />, title: "Opportunity Discovery", desc: "Internships, hackathons, scholarships, fellowships — all matched to your profile.", chip: "chip-lavender" },
  { icon: <FileText className="w-6 h-6" />, title: "AI Resume Intelligence", desc: "ATS score, missing keywords, and targeted improvements in seconds.", chip: "chip-sage" },
  { icon: <Sparkles className="w-6 h-6" />, title: "AI Application Assistant", desc: "Generate cover letters, SOPs, essays and 'why us' answers instantly.", chip: "chip-rose" },
  { icon: <Target className="w-6 h-6" />, title: "Skill Gap Analysis", desc: "See exactly what to learn to unlock each opportunity.", chip: "chip-gold" },
  { icon: <ClipboardList className="w-6 h-6" />, title: "Application Tracking", desc: "Kanban board from Saved to Offer — never lose track of an application.", chip: "chip-coral" },
];

const steps = [
  "Create Profile", "Upload Resume", "Connect GitHub",
  "AI Builds Skill Profile", "Receive Opportunity Matches",
  "Generate Application Content", "Track Applications",
];

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-mesh relative overflow-hidden">
      {/* Floating blobs */}
      <div className="pointer-events-none absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-orange-200 to-pink-200 opacity-40 blur-3xl float-slow" />
      <div className="pointer-events-none absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-gradient-to-br from-purple-200 to-blue-100 opacity-40 blur-3xl float-slow" style={{ animationDelay: "2s" }} />

      {/* Nav */}
      <nav className="glass sticky top-4 mx-4 md:mx-8 mt-4 rounded-2xl px-6 py-3 flex items-center justify-between z-50">
        <Link to="/" className="flex items-center gap-2" data-testid="nav-logo">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white">
            <Zap className="w-4 h-4" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">SkillSprint <span className="text-orange-500">AI</span></span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-neutral-600">
          <a href="#features" className="hover:text-neutral-900 transition-colors">Features</a>
          <a href="#how" className="hover:text-neutral-900 transition-colors">How it works</a>
          <a href="#passport" className="hover:text-neutral-900 transition-colors">Passport</a>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/login"><Button variant="ghost" className="rounded-full" data-testid="nav-login-btn">Log in</Button></Link>
          <Button className="rounded-full btn-coral border-0" onClick={() => navigate("/signup")} data-testid="nav-signup-btn">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 md:px-12 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="chip chip-coral mx-auto mb-6"
          >
            <Sparkles className="w-3 h-3" /> Fill Once. Apply Smarter.
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]"
            data-testid="hero-headline"
          >
            Your <span className="gradient-text">AI Career Copilot</span>.<br />
            Built for ambitious students.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-base md:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed"
          >
            Create one profile, discover matched opportunities, and generate application-ready content instantly.
            Not a job board — an <b>Opportunity Operating System</b>.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button size="lg" className="rounded-full btn-coral border-0 px-8 h-12 text-base" onClick={() => navigate("/signup")} data-testid="hero-get-started">
              Get Started <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full h-12 px-8 text-base border-neutral-300" onClick={() => navigate("/signup")} data-testid="hero-upload-resume">
              <FileText className="w-4 h-4 mr-2" /> Upload Resume
            </Button>
          </motion.div>
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-neutral-500">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Free to try</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> No credit card</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> AI-powered</span>
          </div>
        </div>

        {/* Hero preview card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <div className="glass-strong rounded-3xl p-6 md:p-10">
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { label: "Opportunity Score", value: "86", chip: "chip-coral", sub: "+12 this week" },
                { label: "Matched today", value: "12", chip: "chip-lavender", sub: "Internships & Hackathons" },
                { label: "Resume ATS", value: "78%", chip: "chip-sage", sub: "AI-improved" },
              ].map((s, i) => (
                <div key={i} className="rounded-2xl p-5 bg-white border border-neutral-100">
                  <div className="overline">{s.label}</div>
                  <div className="font-display text-4xl font-bold mt-2">{s.value}</div>
                  <div className={`chip ${s.chip} mt-3`}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative px-6 md:px-12 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-14">
            <div className="overline mb-3">Features</div>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
              An Opportunity OS, not a job board.
            </h2>
            <p className="mt-4 text-neutral-600">
              Every step from discovery to application — powered by your Universal Student Passport.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-in">
            {features.map((f, i) => (
              <div key={i} className="glass rounded-2xl p-6 hover:-translate-y-1 transition-transform">
                <div className={`chip ${f.chip} mb-4`}>{f.icon}</div>
                <h3 className="font-display font-semibold text-xl">{f.title}</h3>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Passport */}
      <section id="passport" className="relative px-6 md:px-12 py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="overline mb-3">Universal Student Passport</div>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
              Fill it <span className="gradient-text">once</span>. Use it everywhere.
            </h2>
            <p className="mt-4 text-neutral-600 leading-relaxed">
              Personal details, academics, skills, projects, achievements, resume, GitHub, LinkedIn, portfolio — one profile becomes the foundation for every AI feature.
            </p>
            <ul className="mt-6 space-y-3">
              {["Auto-imports GitHub projects", "AI extracts skills from resume", "Reused across all opportunities"].map((t, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-strong rounded-3xl p-6 md:p-8">
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <GraduationCap className="w-4 h-4" />, label: "Academic" },
                { icon: <Lightbulb className="w-4 h-4" />, label: "Skills" },
                { icon: <Github className="w-4 h-4" />, label: "GitHub" },
                { icon: <FileText className="w-4 h-4" />, label: "Resume" },
                { icon: <TrendingUp className="w-4 h-4" />, label: "Projects" },
                { icon: <ClipboardList className="w-4 h-4" />, label: "Achievements" },
              ].map((x, i) => (
                <div key={i} className="rounded-xl p-4 bg-white border border-neutral-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center text-orange-600">
                    {x.icon}
                  </div>
                  <span className="text-sm font-medium">{x.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative px-6 md:px-12 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="overline mb-3">How it works</div>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-14">
            From profile to offer in <span className="gradient-text">7 steps</span>.
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            {steps.map((s, i) => (
              <div key={i} className="glass rounded-2xl p-5 hover:-translate-y-1 transition-transform">
                <div className="font-display text-3xl font-bold text-orange-500">{String(i + 1).padStart(2, "0")}</div>
                <div className="mt-2 font-semibold">{s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 md:px-12 py-24">
        <div className="max-w-4xl mx-auto glass-strong rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gradient-to-br from-orange-200 to-pink-200 opacity-50 blur-3xl" />
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">Ready to sprint?</h2>
          <p className="mt-4 text-neutral-600">Create your Universal Student Passport in 2 minutes.</p>
          <Button className="mt-8 rounded-full btn-coral border-0 h-12 px-8" onClick={() => navigate("/signup")} data-testid="cta-signup">
            Start free <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </section>

      <footer className="px-6 md:px-12 py-10 text-center text-sm text-neutral-500">
        © 2026 SkillSprint AI • Fill Once. Apply Smarter.
      </footer>
    </div>
  );
}
