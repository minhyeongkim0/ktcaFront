"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ChatbotPanel from "@/src/components/chat/ChatbotPanel";

const SHIFT_HANDOVER_INITIAL_MEMOS = [
  "AGV-05: 우측 구동부 소음 발생하여 구리스 도포 완료. 야간조 모니터링 요망",
  "⚠OHT-02: 반송 경로 4번 노드에서 일시적 정체 발생 중. 트래픽 분산 필요",
  "공지: 내일 오전 10시 정기 소방점검 예정. 정비 구역 정리 바람",
];

type AlarmItem = { id: string; time: string; level: string; message: string; read: boolean };

/** id는 FDC 알람 리스트(ALARM_LIST)와 맞춰 두어, 클릭 시 해당 알람 상세 모달이 열리도록 함 */
const INITIAL_ALARMS: AlarmItem[] = [
  { id: "a1", time: "14:32", level: "경고", message: "AGV-01 CT2 전류 임계 초과", read: false },
  { id: "a2", time: "14:15", level: "해결", message: "AGV-03 온도 일시 상승", read: true },
  { id: "a3", time: "13:58", level: "정보", message: "AGV-02 진동치 일시 상승", read: true },
];

export default function HeaderActions() {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [alarmOpen, setAlarmOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [handoverOpen, setHandoverOpen] = useState(false);
  const [handoverMemos, setHandoverMemos] = useState<string[]>(() => [...SHIFT_HANDOVER_INITIAL_MEMOS]);
  const [handoverInput, setHandoverInput] = useState("");
  const [alarms, setAlarms] = useState<AlarmItem[]>(() => [...INITIAL_ALARMS]);
  const alarmRef = useRef<HTMLDivElement>(null);
  const handoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!alarmOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (alarmRef.current && !alarmRef.current.contains(e.target as Node)) {
        setAlarmOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [alarmOpen]);

  useEffect(() => {
    if (!handoverOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (handoverRef.current && !handoverRef.current.contains(e.target as Node)) {
        setHandoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handoverOpen]);

  const registerHandoverMemo = () => {
    const trimmed = handoverInput.trim();
    if (!trimmed) return;
    setHandoverMemos((prev) => [trimmed, ...prev]);
    setHandoverInput("");
  };

  useEffect(() => {
    const isDark =
      typeof document !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches));
    setDark(!!isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const markAlarmRead = (id: string) => {
    setAlarms((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const deleteAlarm = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  };

  const unreadCount = alarms.filter((a) => !a.read).length;

  return (
    <>
      <div className="hidden md:flex gap-3 items-center">
        {/* 시계 */}
        <div className="flex items-center justify-center rounded-lg h-9 px-4 bg-[#f6f7f8] dark:bg-[#1e293b] border border-transparent dark:border-gray-600 text-sm font-bold text-gray-600 dark:text-gray-300">
          <span className="material-symbols-outlined text-lg mr-2 text-[#137fec]">schedule</span>
          <span id="clock" suppressHydrationWarning>--:--:--</span>
        </div>

        {/* 다크모드 토글 */}
        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center justify-center rounded-lg size-9 bg-[#f5f3ff] dark:bg-[#2e1065]/50 hover:bg-violet-100 dark:hover:bg-violet-900/50 border border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-200 transition-colors"
          aria-label={dark ? "라이트 모드로 전환" : "다크 모드로 전환"}
        >
          <span className="material-symbols-outlined text-[22px]">
            {dark ? "light_mode" : "dark_mode"}
          </span>
        </button>

        {/* 금일 교대 인수인계 메모장 (챗봇 옆) */}
        <div className="relative" ref={handoverRef}>
          <button
            type="button"
            onClick={() => setHandoverOpen((o) => !o)}
            className="flex items-center justify-center rounded-lg size-9 bg-[#fefce8] dark:bg-[#2d2a1f] hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 transition-colors"
            aria-label="금일 교대 인수인계"
            aria-expanded={handoverOpen}
          >
            <span className="material-symbols-outlined text-[22px]">note</span>
          </button>
          {handoverOpen && (
            <div
              className="absolute right-0 top-full mt-1 z-40 w-[min(32rem,calc(100vw-2rem))] min-w-0 max-w-[32rem] rounded-lg border border-amber-200 dark:border-amber-800/50 bg-[#fefce8] dark:bg-[#2d2a1f] shadow-lg overflow-hidden"
              aria-label="금일 교대 인수인계 메모"
            >
              <div className="px-2.5 py-2 border-b border-amber-200/80 dark:border-amber-800/50 shrink-0 flex items-center justify-between gap-2">
                <h3 className="font-bold text-[#111418] dark:text-[#ededed] text-xs flex items-center gap-1.5 min-w-0">
                  <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-base shrink-0">assignment</span>
                  <span className="min-w-0 break-words">금일 교대 인수인계</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setHandoverOpen(false)}
                  className="shrink-0 p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors"
                  aria-label="창 닫기"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              <div className="p-2 space-y-1.5 max-h-52 overflow-y-auto overflow-x-hidden">
                {handoverMemos.map((text, i) => (
                  <div
                    key={i}
                    className="group flex items-start gap-1.5 text-[11px] text-[#374151] dark:text-[#e5e7eb] py-1 px-2 rounded bg-white/70 dark:bg-[#1c1917]/60 border border-amber-100 dark:border-amber-900/30 leading-snug min-w-0"
                  >
                    <span className="min-w-0 break-words flex-1">{text}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setHandoverMemos((prev) => prev.filter((_, idx) => idx !== i));
                      }}
                      className="shrink-0 p-0.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      aria-label="메모 삭제"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-amber-200/80 dark:border-amber-800/50 flex gap-1.5 min-w-0">
                <input
                  type="text"
                  value={handoverInput}
                  onChange={(e) => setHandoverInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && registerHandoverMemo()}
                  placeholder="메모..."
                  className="flex-1 min-w-0 text-[11px] px-2 py-1.5 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1e293b] text-[#111418] dark:text-[#ededed] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#137fec] w-0"
                />
                <button
                  type="button"
                  onClick={registerHandoverMemo}
                  className="shrink-0 px-2 py-1.5 rounded text-[11px] font-medium bg-[#137fec] text-white hover:bg-[#0d6bd6] transition-colors"
                >
                  등록
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 챗봇 버튼 */}
        <button
          type="button"
          onClick={() => setChatOpen(true)}
          className="flex items-center justify-center rounded-lg size-9 bg-[#eff6ff] dark:bg-[#1e3a5f] hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-200 transition-colors"
          aria-label="챗봇"
        >
          <span className="material-symbols-outlined text-[22px]">smart_toy</span>
        </button>
        <ChatbotPanel open={chatOpen} onClose={() => setChatOpen(false)} />

        {/* 알람(알림) 버튼 + 드롭다운 — 오버레이 없이 바깥 클릭으로만 닫기 */}
        <div className="relative" ref={alarmRef}>
          <button
            type="button"
            onClick={() => setAlarmOpen((o) => !o)}
            className="flex items-center justify-center rounded-lg size-9 bg-[#fff1f2] dark:bg-[#881337]/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-200 transition-colors relative"
            aria-label="알림"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-rose-950" />
            )}
          </button>
          {alarmOpen && (
            <div className="absolute right-0 top-full mt-1 z-40 w-80 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#182635] shadow-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-600 flex items-center justify-between">
                  <span className="font-bold text-[#111418] dark:text-gray-100">알림</span>
                  <Link
                    href="/fdc?tab=alarms"
                    className="text-xs text-[#137fec] hover:underline"
                    onClick={() => setAlarmOpen(false)}
                  >
                    전체 보기
                  </Link>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {alarms.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500 dark:text-gray-400">알림이 없습니다.</p>
                  ) : (
                    <ul className="divide-y divide-gray-100 dark:divide-gray-600">
                      {alarms.map((a) => (
                        <li
                          key={a.id}
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            deleteAlarm(a.id, e);
                            setAlarmOpen(false);
                            router.push(`/fdc?tab=alarms&alarmId=${encodeURIComponent(a.id)}`);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              deleteAlarm(a.id);
                              setAlarmOpen(false);
                              router.push(`/fdc?tab=alarms&alarmId=${encodeURIComponent(a.id)}`);
                            }
                          }}
                          className={`px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1e293b] transition-colors ${!a.read ? "bg-blue-50/50 dark:bg-blue-900/20" : ""}`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">{a.time}</span>
                            <div className="flex items-center gap-1">
                              <span
                                className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                                  a.level === "경고"
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
                                    : a.level === "해결"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200"
                                      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {a.level}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); deleteAlarm(a.id); }}
                                className="p-0.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                aria-label="알림 삭제"
                              >
                                <span className="material-symbols-outlined text-[18px]">close</span>
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-[#111418] dark:text-gray-200 mt-0.5">{a.message}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
          )}
        </div>
      </div>
    </>
  );
}
