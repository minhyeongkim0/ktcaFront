"use client";

import { useState, useMemo } from "react";
import { ShellLayout } from "@/components/ShellLayout";
import { PageShell } from "@/components/layout/PageShell";
import { ContextPage as ContextPageContent } from "@/components/context/ContextPage";
import { getSideMenuItems } from "@/data/dummyData";

export default function ContextPage() {
  const sideMenuItems = getSideMenuItems("context");
  const firstSideId = sideMenuItems[0]?.id ?? null;
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(firstSideId);

  const effectiveSideTab = useMemo(() => {
    const valid = selectedMenuId && sideMenuItems.some((s) => s.id === selectedMenuId);
    return valid ? selectedMenuId : firstSideId;
  }, [selectedMenuId, sideMenuItems, firstSideId]);

  return (
    <ShellLayout
      currentModule="context"
      sideMenuItems={sideMenuItems}
      selectedMenuId={effectiveSideTab}
      onSelectMenu={setSelectedMenuId}
      watermarkIcon="folder_open"
    >
      <PageShell>
        <ContextPageContent selectedSideTab={effectiveSideTab} />
      </PageShell>
    </ShellLayout>
  );
}
