"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ClientClock } from "./ClientClock";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationPanel } from "./NotificationPanel";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useAuth } from "./AuthProvider";
import { useAlarms } from "@/context/AlarmsContext";

export function LayoutHeader() {
  const { t, lang, toggleLang } = useLanguage();
  const { user, logout } = useAuth();
  const { alarms } = useAlarms();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const notificationAnchorRef = useRef<HTMLButtonElement>(null);
  const pageTitle = t("header.title");

  const handleLangClick = () => {
    toggleLang();
  };

  const handleNotificationClick = () => {
    setNotificationOpen((prev) => !prev);
  };

  return (
    <header className="shrink-0 flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e5e7eb] dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-3 z-20 shadow-sm h-16 transition-colors duration-300">
      <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
        <div className="size-8 flex items-center justify-center text-[#137fec] bg-[#137fec]/10 rounded-lg">
          <span className="material-symbols-outlined text-2xl">precision_manufacturing</span>
        </div>
        <h2 className="text-[#111418] dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em] transition-colors duration-300">
          {pageTitle}
        </h2>
      </Link>
      <div className="flex flex-1 justify-end gap-6 items-center">
        <div className="hidden md:flex gap-3 items-center">
          {/* Clock (KST) */}
          <div className="flex items-center justify-center rounded-lg h-9 px-4 bg-[#f6f7f8] dark:bg-slate-800 border border-transparent text-sm font-bold text-gray-600 dark:text-slate-300 transition-colors duration-300">
            <span className="material-symbols-outlined text-lg mr-2 text-[#137fec]">schedule</span>
            <ClientClock />
          </div>
          {/* KO/EN Toggle */}
          <button
            type="button"
            onClick={handleLangClick}
            aria-label={lang === "ko" ? t("header.switchToEn") : t("header.switchToKo")}
            title={lang === "ko" ? t("header.switchToEn") : t("header.switchToKo")}
            className="flex items-center justify-center rounded-lg h-9 px-4 bg-[#f6f7f8] dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 active:scale-[0.98] text-sm font-bold text-[#137fec] dark:text-[#60a5fa] transition-all duration-200"
          >
            {lang === "ko" ? t("lang.switchEn") : t("lang.switchKo")}
          </button>
          {/* Notifications */}
          <div className="relative">
            <button
              ref={notificationAnchorRef}
              type="button"
              onClick={handleNotificationClick}
              aria-label={t("header.notificationsTitle")}
              aria-expanded={notificationOpen}
              className={`flex items-center justify-center rounded-lg size-9 bg-[#f6f7f8] dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 active:scale-[0.98] text-gray-600 dark:text-slate-300 transition-all duration-200 relative ${notificationOpen ? "ring-2 ring-[#137fec] ring-offset-2 dark:ring-offset-slate-900" : ""}`}
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {alarms.length > 0 && (
                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" aria-hidden />
              )}
            </button>
            <NotificationPanel
              open={notificationOpen}
              onClose={() => setNotificationOpen(false)}
              anchorRef={notificationAnchorRef}
            />
          </div>
        </div>
        {/* Theme Toggle + User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 pl-3 border-l border-gray-200 dark:border-slate-700 transition-colors duration-300">
          <ThemeToggle />
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-[#111418] dark:text-slate-100 leading-none transition-colors duration-300">{user?.name ?? "—"}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 transition-colors duration-300">{user?.role ?? t("header.plantManager")}</p>
          </div>
          <div className="bg-[#137fec] rounded-full size-9 flex items-center justify-center text-white font-bold shrink-0">
            {user?.name?.charAt(0) ?? "?"}
          </div>
          <button
            type="button"
            onClick={logout}
            title={t("auth.logout")}
            className="flex items-center justify-center size-9 rounded-lg text-gray-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
