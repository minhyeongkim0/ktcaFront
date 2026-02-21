"use client";

import { useState } from "react";
import { dummyData } from "@/data/dummyData";
import { useLanguage } from "@/i18n/LanguageProvider";

type LoginViewProps = {
  onLogin: (id: string, password: string) => void;
  error: string;
};

export function LoginView({ onLogin, error }: LoginViewProps) {
  const { t } = useLanguage();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(id.trim(), password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f7f8] dark:bg-[#0f172a] p-4 transition-colors duration-300">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 shadow-lg transition-colors duration-300">
        <h1 className="text-center text-xl font-bold text-slate-800 dark:text-slate-100">
          {dummyData.header?.title ?? t("header.title")}
        </h1>
        <p className="mt-1 text-center text-sm text-slate-500 dark:text-slate-400">
          {dummyData.branding?.site}
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              {t("auth.id")}
            </label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-100 focus:border-[#137fec] focus:outline-none focus:ring-1 focus:ring-[#137fec]"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              {t("auth.password")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-100 focus:border-[#137fec] focus:outline-none focus:ring-1 focus:ring-[#137fec]"
              autoComplete="current-password"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{t(error)}</p>
          )}
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#137fec] px-4 py-2.5 font-medium text-white hover:bg-[#0d6bd8] transition-colors"
          >
            <span className="material-symbols-outlined text-lg">login</span>
            {t("auth.login")}
          </button>
        </form>
      </div>
    </div>
  );
}
