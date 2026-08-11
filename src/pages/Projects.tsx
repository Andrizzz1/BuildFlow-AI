import { useEffect, useRef, useState } from "react";
import { FolderPlus, Search, MoreVertical, MapPin, Pencil, Trash2 } from "lucide-react";
import CreateProjectModal, { type ProjectDetails } from "@/components/CreateProjectModal";

type Project = {
  id: string;
  name: string;
  description: string;
  location: string;
  start_date: string;
  finish_date: string;
  budget: number;
  manager: string;
  client: string;
  status: "planning" | "active" | "on_hold" | "completed" | "cancelled";
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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Which project's "..." menu is currently open (null = none)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Editing and deleting
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

  // Close the "..." menu when clicking anywhere outside it
  useEffect(() => {
    if (!openMenuId) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  async function handleCreateProject(details: ProjectDetails) {
    const res = await fetch("http://localhost:3000/createProject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
    });
    if (!res.ok) throw new Error("Failed to create project.");
    await fetchProjects();
  }

  async function handleEditProject(details: ProjectDetails) {
    if (!editingProject) return;
    const res = await fetch(`http://localhost:3000/projects/${editingProject.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
    });
    if (!res.ok) throw new Error("Failed to update project.");
    await fetchProjects();
    setEditingProject(null);
  }

  async function handleDeleteProject() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError(null);
    console.log(deleteTarget)
    console.log(`This is the id ${deleteTarget.id}`)
    try {
      const res = await fetch(`http://localhost:3000/projects/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete project.");
      await fetchProjects();
      setDeleteTarget(null);
      // In case the deleted project was open in the details modal
      setSelectedProject((prev) => (prev?.id === deleteTarget.id ? null : prev));
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete project.");
    } finally {
      setIsDeleting(false);
    }
  }

  // Map a Project (display-shaped) into the ProjectDetails shape the modal expects,
  // for prefilling the edit form. NOTE: this page's Project type stores manager/client
  // as readable names, while CreateProjectModal's ProjectDetails expects
  // assigned_manager/assigned_client (IDs). Adjust this mapping once your backend
  // returns manager/client IDs alongside names.
  function toEditInitialValues(project: Project): Partial<ProjectDetails> {
    return {
      name: project.name,
      description: project.description,
      location: project.location,
      assigned_manager: project.manager,
      assigned_client: project.client,
      start_date: project.start_date,
      finish_date: project.finish_date,
      budget: project.budget,
      status: project.status,
    };
  }

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

        {/* Project cards */}
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.length === 0 && (
            <div className="col-span-full rounded-2xl border border-[#033363]/10 bg-white py-16 text-center shadow-sm">
              <p className="text-sm text-gray-400">No projects found.</p>
            </div>
          )}

          {filtered.map((project) => (
            <div
              key={project.id}
              className="group rounded-2xl border border-[#033363]/10 bg-white p-6 text-left shadow-sm transition-all hover:border-[#033363]/20"
            >
              {/* Status + menu trigger */}
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[project.status]}`}
                >
                  {statusLabels[project.status]}
                </span>

                <div className="relative" ref={openMenuId === project.id ? menuRef : undefined}>
                  <button
                    type="button"
                    aria-label="Project actions"
                    aria-haspopup="menu"
                    aria-expanded={openMenuId === project.id}
                    onClick={() =>
                      setOpenMenuId((prev) => (prev === project.id ? null : project.id))
                    }
                    className="rounded-md p-1 text-gray-300 transition-colors hover:bg-gray-50 hover:text-[#033363]"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {openMenuId === project.id && (
                    <div
                      role="menu"
                      className="absolute right-0 top-8 z-20 w-44 overflow-hidden rounded-lg border border-[#033363]/10 bg-white py-1.5 shadow-[0_15px_35px_-10px_rgba(3,51,99,0.3)]"
                    >
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setEditingProject(project);
                          setOpenMenuId(null);
                        }}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-[#033363] transition-colors hover:bg-[#4682B4]/10"
                      >
                        <Pencil size={15} className="text-[#4682B4]" />
                        Edit Project
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setDeleteTarget(project);
                          setOpenMenuId(null);
                        }}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                        Delete Project
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Project name */}
              <button
                type="button"
                onClick={() => setSelectedProject(project)}
                className="mt-5 block text-left text-xl font-semibold text-[#033363] hover:underline"
              >
                {project.name}
              </button>

              {/* Location */}
              <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                <MapPin size={14} className="text-[#4682B4]" />
                {project.location}
              </div>

              {/* Manager */}
              <div className="mt-6">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#4682B4]/70">
                  Project Manager
                </p>
                <p className="mt-1 text-sm font-medium text-gray-700">
                  {project.manager || "Unassigned"}
                </p>
              </div>

              {/* Client */}
              <div className="mt-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#4682B4]/70">
                  Client
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {project.client || "Unassigned"}
                </p>
              </div>

              {/* Completion */}
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Completion</span>
                  <span className="text-xs font-semibold text-[#033363]">0%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-[#FF8C00]" style={{ width: `0%` }} />
                </div>
              </div>

              {/* View details */}
              <button
                type="button"
                onClick={() => setSelectedProject(project)}
                className="mt-5 w-full border-t border-[#033363]/5 pt-4 text-left text-xs font-semibold text-[#4682B4] hover:underline"
              >
                View project details →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Details modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#033363]/40 p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl bg-white p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[selectedProject.status]}`}
                >
                  {statusLabels[selectedProject.status]}
                </span>
                <h2 className="mt-4 text-2xl font-bold text-[#033363]">
                  {selectedProject.name}
                </h2>
                <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                  <MapPin size={14} className="text-[#4682B4]" />
                  {selectedProject.location}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-[#033363]"
              >
                ✕
              </button>
            </div>

            {/* Description */}
            <p className="mt-8 text-xs uppercase tracking-widest text-[#4682B4]/70">
              Description
            </p>
            {selectedProject.description}

            {/* Info grid */}
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#4682B4]/70">
                  Project Manager
                </p>
                <p className="mt-1 font-medium text-gray-700">
                  {selectedProject.manager || "Unassigned"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-[#4682B4]/70">Client</p>
                <p className="mt-1 font-medium text-gray-700">
                  {selectedProject.client || "Unassigned"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-[#4682B4]/70">
                  Start Date
                </p>
                <p className="mt-1 text-gray-700">{selectedProject.start_date}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-[#4682B4]/70">
                  Expected Finish
                </p>
                <p className="mt-1 text-gray-700">{selectedProject.finish_date}</p>
              </div>
            </div>

            <p className="mt-8 text-xs uppercase tracking-widest text-[#4682B4]/70">Budget</p>
            ₱ {selectedProject.budget}

            {/* Completion */}
            <div className="mt-8">
              <div className="flex justify-between">
                <p className="text-sm font-medium text-gray-600">Project Progress</p>
                <p className="text-sm font-semibold text-[#033363]">0%</p>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-[#FF8C00]" style={{ width: `0%` }} />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="rounded-md border border-[#033363]/10 px-4 py-2 text-sm font-medium text-gray-600"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingProject(selectedProject);
                  setSelectedProject(null);
                }}
                className="rounded-md bg-[#033363] px-4 py-2 text-sm font-medium text-white"
              >
                Edit Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#033363]/40 p-4"
          onClick={() => !isDeleting && setDeleteTarget(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#033363]">
              Delete "{deleteTarget.name}"?
            </h3>
            <p className="mt-1.5 text-sm text-gray-500">
              This will permanently remove the project. This action can't be undone.
            </p>

            {deleteError && (
              <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                {deleteError}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="rounded-md px-4 py-2.5 text-sm font-medium text-[#4682B4] transition-colors hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteProject}
                className="rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Project modal */}
      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateProject}
      />

      {/* Edit Project modal (same component, edit mode) */}
      <CreateProjectModal
        isOpen={!!editingProject}
        mode="edit"
        initialValues={editingProject ? toEditInitialValues(editingProject) : undefined}
        onClose={() => setEditingProject(null)}
        onSubmit={handleEditProject}
      />
    </section>
  );
}