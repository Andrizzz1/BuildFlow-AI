import { useEffect, useRef, useState } from "react";
import { MoreVertical, MessageSquare, Trash2 } from "lucide-react";

type RowActionsMenuProps = {
  /** What this row represents, used to label the delete option, e.g. "Manager", "Client", "Worker". */
  entityLabel: string;
  /** Called when "Message" is clicked. Omit to hide that option entirely. */
  onMessage?: () => void;
  /** Called when "Delete {entityLabel}" is clicked. */
  onDelete: () => void;
};

export default function RowActionsMenu({
  entityLabel,
  onMessage,
  onDelete,
}: RowActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        aria-label="Row actions"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-50 hover:text-[#033363]"
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-8 z-20 w-44 overflow-hidden rounded-lg border border-[#033363]/10 bg-white py-1.5 shadow-[0_15px_35px_-10px_rgba(3,51,99,0.3)]"
        >
          {onMessage && (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onMessage();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-[#033363] transition-colors hover:bg-[#4682B4]/10"
            >
              <MessageSquare size={15} className="text-[#4682B4]" />
              Message
            </button>
          )}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            <Trash2 size={15} />
            Delete {entityLabel}
          </button>
        </div>
      )}
    </div>
  );
}