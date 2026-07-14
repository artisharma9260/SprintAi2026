// import React, { useState, useMemo } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Link } from "react-router-dom";
// import api from "@/lib/api";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Search, MapPin, Calendar, IndianRupee, Sparkles, Loader2 } from "lucide-react";

// const TYPES = [
//   { key: "all", label: "All" },
//   { key: "internship", label: "Internships" },
//   { key: "hackathon", label: "Hackathons" },
//   { key: "scholarship", label: "Scholarships" },
//   { key: "fellowship", label: "Fellowships" },
//   { key: "competition", label: "Competitions" },
//   { key: "research", label: "Research" },
// ];

// export default function Opportunities() {
//   const [type, setType] = useState("all");
//   const [search, setSearch] = useState("");
//   const queryClient = useQueryClient();

//   const { data: opps = [], isLoading } = useQuery({
//     queryKey: ["opportunities", type, search],
//     queryFn: async () => (await api.get("/opportunities", { params: { type, search: search || undefined } })).data,
//   });

//   const discoverMutation = useMutation({
//     mutationFn: async () => (await api.post("/opportunities/discover", { criteria: search || undefined })).data,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["opportunities"] });
//     },
//   });

//   const filtered = useMemo(() => opps, [opps]);

//   return (
//     <div className="space-y-6">
//       <div>
//         <div className="overline">Discover</div>
//         <h1 className="font-display text-3xl font-bold tracking-tight mt-1">Opportunities matched to you</h1>
//         <p className="text-neutral-600 mt-1 text-sm">Internships, hackathons, scholarships, fellowships, competitions & research.</p>
//       </div>

//       {/* Filters */}
//       <div className="glass rounded-2xl p-4 flex flex-col md:flex-row gap-3 md:items-center">
//         <div className="relative flex-1">
//           <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
//           <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, company, tag..." className="pl-9 rounded-xl h-10" data-testid="opp-search" />
//         </div>
//         <div className="flex gap-1 flex-wrap">
//           {TYPES.map((t) => (
//             <button
//               key={t.key}
//               onClick={() => setType(t.key)}
//               data-testid={`filter-${t.key}`}
//               className={`px-3 h-9 rounded-full text-sm font-medium transition-colors ${
//                 type === t.key ? "bg-neutral-900 text-white" : "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
//               }`}
//             >
//               {t.label}
//             </button>
//           ))}
//         </div>
//         <Button
//           onClick={() => discoverMutation.mutate()}
//           disabled={discoverMutation.isPending}
//           className="rounded-xl h-10 gap-2"
//           data-testid="discover-ai-btn"
//         >
//           {discoverMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
//           {discoverMutation.isPending ? "Searching the web…" : "Discover with AI"}
//         </Button>
//       </div>

//       {discoverMutation.isSuccess && (
//         <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2">
//           Found {discoverMutation.data.found} opportunities — added {discoverMutation.data.created}, updated {discoverMutation.data.updated}.
//           <span className="block text-emerald-600 mt-0.5">AI-suggested from well-known programs — please verify the deadline and link before applying.</span>
//         </div>
//       )}
//       {discoverMutation.isError && (
//         <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-2">
//           Couldn't fetch new opportunities: {discoverMutation.error?.response?.data?.detail || discoverMutation.error.message}
//         </div>
//       )}

//       {isLoading ? (
//         <div className="text-neutral-500">Loading opportunities…</div>
//       ) : (
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-in">
//           {filtered.map((o) => (
//             <Link key={o.id} to={`/app/opportunities/${o.id}`} className="glass rounded-2xl p-5 hover:-translate-y-1 transition-transform flex flex-col" data-testid={`opp-${o.id}`}>
//               <div className="flex items-start justify-between">
//                 <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center text-2xl">
//                   {o.logo || "✨"}
//                 </div>
//                 <span className="chip chip-lavender capitalize">{o.type}</span>
//               </div>
//               <h3 className="font-display font-semibold mt-3 text-lg leading-tight">{o.title}</h3>
//               <div className="text-xs text-neutral-500 mt-1">{o.company}</div>
//               <p className="text-sm text-neutral-600 mt-2 line-clamp-2">{o.description}</p>
//               <div className="flex flex-wrap gap-1.5 mt-3">
//                 {o.required_skills.slice(0, 3).map((s) => <span key={s} className="chip">{s}</span>)}
//               </div>
//               <div className="mt-auto pt-4 flex flex-wrap gap-3 text-xs text-neutral-600">
//                 <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {o.location}</span>
//                 <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {o.deadline}</span>
//                 {o.stipend && <span className="chip chip-sage flex items-center gap-1"><IndianRupee className="w-3 h-3" /> {o.stipend}</span>}
//               </div>
//             </Link>
//           ))}
//           {filtered.length === 0 && (
//             <div className="col-span-full text-center py-16 text-neutral-500">No opportunities match your filters.</div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Calendar, IndianRupee, Sparkles, Loader2 } from "lucide-react";

