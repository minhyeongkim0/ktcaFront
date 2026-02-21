"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"}
      className="flex items-center justify-center rounded-lg size-9 bg-[#f6f7f8] hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-600 dark:text-slate-300 transition-colors duration-300"
    >
      {theme === "light" ? (
        <span className="material-symbols-outlined text-[22px]">dark_mode</span>
      ) : (
        <span className="material-symbols-outlined text-[22px]">light_mode</span>
      )}
    </button>
  );
}
