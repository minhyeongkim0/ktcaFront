"use client";

import { ShellLayout } from "@/components/ShellLayout";
import { PageShell } from "@/components/layout/PageShell";
import { getSideMenuItems } from "@/data/dummyData";
import {
  LeadershipHeaderSection,
  CeoProfileCard,
  QualityPolicyCard,
  LeadershipKpiCards,
} from "@/components/leadership";

/**
 * Leadership 페이지: Context와 동일한 레이아웃(상단 툴바 + 상단 탭 + 좌측 사이드바) 유지.
 * 좌측 메뉴는 leadership용 항목이 없으면 빈 목록(No items)만 표시하고, 중앙에 Leadership 콘텐츠 표시.
 */
export default function LeadershipPage() {
  const sideMenuItems = getSideMenuItems("leadership");
  const selectedMenuId = null;

  return (
    <ShellLayout
      currentModule="leadership"
      sideMenuItems={sideMenuItems}
      selectedMenuId={selectedMenuId}
      onSelectMenu={() => {}}
      watermarkIcon="groups"
    >
      <PageShell>
        <LeadershipHeaderSection />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1">
            <CeoProfileCard />
          </div>
          <div className="lg:col-span-2">
            <QualityPolicyCard />
          </div>
        </div>
        <LeadershipKpiCards />
      </PageShell>
    </ShellLayout>
  );
}
