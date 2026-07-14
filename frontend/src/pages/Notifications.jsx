import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Bell, Sparkles, Calendar, TrendingUp } from "lucide-react";

const iconMap = {
  new_opportunity: <Sparkles className="w-4 h-4 text-orange-500" />,
  deadline: <Calendar className="w-4 h-4 text-rose-500" />,
  resume_tip: <TrendingUp className="w-4 h-4 text-emerald-500" />,
  app_status: <Bell className="w-4 h-4 text-purple-500" />,
};

export default function Notifications() {
  const { data: notes = [], isLoading } = useQuery({ queryKey: ["notifications"], queryFn: async () => (await api.get("/notifications")).data });
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <div className="overline">Notifications</div>
        <h1 className="font-display text-3xl font-bold tracking-tight mt-1">Recent activity</h1>
      </div>
      {isLoading ? <div className="text-neutral-500">Loading…</div> : (
        <div className="glass rounded-2xl divide-y divide-neutral-100">
          {notes.map((n) => (
            <div key={n.id} className="p-5 flex gap-3" data-testid={`notif-${n.id}`}>
              <div className="w-9 h-9 rounded-xl bg-white border border-neutral-100 flex items-center justify-center shrink-0">{iconMap[n.type] || <Bell className="w-4 h-4" />}</div>
              <div>
                <div className="font-semibold">{n.title}</div>
                <div className="text-sm text-neutral-600">{n.message}</div>
              </div>
            </div>
          ))}
          {notes.length === 0 && <div className="p-10 text-center text-neutral-500">You're all caught up.</div>}
        </div>
      )}
    </div>
  );
}
