"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageProvider";
import { MonitoringView } from "@/components/fdc/MonitoringView";
import { DeviceTypeToggle, type DeviceType } from "@/components/fdc/DeviceTypeToggle";
import { AlertsView } from "@/components/fdc/AlertsView";
import { PredictionView } from "@/components/fdc/PredictionView";
import { ReportsView } from "@/components/fdc/ReportsView";
import { AssetsView } from "@/components/fdc/AssetsView";

const FDC_TABS = [
  { id: "monitoring", labelKey: "fdc.monitoring", icon: "monitoring" },
  { id: "alarms", labelKey: "fdc.alarms", icon: "notifications_active" },
  { id: "prediction", labelKey: "fdc.prediction", icon: "analytics" },
  { id: "reports", labelKey: "fdc.reports", icon: "summarize" },
  { id: "assets", labelKey: "fdc.assets", icon: "inventory_2" },
] as const;

function parseDeviceType(v: string | null): DeviceType {
  if (v === "AGV" || v === "OHT") return v;
  return "AGV";
}

export default function FdcPage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>("monitoring");
  const [deviceType, setDeviceType] = useState<DeviceType>("AGV");

  const deviceTypeFromUrl = parseDeviceType(searchParams.get("deviceType"));
  useEffect(() => {
    setDeviceType(deviceTypeFromUrl);
  }, [deviceTypeFromUrl]);

  const handleDeviceTypeChange = useCallback(
    (v: DeviceType) => {
      setDeviceType(v);
      const url = new URL(window.location.href);
      url.searchParams.set("deviceType", v);
      window.history.replaceState(null, "", url.toString());
    },
    []
  );

  const renderContent = () => {
    switch (activeTab) {
      case "monitoring":
        return <MonitoringView deviceType={deviceType} />;
      case "alarms":
        return <AlertsView deviceType={deviceType} />;
      case "prediction":
        return <PredictionView deviceType={deviceType} />;
      case "reports":
        return <ReportsView deviceType={deviceType} />;
      case "assets":
        return <AssetsView deviceType={deviceType} />;
      default:
        return <MonitoringView deviceType={deviceType} />;
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-[#f6f7f8] dark:bg-[#0f172a]">
      <div className="shrink-0 px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {FDC_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
        <DeviceTypeToggle value={deviceType} onChange={handleDeviceTypeChange} size="sm" />
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">
        {activeTab === "monitoring" ? renderContent() : renderContent()}
      </div>
    </div>
  );
}
