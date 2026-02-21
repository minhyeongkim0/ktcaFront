"use client";

import { useLanguage } from "@/i18n/LanguageProvider";

export function EquipmentFilters() {
  const { t } = useLanguage();
  const handleStatusClick = () => console.log("filter: Status");
  const handleTypeClick = () => console.log("filter: Type");

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1 relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
          search
        </span>
        <input
          type="search"
          placeholder={t("common.searchEquipment")}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleStatusClick}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <span>{t("common.status")}: {t("common.all")}</span>
          <span className="material-symbols-outlined text-lg text-slate-400">expand_more</span>
        </button>
        <button
          type="button"
          onClick={handleTypeClick}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <span>{t("common.type")}: {t("common.all")}</span>
          <span className="material-symbols-outlined text-lg text-slate-400">expand_more</span>
        </button>
      </div>
    </div>
  );
}
