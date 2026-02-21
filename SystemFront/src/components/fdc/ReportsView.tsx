"use client";

import { useLanguage } from "@/i18n/LanguageProvider";
import { PageShell } from "@/components/layout/PageShell";
import type { DeviceType } from "./DeviceTypeToggle";

export interface ReportsViewProps {
  deviceType: DeviceType;
}

export function ReportsView({ deviceType }: ReportsViewProps) {
  const { t } = useLanguage();

  return (
    <PageShell>
      <div className="space-y-8">
        <h2 className="text-xl font-bold text-[#111418] dark:text-slate-100 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#137fec]">summarize</span>
          {t("fdc.reports")}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          주간/월간 설비 현황 리포트를 자동 생성하여 다운로드할 수 있습니다. ({deviceType})
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-6 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            <span className="material-symbols-outlined text-4xl text-slate-400 mb-3 block">description</span>
            <h3 className="font-bold text-slate-800 dark:text-slate-100">주간 리포트</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">최근 1주 설비 상태 요약</p>
            <button className="mt-4 px-4 py-2 rounded-lg bg-[#137fec] text-white text-sm font-medium hover:bg-[#0d6dd6]">
              다운로드
            </button>
          </div>
          <div className="p-6 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            <span className="material-symbols-outlined text-4xl text-slate-400 mb-3 block">calendar_month</span>
            <h3 className="font-bold text-slate-800 dark:text-slate-100">월간 리포트</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">한 달간 설비 KPI 및 이상 이력</p>
            <button className="mt-4 px-4 py-2 rounded-lg bg-[#137fec] text-white text-sm font-medium hover:bg-[#0d6dd6]">
              다운로드
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
