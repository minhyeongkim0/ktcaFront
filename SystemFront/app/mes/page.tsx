"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function MesPage() {
  const { t } = useLanguage();

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8 bg-[#f6f7f8] dark:bg-[#0f172a] overflow-y-auto transition-colors duration-300">
      <div className="relative z-10 w-full max-w-xl text-center space-y-8">
        <div className="flex items-center justify-center size-20 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 mx-auto">
          <span className="material-symbols-outlined text-5xl">factory</span>
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-[#111418] dark:text-slate-100">
            {t("mes.title")}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t("mes.description")}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#137fec] text-white font-medium hover:bg-[#0d6bd8] transition-colors"
          >
            <span className="material-symbols-outlined text-lg">home</span>
            {t("mes.goHome")}
          </Link>
          <Link
            href="/fdc"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">monitoring</span>
            {t("mes.goFdc")}
          </Link>
        </div>
      </div>
    </main>
  );
}
