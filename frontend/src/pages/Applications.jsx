import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const COLS = [
  { key: "saved", label: "Saved", color: "bg-orange-50 border-orange-100" },
  { key: "applied", label: "Applied", color: "bg-purple-50 border-purple-100" },
  { key: "assessment", label: "Assessment", color: "bg-green-50 border-green-100" },
  { key: "interview", label: "Interview", color: "bg-pink-50 border-pink-100" },
  { key: "offer", label: "Offer", color: "bg-yellow-50 border-yellow-100" },
  { key: "rejected", label: "Rejected", color: "bg-neutral-50 border-neutral-200" },
];

export default function Applications() {
  const qc = useQueryClient();
  const { data: apps = [], isLoading } = useQuery({ queryKey: ["applications"], queryFn: async () => (await api.get("/applications")).data });

  const update = useMutation({
    mutationFn: async ({ id, status }) => (await api.put(`/applications/${id}`, { status })).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["applications"] }); qc.invalidateQueries({ queryKey: ["dashboard-stats"] }); },
  });
  const del = useMutation({
    mutationFn: async (id) => (await api.delete(`/applications/${id}`)).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["applications"] }); toast.success("Removed"); },
  });

  const onDragStart = (e, id) => e.dataTransfer.setData("appId", id);
  const onDrop = (e, status) => {
    const id = e.dataTransfer.getData("appId");
    if (id) update.mutate({ id, status });
  };
  const allowDrop = (e) => e.preventDefault();

  return (
    <div className="space-y-6">
      <div>
        <div className="overline">Application Tracker</div>
        <h1 className="font-display text-3xl font-bold tracking-tight mt-1">Your career pipeline</h1>
        <p className="text-neutral-600 mt-1 text-sm">Drag and drop cards across stages.</p>
      </div>

      {isLoading ? (
        <div className="text-neutral-500">Loading…</div>
      ) : apps.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <p className="text-neutral-600">No applications yet.</p>
          <Link to="/app/opportunities" className="inline-block mt-4">
            <Button className="rounded-full btn-coral border-0">Discover Opportunities</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {COLS.map((c) => {
            const items = apps.filter((a) => a.status === c.key);
            return (
              <div key={c.key} className={`rounded-2xl border ${c.color} p-3 min-h-[400px]`} onDragOver={allowDrop} onDrop={(e) => onDrop(e, c.key)} data-testid={`col-${c.key}`}>
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="font-display font-semibold text-sm">{c.label}</div>
                  <span className="chip">{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.map((a) => (
                    <div key={a.id} draggable onDragStart={(e) => onDragStart(e, a.id)} className="bg-white rounded-xl p-3 shadow-sm border border-white cursor-grab active:cursor-grabbing" data-testid={`card-${a.id}`}>
                      <div className="flex items-start justify-between">
                        <div className="text-lg">{a.opportunity?.logo || "✨"}</div>
                        <button onClick={() => del.mutate(a.id)} className="text-neutral-300 hover:text-rose-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                      <div className="font-semibold text-sm mt-1 line-clamp-2">{a.opportunity?.title}</div>
                      <div className="text-xs text-neutral-500 mt-0.5">{a.opportunity?.company}</div>
                      <div className="text-xs text-neutral-400 mt-1">Due {a.opportunity?.deadline}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
