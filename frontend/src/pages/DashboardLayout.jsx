import React, { useState } from "react";
import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard, User, Compass, Kanban, FileText, Github,
  Sparkles, Bell, Settings as SettingsIcon, LogOut, Zap, Menu, X
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true, testid: "nav-dashboard" },
  { to: "/app/passport", label: "Passport", icon: User, testid: "nav-passport" },
  { to: "/app/opportunities", label: "Opportunities", icon: Compass, testid: "nav-opportunities" },
  { to: "/app/applications", label: "Applications", icon: Kanban, testid: "nav-applications" },
  { to: "/app/resume", label: "Resume Intel", icon: FileText, testid: "nav-resume" },
  { to: "/app/github", label: "GitHub Intel", icon: Github, testid: "nav-github" },
  { to: "/app/assistant", label: "AI Assistant", icon: Sparkles, testid: "nav-assistant" },
  { to: "/app/notifications", label: "Notifications", icon: Bell, testid: "nav-notifications" },
  { to: "/app/settings", label: "Settings", icon: SettingsIcon, testid: "nav-settings" },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarInner = () => (
    <>
      <Link to="/app" className="flex items-center gap-2 px-4 py-6" onClick={() => setMobileOpen(false)}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white">
          <Zap className="w-4 h-4" />
        </div>
        <span className="font-display font-bold text-lg">SkillSprint <span className="text-orange-500">AI</span></span>
      </Link>
      <div className="px-3 space-y-1">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            data-testid={n.testid}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive ? "bg-white text-neutral-900 shadow-sm border border-neutral-100" : "text-neutral-600 hover:bg-white/60"
              }`
            }
          >
            <n.icon className="w-4 h-4" />
            <span>{n.label}</span>
          </NavLink>
        ))}
      </div>
      <div className="mt-auto p-4">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-300 to-pink-300 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-sm truncate" data-testid="user-name">{user?.name}</div>
              <div className="text-xs text-neutral-500 truncate">{user?.email}</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full mt-3 rounded-lg text-neutral-600" onClick={logout} data-testid="logout-btn">
            <LogOut className="w-4 h-4 mr-2" /> Log out
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-mesh-soft flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 border-r border-neutral-100 bg-white/40 backdrop-blur-xl">
        <SidebarInner />
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-white flex flex-col shadow-2xl">
            <SidebarInner />
          </aside>
        </div>
      )}

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Nav */}
        <header className="sticky top-0 z-40 glass border-b border-white/40 px-4 md:px-8 py-4 flex items-center justify-between">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)} data-testid="mobile-menu-btn">
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:block text-sm text-neutral-500">
            Welcome back, <span className="font-semibold text-neutral-900">{user?.name?.split(" ")[0]}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="rounded-full h-9" onClick={() => navigate("/app/opportunities")} data-testid="header-discover-btn">
              <Compass className="w-4 h-4 mr-1" /> Discover
            </Button>
            <Button size="sm" className="rounded-full btn-coral border-0 h-9" onClick={() => navigate("/app/assistant")} data-testid="header-ai-btn">
              <Sparkles className="w-4 h-4 mr-1" /> AI Assistant
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
