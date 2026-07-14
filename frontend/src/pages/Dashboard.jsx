import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Target, Compass, Trophy, ClipboardCheck, Timer, FileCheck,
  ArrowRight, Sparkles
} from "lucide-react";
import {
  LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Area, AreaChart,
  BarChart, Bar, CartesianGrid, PieChart, Pie, Cell,
} from "recharts";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 18) return "Good Afternoon";
  return "Good Evening";
}

const STAT_META = [
  { key: "opportunity_score", label: "Opportunity Score", icon: Target, chip: "chip-coral", suffix: "" },
  { key: "internship_matches", label: "Internship Matches", icon: Compass, chip: "chip-lavender", suffix: "" },
  { key: "hackathon_matches", label: "Hackathon Matches", icon: Trophy, chip: "chip-gold", suffix: "" },
  { key: "applications_submitted", label: "Applications Submitted", icon: ClipboardCheck, chip: "chip-sage", suffix: "" },
  { key: "upcoming_deadlines", label: "Upcoming Deadlines", icon: Timer, chip: "chip-rose", suffix: "" },
  { key: "resume_score", label: "Resume Score", icon: FileCheck, chip: "chip-coral", suffix: "%" },
];

const KANBAN_COLORS = ["#FF7A45", "#B49CFF", "#8BB07F", "#FFB37A", "#FF6BB3", "#FFD84D"];

export default function Dashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => (await api.get("/dashboard/stats")).data,
  });
  const { data: opps = [] } = useQuery({
    queryKey: ["opps-preview"],
    queryFn: async () => (await api.get("/opportunities")).data,
  });

  const activity = (stats?.activity && stats.activity.length > 0)
    ? stats.activity
    : Array.from({ length: 7 }).map((_, i) => ({ date: `Day ${i + 1}`, count: 0 }));

  const kanban = Object.entries(stats?.kanban_counts || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="overline">{greeting()}</div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mt-1" data-testid="dashboard-welcome">
            Hey, {user?.name?.split(" ")[0] || "there"} <span className="ml-1">👋</span>
          </h1>
          <p className="mt-2 text-neutral-600">
            AI found <b className="text-orange-600">{stats?.internship_matches + stats?.hackathon_matches || 12}</b> new opportunities matching your profile today.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/app/opportunities"><Button variant="outline" className="rounded-full h-10" data-testid="explore-opps-btn">Explore <ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
          <Link to="/app/assistant"><Button className="rounded-full btn-coral border-0 h-10" data-testid="quick-ai-btn"><Sparkles className="w-4 h-4 mr-1" /> Quick Apply</Button></Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 stagger-in">
        {STAT_META.map((s) => {
          const Icon = s.icon;
          const v = stats?.[s.key] ?? 0;
          return (
            <div key={s.key} className="glass rounded-2xl p-5 hover:-translate-y-0.5 transition-transform" data-testid={`stat-${s.key}`}>
              <div className="flex items-center justify-between">
                <div className="overline">{s.label}</div>
                <div className={`chip ${s.chip}`}><Icon className="w-3 h-3" /></div>
              </div>
              <div className="mt-3 font-display text-3xl md:text-4xl font-bold">
                {isLoading ? "—" : `${v}${s.suffix}`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="overline">Application Activity</div>
              <h3 className="font-display text-xl font-bold mt-1">Last 7 entries</h3>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%" minHeight={200}>
              <AreaChart data={activity}>
                <defs>
                  <linearGradient id="colorCoral" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(16 100% 66%)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(16 100% 66%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="date" stroke="#999" fontSize={12} />
                <YAxis stroke="#999" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee" }} />
                <Area type="monotone" dataKey="count" stroke="hsl(16 100% 66%)" strokeWidth={2} fill="url(#colorCoral)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="overline">Skill Growth</div>
          <h3 className="font-display text-xl font-bold mt-1 mb-3">6-month trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%" minHeight={200}>
              <LineChart data={stats?.skill_growth || []}>
                <XAxis dataKey="month" stroke="#999" fontSize={12} />
                <YAxis stroke="#999" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee" }} />
                <Line type="monotone" dataKey="skills" stroke="hsl(320 100% 60%)" strokeWidth={3} dot={{ fill: "hsl(320 100% 60%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="overline">Career Progress</div>
          <h3 className="font-display text-xl font-bold mt-1 mb-3">Pipeline distribution</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%" minHeight={180}>
              <PieChart>
                <Pie data={kanban} dataKey="value" nameKey="name" outerRadius={80} innerRadius={45}>
                  {kanban.map((_, i) => <Cell key={i} fill={KANBAN_COLORS[i % KANBAN_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
            {kanban.map((k, i) => (
              <div key={k.name} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: KANBAN_COLORS[i % KANBAN_COLORS.length] }} />
                <span className="capitalize text-neutral-600">{k.name}: {k.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <div className="overline">Opportunity Conversion</div>
          <h3 className="font-display text-xl font-bold mt-1 mb-3">By pipeline stage</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%" minHeight={180}>
              <BarChart data={kanban}>
                <XAxis dataKey="name" stroke="#999" fontSize={12} />
                <YAxis stroke="#999" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee" }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="hsl(95 40% 60%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Featured opportunities */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="overline">Recommended</div>
            <h2 className="font-display text-2xl font-bold mt-1">Fresh opportunities</h2>
          </div>
          <Link to="/app/opportunities"><Button variant="ghost" className="rounded-full">See all <ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {opps.slice(0, 6).map((o) => (
            <Link key={o.id} to={`/app/opportunities/${o.id}`} className="glass rounded-2xl p-5 hover:-translate-y-1 transition-transform" data-testid={`opp-card-${o.id}`}>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center text-xl">
                  {o.logo || "✨"}
                </div>
                <span className={`chip chip-lavender capitalize`}>{o.type}</span>
              </div>
              <h4 className="font-display font-semibold mt-3">{o.title}</h4>
              <div className="text-xs text-neutral-500 mt-1">{o.company} • {o.location}</div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-neutral-600">Deadline {o.deadline}</span>
                {o.stipend && <span className="chip chip-sage">{o.stipend}</span>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
