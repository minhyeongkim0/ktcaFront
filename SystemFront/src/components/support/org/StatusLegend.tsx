"use client";

import { useLanguage } from "@/i18n/LanguageProvider";

export function StatusLegend() {
  const { t } = useLanguage();
  const items = [
    { key: "online" as const, label: t("statusLegend.online"), dotClass: "bg-green-500" },
    { key: "away" as const, label: t("statusLegend.away"), dotClass: "bg-amber-500" },
    { key: "offline" as const, label: t("statusLegend.offline"), dotClass: "bg-slate-400" },
  ];
  return (
    <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
      {items.map((item) => (
        <div key={item.key} className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full shrink-0 ${item.dotClass}`} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
