"use client";

import { useLanguage } from "@/i18n/LanguageProvider";
import { SectionCard } from "@/components/ui/SectionCard";
import { Accordion } from "@/components/planning/Accordion";
import { ISO_MAPPING, buildIsoNavigationUrl } from "@/config/isoMapping";

const BENEFIT_ICONS = [
  "assignment_turned_in",
  "fact_check",
  "group_work",
  "warning",
  "monitoring",
  "hub",
] as const;

interface GuidelineViewProps {
  /** 클릭 시 해당 화면으로 이동 후 모달 닫기 */
  onNavigate?: (url: string) => void;
}

export function GuidelineView({ onNavigate }: GuidelineViewProps) {
  const { t } = useLanguage();

  const benefits = [
    { icon: BENEFIT_ICONS[0], titleKey: "guideline.benefit1Title", descKey: "guideline.benefit1Desc" },
    { icon: BENEFIT_ICONS[1], titleKey: "guideline.benefit2Title", descKey: "guideline.benefit2Desc" },
    { icon: BENEFIT_ICONS[2], titleKey: "guideline.benefit3Title", descKey: "guideline.benefit3Desc" },
    { icon: BENEFIT_ICONS[3], titleKey: "guideline.benefit4Title", descKey: "guideline.benefit4Desc" },
    { icon: BENEFIT_ICONS[4], titleKey: "guideline.benefit5Title", descKey: "guideline.benefit5Desc" },
    { icon: BENEFIT_ICONS[5], titleKey: "guideline.benefit6Title", descKey: "guideline.benefit6Desc" },
  ];

  const accordionItems = [
    { titleKey: "guideline.tabLoginTitle", summaryKey: "guideline.tabLoginSummary", bullets: ["guideline.tabLoginB1"] },
    { titleKey: "guideline.tabFirstTitle", summaryKey: "guideline.tabFirstSummary", bullets: ["guideline.tabFirstB1", "guideline.tabFirstB2", "guideline.tabFirstB3", "guideline.tabFirstB4"] },
    { titleKey: "guideline.tabOrgTitle", summaryKey: "guideline.tabOrgSummary", bullets: ["guideline.tabOrgB1", "guideline.tabOrgB2"] },
    { titleKey: "guideline.tabLeaderTitle", summaryKey: "guideline.tabLeaderSummary", bullets: ["guideline.tabLeaderB1", "guideline.tabLeaderB2"] },
    { titleKey: "guideline.tabPlanTitle", summaryKey: "guideline.tabPlanSummary", bullets: ["guideline.tabPlanB1", "guideline.tabPlanB2", "guideline.tabPlanB3", "guideline.tabPlanB4"] },
    { titleKey: "guideline.tabSupportTitle", summaryKey: "guideline.tabSupportSummary", bullets: ["guideline.tabSupportB1", "guideline.tabSupportB2", "guideline.tabSupportB3"] },
    { titleKey: "guideline.tabOpTitle", summaryKey: "guideline.tabOpSummary", bullets: ["guideline.tabOpB1", "guideline.tabOpB2", "guideline.tabOpB3"] },
    { titleKey: "guideline.tabPerfTitle", summaryKey: "guideline.tabPerfSummary", bullets: ["guideline.tabPerfB1", "guideline.tabPerfB2", "guideline.tabPerfB3", "guideline.tabPerfB4"] },
    { titleKey: "guideline.tabImproveTitle", summaryKey: "guideline.tabImproveSummary", bullets: ["guideline.tabImproveB1", "guideline.tabImproveB2", "guideline.tabImproveB3"] },
  ];

  const mappingRows = [
    { annexKey: "guideline.map1AnnexSl", tabKey: "guideline.map1Tab", featKey: "guideline.map1Features", outKey: "guideline.map1Outputs" },
    { annexKey: "guideline.map2AnnexSl", tabKey: "guideline.map2Tab", featKey: "guideline.map2Features", outKey: "guideline.map2Outputs" },
    { annexKey: "guideline.map3AnnexSl", tabKey: "guideline.map3Tab", featKey: "guideline.map3Features", outKey: "guideline.map3Outputs" },
    { annexKey: "guideline.map4AnnexSl", tabKey: "guideline.map4Tab", featKey: "guideline.map4Features", outKey: "guideline.map4Outputs" },
    { annexKey: "guideline.map5AnnexSl", tabKey: "guideline.map5Tab", featKey: "guideline.map5Features", outKey: "guideline.map5Outputs" },
    { annexKey: "guideline.map6AnnexSl", tabKey: "guideline.map6Tab", featKey: "guideline.map6Features", outKey: "guideline.map6Outputs" },
    { annexKey: "guideline.map7AnnexSl", tabKey: "guideline.map7Tab", featKey: "guideline.map7Features", outKey: "guideline.map7Outputs" },
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Hero */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-6 md:p-8">
        <p className="text-sm font-medium text-[#137fec] mb-1">
          {t("guideline.heroLabel")}
        </p>
        <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          {t("guideline.heroTitle")}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          {t("guideline.heroSubtitle")}
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#137fec]/10 text-[#137fec]">
            {t("guideline.badgeAnnexSl")}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
            {t("guideline.badgeIso")}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400">
            {t("guideline.badgeMes")}
          </span>
        </div>
      </div>

      {/* Section 1: Annex SL 소개 */}
      <SectionCard
        title={t("guideline.section1Title")}
        icon={<span className="material-symbols-outlined text-[#137fec]">architecture</span>}
      >
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          {t("guideline.section1Intro")}
        </p>
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4 font-mono text-sm text-slate-700 dark:text-slate-300 overflow-x-auto">
          {t("guideline.section1Flow")}
        </div>
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          {t("guideline.section1Benefit")}
        </p>
      </SectionCard>

      {/* Section 2: 이점 카드 6개 */}
      <SectionCard
        title={t("guideline.section2Title")}
        icon={<span className="material-symbols-outlined text-[#137fec]">star</span>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-900 hover:border-[#137fec]/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#137fec] shrink-0 mt-0.5">
                  {b.icon}
                </span>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
                    {t(b.titleKey)}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                    {t(b.descKey)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Section 3: 탭별 기능 소개 아코디언 */}
      <SectionCard
        title={t("guideline.section3Title")}
        icon={<span className="material-symbols-outlined text-[#137fec]">menu_book</span>}
      >
        <Accordion
          items={accordionItems.map((item, i) => ({
            title: t(item.titleKey),
            defaultOpen: i === 0,
            content: (
              <div className="space-y-2">
                <p className="text-slate-600 dark:text-slate-400">{t(item.summaryKey)}</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  {item.bullets.map((key, j) => (
                    <li key={j}>{t(key)}</li>
                  ))}
                </ul>
              </div>
            ),
          }))}
        />
      </SectionCard>

      {/* Section 4: Annex SL ↔ 탭 매핑 테이블 */}
      <SectionCard
        title={t("guideline.section4Title")}
        icon={<span className="material-symbols-outlined text-[#137fec]">table_chart</span>}
      >
        <div className="overflow-x-auto -mx-2">
          <table className="w-full min-w-[600px] text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 font-semibold text-slate-800 dark:text-slate-100 w-[15%]">
                  {t("guideline.colAnnexSl")}
                </th>
                <th className="text-left py-3 px-4 font-semibold text-slate-800 dark:text-slate-100 w-[12%]">
                  {t("guideline.colTab")}
                </th>
                <th className="text-left py-3 px-4 font-semibold text-slate-800 dark:text-slate-100 w-[28%]">
                  {t("guideline.colFeatures")}
                </th>
                <th className="text-left py-3 px-4 font-semibold text-slate-800 dark:text-slate-100">
                  {t("guideline.colOutputs")}
                </th>
              </tr>
            </thead>
            <tbody>
              {mappingRows.map((row, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                    {t(row.annexKey)}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-100">
                    {t(row.tabKey)}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                    {t(row.featKey)}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                    {t(row.outKey)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Section 4b: ISO Clause 4~10 화면 매핑 (해당 화면으로 이동) */}
      <SectionCard
        title={t("guideline.section4bTitle")}
        icon={<span className="material-symbols-outlined text-[#137fec]">map</span>}
      >
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          {t("guideline.section4bDesc")}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ISO_MAPPING.map((item) => (
            <div
              key={item.clause}
              className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-900 hover:border-[#137fec]/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100">
                    Clause {item.clause}: {item.titleKo}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {item.descriptionKo}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                    확인 위치: {item.locationKo}
                  </p>
                </div>
                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => onNavigate(buildIsoNavigationUrl(item.target))}
                    className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#137fec] text-white text-sm font-medium hover:bg-[#0d6dd6]"
                  >
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                    {t("guideline.goToScreen")}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Section 5: 사용 순서 */}
      <SectionCard
        title={t("guideline.section5Title")}
        icon={<span className="material-symbols-outlined text-[#137fec]">route</span>}
      >
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          {t("guideline.usageSteps")}
        </p>
      </SectionCard>
    </div>
  );
}
