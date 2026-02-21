"use client";

import { SectionCard } from "@/components/ui/SectionCard";
import { KpiTile } from "@/components/planning/KpiTile";
import { DataTable } from "@/components/DataTable";
import { useLanguage } from "@/i18n/LanguageProvider";
import {
  EXECUTIVE_SUMMARY,
  SWOT_CARDS,
  RECALL_RISK_TABLE,
  TEST_GAP_TABLE,
  TOP_ACTIONS,
} from "@/data/organization/swot";

const PRIMARY = "#137fec";

export function SwotView() {
  const { t } = useLanguage();

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div>
        <nav aria-label="Breadcrumb" className="flex text-slate-500 text-sm mb-1">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-base">folder_open</span>
              <span className="font-medium" style={{ color: PRIMARY }}>{t("org.swot")}</span>
          </span>
        </nav>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t("org.swot")}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {t("org.swotSubtitle")}
          </p>
      </div>

      {/* Executive Summary */}
      <SectionCard
        title={t("planning.executiveSummary")}
        icon={<span className="material-symbols-outlined text-[#137fec] text-xl">summarize</span>}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
          {EXECUTIVE_SUMMARY.kpis.map((k) => (
            <KpiTile key={k.label} label={k.label} value={k.value} unit={k.unit} trend={k.trend} />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {EXECUTIVE_SUMMARY.summary.map((s, i) => (
            <span
              key={i}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300"
            >
              {s}
            </span>
          ))}
        </div>
      </SectionCard>

      {/* SWOT 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {SWOT_CARDS.map((card) => (
          <div
            key={card.type}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-5 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">{card.title}</h3>
              <span
                className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  card.priority === "H"
                    ? "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300"
                    : card.priority === "M"
                      ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                영향도 {card.priority}
              </span>
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-3">{card.summary}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {card.metrics.map((m, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  {m}
                </span>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                {t("swot.linkedActions")}
              </p>
              <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                {card.linkedActions.map((a, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-[#137fec]">arrow_forward</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Evidence & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SectionCard
          title={t("swot.recallRiskDriver")}
          icon={<span className="material-symbols-outlined text-[#137fec] text-xl">shield</span>}
        >
          <DataTable
            data={RECALL_RISK_TABLE}
            columns={[
              { key: "driver", label: t("swot.driver") },
              { key: "indicator", label: t("swot.indicator") },
              { key: "process", label: t("swot.responseProcess") },
              { key: "owner", label: t("table.owner") },
              { key: "sla", label: t("swot.sla") },
            ]}
            idKey="driver"
          />
        </SectionCard>
        <SectionCard
          title={t("swot.testGap")}
          icon={<span className="material-symbols-outlined text-[#137fec] text-xl">science</span>}
        >
          <DataTable
            data={TEST_GAP_TABLE}
            columns={[
              { key: "gap", label: t("swot.gap") },
              { key: "impact", label: t("swot.impact") },
              { key: "current", label: t("swot.current") },
              { key: "target", label: t("swot.target") },
              { key: "action", label: t("swot.actionPlan") },
              { key: "timeline", label: t("swot.timeline") },
            ]}
            idKey="gap"
          />
        </SectionCard>
      </div>

      {/* Top 6 실행 과제 */}
      <SectionCard
        title={t("swot.top6Actions")}
        icon={<span className="material-symbols-outlined text-[#137fec] text-xl">task_alt</span>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOP_ACTIONS.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{item.title}</h4>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                  {item.owner}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">{item.desc}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 dark:text-slate-300">{item.kpi}</span>
                <span className="text-slate-500 dark:text-slate-400">{item.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
