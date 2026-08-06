import { useState } from "react";
import { X, Mail } from "lucide-react";
import { AddWorker } from "@/hooks/AddWorker";
export type WorkerDetails = {
    name:string,
    email:string
};

type AddWorkerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: WorkerDetails) => Promise<void> | void;
};

const initialForm = {
  name: "",
  email: "",

};

export default function AddWorkerModal({
  isOpen,
  onClose,
  onSubmit
}: AddWorkerModalProps) {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  if (!isOpen) return null;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    setIsSubmitting(true);
    try {
      await AddWorker(form);
      setForm(initialForm);
      await onSubmit(form); 
      onClose();
    } catch (err) {
      console.log(err)
      setError(err instanceof Error ? err.message : "Failed to Add Worker.");
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
              New Worker
            </p>
            <h2 className="mt-0.5 text-xl font-bold text-[#033363]">
              Add Worker
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
          <div className="grid grid-cols-1 gap-5 ">
            {/* Project name */}
            <div className="md:col-span-2">
              <label
                htmlFor="name"
                className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#033363]"
              >
                Name
              </label>
              <div className="flex items-center gap-2 rounded-md border border-[#033363]/20 bg-white px-3 py-2.5 transition-colors focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/30">
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

            {/* Email*/}
            <div >
              <label
                htmlFor="email"
                className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#033363]"
              >
                Email
              </label>
              <div className="flex items-center gap-2 rounded-md border border-[#033363]/20 bg-white px-3 py-2.5 transition-colors focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/30">
                <Mail size={18} className="shrink-0 text-[#4682B4]" />
                <input
                  id="email"
                  name="email"
                  type="text"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter an email"
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
              {isSubmitting ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}