import { useEffect, useState } from "react";
import { UserPlus, Search, Mail, MoreVertical } from "lucide-react";
import initials from "@/components/Initials";
import AddWorkerModal from "@/components/AddWorkerModal";
type Worker = {
  id: string;
  full_name: string;
  email: string;
  project_count: string;
};


export default function Worker_Dashboard(){
    const [memberdets, setMemberdets] = useState<Worker[]>([]);
    const [query, setQuery] = useState("");
    const [addWorker,setAddWorker] = useState(false)
    const filtered = memberdets.filter((m) =>
        m.full_name.toLowerCase().includes(query.toLowerCase())
    );
    
    async function Fetch_workers(){
        try{
            const res = await fetch('http://localhost:3000/total_worker')
            const data = await res.json();
            console.log(data)

            if (!Array.isArray(data)) {
                console.error("Expected an array, got:", data);
            return; // don't set bad data into state
            }
            setMemberdets(data);
        }catch(err){
            console.error("Failed to fetch members:", err);
        }
    }
    useEffect(()=>{
        Fetch_workers();
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
                        <button
                          type="button"
                          aria-label="Manager actions"
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
    
          {/*Adding worke Modal */}
        
        <AddWorkerModal 
            isOpen={addWorker}
            onClose={()=>{setAddWorker(false)}}
            onSubmit={()=>{
                Fetch_workers();
            }}
        />
        </section>
      );
}