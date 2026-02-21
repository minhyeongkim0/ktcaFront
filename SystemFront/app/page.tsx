"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageProvider";
import { IsoGuideModal } from "@/components/IsoGuideModal";

export default function Home() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isoModalOpen, setIsoModalOpen] = useState(false);

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8 bg-[#f6f7f8] dark:bg-[#0f172a] overflow-y-auto transition-colors duration-300">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.03]">
        <span className="material-symbols-outlined text-[600px] text-gray-900 dark:text-slate-100 select-none">
          precision_manufacturing
        </span>
      </div>

      <div className="relative z-10 w-full max-w-4xl space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-black text-[#111418] dark:text-slate-100 tracking-tight">
            {t("home.title")}
          </h1>
          <p className="text-lg text-gray-500 dark:text-slate-400">
            {t("home.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/fdc"
            className="group flex flex-col p-6 rounded-2xl border-2 border-[#137fec]/20 dark:border-[#137fec]/30 bg-white dark:bg-slate-900 hover:border-[#137fec] hover:shadow-xl hover:shadow-[#137fec]/10 transition-all duration-300"
          >
            <div className="flex items-center justify-center size-14 rounded-xl bg-[#137fec]/10 dark:bg-[#137fec]/20 text-[#137fec] mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">monitoring</span>
            </div>
            <h2 className="text-lg font-bold text-[#111418] dark:text-slate-100 mb-2">
              {t("home.fdcTitle")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed flex-1">
              {t("home.fdcDesc")}
            </p>
            <span className="mt-3 inline-flex items-center gap-2 text-[#137fec] font-medium text-sm group-hover:gap-3 transition-all">
              {t("home.enter")}
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </span>
          </Link>

          <Link
            href="/management"
            className="group flex flex-col p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-center size-14 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">description</span>
            </div>
            <h2 className="text-lg font-bold text-[#111418] dark:text-slate-100 mb-2">
              {t("home.managementTitle")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed flex-1">
              {t("home.managementDesc")}
            </p>
            <span className="mt-3 inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium text-sm group-hover:gap-3 transition-all">
              {t("home.enter")}
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </span>
          </Link>

          <Link
            href="/mes"
            title="준비 중입니다"
            className="flex flex-col p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 opacity-80 text-left hover:opacity-90 transition-opacity relative"
          >
            <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
              미구현
            </span>
            <div className="flex items-center justify-center size-14 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-500 mb-4">
              <span className="material-symbols-outlined text-3xl">factory</span>
            </div>
            <h2 className="text-lg font-bold text-slate-600 dark:text-slate-400 mb-2">
              {t("home.mesTitle")}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-500 leading-relaxed flex-1">
              {t("home.mesDesc")}
            </p>
            <span className="mt-3 inline-flex items-center gap-2 text-slate-500 dark:text-slate-500 text-sm">
              준비 중입니다
            </span>
          </Link>
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={() => setIsoModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-colors text-sm font-medium"
          >
            <span className="material-symbols-outlined text-lg">menu_book</span>
            {t("home.guidelineButton")}
          </button>
        </div>
      </div>

      <IsoGuideModal open={isoModalOpen} onClose={() => setIsoModalOpen(false)} onNavigate={(url) => { setIsoModalOpen(false); router.push(url); }} />
    </main>
  );
}