const TYPES = [
  { key: "all", label: "All" },
  { key: "internship", label: "Internships" },
  { key: "hackathon", label: "Hackathons" },
  { key: "scholarship", label: "Scholarships" },
  { key: "fellowship", label: "Fellowships" },
  { key: "competition", label: "Competitions" },
  { key: "research", label: "Research" },
];

export default function Opportunities() {
  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: opps = [], isLoading } = useQuery({
    queryKey: ["opportunities", type, search],
    queryFn: async () => (await api.get("/opportunities", { params: { type, search: search || undefined } })).data,
  });

  const discoverMutation = useMutation({
    mutationFn: async () => (await api.post("/opportunities/discover", { criteria: search || undefined })).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
    },
  });

  const filtered = useMemo(() => opps, [opps]);

  return (
    <div className="space-y-6">
      <div>
        <div className="overline">Discover</div>
        <h1 className="font-display text-3xl font-bold tracking-tight mt-1">Opportunities matched to you</h1>
        <p className="text-neutral-600 mt-1 text-sm">Internships, hackathons, scholarships, fellowships, competitions & research.</p>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, company, tag..." className="pl-9 rounded-xl h-10" data-testid="opp-search" />
        </div>
        <div className="flex gap-1 flex-wrap">
          {TYPES.map((t) => (
            <button
              key={t.key}
              onClick={() => setType(t.key)}
              data-testid={`filter-${t.key}`}
              className={`px-3 h-9 rounded-full text-sm font-medium transition-colors ${
                type === t.key ? "bg-neutral-900 text-white" : "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <Button
          onClick={() => discoverMutation.mutate()}
          disabled={discoverMutation.isPending}
          className="rounded-xl h-10 gap-2"
          data-testid="discover-ai-btn"
        >
          {discoverMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {discoverMutation.isPending ? "Searching the web…" : "Discover with AI"}
        </Button>
      </div>

      {discoverMutation.isSuccess && (
        <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2">
          Found {discoverMutation.data.found} opportunities — added {discoverMutation.data.created}, updated {discoverMutation.data.updated}.
          <span className="block text-emerald-600 mt-0.5">AI-suggested from well-known programs — please verify the deadline and link before applying.</span>
        </div>
      )}
      {discoverMutation.isError && (
        <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-2">
          Couldn't fetch new opportunities: {discoverMutation.error?.response?.data?.detail || discoverMutation.error.message}
        </div>
      )}

      {isLoading ? (
        <div className="text-neutral-500">Loading opportunities…</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-in">
          {filtered.map((o) => (
            <Link key={o.id} to={`/app/opportunities/${o.id}`} className="glass rounded-2xl p-5 hover:-translate-y-1 transition-transform flex flex-col" data-testid={`opp-${o.id}`}>
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center text-2xl">
                  {o.logo || "✨"}
                </div>
                <span className="chip chip-lavender capitalize">{o.type}</span>
              </div>
              <h3 className="font-display font-semibold mt-3 text-lg leading-tight">{o.title}</h3>
              <div className="text-xs text-neutral-500 mt-1">{o.company}</div>
              <p className="text-sm text-neutral-600 mt-2 line-clamp-2">{o.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {o.required_skills.slice(0, 3).map((s) => <span key={s} className="chip">{s}</span>)}
              </div>
              <div className="mt-auto pt-4 flex flex-wrap gap-3 text-xs text-neutral-600">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {o.location}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {o.deadline}</span>
                {o.stipend && <span className="chip chip-sage flex items-center gap-1"><IndianRupee className="w-3 h-3" /> {o.stipend}</span>}
              </div>
            </Link>
          ))}
          {filtered.length === 0 && opps.length === 0 && (
            <div className="col-span-full flex flex-col items-center text-center py-20 gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center text-2xl">
                <Sparkles className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg">No opportunities yet</h3>
                <p className="text-sm text-neutral-500 mt-1 max-w-sm">
                  Click "Discover with AI" above to search the web for real, current internships, hackathons, and scholarships.
                </p>
              </div>
              <Button
                onClick={() => discoverMutation.mutate()}
                disabled={discoverMutation.isPending}
                className="rounded-xl h-10 gap-2"
              >
                {discoverMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {discoverMutation.isPending ? "Searching the web…" : "Discover with AI"}
              </Button>
            </div>
          )}
          {filtered.length === 0 && opps.length > 0 && (
            <div className="col-span-full text-center py-16 text-neutral-500">No opportunities match your filters.</div>
          )}
        </div>
      )}
    </div>
  );
}

