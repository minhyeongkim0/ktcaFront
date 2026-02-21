"use client";

import { ShellLayout } from "@/components/ShellLayout";
import { PageShell } from "@/components/layout/PageShell";
import { GuidelineView } from "@/components/guideline/GuidelineView";

export default function GuidelinePage() {
  return (
    <ShellLayout
      currentModule="guideline"
      sideMenuItems={[]}
      selectedMenuId={null}
      onSelectMenu={() => {}}
      watermarkIcon="menu_book"
    >
      <PageShell>
        <GuidelineView />
      </PageShell>
    </ShellLayout>
  );
}
