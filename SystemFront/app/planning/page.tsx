"use client";

import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { ShellLayout } from "@/components/ShellLayout";
import { PageShell } from "@/components/layout/PageShell";
import { InfoCard } from "@/components/InfoCard";
import { DataTable } from "@/components/DataTable";
import { SectionCard } from "@/components/ui/SectionCard";
import { KpiTile } from "@/components/planning/KpiTile";
import { Timeline } from "@/components/planning/Timeline";
import { Accordion } from "@/components/planning/Accordion";
import { dummyData, getSideMenuItems } from "@/data/dummyData";
import {
  EXECUTIVE_SUMMARY,
  ORDER_PIPELINE,
  REVENUE_BY_PRODUCT,
  CAPEX_PLAN,
  RISK_MATRIX,
} from "@/data/planning/businessPlan";
import {
  GOALS_SCOPE_CSF,
  ROADMAP_MILESTONES,
  WBS_STREAMS,
  RACI,
  BUDGET_RESOURCES,
  KPI_OKR,
  RISK_TOP10,
  DASHBOARD_KPI_SOURCE,
} from "@/data/planning/implementationPlan";

export default function PlanningPage() {
  const { t } = useLanguage();
  const sideMenuItems = getSideMenuItems("planning");
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(() => sideMenuItems[0]?.id ?? null);
  const { planning } = dummyData;

  const renderContent = () => {
    switch (selectedMenuId) {
      case "fmea":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#111418] dark:text-slate-100 transition-colors duration-300">
              {t("planning.fmea")}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              RPN(S×O×D) 기준 내림차순 정렬. 고위험(RPN≥180)은 빨간색, 주의(RPN≥120)는 주황색으로 표시됩니다.
            </p>
            <DataTable
              data={[...planning.fmea]}
              columns={[
                { key: "process", label: t("planning.process"), sortable: true },
                { key: "failureMode", label: t("planning.failureMode") },
                { key: "effect", label: t("planning.effect") },
                { key: "cause", label: t("planning.cause") },
                { key: "S", label: "S", sortable: true },
                { key: "O", label: "O", sortable: true },
                { key: "D", label: "D", sortable: true },
                { key: "RPN", label: "RPN", sortable: true },
                { key: "action", label: t("table.action") },
                { key: "owner", label: t("table.owner") },
                { key: "due", label: t("planning.due") },
              ]}
              searchKeys={["process", "failureMode", "action"]}
              idKey="process"
              title={t("planning.fmeaTitle")}
              initialSortKey="RPN"
              initialSortAsc={false}
            />
          </div>
        );
      case "objectives":
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t("planning.objectivesTitle")}</h2>
              <div className="flex gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>AURORA Mobility Semicon (AMS)</span>
                <span>·</span>
                <span>2026~2027</span>
              </div>
            </div>

            {/* 목표/범위/CSF */}
            <SectionCard
              title={t("planning.goalsScopeCsf")}
              icon={<span className="material-symbols-outlined text-[#137fec] text-xl">flag</span>}
            >
              <div className="grid md:grid-cols-3 gap-5">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2 text-sm">{t("planning.objective")}</h4>
                  <div className="flex flex-wrap gap-2">
                    {GOALS_SCOPE_CSF.goals.map((g, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-xs text-slate-700 dark:text-slate-300">{g}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2 text-sm">{t("planning.scope")}</h4>
                  <div className="flex flex-wrap gap-2">
                    {GOALS_SCOPE_CSF.scope.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2 text-sm">CSF</h4>
                  <div className="flex flex-wrap gap-2">
                    {GOALS_SCOPE_CSF.csf.map((c, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-xs text-slate-700 dark:text-slate-300">{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* 로드맵 타임라인 */}
            <SectionCard
              title="추진 로드맵 (2026 Q1 ~ 2027 H1)"
              icon={<span className="material-symbols-outlined text-[#137fec] text-xl">schedule</span>}
            >
              <Timeline items={ROADMAP_MILESTONES} />
            </SectionCard>

            {/* WBS / RACI */}
            <div className="grid md:grid-cols-2 gap-5">
              <SectionCard
                title="WBS (세부 과제)"
                icon={<span className="material-symbols-outlined text-[#137fec] text-xl">list</span>}
              >
                <DataTable
                  data={WBS_STREAMS}
                  columns={[
                    { key: "id", label: "ID" },
                    { key: "name", label: "과제" },
                    { key: "owner", label: "책임" },
                    { key: "deliverables", label: "산출물" },
                  ]}
                  idKey="id"
                />
              </SectionCard>
              <SectionCard
                title="RACI"
                icon={<span className="material-symbols-outlined text-[#137fec] text-xl">groups</span>}
              >
                <DataTable
                  data={RACI}
                  columns={[
                    { key: "task", label: "과제" },
                    { key: "R", label: "R" },
                    { key: "A", label: "A" },
                    { key: "C", label: "C" },
                    { key: "I", label: "I" },
                  ]}
                  idKey="task"
                />
              </SectionCard>
            </div>

            {/* 예산 / KPI / 리스크 */}
            <div className="grid md:grid-cols-2 gap-5">
              <SectionCard
                title="예산·인력"
                icon={<span className="material-symbols-outlined text-[#137fec] text-xl">payments</span>}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">인력</span>
                    <span className="text-2xl font-bold text-[#137fec]">{BUDGET_RESOURCES.manpower.count}명</span>
                    <span className="text-xs text-slate-500">{BUDGET_RESOURCES.manpower.roles}</span>
                  </div>
                  <DataTable
                    data={BUDGET_RESOURCES.cost}
                    columns={[
                      { key: "category", label: "항목" },
                      { key: "y2026", label: "2026(억원)" },
                      { key: "y2027", label: "2027(억원)" },
                    ]}
                    idKey="category"
                  />
                </div>
              </SectionCard>
              <SectionCard
                title="KPI/OKR"
                icon={<span className="material-symbols-outlined text-[#137fec] text-xl">analytics</span>}
              >
                <DataTable
                  data={KPI_OKR}
                  columns={[
                    { key: "kpi", label: "KPI" },
                    { key: "target", label: "목표" },
                    { key: "baseline", label: "기준" },
                    { key: "owner", label: "담당" },
                  ]}
                  idKey="kpi"
                />
              </SectionCard>
            </div>

            {/* 데이터/대시보드 과제 (AGV/OHT 포함) */}
            <SectionCard
              title="데이터·대시보드 과제"
              icon={<span className="material-symbols-outlined text-[#137fec] text-xl">monitoring</span>}
              badge={<span className="text-xs text-slate-500">OEE·PPM·CT·WIP·물류(AGV/OHT) 포함</span>}
            >
              <DataTable
                data={DASHBOARD_KPI_SOURCE}
                columns={[
                  { key: "kpi", label: "KPI" },
                  { key: "source", label: "데이터 소스" },
                  { key: "update", label: "업데이트" },
                  { key: "notes", label: "비고" },
                ]}
                idKey="kpi"
              />
            </SectionCard>

            {/* 리스크 Top 10 */}
            <SectionCard
              title="리스크 Top 10"
              icon={<span className="material-symbols-outlined text-[#137fec] text-xl">warning</span>}
            >
              <DataTable
                data={RISK_TOP10}
                columns={[
                  { key: "rank", label: "순위" },
                  { key: "risk", label: "리스크" },
                  { key: "impact", label: "영향" },
                  { key: "owner", label: "담당" },
                  { key: "mitigation", label: "대응" },
                ]}
                idKey="rank"
              />
            </SectionCard>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-6">
              ※ 위 수치/지표는 가상 데이터이며, 실제 추진계획과 다를 수 있습니다.
            </p>
          </div>
        );
      case "business":
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">사업계획서</h2>
              <div className="flex gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>AURORA Mobility Semicon (AMS)</span>
                <span>·</span>
                <span>2026.01.15</span>
              </div>
            </div>

            {/* Executive Summary */}
            <SectionCard
              title="Executive Summary"
              icon={<span className="material-symbols-outlined text-[#137fec] text-xl">summarize</span>}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
                {EXECUTIVE_SUMMARY.kpis.map((k) => (
                  <KpiTile key={k.label} label={k.label} value={k.value} unit={k.unit} trend={k.trend} />
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {EXECUTIVE_SUMMARY.summary.map((s, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300">
                    {s}
                  </span>
                ))}
              </div>
            </SectionCard>

            {/* Accordion Sections */}
            <Accordion
              items={[
                {
                  title: "I. 회사 개요",
                  icon: <span className="material-symbols-outlined text-lg">business</span>,
                  defaultOpen: false,
                  content: (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {["IATF 16949", "ISO 26262", "AEC-Q100/Q101", "PPAP"].map((b) => (
                          <span key={b} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300">
                            {b}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        Fabless 자동차용 반도체. 설계센터·검증랩 국내 운영, OSAT 후공정, FT 일부 내재화 추진.
                      </p>
                    </div>
                  ),
                },
                {
                  title: "II. 매출/수주",
                  icon: <span className="material-symbols-outlined text-lg">trending_up</span>,
                  content: (
                    <div className="space-y-4">
                      <DataTable
                        data={ORDER_PIPELINE}
                        columns={[
                          { key: "customer", label: "고객" },
                          { key: "product", label: "제품" },
                          { key: "qty", label: "수량" },
                          { key: "value", label: "금액(억원)" },
                          { key: "status", label: "상태" },
                          { key: "yyyy", label: "연도" },
                        ]}
                        idKey="customer"
                      />
                      <DataTable
                        data={REVENUE_BY_PRODUCT}
                        columns={[
                          { key: "product", label: "제품군" },
                          { key: "y2025", label: "2025(억원)" },
                          { key: "y2026", label: "2026(억원)" },
                          { key: "y2027", label: "2027(억원)" },
                          { key: "share", label: "비중" },
                        ]}
                        idKey="product"
                      />
                    </div>
                  ),
                },
                {
                  title: "III. 재무계획 (CAPEX)",
                  icon: <span className="material-symbols-outlined text-lg">savings</span>,
                  content: (
                    <DataTable
                      data={CAPEX_PLAN}
                      columns={[
                        { key: "category", label: "항목" },
                        { key: "y2026", label: "2026(억원)" },
                        { key: "y2027", label: "2027(억원)" },
                        { key: "y2028", label: "2028(억원)" },
                      ]}
                      idKey="category"
                    />
                  ),
                },
                {
                  title: "IV. 리스크 매트릭스",
                  icon: <span className="material-symbols-outlined text-lg">warning</span>,
                  content: (
                    <DataTable
                      data={RISK_MATRIX}
                      columns={[
                        { key: "risk", label: "리스크" },
                        { key: "probability", label: "가능성" },
                        { key: "impact", label: "영향" },
                        { key: "owner", label: "오너" },
                        { key: "response", label: "대응" },
                      ]}
                      idKey="risk"
                    />
                  ),
                },
                {
                  title: "V. 부록 (용어집)",
                  icon: <span className="material-symbols-outlined text-lg">menu_book</span>,
                  content: (
                    <div className="flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <span><strong>ASIL</strong> 기능안전 등급</span>
                      <span><strong>PPAP</strong> 양산 승인</span>
                      <span><strong>AEC-Q100</strong> 반도체 신뢰성 규격</span>
                      <span><strong>OTD</strong> 납기준수율</span>
                      <span><strong>PPM</strong> 불량률</span>
                    </div>
                  ),
                },
              ]}
            />

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-6">
              ※ 위 수치/지표는 가상 데이터이며, 실제 사업계획과 다를 수 있습니다.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ShellLayout
      currentModule="planning"
      sideMenuItems={sideMenuItems}
      selectedMenuId={selectedMenuId}
      onSelectMenu={setSelectedMenuId}
      watermarkIcon="calendar_month"
    >
      <PageShell>{renderContent()}</PageShell>
    </ShellLayout>
  );
}
