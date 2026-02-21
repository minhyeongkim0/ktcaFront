"use client";

import { useRef, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useAlarms } from "@/context/AlarmsContext";

type NotificationPanelProps = {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
};

function formatAlarmTime(at: string): string {
  try {
    const date = new Date(at);
    if (Number.isNaN(date.getTime())) return at;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);
    if (diffMin < 1) return "방금 전";
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    if (diffDay < 7) return `${diffDay}일 전`;
    return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return at;
  }
}

export function NotificationPanel({ open, onClose, anchorRef }: NotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { alarms, markAsRead } = useAlarms();

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const el = panelRef.current;
      const anchor = anchorRef.current;
      if (el && !el.contains(e.target as Node) && anchor && !anchor.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full z-50 mt-2 w-[360px] max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl"
      role="dialog"
      aria-label={t("header.notificationsTitle")}
    >
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-4 py-3">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
          {t("header.notificationsTitle")}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300"
          aria-label={t("common.close")}
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
      </div>
      <div className="max-h-[320px] overflow-y-auto">
        {alarms.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            {t("header.noNotifications")}
          </p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {alarms.map((n) => (
              <li
                key={n.id}
                className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 ${n.unread ? "bg-red-500/5 dark:bg-red-500/10" : ""}`}
              >
                <button
                  type="button"
                  className="w-full text-left"
                  onClick={() => n.unread && markAsRead(n.id)}
                >
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{n.title}</p>
                  <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">{n.message}</p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    {formatAlarmTime(n.at)}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
