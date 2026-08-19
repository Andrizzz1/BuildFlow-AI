import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  UserCheck,
  UserRoundCheck,
  Plus,
  X,
  Check,
  ChevronDown,
} from "lucide-react";
import { Fetch_workers } from "@/hooks/FetchWorkers";
import AddWorkerModal from "@/components/AddWorkerModal";
import type { Worker, WorkerStatus } from "@/types/types";
import initials from "@/components/Initials";



const projects = [
  "Skyline Corporate",
  "La Trinidad Warehouse",
  "Mountain View Residence",
];

const statusStyles: Record<WorkerStatus, string> = {
  Available: "bg-emerald-50 text-emerald-600",
  Working: "bg-[#FF8C00]/10 text-[#FF8C00]",
  "On Leave": "bg-gray-100 text-gray-500",
};


export default function ManagerWorkers() {
  const [workersdets,setWorkersdets] = useState<Worker[]>([])
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | WorkerStatus
  >("All");

  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedWorkers, setSelectedWorkers] = useState<number[]>([]);
  const [addWorker,setAddWorker] = useState(false)

  const filteredWorkers = useMemo(() => {
    return workersdets.filter((worker) => {
      const matchesSearch =
        worker.full_name.toLowerCase().includes(query.toLowerCase()) ||
        worker.email.toLowerCase().includes(query.toLowerCase()) ||
        worker.specialty.toLowerCase().includes(query.toLowerCase()) ||
        (worker.project ?? "")
          .toLowerCase()
          .includes(query.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || worker.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [workersdets,query, statusFilter]);

  const totalWorkers = workersdets.length;

  const assignedWorkers = workersdets.filter(
    (worker) => worker.project !== null,
  ).length;

  const availableWorkers = workersdets.filter(
    (worker) => worker.status === "Available",
  ).length;

  const onLeaveWorkers = workersdets.filter(
    (worker) => worker.status === "On Leave",
  ).length;

  function toggleWorker(workerId: number) {
    setSelectedWorkers((current) =>
      current.includes(workerId)
        ? current.filter((id) => id !== workerId)
        : [...current, workerId],
    );
  }

  function closeAssignModal() {
    setIsAssignOpen(false);
    setSelectedProject("");
    setSelectedWorkers([]);
  }

  function handleAssign() {
    if (!selectedProject || selectedWorkers.length === 0) {
      return;
    }
    closeAssignModal();
  }

    useEffect(()=>{
    Fetch_workers(setWorkersdets);
},[])
  return (
    <section className="min-h-screen bg-[#FBFCFE] px-4 pb-16 pt-12 sm:px-6 lg:px-10 lg:pt-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#4682B4]">
              Team Management
            </p>

            <h1 className="mt-1 text-3xl font-bold text-[#033363] sm:text-4xl">
              Workers
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Manage workers assigned to your projects and build project
              teams.
            </p>
          </div>
            <div className="flex gap-4 justify-center md:justify-end">
            <button
                type="button"
                onClick={() => setIsAssignOpen(true)}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#FF8C00] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_-8px_rgba(255,140,0,0.5)] transition hover:bg-[#e67e00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#033363]"
            >
                <Plus size={18} />
                Assign to Project
            </button>
            <button
                type="button"
                onClick={() => setAddWorker(true)}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#FF8C00] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_-8px_rgba(255,140,0,0.5)] transition hover:bg-[#e67e00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#033363]"
            >
                <Plus size={18} />
                Add Workers
            </button>
            </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-[#033363] p-5 text-white shadow-[0_15px_40px_-20px_rgba(3,51,99,0.45)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Users size={20} />
            </div>

            <p className="mt-5 text-3xl font-bold">{totalWorkers}</p>
            <p className="mt-1 text-sm text-white/65">Total Workers</p>
          </div>

          <div className="rounded-2xl border border-[#033363]/10 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF8C00]/10 text-[#FF8C00]">
              <UserCheck size={20} />
            </div>

            <p className="mt-5 text-3xl font-bold text-[#033363]">
              {assignedWorkers}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Currently Assigned
            </p>
          </div>

          <div className="rounded-2xl border border-[#033363]/10 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <UserRoundCheck size={20} />
            </div>

            <p className="mt-5 text-3xl font-bold text-[#033363]">
              {availableWorkers}
            </p>
            <p className="mt-1 text-sm text-gray-500">Available</p>
          </div>

          <div className="rounded-2xl border border-[#033363]/10 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
              <Users size={20} />
            </div>

            <p className="mt-5 text-3xl font-bold text-[#033363]">
              {onLeaveWorkers}
            </p>
            <p className="mt-1 text-sm text-gray-500">On Leave</p>
          </div>
        </div>

        {/* Search + filters */}
        <div className="mt-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#033363]">
                Worker Directory
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Workers available to support your assigned projects.
              </p>
            </div>

            <div className="flex w-full max-w-md items-center gap-2 rounded-xl border border-[#033363]/15 bg-white px-4 py-3 shadow-sm focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/20">
              <Search size={17} className="shrink-0 text-[#4682B4]" />

              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search workers..."
                className="w-full bg-transparent text-sm text-[#033363] outline-none placeholder:text-[#4682B4]/40"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              "All",
              "Available",
              "Working",
              "On Leave",
            ].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() =>
                  setStatusFilter(filter as "All" | WorkerStatus)
                }
                className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                  statusFilter === filter
                    ? "bg-[#033363] text-white"
                    : "border border-[#033363]/10 bg-white text-gray-500 hover:border-[#033363]/20 hover:text-[#033363]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Worker table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-[#033363]/10 bg-white shadow-sm">
          {/* Desktop header */}
          <div className="hidden border-b border-[#033363]/10 px-6 py-4 lg:grid lg:grid-cols-[2fr_1.3fr_1.7fr_1fr_1fr_auto] lg:gap-5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#4682B4]/70">
              Worker
            </span>

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#4682B4]/70">
              Specialty
            </span>

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#4682B4]/70">
              Current Project
            </span>

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#4682B4]/70">
              Status
            </span>

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#4682B4]/70">
              Activity
            </span>

            <span className="text-right text-[10px] font-semibold uppercase tracking-[0.18em] text-[#4682B4]/70">
              Action
            </span>
          </div>

          {filteredWorkers.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#033363]/5 text-[#4682B4]">
                <Search size={20} />
              </div>

              <p className="mt-4 text-sm font-semibold text-[#033363]">
                No workers found
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Try another search or filter.
              </p>
            </div>
          ) : (
            filteredWorkers.map((worker) => (
              <div
                key={worker.id}
                className="border-b border-[#033363]/5 px-4 py-4 last:border-b-0 lg:grid lg:grid-cols-[2fr_1.3fr_1.7fr_1fr_1fr_auto] lg:items-center lg:gap-5 lg:px-6"
              >
                {/* Worker */}
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#033363] text-xs font-bold text-white">
                    {initials(worker.full_name)}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#033363]">
                      {worker.full_name}
                    </p>

                    <p className="truncate text-xs text-gray-400">
                      {worker.email}
                    </p>
                  </div>
                </div>

                {/* Specialty */}
                <div className="mt-4 lg:mt-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#4682B4]/70 lg:hidden">
                    Specialty
                  </p>

                  <p className="mt-1 text-sm text-gray-600 lg:mt-0">
                    {worker.specialty}
                  </p>
                </div>

                {/* Project */}
                <div className="mt-4 lg:mt-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#4682B4]/70 lg:hidden">
                    Current Project
                  </p>

                  <p className="mt-1 text-sm text-gray-600 lg:mt-0">
                    {worker.project ?? (
                      <span className="text-gray-400">
                        Unassigned
                      </span>
                    )}
                  </p>
                </div>

                {/* Status */}
                <div className="mt-4 lg:mt-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#4682B4]/70 lg:hidden">
                    Status
                  </p>

                  <span
                    className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium lg:mt-0 ${
                      statusStyles[worker.status]
                    }`}
                  >
                    {worker.status}
                  </span>
                </div>

                {/* Activity */}
                <div className="mt-4 lg:mt-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#4682B4]/70 lg:hidden">
                    Last Activity
                  </p>

                  <p className="mt-1 text-sm text-gray-500 lg:mt-0">
                    {worker.lastActivity}
                  </p>
                </div>

                {/* Action */}
                <div className="mt-4 lg:mt-0 lg:text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedWorkers([worker.id]);
                      setIsAssignOpen(true);
                    }}
                    className="rounded-lg border border-[#033363]/15 px-3 py-2 text-xs font-semibold text-[#033363] transition hover:bg-[#033363] hover:text-white"
                  >
                    Assign
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Assign Modal */}
      {isAssignOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#033363]/40 p-4 backdrop-blur-sm"
          onClick={closeAssignModal}
        >
          <div
            className="w-full max-w-xl rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between border-b border-[#033363]/10 px-6 py-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#4682B4]">
                  Team Assignment
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#033363]">
                  Assign Workers
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Select a project and assign one or more workers.
                </p>
              </div>

              <button
                type="button"
                onClick={closeAssignModal}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-[#033363]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-6">
              {/* Project */}
              <label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#033363]">
                Project
              </label>

              <div className="relative mt-2">
                <select
                  value={selectedProject}
                  onChange={(event) =>
                    setSelectedProject(event.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-[#033363]/15 bg-white px-4 py-3 pr-10 text-sm text-[#033363] outline-none transition focus:border-[#00BFFF] focus:ring-2 focus:ring-[#00BFFF]/20"
                >
                  <option value="">Select a project</option>

                  {projects.map((project) => (
                    <option key={project} value={project}>
                      {project}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#4682B4]"
                />
              </div>

              {/* Workers */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#033363]">
                    Workers
                  </label>

                  <span className="text-xs text-gray-400">
                    {selectedWorkers.length} selected
                  </span>
                </div>

                <div className="mt-3 max-h-64 overflow-y-auto rounded-xl border border-[#033363]/10">
                  {workersdets.map((worker) => {
                    const selected = selectedWorkers.includes(worker.id);

                    return (
                      <button
                        key={worker.id}
                        type="button"
                        onClick={() => toggleWorker(worker.id)}
                        className={`flex w-full items-center gap-3 border-b border-[#033363]/5 px-4 py-3 text-left transition last:border-b-0 ${
                          selected
                            ? "bg-[#033363]/5"
                            : "hover:bg-[#FBFCFE]"
                        }`}
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                            selected
                              ? "bg-[#033363] text-white"
                              : "bg-[#033363]/10 text-[#033363]"
                          }`}
                        >
                          {initials(worker.full_name)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-[#033363]">
                            {worker.full_name}
                          </p>

                          <p className="text-xs text-gray-400">
                            {worker.specialty}
                          </p>
                        </div>

                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                            selected
                              ? "border-[#033363] bg-[#033363] text-white"
                              : "border-[#033363]/20"
                          }`}
                        >
                          {selected && <Check size={13} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Modal actions */}
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeAssignModal}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-gray-500 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleAssign}
                  disabled={
                    !selectedProject || selectedWorkers.length === 0
                  }
                  className="rounded-xl bg-[#FF8C00] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e67e00] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Assign Workers
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/*Add Worker Modal */}
       <AddWorkerModal        
        isOpen={addWorker}
        onClose={()=>{setAddWorker(false)}}
        onSubmit={()=>{
            Fetch_workers(setWorkersdets);
        }}
               />
    </section>
  );
}