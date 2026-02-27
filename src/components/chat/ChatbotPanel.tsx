"use client";

import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

const QUICK_REPLIES = [
  "가동률 문의",
  "고장 조치 가이드",
  "안전 수칙",
  "오늘 가동률이 왜 낮아?",
  "이 장비 마지막 점검이 언제였지?",
];

const RATE_LIMIT_MESSAGE = "잠시만 기다려주세요.";

export default function ChatbotPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [open, messages]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        const isRateLimit = res.status === 429 || data?.code === "RATE_LIMIT";
        const content = isRateLimit
          ? RATE_LIMIT_MESSAGE
          : data?.error ?? "응답을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.";
        setMessages((prev) => [...prev, { role: "assistant", content }]);
        return;
      }
      setMessages((prev) => [...prev, { role: "assistant", content: data.content ?? data.message ?? "" }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "연결에 실패했어요. 네트워크를 확인한 뒤 다시 시도해 주세요." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40"
        aria-hidden
        onClick={onClose}
      />
      <div
        className="fixed right-4 bottom-4 z-50 w-full max-w-md h-[min(32rem,85vh)] bg-white dark:bg-[#182635] rounded-t-2xl rounded-l-2xl border border-gray-200 dark:border-gray-600 shadow-xl flex flex-col"
        role="dialog"
        aria-labelledby="chatbot-title"
      >
        <div className="shrink-0 px-4 py-3 rounded-t-2xl bg-[#f6f7f8] dark:bg-[#1e293b] border-b border-gray-200 dark:border-gray-600 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#137fec] text-2xl">smart_toy</span>
            <h2 id="chatbot-title" className="font-bold text-[#111418] dark:text-[#ededed]">
              챗봇
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#182635] transition-colors"
            aria-label="챗봇 닫기"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="shrink-0 px-4 py-2 border-b border-gray-100 dark:border-gray-600 bg-white dark:bg-[#182635]">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">자주 묻는 질문</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_REPLIES.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => sendMessage(label)}
                disabled={loading}
                className="px-3 py-1.5 rounded-full text-sm bg-gray-100 dark:bg-[#1e293b] text-[#111418] dark:text-[#ededed] hover:bg-[#137fec]/10 hover:text-[#137fec] dark:hover:bg-[#137fec]/20 transition-colors disabled:opacity-50"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
        >
          {messages.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
              궁금한 걸 편하게 물어보세요. 가동률, 고장 조치, 안전 수칙, 점검 이력 등 뭐든 도와드릴게요.
            </p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === "user"
                    ? "bg-[#137fec] text-white rounded-br-md"
                    : "bg-gray-100 dark:bg-[#1e293b] text-[#111418] dark:text-[#ededed] rounded-bl-md"
                }`}
              >
                <span className="whitespace-pre-wrap">{m.content}</span>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md px-4 py-2.5 bg-gray-100 dark:bg-[#1e293b] text-gray-500 dark:text-gray-400 text-sm">
                선배님이 생각 중입니다...
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="shrink-0 p-4 border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-[#182635] rounded-b-2xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="궁금한 것을 입력하세요..."
              disabled={loading}
              className="flex-1 rounded-xl border border-gray-200 dark:border-gray-600 bg-[#f6f7f8] dark:bg-[#1e293b] text-[#111418] dark:text-[#ededed] px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#137fec] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="shrink-0 p-2.5 rounded-xl bg-[#137fec] text-white hover:bg-[#0d6bd6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="전송"
            >
              <span className="material-symbols-outlined text-xl">send</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
