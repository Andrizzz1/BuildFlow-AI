import { useEffect, useState } from "react";
import { UserPlus, Search, Mail,Trash2 } from "lucide-react";
import initials from "@/components/Initials";
import AddWorkerModal from "@/components/AddWorkerModal";
import RowActionsMenu from "@/components/RowActionsMenu";
import { useNavigate } from "react-router-dom";
import { Fetch_workers } from "@/hooks/FetchWorkers";
import type{ Worker } from "@/types/types";


export default function Worker_Dashboard(){
    const [memberdets, setMemberdets] = useState<Worker[]>([]);
    const [query, setQuery] = useState("");
    const [addWorker,setAddWorker] = useState(false)

    // Delete confirmation
    const [deleteTarget, setDeleteTarget] = useState<Worker | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const filtered = memberdets.filter((m) =>
        m.full_name.toLowerCase().includes(query.toLowerCase())
    );
    const navigate = useNavigate()


      async function handleDeleteManager() {
        if (!deleteTarget) return;
          setIsDeleting(true);
          setDeleteError(null);
        try {
          const res = await fetch(`http://localhost:3000/user/${deleteTarget.id}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error("Failed to delete manager.");
          await Fetch_workers(setMemberdets);
          setDeleteTarget(null);
        } catch (err) {
          console.log(err)
          setDeleteError(err instanceof Error ? err.message : "Failed to delete manager.");
        } finally {
          setIsDeleting(false);
        }
      }

    useEffect(()=>{
        Fetch_workers(setMemberdets);
        
    },[])
    
      return (
        <section className="min-h-screen bg-[#FBFCFE] px-6 pb-16 pt-16 lg:px-10">
          <div className="mx-auto max-w-7xl">
            {/* Page header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="mt-1 text-3xl font-bold text-[#033363]">
                  Workers Page
                </h1>
              </div>
    
              <button
              onClick={()=>setAddWorker(true)}
                type="button"
                className="flex items-center gap-2 self-start rounded-md bg-[#FF8C00] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_-8px_rgba(255,140,0,0.5)] transition-colors hover:bg-[#e67e00] focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-[#033363] sm:self-auto"
              >
                <UserPlus size={18} />
                Add Worker
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
                  placeholder="Search managers..."
                  className="w-full bg-transparent text-sm text-[#033363] outline-none placeholder:text-[#4682B4]/40"
                />
              </div>
              <p className="text-sm text-gray-500">
                {memberdets.length} worker{memberdets.length !== 1 ? "s" : ""} total
              </p>
            </div>
    
            {/* Managers table */}
            <div className="mt-6 rounded-2xl border border-[#033363]/10 bg-white p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-[2fr_1.4fr_1fr_auto] md:gap-x-4">
                {/* Column labels */}
                <div className="hidden md:contents">
                  <span className="border-b border-[#033363]/10 pb-3 text-[11px] font-semibold uppercase tracking-widest text-[#4682B4]/70">
                    Worker
                  </span>
                  <span className="border-b border-[#033363]/10 pb-3 text-[11px] font-semibold uppercase tracking-widest text-[#4682B4]/70">
                    Email
                  </span>
                  <span className="border-b border-[#033363]/10 pb-3 text-[11px] font-semibold uppercase tracking-widest text-[#4682B4]/70">
                    Active Projects
                  </span>
                  <span className="border-b border-[#033363]/10 pb-3 text-right text-[11px] font-semibold uppercase tracking-widest text-[#4682B4]/70">
                    Action
                  </span>
                </div>
    
                {filtered.length === 0 && (
                  <div className="col-span-full py-10 text-center text-sm text-gray-400">
                    No Workers Yet.
                  </div>
                )}
    
                {filtered.map((manager, i) => {
                  const isLast = i === filtered.length - 1;
                  const cellBorder = isLast ? "" : "border-b border-[#033363]/5";
                  return (
                    <div key={manager.id} className="contents">
                      <div className={`flex items-center gap-3 py-4 ${cellBorder}`}>
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#033363] text-xs font-semibold text-white">
                          {initials(manager.full_name)}
                        </div>
                        <p className="font-medium text-[#033363]">{manager.full_name}</p>
                      </div>
    
                      <div className={`flex flex-col justify-center gap-1 py-4 text-xs text-gray-500 ${cellBorder}`}>
                        <span className="flex items-center gap-1.5">
                          <Mail size={13} className="text-[#4682B4]" />
                          {manager.email}
                        </span>
                      </div>
    
                      <p className={`flex items-center py-4 text-sm text-gray-600 ${cellBorder}`}>
                        {manager.project_count}
                      </p>
    
    
                      <div className={`flex items-center justify-start py-4 md:justify-end ${cellBorder}`}>
                        <RowActionsMenu
                          entityLabel="Manager"
                          onMessage={() => navigate("/Dashboard/Messages")}
                          onDelete={() => setDeleteTarget(manager)}
                        />
                    
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
    
          {/*Adding worke Modal */}
        
        <AddWorkerModal 
            isOpen={addWorker}
            onClose={()=>{setAddWorker(false)}}
            onSubmit={()=>{
                Fetch_workers(setMemberdets);
            }}
        />

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
                Delete {deleteTarget.full_name}?
              </h3>
              <p className="mt-1.5 text-sm text-gray-500">
                This will remove this manager's account. This action can't be undone.
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
                  onClick={handleDeleteManager}
                  className="rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
        </section>
      );
}