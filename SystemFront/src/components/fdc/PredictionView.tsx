"use client";

import { useLanguage } from "@/i18n/LanguageProvider";
import { useTheme } from "@/components/ThemeProvider";
import { TableauEmbed } from "@/components/TableauEmbed";
import { SectionCard } from "@/components/ui/SectionCard";
import { OHT_DASHBOARDS, AGV_DASHBOARDS } from "@/config/tableauDashboards";
import { PageShell } from "@/components/layout/PageShell";
import type { DeviceType } from "./DeviceTypeToggle";

export interface PredictionViewProps {
  deviceType: DeviceType;
}

export function PredictionView({ deviceType }: PredictionViewProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const raw = deviceType === "OHT" ? OHT_DASHBOARDS : AGV_DASHBOARDS;
  const dashboards = Array.isArray(raw) ? raw : [];
  const items = dashboards.filter((d) => d?.url && d?.id?.includes("anomaly"));

  return (
    <PageShell>
      <div className="space-y-8">
        <h2 className="text-xl font-bold text-[#111418] dark:text-slate-100 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#137fec]">analytics</span>
          {t("fdc.prediction")}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          예측 기반 이상/위험 탐지, 고장 확률, Feature 중요도 등을 확인합니다. ({deviceType})
        </p>
        <div className="space-y-6">
          {items.map((d) => (
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
                <TableauEmbed
                  src={d.url}
                  title={d.title}
                  theme={theme}
                  className="rounded-lg"
                  heightDesktop={d.heightDesktop}
                  heightMobile={d.heightMobile}
                />
              </div>
            </SectionCard>
          ))}
          {items.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {deviceType} 예측/진단 대시보드 URL 설정 후 표시됩니다.
            </p>
          )}
        </div>
      </div>
    </PageShell>
  );
}
