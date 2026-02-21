"use client";

import { useLanguage } from "@/i18n/LanguageProvider";
import { SectionCard } from "@/components/ui/SectionCard";
import { PlanningView } from "@/components/views/PlanningView";
import { dummyData } from "@/data/dummyData";

export function PlanningRiskTabView({ selectedSideTab }: { selectedSideTab: string | null }) {
  const { t } = useLanguage();
  const planning = dummyData.planning as {
    riskRegister?: { risk: string; impact: string; probability: string; response: string }[];
    businessPlan?: { year: string; vision: string; keyProducts?: string[]; targetIndustries?: string[]; productionGoal: string; qualityGoal: string; capex: string };
  };
  const risks = planning?.riskRegister ?? [];
  const bp = planning?.businessPlan;

  if (selectedSideTab === "risk") {
    return (
      <div className="w-full space-y-6">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#137fec]/10 text-[#137fec]">Clause 6</span>
          <p className="text-sm text-slate-600 dark:text-slate-400">{t("guideline.tabPlanSummary")}</p>
        </div>
        <SectionCard title="리스크 레지스터" icon={<span className="material-symbols-outlined text-[#137fec]">warning</span>}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-left text-slate-600 dark:text-slate-400">
                  <th className="p-3 font-medium">리스크</th>
                  <th className="p-3 font-medium">영향</th>
                  <th className="p-3 font-medium">가능성</th>
                  <th className="p-3 font-medium">대응전략</th>
                </tr>
              </thead>
              <tbody>
                {risks.map((r, i) => (
                  <tr key={i} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{r.risk}</td>
                    <td className="p-3">{r.impact}</td>
                    <td className="p-3">{r.probability}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{r.response}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
        {bp && (
          <SectionCard title="사업계획 요약" icon={<span className="material-symbols-outlined text-[#137fec]">trending_up</span>}>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-slate-500">연도</dt><dd className="font-medium">{bp.year}</dd></div>
              <div><dt className="text-slate-500">비전</dt><dd className="font-medium text-[#137fec]">{bp.vision}</dd></div>
              <div><dt className="text-slate-500">주요 제품</dt><dd className="font-medium">{(bp.keyProducts ?? []).join(", ")}</dd></div>
              <div><dt className="text-slate-500">타겟 산업</dt><dd className="font-medium">{(bp.targetIndustries ?? []).join(", ")}</dd></div>
              <div><dt className="text-slate-500">생산 목표</dt><dd className="font-medium">{bp.productionGoal}</dd></div>
              <div><dt className="text-slate-500">품질 목표</dt><dd className="font-medium">{bp.qualityGoal}</dd></div>
              <div><dt className="text-slate-500">CAPEX</dt><dd className="font-medium">{bp.capex}</dd></div>
            </dl>
          </SectionCard>
        )}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#137fec]/10 text-[#137fec]">Clause 6</span>
        <p className="text-sm text-slate-600 dark:text-slate-400">{t("guideline.tabPlanSummary")}</p>
      </div>
      <PlanningView selectedSideTab={selectedSideTab} />
    </div>
  );
}
