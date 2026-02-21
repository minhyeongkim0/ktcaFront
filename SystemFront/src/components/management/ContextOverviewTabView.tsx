"use client";

import { useLanguage } from "@/i18n/LanguageProvider";
import { ContextPage } from "@/components/context/ContextPage";
import { dummyData } from "@/data/dummyData";

export function ContextOverviewTabView({ selectedSideTab }: { selectedSideTab: string | null }) {
  const { t } = useLanguage();
  const kpis = (dummyData.context as { overviewKpi?: { label: string; value: string; icon: string }[] }).overviewKpi ?? [
    { label: "타깃 고객", value: "현대자동차, Atlas Auto", icon: "groups" },
    { label: "주력제품 TOP3", value: "MCU, PMIC, SiC", icon: "inventory_2" },
    { label: "주요 강점", value: "품질/데이터 기반", icon: "star" },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#137fec]/10 text-[#137fec]">Clause 4</span>
        <p className="text-sm text-slate-600 dark:text-slate-400">조직상황, 원자재/납품/본사/고객, SWOT</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kpis.map((k, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 flex items-center gap-3"
          >
            <span className="material-symbols-outlined text-2xl text-[#137fec]">{k.icon}</span>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{k.label}</p>
              <p className="font-bold text-slate-800 dark:text-slate-100">{k.value}</p>
            </div>
          </div>
        ))}
      </div>

      <ContextPage selectedSideTab={selectedSideTab} />
    </div>
  );
}
