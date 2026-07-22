import StaggeredMenu from "@/components/StaggeredMenu";
import logo from "../assets/logo.png";
import CreateProjectModal from "@/components/CreateProjectModal";

import {
  FolderOpenDot,
  FolderDot,
  Pickaxe,
  EllipsisVertical,
  Plus,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
export default function Owner_Dashboard() {
  const menuItems = [
    { label: "Projects", ariaLabel: "Go to home page", link: "/Dashboard/Projects" },
    { label: "Managers", ariaLabel: "Learn about us", link: "/Dashboard/Managers" },
    { label: "Workers", ariaLabel: "View our services", link: "/Dashboard/Workers" },
    { label: "Clients", ariaLabel: "Get in touch", link: "/Dashboard/Clients" },
    { label: "Messages", ariaLabel: "Get in touch", link: "/Dashboard/Messages" },
  ];

  const socialItems = [{ label: "Twitter", link: "/" }];

  const navigate = useNavigate()
  const [isCreateProject, setIsCreateProject] = useState(false)
  const stats = [
    { icon: FolderOpenDot, label: "Total Projects", value: 0 },
    { icon: FolderDot, label: "Active Projects", value: 0 },
    { icon: Pickaxe, label: "Total Workers", value: 0 },
  ];

  const activeProjects = [
    {
      name: "Skyline Corporate",
      location: "Chicago, IL",
      status: "On Planning",
      completion: 55,
    },
  ];

  const memberProgress = [
    {
      name: "Juan Dela Cruz",
      task: "Wall Construction",
      status: "Ongoing",
      lastUpdate: "Jul 2, 2026",
      completion: 55,
    },
  ];

  const statusStyles: Record<string, string> = {
    "On Planning": "bg-[#4682B4]/10 text-[#4682B4]",
    Ongoing: "bg-[#FF8C00]/10 text-[#FF8C00]",
    Completed: "bg-emerald-50 text-emerald-600",
  };

  return (
    <section className="min-h-screen bg-[#FBFCFE] pb-28">
      <nav>
        <StaggeredMenu
          isFixed
          position="right"
          items={menuItems}
          socialItems={socialItems}
          displaySocials
          displayItemNumbering={true}
          menuButtonColor="033363"
          openMenuButtonColor="#1a1a1a"
          changeMenuColorOnOpen={true}
          colors={["033363", "#5227FF"]}
          logoUrl={logo}
          accentColor="#5227FF"
        />
      </nav>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 pt-16 lg:px-10 z-50">
        {/* Page heading */}
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#4682B4]">
            Overview
          </p>
          <h1 className="mt-1 text-3xl font-bold text-[#033363]">
            Dashboard
          </h1>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="relative overflow-hidden rounded-2xl bg-[#033363] p-6 text-white shadow-[0_15px_40px_-15px_rgba(3,51,99,0.5)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                  <Icon size={20} />
                </div>
              </div>
              <p className="mt-6 text-4xl font-bold tabular-nums">{value}</p>
              <p className="mt-1 text-sm text-white/70">{label}</p>
            </div>
          ))}
        </div>

        {/* Active Project Overview */}
        <div className="mt-10 rounded-2xl border border-[#033363]/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#033363]">
              Active Project Overview
            </h2>
            <a
              onClick={()=>{navigate('/Dashboard/Projects')}}
              className="text-xs font-medium text-[#4682B4] hover:text-[#033363]   cursor-pointer"
            >
              View all projects →
            </a>
          </div>

          {/* Header + rows share one grid so columns can never drift apart */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-[2fr_1.2fr_1fr_1.2fr_auto] md:gap-x-4">
            {/* Column labels */}
            <div className="hidden md:contents">
              <span className="border-b border-[#033363]/10 pb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#4682B4]/70">
                Project
              </span>
              <span className="border-b border-[#033363]/10 pb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#4682B4]/70">
                Location
              </span>
              <span className="border-b border-[#033363]/10 pb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#4682B4]/70">
                Status
              </span>
              <span className="border-b border-[#033363]/10 pb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#4682B4]/70">
                Completion
              </span>
              <span className="border-b border-[#033363]/10 pb-3 text-right text-[11px] font-semibold uppercase tracking-[0.1em] text-[#4682B4]/70">
                Action
              </span>
            </div>

            {<CreateProjectModal 
              isOpen={isCreateProject}
              onClose={()=>(setIsCreateProject(false))}
              onSubmit={()=>{}}
            />}

            {activeProjects.map((project, i) => {
              const isLast = i === activeProjects.length - 1;
              const cellBorder = isLast ? "" : "border-b border-[#033363]/5";
              return (
                <div key={project.name} className="contents">
                  <p className={`flex items-center py-4 font-medium text-[#033363] ${cellBorder}`}>
                    {project.name}
                  </p>
                  <p className={`flex items-center py-4 text-sm text-gray-500 ${cellBorder}`}>
                    {project.location}
                  </p>
                  <div className={`flex items-center py-4 ${cellBorder}`}>
                    <span
                      className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium ${
                        statusStyles[project.status] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {project.status}
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
                      <EllipsisVertical size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Member Progress Monitoring */}
        <div className="mt-8 rounded-2xl border border-[#033363]/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#033363]">
              Member Progress Monitoring
            </h2>
            <a
               onClick={()=>{navigate('/Dashboard/Workers')}}
              className="text-xs font-medium text-[#4682B4] hover:text-[#033363] cursor-pointer"
            >
              View all members →
            </a>
          </div>

          {/* Header + rows share one grid so columns can never drift apart */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-[1.6fr_1.6fr_1fr_1fr_1.2fr_auto] md:gap-x-4">
            {/* Column labels */}
            <div className="hidden md:contents">
              <span className="border-b border-[#033363]/10 pb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#4682B4]/70">
                Member
              </span>
              <span className="border-b border-[#033363]/10 pb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#4682B4]/70">
                Task
              </span>
              <span className="border-b border-[#033363]/10 pb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#4682B4]/70">
                Status
              </span>
              <span className="border-b border-[#033363]/10 pb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#4682B4]/70">
                Last Update
              </span>
              <span className="border-b border-[#033363]/10 pb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#4682B4]/70">
                Progress
              </span>
              <span className="border-b border-[#033363]/10 pb-3 text-right text-[11px] font-semibold uppercase tracking-[0.1em] text-[#4682B4]/70">
                Action
              </span>
            </div>

            {memberProgress.map((member, i) => {
              const isLast = i === memberProgress.length - 1;
              const cellBorder = isLast ? "" : "border-b border-[#033363]/5";
              return (
                <div key={member.name} className="contents">
                  <p className={`flex items-center py-4 font-medium text-[#033363] ${cellBorder}`}>
                    {member.name}
                  </p>
                  <p className={`flex items-center py-4 text-sm text-gray-500 ${cellBorder}`}>
                    {member.task}
                  </p>
                  <div className={`flex items-center py-4 ${cellBorder}`}>
                    <span
                      className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium ${
                        statusStyles[member.status] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {member.status}
                    </span>
                  </div>
                  <p className={`flex items-center py-4 text-sm text-gray-500 ${cellBorder}`}>
                    {member.lastUpdate}
                  </p>
                  <div className={`flex items-center gap-2 py-4 ${cellBorder}`}>
                    <div className="h-2 w-full max-w-[6rem] rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-[#FF8C00]"
                        style={{ width: `${member.completion}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {member.completion}%
                    </span>
                  </div>
                  <div className={`flex items-center justify-start py-4 md:justify-end ${cellBorder}`}>
                    <button
                      type="button"
                      className="rounded-full border border-[#033363]/15 px-4 py-2 text-xs font-medium text-[#033363] transition-colors hover:bg-[#033363] hover:text-white"
                    >
                      Message
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fixed create-project button */}
      <button
        type="button"
        className="cursor-pointer fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-[#FF8C00] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(255,140,0,0.6)] transition-transform hover:scale-105 hover:bg-[#e67e00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#033363]"
        onClick={()=>{setIsCreateProject(true)}}
      >
        <Plus size={18} />
        Create Project
      </button>
    </section>
  );
}