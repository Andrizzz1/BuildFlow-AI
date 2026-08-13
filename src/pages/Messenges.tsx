import { useState } from "react";
import { Search, Send, ArrowLeft, MoreVertical } from "lucide-react";

type Conversation = {
  id: string;
  name: string;
  role: "Manager" | "Client" | "Worker";
  lastMessage: string;
  time: string;
  unread: number;
};

type ChatMessage = {
  id: string;
  sender: "them" | "me";
  text: string;
  time: string;
};

const conversations: Conversation[] = [
  {
    id: "1",
    name: "Ramon Villareal",
    role: "Manager",
    lastMessage: "Electricians are scheduled to start Monday.",
    time: "9:24 AM",
    unread: 2,
  },
  {
    id: "2",
    name: "David Rojo",
    role: "Client",
    lastMessage: "Thanks for the update on the timeline!",
    time: "Yesterday",
    unread: 0,
  },
  {
    id: "3",
    name: "Aiko Santos",
    role: "Manager",
    lastMessage: "Budget report is ready for review.",
    time: "Yesterday",
    unread: 0,
  },
  {
    id: "4",
    name: "Juan Dela Cruz",
    role: "Worker",
    lastMessage: "Finished the wall construction task.",
    time: "Mon",
    unread: 0,
  },
];

const messagesByConversation: Record<string, ChatMessage[]> = {
  "1": [
    { id: "a", sender: "them", text: "Good morning! Framing on the second floor wrapped up ahead of schedule.", time: "9:12 AM" },
    { id: "b", sender: "me", text: "That's great to hear. Any updates on the electrical timeline?", time: "9:20 AM" },
    { id: "c", sender: "them", text: "Electricians are scheduled to start Monday.", time: "9:24 AM" },
  ],
  "2": [
    { id: "a", sender: "them", text: "Hi! Just checking in on the Skyline Corporate progress.", time: "Yesterday" },
    { id: "b", sender: "me", text: "We're at 62% completion, on track for the November finish date.", time: "Yesterday" },
    { id: "c", sender: "them", text: "Thanks for the update on the timeline!", time: "Yesterday" },
  ],
  "3": [
    { id: "a", sender: "them", text: "Budget report is ready for review.", time: "Yesterday" },
  ],
  "4": [
    { id: "a", sender: "them", text: "Finished the wall construction task.", time: "Mon" },
  ],
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Messages() {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(conversations[0]?.id ?? null);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState(messagesByConversation);

  const filtered = conversations.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const active = conversations.find((c) => c.id === activeId) ?? null;
  const activeMessages = activeId ? messages[activeId] ?? [] : [];

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || !activeId) return;

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "me",
      text: draft.trim(),
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    };

    setMessages((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), newMessage],
    }));
    setDraft("");
  }

  return (
    <section className="min-h-screen bg-[#FBFCFE] px-6 pb-16 pt-16 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Page header */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#4682B4]">
            Communication
          </p>
          <h1 className="mt-1 text-3xl font-bold text-[#033363]">
            Messages
          </h1>
        </div>

        {/* Two-pane layout */}
        <div className="mt-6 grid h-[calc(100vh-220px)] min-h-[520px] grid-cols-1 overflow-hidden rounded-2xl border border-[#033363]/10 bg-white shadow-sm lg:grid-cols-[340px_1fr]">
          {/* Conversation list */}
          <div
            className={`flex flex-col border-[#033363]/10 lg:border-r ${
              active ? "hidden lg:flex" : "flex"
            }`}
          >
            <div className="border-b border-[#033363]/10 p-4">
              <div className="flex items-center gap-2 rounded-md border border-[#033363]/20 bg-white px-3 py-2.5 focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/30">
                <Search size={16} className="shrink-0 text-[#4682B4]" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search messages..."
                  className="w-full bg-transparent text-sm text-[#033363] outline-none placeholder:text-[#4682B4]/40"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 && (
                <p className="px-4 py-10 text-center text-sm text-gray-400">
                  No conversations found.
                </p>
              )}

              {filtered.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveId(c.id)}
                  className={`flex w-full items-start gap-3 border-b border-[#033363]/5 px-4 py-3.5 text-left transition-colors hover:bg-[#4682B4]/5 ${
                    activeId === c.id ? "bg-[#4682B4]/10" : ""
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#033363] text-xs font-semibold text-white">
                    {initials(c.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-[#033363]">
                        {c.name}
                      </p>
                      <span className="shrink-0 text-[11px] text-gray-400">{c.time}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-[#4682B4]/70">
                      {c.role}
                    </p>
                    <p className="mt-1 truncate text-xs text-gray-500">{c.lastMessage}</p>
                  </div>
                  {c.unread > 0 && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FF8C00] text-[10px] font-semibold text-white">
                      {c.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat panel */}
          <div className={`flex flex-col ${active ? "flex" : "hidden lg:flex"}`}>
            {active ? (
              <>
                {/* Chat header */}
                <div className="flex items-center gap-3 border-b border-[#033363]/10 px-5 py-3.5">
                  <button
                    type="button"
                    onClick={() => setActiveId(null)}
                    className="rounded-md p-1.5 text-gray-400 hover:bg-gray-50 hover:text-[#033363] lg:hidden"
                    aria-label="Back to conversations"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#033363] text-xs font-semibold text-white">
                    {initials(active.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#033363]">
                      {active.name}
                    </p>
                    <p className="text-xs text-gray-400">{active.role}</p>
                  </div>
                  <button
                    type="button"
                    aria-label="Conversation actions"
                    className="rounded-md p-1.5 text-gray-400 hover:bg-gray-50 hover:text-[#033363]"
                  >
                    <MoreVertical size={18} />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
                  {activeMessages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${m.sender === "me" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                          m.sender === "me"
                            ? "rounded-br-sm bg-[#FF8C00] text-white"
                            : "rounded-bl-sm bg-[#4682B4]/10 text-[#033363]"
                        }`}
                      >
                        <p>{m.text}</p>
                        <p
                          className={`mt-1 text-[10px] ${
                            m.sender === "me" ? "text-white/70" : "text-[#4682B4]/60"
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
                    disabled={!draft.trim()}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FF8C00] text-white transition-colors hover:bg-[#e67e00] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center px-6 text-center">
                <p className="text-sm text-gray-400">
                  Select a conversation to start messaging.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}