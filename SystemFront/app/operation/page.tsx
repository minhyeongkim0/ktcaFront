"use client";

import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { ShellLayout } from "@/components/ShellLayout";
import { PageShell } from "@/components/layout/PageShell";
import { InfoCard } from "@/components/InfoCard";
import { DataTable } from "@/components/DataTable";
import { ControlChart, ParetoChart } from "@/components/Charts";
import { SectionCard } from "@/components/ui/SectionCard";
import { TableauEmbed } from "@/components/TableauEmbed";
import ProcessFlowPipeline from "@/components/ProcessFlowPipeline";
import { ProcessVideoSection } from "@/components/operation/ProcessVideoSection";
import { useTheme } from "@/components/ThemeProvider";
import { dummyData, getSideMenuItems } from "@/data/dummyData";
import { SEMICONDUCTOR_FLOW_STEPS } from "@/data/processFlow";
import { AGV_DASHBOARDS, OHT_DASHBOARDS } from "@/config/tableauDashboards";

export default function OperationPage() {
  const { t } = useLanguage();
  const sideMenuItems = getSideMenuItems("operation");
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(() => sideMenuItems[0]?.id ?? null);
  const { theme } = useTheme();
  const { operation = {}, improvement = {} } = dummyData;
  const processVars = operation.processVariables ?? [];
  const controlLimits = operation.controlLimits ?? { tempC: { UCL: 100, LCL: 0 }, pressureBar: { UCL: 5, LCL: 0 }, flowLpm: { UCL: 10, LCL: 0 } };
  const kpis = operation.kpis ?? { equipmentAnomalyRate: 0, defectRate: 0, energyConsumptionRate: "-" };
  const defectsBeforeAfter = improvement.defectsBeforeAfter ?? [];

  const controlChartData = processVars.map((p) => ({
    date: p.timestamp.slice(11, 16),
    value: p.tempC,
    ucl: controlLimits.tempC.UCL,
    lcl: controlLimits.tempC.LCL,
    cl: (controlLimits.tempC.UCL + controlLimits.tempC.LCL) / 2,
  }));

  const paretoData = defectsBeforeAfter.map((d) => ({ name: d.defect, count: d.beforeCount }));

  const renderContent = () => {
    switch (selectedMenuId) {
      case "flow":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#111418] dark:text-slate-100 transition-colors duration-300">
              {t("operation.flow")}
            </h2>
            <SectionCard
              title={t("operation.processFlow")}
              icon={<span className="material-symbols-outlined text-[#137fec] text-xl">account_tree</span>}
            >
              <p className="mb-6 text-sm text-slate-600 dark:text-slate-400 transition-colors duration-300">
                원자재(Si 웨이퍼)부터 노광·식각·증착·CMP 등 프론트엔드 공정을 거쳐 반제품(웨이퍼)이 되고,
                다이싱·다이부착·와이어본딩·몰딩·경화·리드가공·최종검사를 통해 자동차용 반도체(PMIC·파워 MCU)로 완성됩니다.
              </p>
              <ProcessFlowPipeline steps={SEMICONDUCTOR_FLOW_STEPS} />
            </SectionCard>
            <ProcessVideoSection />
          </div>
        );
      case "variables":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#111418] dark:text-slate-100 transition-colors duration-300">{t("operation.processVariables")}</h2>
            <DataTable
              data={[...processVars]}
              columns={[
                { key: "timestamp", label: t("operation.timestamp") },
                { key: "tempC", label: t("operation.tempC") },
                { key: "pressureBar", label: t("operation.pressureBar") },
                { key: "flowLpm", label: t("operation.flowLpm") },
              ]}
              idKey="timestamp"
              title={t("operation.processVarLog")}
            />
            <InfoCard title={t("operation.controlLimits")} icon="tune">
              <ul className="text-sm text-slate-600 space-y-1">
                <li>온도: LCL {controlLimits.tempC.LCL} / UCL {controlLimits.tempC.UCL} ℃</li>
                <li>압력: LCL {controlLimits.pressureBar.LCL} / UCL {controlLimits.pressureBar.UCL} bar</li>
                <li>유량: LCL {controlLimits.flowLpm.LCL} / UCL {controlLimits.flowLpm.UCL} L/min</li>
              </ul>
            </InfoCard>
          </div>
        );
      case "agv":
        return (
          <div className="space-y-8">
            <h2 className="flex items-center gap-2 text-xl font-bold text-[#111418] dark:text-slate-100 transition-colors duration-300">
              <span className="material-symbols-outlined text-[#137fec] text-xl">local_shipping</span>
              {t("operation.agv")}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              AGV 운행 현황·장애 감지·가동률 등 Tableau 대시보드를 확인할 수 있습니다.
            </p>
            <div className="space-y-6">
              {AGV_DASHBOARDS.map((d) => (
                <SectionCard
                  key={d.id}
                  title={d.title}
                  icon={<span className="material-symbols-outlined text-[#137fec] text-xl">bar_chart</span>}
                >
                  <div className="-mx-2 md:-mx-4">
                    <TableauEmbed src={d.url} title={d.title} theme={theme} className="rounded-lg" heightDesktop={d.heightDesktop} heightMobile={d.heightMobile} />
                  </div>
                </SectionCard>
              ))}
            </div>
          </div>
        );
      case "oht":
        return (
          <div className="space-y-8">
            <h2 className="flex items-center gap-2 text-xl font-bold text-[#111418] dark:text-slate-100 transition-colors duration-300">
              <span className="material-symbols-outlined text-[#137fec] text-xl">precision_manufacturing</span>
              {t("operation.oht")}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              OHT 운행 현황·장애 감지·통합 관제판 등 Tableau 대시보드를 확인할 수 있습니다.
            </p>
            <div className="space-y-6">
              {OHT_DASHBOARDS.map((d) => (
                <SectionCard
                  key={d.id}
                  title={d.title}
                  icon={<span className="material-symbols-outlined text-[#137fec] text-xl">bar_chart</span>}
                  badge={
                    d.url && (
                      <a
                        href={d.url.split("?")[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-[#137fec] hover:underline flex items-center gap-1"
                      >
                        Tableau에서 크게 보기
                        <span className="material-symbols-outlined text-base">open_in_new</span>
                      </a>
                    )
                  }
                >
                  <div className="-mx-2 md:-mx-4">
                    <TableauEmbed src={d.url} title={d.title} theme={theme} className="rounded-lg" heightDesktop={d.heightDesktop} heightMobile={d.heightMobile} />
                  </div>
                </SectionCard>
              ))}
            </div>
          </div>
        );
      case "qc7":
        return (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-[#111418] dark:text-slate-100 transition-colors duration-300">{t("operation.qc7")}</h2>
            <ControlChart data={controlChartData} title={t("operation.moldingTempChart")} />
            <ParetoChart data={paretoData} title={t("operation.paretoDefect")} />
            <InfoCard title="KPI" icon="analytics">
              <ul className="text-sm text-slate-600 space-y-1">
                <li>설비 이상률: {(kpis.equipmentAnomalyRate * 100).toFixed(2)}%</li>
                <li>불량률: {(kpis.defectRate * 100).toFixed(2)}%</li>
                <li>에너지 소비: {kpis.energyConsumptionRate}</li>
              </ul>
            </InfoCard>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ShellLayout
      currentModule="operation"
      sideMenuItems={sideMenuItems}
      selectedMenuId={selectedMenuId}
      onSelectMenu={setSelectedMenuId}
      watermarkIcon="precision_manufacturing"
    >
      <PageShell>{renderContent()}</PageShell>
    </ShellLayout>
  );
}
