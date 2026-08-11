import { useEffect, useState } from "react";
import { X, Building2, MapPin, User, Users, Calendar, DollarSign } from "lucide-react";

type ProjectStatus = "planning" | "active" | "on_hold" | "completed" | "cancelled";

export type ProjectDetails = {
  name: string;
  description: string;
  location: string;
  assigned_manager: string;
  assigned_client: string;
  start_date: string;
  finish_date: string;
  budget: number;
  status: ProjectStatus;
  created_at: string;
};

type CreateProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: ProjectDetails) => Promise<void> | void;
  /** Pass "edit" to prefill the form and adjust labels for editing an existing project. */
  mode?: "create" | "edit";
  /** Values to prefill when mode is "edit". Ignored in create mode. */
  initialValues?: Partial<ProjectDetails>;
};

const emptyForm = {
  name: "",
  description: "",
  location: "",
  assigned_manager: "",
  assigned_client: "",
  start_date: "",
  finish_date: "",
  budget: "",
  status: "planning" as ProjectStatus,
};

function toFormShape(values?: Partial<ProjectDetails>) {
  if (!values) return emptyForm;
  return {
    name: values.name ?? "",
    description: values.description ?? "",
    location: values.location ?? "",
    assigned_manager: values.assigned_manager ?? "",
    assigned_client: values.assigned_client ?? "",
    start_date: values.start_date ?? "",
    finish_date: values.finish_date ?? "",
    budget: values.budget !== undefined ? String(values.budget) : "",
    status: values.status ?? "planning",
  };
}

