import { useState } from "react";
import {
  MapPin,
  Calendar,
  Phone,
  Mail,
  Send,
  Building2,
  CircleCheck,
} from "lucide-react";

type ChatMessage = {
  id: string;
  sender: "manager" | "client";
  text: string;
  time: string;
};

const project = {
  name: "Skyline Corporate",
  location: "Chicago, IL",
  status: "Ongoing",
  start_date: "Mar 3, 2026",
  finish_date: "Nov 20, 2026",
  completion: 62,
};

const manager = {
  name: "Ramon Villareal",
  role: "Project Manager",
  email: "ramon.villareal@company.com",
  phone: "+1 (555) 213-4487",
};

const milestones = [
  { label: "Foundation", done: true },
  { label: "Framing", done: true },
  { label: "Electrical & Plumbing", done: false },
  { label: "Interior Finishing", done: false },
  { label: "Final Inspection", done: false },
];

const initialMessages: ChatMessage[] = [
  {
    id: "1",
    sender: "manager",
    text: "Good morning! Framing on the second floor wrapped up ahead of schedule.",
    time: "9:12 AM",
  },
  {
    id: "2",
    sender: "client",
    text: "That's great news. Any updates on the electrical timeline?",
    time: "9:20 AM",
  },
  {
    id: "3",
    sender: "manager",
    text: "Electricians are scheduled to start Monday. I'll send photos once they're in.",
    time: "9:24 AM",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Client_Dashboard() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "client",
      text: draft.trim(),
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setDraft("");
  }

  return (
    <section className="min-h-screen bg-[#FBFCFE] px-6 pb-16 pt-16 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Page header */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#4682B4]">
            Overview
          </p>
          <h1 className="mt-1 text-3xl font-bold text-[#033363]">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here's how your project is progressing.
          </p>
        </div>

        {/* Top row: progress + manager */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Project progress card */}
          <div className="rounded-2xl border border-[#033363]/10 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <Building2 size={18} className="text-[#4682B4]" />
                  <h2 className="text-lg font-semibold text-[#033363]">
                    {project.name}
                  </h2>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#4682B4]" />
                    {project.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-[#4682B4]" />
                    {project.start_date} – {project.finish_date}
                  </span>
                </div>
                <span className="mt-3 inline-block w-fit rounded-full bg-[#FF8C00]/10 px-2.5 py-1 text-xs font-medium text-[#FF8C00]">
                  {project.status}
                </span>
              </div>

              {/* Circular progress */}
              <div className="relative flex h-28 w-28 shrink-0 items-center justify-center self-center">
                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#E5E9F0"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#FF8C00"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 42}
                    strokeDashoffset={
                      2 * Math.PI * 42 * (1 - project.completion / 100)
                    }
                  />
                </svg>
                <span className="absolute text-xl font-bold text-[#033363]">
                  {project.completion}%
                </span>
              </div>
            </div>

            {/* Milestones */}
            <div className="mt-6 border-t border-[#033363]/10 pt-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-[#4682B4]/70">
                Milestones
              </p>
              <ul className="flex flex-col gap-2.5">
                {milestones.map((m) => (
                  <li key={m.label} className="flex items-center gap-2.5 text-sm">
                    <CircleCheck
                      size={18}
                      className={m.done ? "text-[#FF8C00]" : "text-gray-300"}
                    />
                    <span className={m.done ? "text-[#033363]" : "text-gray-400"}>
                      {m.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Assigned manager card */}
          <div className="rounded-2xl border border-[#033363]/10 bg-white p-6 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#4682B4]/70">
              Assigned Manager
            </p>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#033363] text-lg font-semibold text-white">
                {initials(manager.name)}
              </div>
              <div>
                <p className="font-semibold text-[#033363]">{manager.name}</p>
                <p className="text-sm text-gray-500">{manager.role}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2.5 border-t border-[#033363]/10 pt-5 text-sm text-gray-600">
              <a
                href={`mailto:${manager.email}`}
                className="flex items-center gap-2 hover:text-[#033363]"
              >
                <Mail size={15} className="text-[#4682B4]" />
                {manager.email}
              </a>
              <a
                href={`tel:${manager.phone}`}
                className="flex items-center gap-2 hover:text-[#033363]"
              >
                <Phone size={15} className="text-[#4682B4]" />
                {manager.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Chat panel */}
        <div className="mt-6 flex h-[520px] flex-col rounded-2xl border border-[#033363]/10 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#033363]/10 px-6 py-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#033363] text-xs font-semibold text-white">
              {initials(manager.name)}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#033363]">{manager.name}</p>
              <p className="text-xs text-gray-400">{manager.role}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === "client" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.sender === "client"
                      ? "rounded-br-sm bg-[#FF8C00] text-white"
                      : "rounded-bl-sm bg-[#4682B4]/10 text-[#033363]"
                  }`}
                >
                  <p>{m.text}</p>
                  <p
                    className={`mt-1 text-[10px] ${
                      m.sender === "client" ? "text-white/70" : "text-[#4682B4]/60"
                    }`}
                  >
                    {m.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Composer */}
          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 border-t border-[#033363]/10 px-4 py-3"
          >
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type a message..."
              className="w-full rounded-full border border-[#033363]/20 bg-white px-4 py-2.5 text-sm text-[#033363] outline-none transition-colors placeholder:text-[#4682B4]/40 focus:border-[#00BFFF] focus:ring-2 focus:ring-[#00BFFF]/30"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FF8C00] text-white transition-colors hover:bg-[#e67e00] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!draft.trim()}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}