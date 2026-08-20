import { useState } from "react";
import {
  X,
  Mail,
  Calendar,
  User,
  BriefcaseBusiness,
  Phone,
  ShieldAlert,
} from "lucide-react";
import { AddWorker } from "@/hooks/AddWorker";

export type WorkerDetails = {
  name: string;
  email: string;
  specialty: string;
  hire_date: string;
  phone_number: string;
  emergency_contact: string;
};

type AddWorkerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: WorkerDetails) => Promise<void> | void;
};

const initialForm: WorkerDetails = {
  name: "",
  email: "",
  specialty: "",
  hire_date: "",
  phone_number: "",
  emergency_contact: "",
};

export default function AddWorkerModal({
  isOpen,
  onClose,
  onSubmit,
}: AddWorkerModalProps) {
  const [form, setForm] = useState<WorkerDetails>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    setIsSubmitting(true);
    console.log(form)
    try {
      await AddWorker(form);

      await onSubmit(form);

      setForm(initialForm);
      onClose();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to add worker.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClose() {
    if (isSubmitting) return;

    setForm(initialForm);
    setError(null);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#033363]/40 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-[0_25px_70px_-15px_rgba(3,51,99,0.4)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#033363]/10 px-6 py-5 sm:px-7">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#4682B4]">
              Team Management
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#033363] sm:text-2xl">
              Add Worker
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Create a worker profile and add them to your organization.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Close"
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-[#033363] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 sm:px-7">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-[#033363]"
              >
                Full Name
              </label>

              <div className="flex items-center gap-2 rounded-xl border border-[#033363]/15 bg-white px-3 py-3 transition-colors focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/20">
                <User
                  size={18}
                  className="shrink-0 text-[#4682B4]"
                />

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Juan Dela Cruz"
                  className="w-full bg-transparent text-sm text-[#033363] outline-none placeholder:text-[#4682B4]/40"
                />
              </div>
            </div>

            {/* Specialty */}
            <div>
              <label
                htmlFor="specialty"
                className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-[#033363]"
              >
                Specialty
              </label>

              <div className="flex items-center gap-2 rounded-xl border border-[#033363]/15 bg-white px-3 py-3 transition-colors focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/20">
                <BriefcaseBusiness
                  size={18}
                  className="shrink-0 text-[#4682B4]"
                />

                <input
                  id="specialty"
                  name="specialty"
                  type="text"
                  required
                  value={form.specialty}
                  onChange={handleChange}
                  placeholder="Electrician"
                  className="w-full bg-transparent text-sm text-[#033363] outline-none placeholder:text-[#4682B4]/40"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-[#033363]"
              >
                Email Address
              </label>

              <div className="flex items-center gap-2 rounded-xl border border-[#033363]/15 bg-white px-3 py-3 transition-colors focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/20">
                <Mail
                  size={18}
                  className="shrink-0 text-[#4682B4]"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="juan@buildflow.com"
                  className="w-full bg-transparent text-sm text-[#033363] outline-none placeholder:text-[#4682B4]/40"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phone_number"
                className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-[#033363]"
              >
                Phone Number
              </label>

              <div className="flex items-center gap-2 rounded-xl border border-[#033363]/15 bg-white px-3 py-3 transition-colors focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/20">
                <Phone
                  size={18}
                  className="shrink-0 text-[#4682B4]"
                />

                <input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  required
                  value={form.phone_number}
                  onChange={handleChange}
                  placeholder="09195371354"
                  className="w-full bg-transparent text-sm text-[#033363] outline-none placeholder:text-[#4682B4]/40"
                />
              </div>
            </div>

            {/* Hire Date */}
            <div>
              <label
                htmlFor="hire_date"
                className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-[#033363]"
              >
                Hire Date
              </label>

              <div className="flex items-center gap-2 rounded-xl border border-[#033363]/15 bg-white px-3 py-3 transition-colors focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/20">
                <Calendar
                  size={18}
                  className="shrink-0 text-[#4682B4]"
                />

                <input
                  id="hire_date"
                  name="hire_date"
                  type="date"
                  required
                  value={form.hire_date}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm text-[#033363] outline-none"
                />
              </div>

              <p className="mt-1.5 text-[10px] text-gray-400">
                Date the worker officially joined the organization.
              </p>
            </div>

            {/* Emergency Contact */}
            <div className="sm:col-span-2">
              <label
                htmlFor="emergency_contact"
                className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-[#033363]"
              >
                Emergency Contact
              </label>

              <div className="flex items-center gap-2 rounded-xl border border-[#033363]/15 bg-white px-3 py-3 transition-colors focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/20">
                <ShieldAlert
                  size={18}
                  className="shrink-0 text-[#4682B4]"
                />

                <input
                  id="emergency_contact"
                  name="emergency_contact"
                  type="text"
                  required
                  value={form.emergency_contact}
                  onChange={handleChange}
                  placeholder="Maria Dela Cruz — +1 (555) 908-2214"
                  className="w-full bg-transparent text-sm text-[#033363] outline-none placeholder:text-[#4682B4]/40"
                />
              </div>

              <p className="mt-1.5 text-[10px] text-gray-400">
                Name and phone number of who to contact in case of an emergency.
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
              <p className="text-xs font-medium text-red-700">
                {error}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#033363]/10 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-xl px-5 py-3 text-sm font-medium text-[#4682B4] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#FF8C00] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(255,140,0,0.5)] transition-colors hover:bg-[#e67e00] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Adding Worker..." : "Add Worker"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}