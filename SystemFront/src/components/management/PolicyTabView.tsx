"use client";

import { useLanguage } from "@/i18n/LanguageProvider";
import { SectionCard } from "@/components/ui/SectionCard";
import { dummyData } from "@/data/dummyData";

export function PolicyTabView() {
  const { t } = useLanguage();
  const ld = dummyData.leadership as { ceoMessage?: string; qualityPolicy?: string; raci?: { process: string; R: string; A: string; C: string; I: string }[] };
  const raci = ld?.raci ?? [];

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#137fec]/10 text-[#137fec]">Clause 5</span>
        <p className="text-sm text-slate-600 dark:text-slate-400">{t("guideline.tabLeaderSummary")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard
          title={t("leadership.title")}
          icon={<span className="material-symbols-outlined text-[#137fec]">person</span>}
        >
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
              <span className="text-xl font-bold text-slate-500">P</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {ld?.ceoMessage ?? "품질은 선택이 아닌 필수입니다."}
            </p>
          </div>
        </SectionCard>
        <SectionCard
          title="품질 방침 (Quality Policy)"
          icon={<span className="material-symbols-outlined text-[#137fec]">policy</span>}
        >
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            {ld?.qualityPolicy ?? "고객 요구사항 충족, 지속적 개선을 통해 품질경영시스템을 운영합니다."}
          </p>
        </SectionCard>
      </div>

      <SectionCard
        title="RACI 요약"
        icon={<span className="material-symbols-outlined text-[#137fec]">group_work</span>}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-left text-slate-600 dark:text-slate-400">
                <th className="p-3 font-medium">프로세스</th>
                <th className="p-3 font-medium">R</th>
                <th className="p-3 font-medium">A</th>
                <th className="p-3 font-medium">C</th>
                <th className="p-3 font-medium">I</th>
              </tr>
            </thead>
            <tbody>
              {raci.map((r, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-3 text-slate-800 dark:text-slate-200">{r.process}</td>
                  <td className="p-3">{r.R}</td>
                  <td className="p-3 font-medium">{r.A}</td>
                  <td className="p-3">{r.C}</td>
                  <td className="p-3">{r.I}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
