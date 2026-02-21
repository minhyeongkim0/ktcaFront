"use client";

import { useState } from "react";
import { ShellLayout } from "@/components/ShellLayout";
import { PageShell } from "@/components/layout/PageShell";
import { InfoCard } from "@/components/InfoCard";
import { DataTable } from "@/components/DataTable";
import { dummyData, getSideMenuItems } from "@/data/dummyData";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function ImprovementPage() {
  const { t } = useLanguage();
  const sideMenuItems = getSideMenuItems("improvement");
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(() => sideMenuItems[0]?.id ?? null);
  const { improvement } = dummyData;

  const renderContent = () => {
    switch (selectedMenuId) {
      case "capa":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#111418]">{t("improvement.capaLog")}</h2>
            <InfoCard title={t("improvement.capaHistory")} icon="pending_actions">
              <p className="text-sm text-slate-500 mb-2">{t("improvement.totalCount", { count: improvement.capaLog.length })}</p>
            </InfoCard>
            <DataTable
              data={[...improvement.capaLog]}
              columns={[
                { key: "date", label: t("table.date") },
                { key: "equipment", label: t("table.equipment") },
                { key: "rootCause", label: t("table.rootCause") },
                { key: "action", label: t("table.action") },
                { key: "owner", label: t("table.owner") },
              ]}
              searchKeys={["equipment", "rootCause", "action", "owner"]}
              idKey="date"
              title={t("improvement.capaLog")}
            />
          </div>
        );
      case "defects":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#111418]">{t("improvement.defectsBeforeAfter")}</h2>
            <DataTable
              data={[...improvement.defectsBeforeAfter]}
              columns={[
                { key: "defect", label: t("table.defectType") },
                { key: "beforeCount", label: t("table.beforeCount") },
                { key: "afterCount", label: t("table.afterCount") },
              ]}
              searchKeys={["defect"]}
              idKey="defect"
              title={t("improvement.defectBeforeAfterCompare")}
            />
          </div>
        );
      case "effectiveness":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#111418]">{t("improvement.effectivenessTitle")}</h2>
            <InfoCard title={t("improvement.byEquipment")} icon="precision_manufacturing">
              <DataTable
                data={[...improvement.effectivenessBy.byEquipment]}
                columns={[
                  { key: "equipment", label: t("table.equipment") },
                  { key: "beforeDefectRate", label: t("table.beforeDefectRate"), render: (r) => (r.beforeDefectRate * 100).toFixed(2) + "%" },
                  { key: "afterDefectRate", label: t("table.afterDefectRate"), render: (r) => (r.afterDefectRate * 100).toFixed(2) + "%" },
                ]}
                idKey="equipment"
                title=""
              />
            </InfoCard>
            <InfoCard title={t("improvement.byOperator")} icon="person">
              <DataTable
                data={[...improvement.effectivenessBy.byOperator]}
                columns={[
                  { key: "operator", label: t("table.operator") },
                  { key: "beforeDefectRate", label: t("table.beforeDefectRate"), render: (r) => (r.beforeDefectRate * 100).toFixed(2) + "%" },
                  { key: "afterDefectRate", label: t("table.afterDefectRate"), render: (r) => (r.afterDefectRate * 100).toFixed(2) + "%" },
                ]}
                idKey="operator"
                title=""
              />
            </InfoCard>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ShellLayout
      currentModule="improvement"
      sideMenuItems={sideMenuItems}
      selectedMenuId={selectedMenuId}
      onSelectMenu={setSelectedMenuId}
      watermarkIcon="auto_awesome"
    >
      <PageShell>{renderContent()}</PageShell>
    </ShellLayout>
  );
}
