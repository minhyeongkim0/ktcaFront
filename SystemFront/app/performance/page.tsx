"use client";

import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { ShellLayout } from "@/components/ShellLayout";
import { PageShell } from "@/components/layout/PageShell";
import { InfoCard } from "@/components/InfoCard";
import { DataTable } from "@/components/DataTable";
import { SectionCard } from "@/components/ui/SectionCard";
import { dummyData, getSideMenuItems } from "@/data/dummyData";
import { downloadReport } from "@/utils/download";

export default function PerformancePage() {
  const { t } = useLanguage();
  const sideMenuItems = getSideMenuItems("performance");
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(() => sideMenuItems[0]?.id ?? null);
  const { performance } = dummyData;

  const renderContent = () => {
    switch (selectedMenuId) {
      case "monitor":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t("performance.monitor")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard title={t("performance.productionStatus")} icon="precision_manufacturing">
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>금일 계획: {performance.monitoring.productionStatus.todayPlan}</li>
                  <li>금일 실적: {performance.monitoring.productionStatus.todayOutput}</li>
                  <li>WIP: {performance.monitoring.productionStatus.wip}</li>
                  <li>라인: {performance.monitoring.productionStatus.line}</li>
                </ul>
              </InfoCard>
              <InfoCard title={t("performance.equipmentStatus")} icon="build">
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  {performance.monitoring.equipmentStatus.map((e, i) => (
                    <li key={i}>{e.eq}: {e.state} (알람 {e.alarm})</li>
                  ))}
                </ul>
              </InfoCard>
              <InfoCard title={t("performance.factoryEnv")} icon="thermostat">
                <p className="text-sm text-slate-600 dark:text-slate-400">온도 {performance.monitoring.factoryStatus.temperatureC}℃, 습도 {performance.monitoring.factoryStatus.humidityPct}%, {performance.monitoring.factoryStatus.cleanroomClass}</p>
              </InfoCard>
              <InfoCard title={t("performance.qualityStatus")} icon="analytics">
                <p className="text-sm text-slate-600 dark:text-slate-400">PPM {performance.monitoring.qualityStatus.ppm}, 불량률 {performance.monitoring.qualityStatus.defectRate}, 주요 불량 {performance.monitoring.qualityStatus.topDefect}</p>
              </InfoCard>
              <InfoCard title={t("performance.operationRate")} icon="trending_up">
                <p className="text-sm text-slate-600 dark:text-slate-400">OEE {performance.monitoring.utilizationStatus.oee}, 가용률 {performance.monitoring.utilizationStatus.availability}, 성능률 {performance.monitoring.utilizationStatus.performance}, 품질률 {performance.monitoring.utilizationStatus.quality}</p>
              </InfoCard>
            </div>
          </div>
        );
      case "weekly":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t("performance.weeklyReport")}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t("performance.weeklyReportList")}</p>
            </div>
            <SectionCard
              title={t("performance.weeklyReportTitle")}
              icon={<span className="material-symbols-outlined text-[#137fec] text-xl">summarize</span>}
              badge={<span className="text-xs text-slate-500">{t("performance.recent5Weeks")}</span>}
            >
              <DataTable
                data={performance.reports.weekly}
                columns={[
                  { key: "week", label: t("performance.week") },
                  { key: "title", label: t("performance.title") },
                  { key: "summary", label: t("performance.summary") },
                  { key: "generatedAt", label: t("performance.createdAt") },
                  {
                    key: "fileName",
                    label: t("performance.fileName"),
                    render: (row) => (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-700 dark:text-slate-300">{row.fileName}</span>
                        <button
                          type="button"
                          onClick={() => downloadReport(row)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-[#137fec] text-white hover:bg-[#0d6fd8] transition-colors"
                          title={t("common.download")}
                        >
                          <span className="material-symbols-outlined text-sm">download</span>
                          {t("common.download")}
                        </button>
                      </div>
                    ),
                  },
                ]}
                idKey="week"
                title=""
              />
            </SectionCard>
          </div>
        );
      case "monthly":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t("performance.monthlyReport")}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t("performance.monthlyReportList")}</p>
            </div>
            <SectionCard
              title={t("performance.monthlyReportTitle")}
              icon={<span className="material-symbols-outlined text-[#137fec] text-xl">calendar_month</span>}
              badge={<span className="text-xs text-slate-500">{t("performance.recent3Months")}</span>}
            >
              <DataTable
                data={performance.reports.monthly}
                columns={[
                  { key: "month", label: "월" },
                  { key: "title", label: t("performance.title") },
                  { key: "summary", label: t("performance.summary") },
                  { key: "generatedAt", label: t("performance.createdAt") },
                  {
                    key: "fileName",
                    label: t("performance.fileName"),
                    render: (row) => (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-700 dark:text-slate-300">{row.fileName}</span>
                        <button
                          type="button"
                          onClick={() => downloadReport(row)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-[#137fec] text-white hover:bg-[#0d6fd8] transition-colors"
                          title={t("common.download")}
                        >
                          <span className="material-symbols-outlined text-sm">download</span>
                          {t("common.download")}
                        </button>
                      </div>
                    ),
                  },
                ]}
                idKey="month"
                title=""
              />
            </SectionCard>
          </div>
        );
      case "kpi":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t("performance.employeeKpiTitle")}</h2>
            <DataTable
              data={performance.employeeKpi}
              columns={[
                { key: "name", label: t("performance.name") },
                { key: "dept", label: t("performance.dept") },
                { key: "kpi", label: t("planning.kpi") },
                { key: "target", label: t("performance.target") },
                { key: "actual", label: t("performance.actual") },
                { key: "achievementRate", label: "달성률", render: (r) => `${((r.achievementRate ?? 0) * 100).toFixed(0)}%` },
              ]}
              searchKeys={["name", "dept", "kpi"]}
              idKey="name"
              title="작업자 KPI"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ShellLayout
      currentModule="performance"
      sideMenuItems={sideMenuItems}
      selectedMenuId={selectedMenuId}
      onSelectMenu={setSelectedMenuId}
      watermarkIcon="trending_up"
    >
      <PageShell>{renderContent()}</PageShell>
    </ShellLayout>
  );
}
