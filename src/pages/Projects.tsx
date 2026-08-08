import { useEffect, useState } from "react";
import { FolderPlus, Search, MoreVertical, MapPin } from "lucide-react";
import CreateProjectModal from "@/components/CreateProjectModal";



type Project = {
  id: string;
  name: string;
  location: string;
  manager_name: string;
  client_name: string;
  status: "planning" | "active" | "on_hold" | "completed" | "cancelled";
  completion: number;
};

const statusStyles: Record<Project["status"], string> = {
  planning: "bg-[#4682B4]/10 text-[#4682B4]",
  active: "bg-[#FF8C00]/10 text-[#FF8C00]",
  on_hold: "bg-amber-50 text-amber-600",
  completed: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-red-50 text-red-500",
};

const statusLabels: Record<Project["status"], string> = {
  planning: "Planning",
  active: "Active",
  on_hold: "On Hold",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function Projects() {
  const [query, setQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  async function fetchProjects() {
    try {
      const res = await fetch("http://localhost:3000/projects");
      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Expected an array, got:", data);
        return;
      }
      setProjects(data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );


  return (
    <section className="min-h-screen bg-[#FBFCFE] px-6 pb-16 pt-16 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#4682B4]">
              Overview
            </p>
            <h1 className="mt-1 text-3xl font-bold text-[#033363]">
              Projects
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 self-start rounded-md bg-[#FF8C00] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_-8px_rgba(255,140,0,0.5)] transition-colors hover:bg-[#e67e00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#033363] sm:self-auto"
          >
            <FolderPlus size={18} />
            Create Project
          </button>
        </div>

        {/* Search + summary */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full max-w-sm items-center gap-2 rounded-md border border-[#033363]/20 bg-white px-3 py-2.5 focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/30">
            <Search size={18} className="shrink-0 text-[#4682B4]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full bg-transparent text-sm text-[#033363] outline-none placeholder:text-[#4682B4]/40"
            />
          </div>
          <p className="text-sm text-gray-500">
            {projects.length} project{projects.length !== 1 ? "s" : ""} total
          </p>
        </div>

        {/* Projects table */}
        <div className="mt-6 rounded-2xl border border-[#033363]/10 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1.2fr_1.2fr_1.2fr_1fr_1.2fr_auto] md:gap-x-4">
            {/* Column labels */}
            <div className="hidden md:contents">
              <span className="border-b border-[#033363]/10 pb-3 text-[11px] font-semibold uppercase tracking-widest text-[#4682B4]/70">
                Project
              </span>
              <span className="border-b border-[#033363]/10 pb-3 text-[11px] font-semibold uppercase tracking-widest text-[#4682B4]/70">
                Location
              </span>
              <span className="border-b border-[#033363]/10 pb-3 text-[11px] font-semibold uppercase tracking-widest text-[#4682B4]/70">
                Manager
              </span>
              <span className="border-b border-[#033363]/10 pb-3 text-[11px] font-semibold uppercase tracking-widest text-[#4682B4]/70">
                Client
              </span>
              <span className="border-b border-[#033363]/10 pb-3 text-[11px] font-semibold uppercase tracking-widest text-[#4682B4]/70">
                Status
              </span>
              <span className="border-b border-[#033363]/10 pb-3 text-[11px] font-semibold uppercase tracking-widest text-[#4682B4]/70">
                Completion
              </span>
              <span className="border-b border-[#033363]/10 pb-3 text-right text-[11px] font-semibold uppercase tracking-widest text-[#4682B4]/70">
                Action
              </span>
            </div>

            {filtered.length === 0 && (
              <div className="col-span-full py-10 text-center text-sm text-gray-400">
                No projects found.
              </div>
            )}

            {filtered.map((project, i) => {
              const isLast = i === filtered.length - 1;
              const cellBorder = isLast ? "" : "border-b border-[#033363]/5";
              return (
                <div key={project.id} className="contents">
                  <p className={`flex items-center py-4 font-medium text-[#033363] ${cellBorder}`}>
                    {project.name}
                  </p>

                  <div className={`flex items-center gap-1.5 py-4 text-sm text-gray-500 ${cellBorder}`}>
                    <MapPin size={13} className="shrink-0 text-[#4682B4]" />
                    {project.location}
                  </div>

                  <p className={`flex items-center py-4 text-sm text-gray-600 ${cellBorder}`}>
                    {project.manager_name || "—"}
                  </p>

                  <p className={`flex items-center py-4 text-sm text-gray-600 ${cellBorder}`}>
                    {project.client_name || "—"}
                  </p>

                  <div className={`flex items-center py-4 ${cellBorder}`}>
                    <span
                      className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[project.status]}`}
                    >
                      {statusLabels[project.status]}
                    </span>
                  </div>

                  <div className={`flex items-center gap-2 py-4 ${cellBorder}`}>
                    <div className="h-2 w-full max-w-[7rem] rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-[#FF8C00]"
                        style={{ width: `${project.completion}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {project.completion}%
                    </span>
                  </div>

                  <div className={`flex items-center justify-start py-4 md:justify-end ${cellBorder}`}>
                    <button
                      type="button"
                      aria-label="Project actions"
                      className="rounded-md p-1.5 text-gray-400 hover:bg-gray-50 hover:text-[#033363]"
                    >
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Create Project modal */}
      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={()=>{
            fetchProjects();
        }}
      />
    </section>
  );
}