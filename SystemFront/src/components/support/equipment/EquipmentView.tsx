"use client";

import { equipmentKpis, equipmentList } from "@/data/equipment";
import { exportEquipmentReport } from "@/utils/download";
import { KpiCard } from "./KpiCard";
import { EquipmentFilters } from "./EquipmentFilters";
import { EquipmentRow } from "./EquipmentRow";
import { useLanguage } from "@/i18n/LanguageProvider";

const PRIMARY = "#1e40af";

export function EquipmentView() {
  const { t } = useLanguage();

  const handleExport = () => {
    const kpiSummary = {
      [t("support.totalEquipment")]: `${equipmentKpis.totalEquipment}대`,
      [t("support.operationRate")]: equipmentKpis.operationRate,
      [t("support.maintenanceDue")]: `${equipmentKpis.maintenanceDue}대`,
      [t("support.powerUsage")]: `${equipmentKpis.powerUsage} kW`,
    };
    const equipmentSummary = equipmentList.map(
      (e) => `${e.machineName} (${e.id}) - ${e.status} - ${e.capacity}`
    );
    exportEquipmentReport(kpiSummary, equipmentSummary);
  };

  const handleRegister = () => console.log("Register New Equipment");

  return (
    <div className="w-full space-y-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t("support.equipment")}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t("support.equipmentDesc")}
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            {t("common.export")}
          </button>
          <button
            type="button"
            onClick={handleRegister}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors shadow-sm"
            style={{ backgroundColor: PRIMARY }}
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            {t("support.registerEquipment")}
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          title={t("support.totalEquipment")}
          value={`${equipmentKpis.totalEquipment} units`}
          sub={equipmentKpis.totalSub}
          icon="precision_manufacturing"
          iconBgClass="bg-blue-100 dark:bg-blue-900/40"
          iconColorClass="text-blue-600 dark:text-blue-400"
        />
        <KpiCard
          title={t("support.operationRate")}
          value={equipmentKpis.operationRate}
          sub={equipmentKpis.operationRateSub}
          icon="trending_up"
          iconBgClass="bg-emerald-100 dark:bg-emerald-900/40"
          iconColorClass="text-emerald-600 dark:text-emerald-400"
        />
        <KpiCard
          title={t("support.maintenanceDue")}
          value={`${equipmentKpis.maintenanceDue} units`}
          sub={equipmentKpis.maintenanceDueSub}
          icon="build"
          iconBgClass="bg-amber-100 dark:bg-amber-900/40"
          iconColorClass="text-amber-600 dark:text-amber-400"
        />
        <KpiCard
          title={t("support.powerUsage")}
          value={`${equipmentKpis.powerUsage} kW`}
          sub={equipmentKpis.powerUsageSub}
          icon="bolt"
          iconBgClass="bg-purple-100 dark:bg-purple-900/40"
          iconColorClass="text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* Search / Filter */}
      <EquipmentFilters />

      {/* Table header (desktop only) */}
      <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        <div className="md:col-span-2">{t("support.equipmentTableName")}</div>
        <div className="md:col-span-2">{t("support.equipmentTableRole")}</div>
        <div className="md:col-span-1">{t("support.equipmentTableStatus")}</div>
        <div className="md:col-span-2">{t("support.equipmentTableSpec")}</div>
        <div className="md:col-span-2">{t("support.equipmentTableEfficiency")}</div>
        <div className="md:col-span-1" />
      </div>

      {/* Equipment list */}
      <div className="space-y-3">
        {equipmentList.map((item) => (
          <EquipmentRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
