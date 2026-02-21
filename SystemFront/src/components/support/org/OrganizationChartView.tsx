"use client";

import { useLanguage } from "@/i18n/LanguageProvider";
import { SectionCard } from "@/components/ui/SectionCard";
import { OrgDirectory } from "../OrgDirectory";

export function OrganizationChartView() {
  const { t } = useLanguage();

  return (
    <div className="w-full space-y-6">
      <SectionCard
        title={t("support.orgChart")}
        icon={<span className="material-symbols-outlined text-[#137fec]">groups</span>}
      >
        <div className="-mx-2 -mb-2">
          <OrgDirectory />
        </div>
      </SectionCard>
    </div>
  );
}
