import { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  CalendarDays,
  Users,
  FolderKanban,
  Clock3,
  ChevronRight,
  CircleCheck,
  CircleAlert,
  PauseCircle,
} from "lucide-react";

type ProjectStatus =
  | "planning"
  | "active"
  | "on_hold"
  | "completed";

type Project = {
  id: number;
  name: string;
  location: string;
  client: string;
  progress: number;
  status: ProjectStatus;
  startDate: string;
  finishDate: string;
  workers: number;
};

const projects: Project[] = [
  {
    id: 1,
    name: "Skyline Corporate",
    location: "Baguio City",
    client: "David Rojo",
    progress: 72,
    status: "active",
    startDate: "Aug 12, 2026",
    finishDate: "Nov 30, 2026",
    workers: 14,
  },
  {
    id: 2,
    name: "La Trinidad Warehouse",
    location: "La Trinidad",
    client: "ABC Logistics",
    progress: 38,
    status: "active",
    startDate: "Jul 20, 2026",
    finishDate: "Jan 18, 2027",
    workers: 9,
  },
  {
    id: 3,
    name: "Mountain View Residence",
    location: "Itogon",
    client: "Maria Santos",
    progress: 15,
    status: "planning",
    startDate: "Sep 5, 2026",
    finishDate: "Apr 20, 2027",
    workers: 5,
  },
  {
    id: 4,
    name: "Burnham Office Renovation",
    location: "Baguio City",
    client: "NorthPeak Inc.",
    progress: 86,
    status: "active",
    startDate: "Jun 10, 2026",
    finishDate: "Sep 15, 2026",
    workers: 11,
  },
  {
    id: 5,
    name: "Pines Commercial Center",
    location: "Baguio City",
    client: "Pines Development",
    progress: 54,
    status: "on_hold",
    startDate: "May 18, 2026",
    finishDate: "Dec 12, 2026",
    workers: 7,
  },
  {
    id: 6,
    name: "Camp 7 Residential Build",
    location: "Camp 7",
    client: "John Mendoza",
    progress: 100,
    status: "completed",
    startDate: "Mar 2, 2026",
    finishDate: "Jul 28, 2026",
    workers: 8,
  },
];

const statusStyles: Record<ProjectStatus, string> = {
  planning: "bg-[#4682B4]/10 text-[#4682B4]",
  active: "bg-[#FF8C00]/10 text-[#FF8C00]",
  on_hold: "bg-amber-50 text-amber-600",
  completed: "bg-emerald-50 text-emerald-600",
};

const statusLabels: Record<ProjectStatus, string> = {
  planning: "Planning",
  active: "Active",
  on_hold: "On Hold",
  completed: "Completed",
};

function getProgressColor(progress: number) {
  if (progress >= 100) return "bg-emerald-500";
  if (progress >= 70) return "bg-[#FF8C00]";
  return "bg-[#4682B4]";
}

