import { useState } from "react";
import {
  Search,
  Send,
  ArrowLeft,
  MoreVertical,
  Sparkles,
  Bot,
  UserRound,
} from "lucide-react";

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
    {
      id: "a",
      sender: "them",
      text: "Good morning! Framing on the second floor wrapped up ahead of schedule.",
      time: "9:12 AM",
    },
    {
      id: "b",
      sender: "me",
      text: "That's great to hear. Any updates on the electrical timeline?",
      time: "9:20 AM",
    },
    {
      id: "c",
      sender: "them",
      text: "Electricians are scheduled to start Monday.",
      time: "9:24 AM",
    },
  ],
  "2": [
    {
      id: "a",
      sender: "them",
      text: "Hi! Just checking in on the Skyline Corporate progress.",
      time: "Yesterday",
    },
    {
      id: "b",
      sender: "me",
      text: "We're at 62% completion, on track for the November finish date.",
      time: "Yesterday",
    },
    {
      id: "c",
      sender: "them",
      text: "Thanks for the update on the timeline!",
      time: "Yesterday",
    },
  ],
  "3": [
    {
      id: "a",
      sender: "them",
      text: "Budget report is ready for review.",
      time: "Yesterday",
    },
  ],
  "4": [
    {
      id: "a",
      sender: "them",
      text: "Finished the wall construction task.",
      time: "Mon",
    },
  ],
};

const aiInitialMessages: ChatMessage[] = [
  {
    id: "ai-1",
    sender: "them",
    text: "Hi! I'm your BuildFlow AI Assistant. I can help you understand your projects, budgets, schedules, reports, and team activity.",
    time: "Now",
  },
];

