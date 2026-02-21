"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageProvider";
import { ShellLayout } from "@/components/ShellLayout";
import { PageShell } from "@/components/layout/PageShell";
import {
  ContextOverviewTabView,
  PolicyTabView,
  PlanningRiskTabView,
  SupportTabView,
  PerformanceTabView,
  ImprovementTabView,
  ReportsTabView,
  QualityGoalsTabView,
} from "@/components/management";

const MANAGEMENT_TABS = [
  { id: "context", labelKey: "management.context", icon: "business", clause: 4 },
  { id: "policy", labelKey: "management.policy", icon: "policy", clause: 5 },
  { id: "planning", labelKey: "management.planning", icon: "target", clause: 6 },
  { id: "support", labelKey: "management.support", icon: "groups", clause: 7 },
  { id: "performance", labelKey: "management.performance", icon: "analytics", clause: 9 },
  { id: "improvement", labelKey: "management.improvement", icon: "trending_up", clause: 10 },
  { id: "reports", labelKey: "management.reports", icon: "description", clause: "9/10" },
  { id: "qualityGoals", labelKey: "management.qualityGoals", icon: "flag", clause: "6/9" },
] as const;

const SIDE_ITEMS_CONTEXT = [
  { id: "RawMaterials", labelKey: "org.rawMaterial" },
  { id: "Suppliers", labelKey: "org.suppliers" },
  { id: "Headquarters", labelKey: "org.headquarters" },
  { id: "Customers", labelKey: "org.customers" },
  { id: "Swot", labelKey: "org.swot" },
];

const SIDE_ITEMS_PLANNING = [
  { id: "fmea", labelKey: "planning.fmea" },
  { id: "business", labelKey: "planning.businessPlan" },
  { id: "objectives", labelKey: "planning.implementationPlan" },
  { id: "risk", labelKey: "swot.recallRiskDriver" },
];

const DEFAULT_SIDE: Record<string, string> = {
  context: "RawMaterials",
  planning: "fmea",
};

export default function ManagementPage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const sectionFromUrl = searchParams.get("section") ?? "context";
  const menuFromUrl = searchParams.get("menu");

  const [activeTab, setActiveTab] = useState<string>("context");
  const [sideTab, setSideTab] = useState<string>("RawMaterials");

  useEffect(() => {
    const validTab = MANAGEMENT_TABS.some((tab) => tab.id === sectionFromUrl) ? sectionFromUrl : "context";
    setActiveTab(validTab);
    const defaultSide = DEFAULT_SIDE[validTab] ?? "RawMaterials";
    const validMenus = ["RawMaterials", "Suppliers", "Headquarters", "Customers", "Swot", "fmea", "business", "objectives", "risk"];
    setSideTab(menuFromUrl && validMenus.includes(menuFromUrl) ? menuFromUrl : defaultSide);
  }, [sectionFromUrl, menuFromUrl]);

  const sideMenuItems =
    activeTab === "context"
      ? SIDE_ITEMS_CONTEXT.map((s) => ({ id: s.id, labelKey: s.labelKey }))
      : activeTab === "planning"
        ? SIDE_ITEMS_PLANNING.map((s) => ({ id: s.id, labelKey: s.labelKey }))
        : [];

  const renderContent = () => {
    switch (activeTab) {
      case "context":
        return <ContextOverviewTabView selectedSideTab={sideTab} />;
      case "policy":
        return <PolicyTabView />;
      case "planning":
        return <PlanningRiskTabView selectedSideTab={sideTab} />;
      case "support":
        return <SupportTabView />;
      case "performance":
        return <PerformanceTabView />;
      case "improvement":
        return <ImprovementTabView />;
      case "reports":
        return <ReportsTabView />;
      case "qualityGoals":
        return <QualityGoalsTabView />;
      default:
        return <ContextOverviewTabView selectedSideTab={sideTab} />;
    }
  };

  const effectiveSideTab =
    sideMenuItems.length > 0 && sideMenuItems.some((s) => s.id === sideTab)
      ? sideTab
      : sideMenuItems[0]?.id ?? sideTab;

  const updateUrl = (tab: string, menu?: string) => {
    const params = new URLSearchParams();
    params.set("section", tab);
    if (menu) params.set("menu", menu);
    const url = params.toString() ? `/management?${params.toString()}` : "/management";
    window.history.replaceState(null, "", url);
  };

  const handleSelectMenu = (id: string) => {
    setSideTab(id);
    updateUrl(activeTab, id);
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    const defaultSide = DEFAULT_SIDE[tabId] ?? "RawMaterials";
    setSideTab(defaultSide);
    const hasSide = tabId === "context" || tabId === "planning";
    updateUrl(tabId, hasSide ? defaultSide : undefined);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="shrink-0 px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {MANAGEMENT_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-[#137fec] text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              {t(tab.labelKey)}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <ShellLayout
          currentModule="management"
          sideMenuItems={sideMenuItems.map((s) => ({ id: s.id, labelKey: s.labelKey }))}
          selectedMenuId={effectiveSideTab}
          onSelectMenu={handleSelectMenu}
          watermarkIcon="description"
        >
          <PageShell>{renderContent()}</PageShell>
        </ShellLayout>
      </div>
    </div>
  );
}
