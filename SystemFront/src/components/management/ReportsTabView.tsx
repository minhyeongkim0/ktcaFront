"use client";

import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { SectionCard } from "@/components/ui/SectionCard";
import { dummyData } from "@/data/dummyData";

export function ReportsTabView() {
  const { t } = useLanguage();
  const [toast, setToast] = useState<string | null>(null);
  const reports = dummyData.reports as { history?: { name: string; date: string; type: string }[] };
  const history = reports?.history ?? [];

  const handleWeekly = () => {
    setToast("주간 보고서 생성이 요청되었습니다. (실제 구현 시 PDF/Doc 다운로드)");
    setTimeout(() => setToast(null), 3000);
  };
  const handleMonthly = () => {
    setToast("월간 보고서 생성이 요청되었습니다. (실제 구현 시 PDF/Doc 다운로드)");
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#137fec]/10 text-[#137fec]">Clause 9/10</span>
        <p className="text-sm text-slate-600 dark:text-slate-400">주간/월간 보고서 자동작성 및 다운로드</p>
      </div>

      <SectionCard title="보고서 생성" icon={<span className="material-symbols-outlined text-[#137fec]">add_circle</span>}>
        <div className="flex gap-4 flex-wrap">
          <button
            type="button"
            onClick={handleWeekly}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#137fec] text-white font-medium hover:bg-[#0d6bd8] transition-colors"
          >
            <span className="material-symbols-outlined">description</span>
            주간 보고서 생성
          </button>
          <button
            type="button"
            onClick={handleMonthly}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-600 text-white font-medium hover:bg-slate-700 transition-colors"
          >
            <span className="material-symbols-outlined">description</span>
            월간 보고서 생성
          </button>
        </div>
        {toast && (
          <div className="mt-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 text-sm">
            {toast}
          </div>
        )}
      </SectionCard>

      <SectionCard title="최근 생성 이력" icon={<span className="material-symbols-outlined text-[#137fec]">folder_open</span>}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-left text-slate-600 dark:text-slate-400">
                <th className="p-3 font-medium">파일명</th>
                <th className="p-3 font-medium">일자</th>
                <th className="p-3 font-medium">유형</th>
                <th className="p-3 font-medium">{t("common.download")}</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-3 text-slate-800 dark:text-slate-200">{h.name}</td>
                  <td className="p-3">{h.date}</td>
                  <td className="p-3">{h.type}</td>
                  <td className="p-3">
                    <button type="button" className="text-[#137fec] hover:underline flex items-center gap-1">
                      <span className="material-symbols-outlined text-lg">download</span>
                      다운로드
                    </button>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-slate-500">
                    {t("state.empty")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