const aiSuggestions = [
  "Active Projects",
  "Behind Schedule",
  "Budget Concerns",
  "Today's Activity",
  "Project Risks",
  "Team Progress",
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Messages() {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>("ai");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState(messagesByConversation);
  const [aiMessages, setAiMessages] =
    useState<ChatMessage[]>(aiInitialMessages);

  const filtered = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(query.toLowerCase()),
  );

  const active = conversations.find(
    (conversation) => conversation.id === activeId,
  );

  const isAIActive = activeId === "ai";

  const activeMessages = isAIActive
    ? aiMessages
    : activeId
      ? messages[activeId] ?? []
      : [];

  function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const message = draft.trim();

    if (!message || !activeId) return;

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "me",
      text: message,
      time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    if (isAIActive) {
      setAiMessages((previous) => [...previous, newMessage]);

      // Replace this later with your AI API request.
      setTimeout(() => {
        setAiMessages((previous) => [
          ...previous,
          {
            id: crypto.randomUUID(),
            sender: "them",
            text: "This is a temporary response. Your AI backend will eventually process this question using authorized BuildFlow project data.",
            time: new Date().toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            }),
          },
        ]);
      }, 600);
    } else {
      setMessages((previous) => ({
        ...previous,
        [activeId]: [...(previous[activeId] ?? []), newMessage],
      }));
    }

    setDraft("");
  }

  function handleSuggestionClick(suggestion: string) {
    const questions: Record<string, string> = {
      "Active Projects": "Which projects are currently active?",
      "Behind Schedule": "Which projects are currently behind schedule?",
      "Budget Concerns": "Which projects have budget concerns?",
      "Today's Activity": "Summarize today's project activity.",
      "Project Risks": "Which projects currently have the highest risks?",
      "Team Progress": "How is the team progressing across projects?",
    };

    setDraft(questions[suggestion] ?? suggestion);
  }

  return (
    <section className="min-h-screen bg-[#FBFCFE] px-4 pb-12 pt-10 sm:px-6 lg:px-10 lg:pt-16">
      <div className="mx-auto max-w-7xl">
        {/* PAGE HEADER */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#4682B4]">
            Communication & Intelligence
          </p>

          <h1 className="mt-1 text-3xl font-bold text-[#033363]">
            Messages
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            Communicate with your team and use BuildFlow AI to understand your
            construction operations.
          </p>
        </div>

        {/* MESSAGING CONTAINER */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-[#033363]/10 bg-white shadow-sm">
          <div className="grid min-h-[650px] grid-cols-1 lg:grid-cols-[350px_1fr]">
            {/* LEFT SIDEBAR */}
            <aside
              className={`min-h-0 flex-col border-[#033363]/10 lg:flex lg:border-r ${
                activeId ? "hidden" : "flex"
              }`}
            >
              {/* SEARCH */}
              <div className="border-b border-[#033363]/10 p-4">
                <div className="flex items-center gap-2 rounded-xl border border-[#033363]/15 bg-[#FBFCFE] px-3 py-2.5 focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/20">
                  <Search
                    size={16}
                    className="shrink-0 text-[#4682B4]"
                  />

                  <input
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search conversations..."
                    className="w-full bg-transparent text-sm text-[#033363] outline-none placeholder:text-[#4682B4]/40"
                  />
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto">
                {/* AI CONVERSATION */}
                <button
                  type="button"
                  onClick={() => setActiveId("ai")}
                  className={`w-full border-b border-[#033363]/10 px-4 py-4 text-left transition-colors ${
                    isAIActive
                      ? "bg-[#033363]"
                      : "bg-white hover:bg-[#033363]/5"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        isAIActive
                          ? "bg-[#FF8C00] text-white"
                          : "bg-[#033363] text-white"
                      }`}
                    >
                      <Sparkles size={19} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`truncate text-sm font-semibold ${
                            isAIActive ? "text-white" : "text-[#033363]"
                          }`}
                        >
                          BuildFlow AI
                        </p>

                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider ${
                            isAIActive
                              ? "text-white/60"
                              : "text-[#4682B4]"
                          }`}
                        >
                          AI
                        </span>
                      </div>

                      <p
                        className={`mt-1 text-xs ${
                          isAIActive ? "text-white/70" : "text-gray-500"
                        }`}
                      >
                        Ask about projects, budgets, reports and schedules.
                      </p>
                    </div>
                  </div>
                </button>

                {/* HUMAN CONVERSATIONS TITLE */}
                <div className="px-4 pb-2 pt-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#4682B4]/70">
                    Team Conversations
                  </p>
                </div>

                {filtered.length === 0 && (
                  <p className="px-4 py-10 text-center text-sm text-gray-400">
                    No conversations found.
                  </p>
                )}

                {filtered.map((conversation) => (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => setActiveId(conversation.id)}
                    className={`flex w-full items-start gap-3 border-b border-[#033363]/5 px-4 py-3.5 text-left transition-colors hover:bg-[#4682B4]/5 ${
                      activeId === conversation.id
                        ? "bg-[#4682B4]/10"
                        : ""
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#033363] text-xs font-semibold text-white">
                      {initials(conversation.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-[#033363]">
                          {conversation.name}
                        </p>

                        <span className="shrink-0 text-[11px] text-gray-400">
                          {conversation.time}
                        </span>
                      </div>

                      <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-[#4682B4]/70">
                        {conversation.role}
                      </p>

                      <p className="mt-1 truncate text-xs text-gray-500">
                        {conversation.lastMessage}
                      </p>
                    </div>

                    {conversation.unread > 0 && (
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FF8C00] text-[10px] font-semibold text-white">
                        {conversation.unread}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </aside>

            {/* CHAT PANEL */}
            <main
              className={`min-h-0 ${
                activeId ? "flex" : "hidden lg:flex"
              } flex-col`}
            >
              {activeId ? (
                <>
                  {/* HEADER */}
                  <div className="flex items-center gap-3 border-b border-[#033363]/10 px-4 py-4 sm:px-5">
                    <button
                      type="button"
                      onClick={() => setActiveId(null)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 hover:text-[#033363] lg:hidden"
                      aria-label="Back to conversations"
                    >
                      <ArrowLeft size={18} />
                    </button>

                    {isAIActive ? (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#033363] text-white">
                        <Sparkles size={18} />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#033363] text-xs font-semibold text-white">
                        {active ? initials(active.name) : "?"}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#033363] sm:text-base">
                        {isAIActive
                          ? "BuildFlow AI Assistant"
                          : active?.name}
                      </p>

                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                        <p className="text-xs text-gray-400">
                          {isAIActive
                            ? "Project intelligence assistant"
                            : active?.role}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 hover:text-[#033363]"
                      aria-label="Conversation actions"
                    >
                      <MoreVertical size={18} />
                    </button>
                  </div>

                  {/* MESSAGE AREA */}
                  <div className="min-h-0 flex-1 overflow-y-auto">
                    <div className="space-y-4 px-4 py-5 sm:px-6">
                      {activeMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender === "me"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`flex max-w-[88%] items-end gap-2 sm:max-w-[75%] ${
                              message.sender === "me"
                                ? "flex-row-reverse"
                                : ""
                            }`}
                          >
                            {message.sender === "them" ? (
                              <div className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#033363]/10 text-[#033363] sm:flex">
                                {isAIActive ? (
                                  <Sparkles size={13} />
                                ) : (
                                  <UserRound size={13} />
                                )}
                              </div>
                            ) : null}

                            <div
                              className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                                message.sender === "me"
                                  ? "rounded-br-sm bg-[#FF8C00] text-white"
                                  : isAIActive
                                    ? "rounded-bl-sm border border-[#033363]/10 bg-white text-[#033363] shadow-sm"
                                    : "rounded-bl-sm bg-[#4682B4]/10 text-[#033363]"
                              }`}
                            >
                              <p>{message.text}</p>

                              <p
                                className={`mt-1.5 text-[10px] ${
                                  message.sender === "me"
                                    ? "text-white/70"
                                    : "text-[#4682B4]/60"
                                }`}
                              >
                                {message.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI SUGGESTIONS */}
                  {isAIActive && (
                    <div className="border-t border-[#033363]/10 bg-[#FBFCFE] px-4 py-4 sm:px-6">
                      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#4682B4]">
                        Suggested Questions
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {aiSuggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() =>
                              handleSuggestionClick(suggestion)
                            }
                            className="rounded-full border border-[#FF8C00]/30 bg-white px-3.5 py-2 text-xs font-medium text-[#033363] transition-colors hover:border-[#FF8C00] hover:bg-[#FF8C00]/5"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* COMPOSER */}
                  <form
                    onSubmit={handleSend}
                    className="border-t border-[#033363]/10 bg-white p-3 sm:p-4"
                  >
                    <div className="flex items-center gap-2 rounded-2xl border border-[#033363]/15 bg-[#FBFCFE] p-2 focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/20">
                      <input
                        type="text"
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        placeholder={
                          isAIActive
                            ? "Ask BuildFlow AI about your projects..."
                            : "Type a message..."
                        }
                        className="min-w-0 flex-1 bg-transparent px-2 text-sm text-[#033363] outline-none placeholder:text-[#4682B4]/40"
                      />

                      <button
                        type="submit"
                        disabled={!draft.trim()}
                        aria-label="Send message"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FF8C00] text-white transition hover:bg-[#e67e00] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Send size={16} />
                      </button>
                    </div>

                    {isAIActive && (
                      <p className="mt-2 px-1 text-[10px] text-gray-400">
                        BuildFlow AI will use authorized project data when
                        connected to your backend.
                      </p>
                    )}
                  </form>
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center px-6 text-center">
                  <div>
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#033363]/5 text-[#033363]">
                      <Bot size={24} />
                    </div>

                    <p className="mt-4 text-sm font-medium text-[#033363]">
                      Select a conversation
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Choose a team member or BuildFlow AI Assistant.
                    </p>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </section>
  );
}