export default function Manager_Dashboard() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ProjectStatus>(
    "all",
  );

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(query.toLowerCase()) ||
        project.location.toLowerCase().includes(query.toLowerCase()) ||
        project.client.toLowerCase().includes(query.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [query, statusFilter]);

  const totalProjects = projects.length;
  const activeProjects = projects.filter(
    (project) => project.status === "active",
  ).length;
  const planningProjects = projects.filter(
    (project) => project.status === "planning",
  ).length;
  const onHoldProjects = projects.filter(
    (project) => project.status === "on_hold",
  ).length;

  const averageProgress = Math.round(
    projects.reduce((sum, project) => sum + project.progress, 0) /
      projects.length,
  );

  return (
    <section className="min-h-screen bg-[#FBFCFE] px-4 pb-16 pt-12 sm:px-6 lg:px-10 lg:pt-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#4682B4]">
              Project Management
            </p>

            <h1 className="mt-1 text-3xl font-bold text-[#033363] sm:text-4xl">
              Manager Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Monitor your assigned construction projects, track progress, and
              stay ahead of upcoming deadlines.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[#033363]/10 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#033363]/5 text-[#033363]">
              <FolderKanban size={18} />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#4682B4]">
                My Projects
              </p>

              <p className="text-sm font-semibold text-[#033363]">
                {totalProjects} Assigned
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {/* Total */}
          <div className="rounded-2xl bg-[#033363] p-5 text-white shadow-[0_15px_40px_-20px_rgba(3,51,99,0.45)]">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <FolderKanban size={20} />
              </div>

              <span className="text-xs text-white/50">ALL</span>
            </div>

            <p className="mt-5 text-3xl font-bold">{totalProjects}</p>

            <p className="mt-1 text-sm text-white/65">
              Total Projects
            </p>
          </div>

          {/* Active */}
          <div className="rounded-2xl border border-[#033363]/10 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF8C00]/10 text-[#FF8C00]">
              <CircleCheck size={20} />
            </div>

            <p className="mt-5 text-3xl font-bold text-[#033363]">
              {activeProjects}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Active Projects
            </p>
          </div>

          {/* Planning */}
          <div className="rounded-2xl border border-[#033363]/10 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4682B4]/10 text-[#4682B4]">
              <Clock3 size={20} />
            </div>

            <p className="mt-5 text-3xl font-bold text-[#033363]">
              {planningProjects}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Planning
            </p>
          </div>

          {/* On Hold */}
          <div className="rounded-2xl border border-[#033363]/10 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <PauseCircle size={20} />
            </div>

            <p className="mt-5 text-3xl font-bold text-[#033363]">
              {onHoldProjects}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              On Hold
            </p>
          </div>

          {/* Average progress */}
          <div className="rounded-2xl border border-[#033363]/10 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF8C00]/10 text-[#FF8C00]">
              <CircleAlert size={20} />
            </div>

            <p className="mt-5 text-3xl font-bold text-[#033363]">
              {averageProgress}%
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Average Progress
            </p>
          </div>
        </div>

        {/* Project section */}
        <div className="mt-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#033363]">
                My Projects
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                All projects currently assigned to you.
              </p>
            </div>

            {/* Search */}
            <div className="flex w-full max-w-md items-center gap-2 rounded-xl border border-[#033363]/15 bg-white px-4 py-3 shadow-sm focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/20">
              <Search
                size={17}
                className="shrink-0 text-[#4682B4]"
              />

              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search projects, clients, or locations..."
                className="w-full bg-transparent text-sm text-[#033363] outline-none placeholder:text-[#4682B4]/40"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              { value: "all", label: "All Projects" },
              { value: "active", label: "Active" },
              { value: "planning", label: "Planning" },
              { value: "on_hold", label: "On Hold" },
              { value: "completed", label: "Completed" },
            ].map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() =>
                  setStatusFilter(
                    filter.value as "all" | ProjectStatus,
                  )
                }
                className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                  statusFilter === filter.value
                    ? "bg-[#033363] text-white"
                    : "border border-[#033363]/10 bg-white text-gray-500 hover:border-[#033363]/20 hover:text-[#033363]"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-[#033363]/10 bg-white py-16 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#033363]/5 text-[#4682B4]">
                  <Search size={20} />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-[#033363]">
                  No projects found
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  Try another search or filter.
                </p>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  className="group rounded-2xl border border-[#033363]/10 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-[#033363]/20 hover:shadow-lg"
                >
                  {/* Card top */}
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusStyles[project.status]}`}
                    >
                      {statusLabels[project.status]}
                    </span>

                    <ChevronRight
                      size={18}
                      className="text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-[#033363]"
                    />
                  </div>

                  {/* Project name */}
                  <h3 className="mt-5 text-xl font-bold text-[#033363]">
                    {project.name}
                  </h3>

                  {/* Location */}
                  <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                    <MapPin
                      size={14}
                      className="text-[#4682B4]"
                    />
                    {project.location}
                  </div>

                  {/* Client */}
                  <div className="mt-6">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#4682B4]/70">
                      Client
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {project.client}
                    </p>
                  </div>

                  {/* Dates + workers */}
                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#4682B4]/70">
                        Finish Date
                      </p>

                      <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-600">
                        <CalendarDays size={14} className="text-[#4682B4]" />
                        {project.finishDate}
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#4682B4]/70">
                        Workers
                      </p>

                      <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-600">
                        <Users size={14} className="text-[#4682B4]" />
                        {project.workers}
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">
                        Project Progress
                      </span>

                      <span className="text-xs font-bold text-[#033363]">
                        {project.progress}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full transition-all ${getProgressColor(
                          project.progress,
                        )}`}
                        style={{
                          width: `${project.progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 flex items-center justify-between border-t border-[#033363]/5 pt-4">
                    <span className="text-xs text-gray-400">
                      Started {project.startDate}
                    </span>

                    <span className="text-xs font-semibold text-[#4682B4] transition-colors group-hover:text-[#033363]">
                      View Project
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}