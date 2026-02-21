"use client";

import { useLanguage } from "@/i18n/LanguageProvider";
import { PageShell } from "@/components/layout/PageShell";
import type { DeviceType } from "./DeviceTypeToggle";

export interface AssetsViewProps {
  deviceType: DeviceType;
}

export function AssetsView({ deviceType }: AssetsViewProps) {
  const { t } = useLanguage();

  return (
    <PageShell>
      <div className="space-y-8">
        <h2 className="text-xl font-bold text-[#111418] dark:text-slate-100 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#137fec]">inventory_2</span>
          {t("fdc.assets")}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {deviceType} 장비 목록, 스펙, 가동률, 최근 이상 이력을 확인합니다.
        </p>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-slate-600 dark:text-slate-300">장비 ID</th>
                <th className="px-4 py-3 text-left font-bold text-slate-600 dark:text-slate-300">유형</th>
                <th className="px-4 py-3 text-right font-bold text-slate-600 dark:text-slate-300">가동률</th>
                <th className="px-4 py-3 text-left font-bold text-slate-600 dark:text-slate-300">최근 상태</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-200 dark:border-slate-700">
                <td className="px-4 py-3">—</td>
                <td className="px-4 py-3">API 연동 후 표시</td>
                <td className="px-4 py-3 text-right">—</td>
                <td className="px-4 py-3">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
