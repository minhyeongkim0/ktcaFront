"use client";

import { useLanguage } from "@/i18n/LanguageProvider";
import { SectionCard } from "@/components/ui/SectionCard";
import { DataTable } from "@/components/DataTable";
import { dummyData } from "@/data/dummyData";

export function ImprovementTabView() {
  const { t } = useLanguage();
  const imp = dummyData.improvement as {
    history?: { date: string; target: string; cause: string; action: string; owner: string; status: string }[];
    effectiveness?: { before: { ppm: number; yield: number; oee: number }; after: { ppm: number; yield: number; oee: number } };
  };
  const history = imp?.history ?? [];
  const eff = imp?.effectiveness;

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#137fec]/10 text-[#137fec]">Clause 10</span>
        <p className="text-sm text-slate-600 dark:text-slate-400">{t("guideline.tabImproveSummary")}</p>
      </div>

      <SectionCard title="개선조치 이력" icon={<span className="material-symbols-outlined text-[#137fec]">history</span>}>
        <DataTable
          data={history}
          columns={[
            { key: "date", label: t("table.date") },
            { key: "target", label: "대상" },
            { key: "cause", label: t("table.rootCause") },
            { key: "action", label: t("table.action") },
            { key: "owner", label: t("table.owner") },
            { key: "status", label: t("common.status") },
          ]}
          searchKeys={["target", "cause", "action", "owner"]}
          idKey="date"
        />
      </SectionCard>

      {eff && (
        <SectionCard title="효과성 검증 (조치 전/후 비교)" icon={<span className="material-symbols-outlined text-[#137fec]">compare_arrows</span>}>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
              <p className="text-xs text-slate-500 mb-1">조치 전 PPM</p>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{eff.before.ppm}</p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
              <p className="text-xs text-slate-500 mb-1">조치 후 PPM</p>
              <p className="text-xl font-bold text-emerald-600">{eff.after.ppm}</p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
              <p className="text-xs text-slate-500 mb-1">조치 전 수율</p>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{eff.before.yield}%</p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
              <p className="text-xs text-slate-500 mb-1">조치 후 수율</p>
              <p className="text-xl font-bold text-emerald-600">{eff.after.yield}%</p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
              <p className="text-xs text-slate-500 mb-1">조치 전 OEE</p>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{eff.before.oee}%</p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
              <p className="text-xs text-slate-500 mb-1">조치 후 OEE</p>
              <p className="text-xl font-bold text-emerald-600">{eff.after.oee}%</p>
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
