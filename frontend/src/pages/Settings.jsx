import React from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LogOut } from "lucide-react";

export default function Settings() {
  const { user, logout } = useAuth();
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <div className="overline">Settings</div>
        <h1 className="font-display text-3xl font-bold tracking-tight mt-1">Preferences</h1>
      </div>
      <div className="glass rounded-2xl p-6 space-y-4">
        <div>
          <Label>Name</Label>
          <Input className="rounded-xl h-10 mt-1" value={user?.name || ""} readOnly />
        </div>
        <div>
          <Label>Email</Label>
          <Input className="rounded-xl h-10 mt-1" value={user?.email || ""} readOnly />
        </div>
      </div>

      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="font-display font-semibold text-lg">Notifications</div>
        {[
          "New opportunity matches",
          "Deadline reminders",
          "Resume improvement suggestions",
          "Application status updates",
        ].map((label, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
            <span className="text-sm">{label}</span>
            <Switch defaultChecked data-testid={`toggle-${i}`} />
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="font-display font-semibold text-lg">Security</div>
        <p className="text-sm text-neutral-600">Password reset available via the "Forgot password" flow.</p>
        <Button variant="outline" className="rounded-full" onClick={logout} data-testid="settings-logout"><LogOut className="w-4 h-4 mr-1" /> Log out of all sessions</Button>
      </div>
    </div>
  );
}