export default function CreateProjectModal({
  isOpen,
  onClose,
  onSubmit,
  mode = "create",
  initialValues,
}: CreateProjectModalProps) {
  const [form, setForm] = useState(() => toFormShape(initialValues));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Re-sync the form whenever the modal opens with new initial values
  // (e.g. switching which project is being edited).
  useEffect(() => {
    if (isOpen) {
      setForm(toFormShape(initialValues));
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialValues]);

  if (!isOpen) return null;

  const isEdit = mode === "edit";

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (new Date(form.finish_date) < new Date(form.start_date)) {
      setError("Finish date can't be earlier than the start date.");
      return;
    }

    setIsSubmitting(true);
    try {
      const details: ProjectDetails = {
        ...form,
        budget: Number(form.budget),
        created_at: isEdit
          ? initialValues?.created_at ?? new Date().toISOString()
          : new Date().toISOString(),
      };
      await onSubmit(details);
      setForm(emptyForm);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${isEdit ? "update" : "create"} project.`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#033363]/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-[0_25px_70px_-15px_rgba(3,51,99,0.4)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#033363]/10 px-6 py-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#4682B4]">
              {isEdit ? "Edit Project" : "New Project"}
            </p>
            <h2 className="mt-0.5 text-xl font-bold text-[#033363]">
              {isEdit ? "Edit Project" : "Create Project"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-[#033363]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Project name */}
            <div className="md:col-span-2">
              <label
                htmlFor="name"
                className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#033363]"
              >
                Project Name
              </label>
              <div className="flex items-center gap-2 rounded-md border border-[#033363]/20 bg-white px-3 py-2.5 transition-colors focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/30">
                <Building2 size={18} className="shrink-0 text-[#4682B4]" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Skyline Corporate"
                  className="w-full bg-transparent text-sm text-[#033363] outline-none placeholder:text-[#4682B4]/40"
                />
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#033363]"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                required
                value={form.description}
                onChange={handleChange}
                placeholder="Brief scope of the project..."
                className="w-full resize-none rounded-md border border-[#033363]/20 bg-white px-3 py-2.5 text-sm text-[#033363] outline-none transition-colors placeholder:text-[#4682B4]/40 focus:border-[#00BFFF] focus:ring-2 focus:ring-[#00BFFF]/30"
              />
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#033363]"
              >
                Location
              </label>
              <div className="flex items-center gap-2 rounded-md border border-[#033363]/20 bg-white px-3 py-2.5 transition-colors focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/30">
                <MapPin size={18} className="shrink-0 text-[#4682B4]" />
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Chicago, IL"
                  className="w-full bg-transparent text-sm text-[#033363] outline-none placeholder:text-[#4682B4]/40"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#033363]"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-md border border-[#033363]/20 bg-white px-3 py-2.5 text-sm text-[#033363] outline-none transition-colors focus:border-[#00BFFF] focus:ring-2 focus:ring-[#00BFFF]/30"
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Assigned manager */}
            <div>
              <label
                htmlFor="assigned_manager"
                className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#033363]"
              >
                Assigned Manager
              </label>
              <div className="flex items-center gap-2 rounded-md border border-[#033363]/20 bg-white px-3 py-2.5 transition-colors focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/30">
                <User size={18} className="shrink-0 text-[#4682B4]" />
                <input
                  id="assigned_manager"
                  name="assigned_manager"
                  type="text"
                  required
                  value={form.assigned_manager}
                  onChange={handleChange}
                  placeholder="Manager name or ID"
                  className="w-full bg-transparent text-sm text-[#033363] outline-none placeholder:text-[#4682B4]/40"
                />
              </div>
            </div>

            {/* Assigned client */}
            <div>
              <label
                htmlFor="assigned_client"
                className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#033363]"
              >
                Assigned Client
              </label>
              <div className="flex items-center gap-2 rounded-md border border-[#033363]/20 bg-white px-3 py-2.5 transition-colors focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/30">
                <Users size={18} className="shrink-0 text-[#4682B4]" />
                <input
                  id="assigned_client"
                  name="assigned_client"
                  type="text"
                  required
                  value={form.assigned_client}
                  onChange={handleChange}
                  placeholder="Client name or ID"
                  className="w-full bg-transparent text-sm text-[#033363] outline-none placeholder:text-[#4682B4]/40"
                />
              </div>
            </div>

            {/* Start date */}
            <div>
              <label
                htmlFor="start_date"
                className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#033363]"
              >
                Start Date
              </label>
              <div className="flex items-center gap-2 rounded-md border border-[#033363]/20 bg-white px-3 py-2.5 transition-colors focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/30">
                <Calendar size={18} className="shrink-0 text-[#4682B4]" />
                <input
                  id="start_date"
                  name="start_date"
                  type="date"
                  required
                  value={form.start_date}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm text-[#033363] outline-none"
                />
              </div>
            </div>

            {/* Finish date */}
            <div>
              <label
                htmlFor="finish_date"
                className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#033363]"
              >
                Finish Date
              </label>
              <div className="flex items-center gap-2 rounded-md border border-[#033363]/20 bg-white px-3 py-2.5 transition-colors focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/30">
                <Calendar size={18} className="shrink-0 text-[#4682B4]" />
                <input
                  id="finish_date"
                  name="finish_date"
                  type="date"
                  required
                  value={form.finish_date}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm text-[#033363] outline-none"
                />
              </div>
            </div>

            {/* Budget */}
            <div>
              <label
                htmlFor="budget"
                className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#033363]"
              >
                Budget
              </label>
              <div className="flex items-center gap-2 rounded-md border border-[#033363]/20 bg-white px-3 py-2.5 transition-colors focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/30">
                <DollarSign size={18} className="shrink-0 text-[#4682B4]" />
                <input
                  id="budget"
                  name="budget"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.budget}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full bg-transparent text-sm text-[#033363] outline-none placeholder:text-[#4682B4]/40"
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="mt-5 rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#033363]/10 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2.5 text-sm font-medium text-[#4682B4] transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-[#FF8C00] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e67e00] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? isEdit
                  ? "Saving..."
                  : "Creating..."
                : isEdit
                ? "Save Changes"
                : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}