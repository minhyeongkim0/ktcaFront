"use client";

import { useLanguage } from "@/i18n/LanguageProvider";
import { SectionCard } from "@/components/ui/SectionCard";
import { dummyData } from "@/data/dummyData";

export function PerformanceTabView() {
  const { t } = useLanguage();
  const perf = dummyData.performance as {
    kpiBoard?: { dept: string; kpi: string; target: string; actual: string; rate: string }[];
    auditSchedule?: { date: string; type: string; result: string; nc: number; obs: number; status: string }[];
    mgmtReview?: { issues: string[]; decisions: string[]; actions: string[] };
  };
  const kpis = perf?.kpiBoard ?? [];
  const audits = perf?.auditSchedule ?? [];
  const review = perf?.mgmtReview ?? { issues: [], decisions: [], actions: [] };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#137fec]/10 text-[#137fec]">Clause 9</span>
        <p className="text-sm text-slate-600 dark:text-slate-400">{t("guideline.tabPerfSummary")}</p>
      </div>

      <SectionCard title="KPI 보드" icon={<span className="material-symbols-outlined text-[#137fec]">analytics</span>}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-left text-slate-600 dark:text-slate-400">
                <th className="p-3 font-medium">부서</th>
                <th className="p-3 font-medium">KPI</th>
                <th className="p-3 font-medium">목표</th>
                <th className="p-3 font-medium">실적</th>
                <th className="p-3 font-medium">달성률</th>
              </tr>
            </thead>
            <tbody>
              {kpis.map((k, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-3 text-slate-800 dark:text-slate-200">{k.dept}</td>
                  <td className="p-3">{k.kpi}</td>
                  <td className="p-3">{k.target}</td>
                  <td className="p-3">{k.actual}</td>
                  <td className="p-3 font-medium">{k.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="내부감사 / 점검 일정" icon={<span className="material-symbols-outlined text-[#137fec]">fact_check</span>}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-left text-slate-600 dark:text-slate-400">
                <th className="p-3 font-medium">일자</th>
                <th className="p-3 font-medium">유형</th>
                <th className="p-3 font-medium">결과</th>
                <th className="p-3 font-medium">부적합</th>
                <th className="p-3 font-medium">관찰</th>
                <th className="p-3 font-medium">상태</th>
              </tr>
            </thead>
            <tbody>
              {audits.map((a, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-3">{a.date}</td>
                  <td className="p-3">{a.type}</td>
                  <td className="p-3">{a.result}</td>
                  <td className="p-3">{a.nc}</td>
                  <td className="p-3">{a.obs}</td>
                  <td className="p-3">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="경영검토 (Management Review) 요약" icon={<span className="material-symbols-outlined text-[#137fec]">summarize</span>}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-4">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">주요 이슈</h4>
            <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
              {(review.issues ?? []).map((s, i) => <li key={i}>• {s}</li>)}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-4">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">결정사항</h4>
            <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
              {(review.decisions ?? []).map((s, i) => <li key={i}>• {s}</li>)}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-4">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Action</h4>
            <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
              {(review.actions ?? []).map((s, i) => <li key={i}>• {s}</li>)}
            </ul>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
