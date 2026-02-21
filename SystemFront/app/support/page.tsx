"use client";

import { useState, useMemo } from "react";
import { ShellLayout } from "@/components/ShellLayout";
import { PageShell } from "@/components/layout/PageShell";
import { getSideMenuItems } from "@/data/dummyData";
import { OrganizationChartView } from "@/components/support/org";
import { EquipmentView } from "@/components/support/equipment";

export default function SupportPage() {
  const sideMenuItems = getSideMenuItems("support");
  const firstSideId = sideMenuItems[0]?.id ?? null;
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(firstSideId);

  const effectiveMenuId = useMemo(() => {
    const valid = selectedMenuId && sideMenuItems.some((s) => s.id === selectedMenuId);
    return valid ? selectedMenuId : firstSideId;
  }, [selectedMenuId, sideMenuItems, firstSideId]);

  const renderContent = () => {
    switch (effectiveMenuId) {
      case "org":
        return <OrganizationChartView />;
      case "equip":
        return <EquipmentView />;
      default:
        return null;
    }
  };

  return (
    <ShellLayout
      currentModule="support"
      sideMenuItems={sideMenuItems}
      selectedMenuId={effectiveMenuId}
      onSelectMenu={setSelectedMenuId}
      watermarkIcon="support_agent"
    >
      <PageShell>{renderContent()}</PageShell>
    </ShellLayout>
  );
}
