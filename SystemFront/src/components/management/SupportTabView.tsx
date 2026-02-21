"use client";

import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { SectionCard } from "@/components/ui/SectionCard";
import { OrganizationChartView } from "@/components/support/org";
import { EquipmentView } from "@/components/support/equipment";
import { dummyData } from "@/data/dummyData";

const SUPPORT_SIDES = [
  { id: "org", labelKey: "support.orgChart", icon: "groups" },
  { id: "equip", labelKey: "support.equipment", icon: "precision_manufacturing" },
  { id: "docs", labelKey: "management.reports", icon: "description" },
] as const;

export function SupportTabView() {
  const { t } = useLanguage();
  const [side, setSide] = useState<string>("org");
  const support = dummyData.support as {
    equipment?: { name: string; qty: number; status: string }[];
    equipmentNeeded?: { name: string; reason: string }[];
    documents?: { name: string; type: string; status: string; revised: string }[];
    orgManpower?: { total: number; depts: string };
  };
  const equip = support?.equipment ?? [];
  const needed = support?.equipmentNeeded ?? [];
  const docs = support?.documents ?? [];
  const manpower = support?.orgManpower;

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#137fec]/10 text-[#137fec]">Clause 7</span>
        <p className="text-sm text-slate-600 dark:text-slate-400">{t("guideline.tabSupportSummary")}</p>
      </div>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
        {SUPPORT_SIDES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSide(s.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              side === s.id
                ? "bg-[#137fec] text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <span className="material-symbols-outlined text-lg">{s.icon}</span>
            {t(s.labelKey)}
          </button>
        ))}
      </div>

      {side === "org" && (
        <>
          {manpower && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{t("support.totalPeople")}</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{manpower.total}</p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">부서별</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">{manpower.depts}</p>
              </div>
            </div>
          )}
          <OrganizationChartView />
        </>
      )}

      {side === "equip" && (
        <>
          <SectionCard title="보유 장비" icon={<span className="material-symbols-outlined text-[#137fec]">precision_manufacturing</span>}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-600">
                    <th className="p-3 font-medium">장비명</th>
                    <th className="p-3 font-medium">수량</th>
                    <th className="p-3 font-medium">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {equip.map((e, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-3">{e.name}</td>
                      <td className="p-3">{e.qty}</td>
                      <td className="p-3">{e.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
          <SectionCard title="추가 필요 장비" icon={<span className="material-symbols-outlined text-amber-500">warning</span>}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-600">
                    <th className="p-3 font-medium">장비명</th>
                    <th className="p-3 font-medium">사유</th>
                  </tr>
                </thead>
                <tbody>
                  {needed.map((n, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-3">{n.name}</td>
                      <td className="p-3">{n.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
          <EquipmentView />
        </>
      )}

      {side === "docs" && (
        <SectionCard title="문서 목록" icon={<span className="material-symbols-outlined text-[#137fec]">description</span>}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600">
                  <th className="p-3 font-medium">문서명</th>
                  <th className="p-3 font-medium">유형</th>
                  <th className="p-3 font-medium">상태</th>
                  <th className="p-3 font-medium">개정일</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((d, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3">{d.name}</td>
                    <td className="p-3">{d.type}</td>
                    <td className="p-3">{d.status}</td>
                    <td className="p-3">{d.revised}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
