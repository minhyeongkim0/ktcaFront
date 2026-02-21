"use client";

import { useLanguage } from "@/i18n/LanguageProvider";
import { SectionCard } from "@/components/ui/SectionCard";
import { dummyData } from "@/data/dummyData";

const PROGRESS_MAP = {
  on: { label: "달성", cls: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300" },
  caution: { label: "주의", cls: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300" },
  off: { label: "미달", cls: "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300" },
};

export function QualityGoalsTabView() {
  const { t } = useLanguage();
  const goals = (dummyData.qualityGoals ?? []) as { goal: string; definition: string; cycle: string; dept: string; progress: "on" | "caution" | "off" }[];

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#137fec]/10 text-[#137fec]">Clause 6/9</span>
        <p className="text-sm text-slate-600 dark:text-slate-400">품질 목표 및 지표 진척 대시보드</p>
      </div>

      <SectionCard title="품질 목표 요약" icon={<span className="material-symbols-outlined text-[#137fec]">flag</span>}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-left text-slate-600 dark:text-slate-400">
                <th className="p-3 font-medium">목표</th>
                <th className="p-3 font-medium">정의</th>
                <th className="p-3 font-medium">측정주기</th>
                <th className="p-3 font-medium">책임부서</th>
                <th className="p-3 font-medium">진척</th>
              </tr>
            </thead>
            <tbody>
              {goals.map((g, i) => {
                const p = PROGRESS_MAP[g.progress] ?? PROGRESS_MAP.on;
                return (
                  <tr key={i} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{g.goal}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{g.definition}</td>
                    <td className="p-3">{g.cycle}</td>
                    <td className="p-3">{g.dept}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${p.cls}`}>
                        {p.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
