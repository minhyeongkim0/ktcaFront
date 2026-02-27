"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import PageShell from "@/src/components/common/PageShell";
import SectionCard from "@/src/components/common/SectionCard";
import type { IsoMappingItem } from "@/src/components/common/IsoMappingBadge";

const MGMT_TABS = [
  { id: "overview", label: "회사 개요 & 이해관계자", icon: "business" },
  { id: "leadership", label: "리더십 & 방침", icon: "groups" },
  { id: "planning", label: "목표/계획", icon: "edit_calendar" },
  { id: "resources", label: "자원/역량", icon: "support" },
  { id: "performance", label: "성과/리뷰", icon: "analytics" },
  { id: "improvement", label: "개선/감사 대응", icon: "verified_user" },
] as const;

const TAB_ISO_MAPPING: Record<string, IsoMappingItem[]> = {
  overview: [{ iso: "Context", label: "조직의 맥락" }],
  leadership: [{ iso: "Leadership", label: "리더십" }],
  planning: [{ iso: "Planning", label: "기획" }],
  resources: [{ iso: "Support", label: "지원" }],
  performance: [{ iso: "Performance", label: "성과평가" }],
  improvement: [{ iso: "Improvement", label: "개선" }],
};

function ManagementPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "overview";
  const validTab = MGMT_TABS.some((t) => t.id === tab) ? tab : "overview";

  const setTab = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", id);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <PageShell
      title="경영(Management)"
      description="조직·방침·자원·성과 등 경영 정보 (정성 중심)"
      breadcrumb={[{ label: "경영", href: "/management" }]}
      isoMapping={TAB_ISO_MAPPING[validTab] ?? TAB_ISO_MAPPING.overview}
      isoNote="Annex SL 기준 매핑"
      tabs={MGMT_TABS.map((t) => ({ id: t.id, label: t.label, icon: t.icon }))}
      activeTab={validTab}
      onTabChange={setTab}
    >
      <MgmtTabContent tab={validTab} />
    </PageShell>
  );
}

export default function ManagementPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center bg-[#f6f7f8]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#137fec]" /></div>}>
      <ManagementPageContent />
    </Suspense>
  );
}

function MgmtTabContent({ tab }: { tab: string }) {
  if (tab === "overview") {
    return (
      <div className="space-y-6">
        <SectionCard title="요약" icon="summarize">
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• 반도체 부품(MCU, PMIC 등) 품질관리 전문 기업</li>
            <li>• 주요 고객: 현대자동차 등 자동차 OEM/Tier1</li>
            <li>• 설비 예지보전(FDC) 및 데이터 기반 품질 경영 추진</li>
          </ul>
        </SectionCard>
        <SectionCard title="제품 TOP3" icon="inventory">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {["MCU", "PMIC", "센서 IC"].map((p) => (
              <div key={p} className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                <p className="font-bold text-[#111418]">{p}</p>
                <p className="text-xs text-gray-500 mt-1">자동차용 반도체</p>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="이해관계자" icon="people">
          <div className="space-y-2 text-sm">
            <p><strong>고객:</strong> 현대자동차, Tier1 모듈사</p>
            <p><strong>공급사:</strong> 웨이퍼·장비 업체</p>
            <p><strong>규제:</strong> IATF 16949, ISO 9001</p>
          </div>
        </SectionCard>
        <SectionCard title="SWOT 요약" icon="lightbulb">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-bold text-green-700 mb-1">강점</p>
              <p className="text-gray-600">품질 프로세스, 데이터 기반 의사결정</p>
            </div>
            <div>
              <p className="font-bold text-amber-700 mb-1">약점</p>
              <p className="text-gray-600">테스트 장비 부족, 신규 공정 경험</p>
            </div>
            <div>
              <p className="font-bold text-blue-700 mb-1">기회</p>
              <p className="text-gray-600">전장화 확대, 예지보전 도입</p>
            </div>
            <div>
              <p className="font-bold text-red-700 mb-1">리스크</p>
              <p className="text-gray-600">리콜, 공급망 단절</p>
            </div>
          </div>
        </SectionCard>
      </div>
    );
  }

  if (tab === "leadership") {
    return (
      <div className="space-y-6">
        <SectionCard title="품질방침" icon="flag">
          <p className="text-sm text-gray-600 leading-relaxed">
            &quot;고객 만족을 위한 품질 1위 추구. 데이터 기반의 지속적 개선과 예방 활동으로 신뢰를 구축합니다.&quot;
          </p>
        </SectionCard>
        <SectionCard title="최고경영진 의지" icon="verified">
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• 품질 목표 연 1회 경영검토 회의 승인</li>
            <li>• 예지보전(FDC) 프로젝트 직접 추진</li>
            <li>• 품질 문제 시 즉시 에스컬레이션 경로 운영</li>
          </ul>
        </SectionCard>
        <SectionCard title="슬로건/비전" icon="auto_awesome">
          <p className="text-[#137fec] font-bold">Data-Driven Quality · Zero Defect Mindset</p>
        </SectionCard>
      </div>
    );
  }

  if (tab === "planning") {
    return (
      <div className="space-y-6">
        <SectionCard title="품질목표 (정량 KPI 목표값)" icon="target">
          <div className="space-y-3 text-sm">
            <p><strong>불량률:</strong> 100ppm 이하 (연간)</p>
            <p><strong>고객 불만:</strong> 0건</p>
            <p><strong>시정조치 완료율:</strong> 100%</p>
            <p><strong>예지보전 적용율:</strong> 80% 이상</p>
          </div>
        </SectionCard>
        <SectionCard title="추진계획" icon="assignment">
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• 1분기: FDC Phase 1 구축 (AGV/OHT 50대)</li>
            <li>• 2분기: 알람 규칙 최적화, KPI 대시보드 정착</li>
            <li>• 3분기: 예측 모델 고도화 (LSTM v2)</li>
            <li>• 4분기: 경영검토 및 내부심사</li>
          </ul>
        </SectionCard>
      </div>
    );
  }

  if (tab === "resources") {
    return (
      <div className="space-y-6">
        <SectionCard title="조직/RACI 요약" icon="account_tree">
          <p className="text-sm text-gray-600 mb-4">
            품질담당(R), 생산(A), 설비(C), 경영진(I) 역할 정의. 프로세스별 RACI 매트릭스 운영.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3">프로세스</th>
                  <th className="text-left py-2 px-3">R</th>
                  <th className="text-left py-2 px-3">A</th>
                  <th className="text-left py-2 px-3">C</th>
                  <th className="text-left py-2 px-3">I</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2 px-3">품질 목표 수립</td>
                  <td className="py-2 px-3">품질팀</td>
                  <td className="py-2 px-3">경영진</td>
                  <td className="py-2 px-3">생산</td>
                  <td className="py-2 px-3">설비</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 px-3">FDC 운영</td>
                  <td className="py-2 px-3">설비팀</td>
                  <td className="py-2 px-3">생산</td>
                  <td className="py-2 px-3">품질</td>
                  <td className="py-2 px-3">경영진</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SectionCard>
        <SectionCard title="설비/자원 요약" icon="precision_manufacturing">
          <p className="text-sm text-gray-600">
            AGV 50대, OHT 20대. FDC 센서 적용률 80%. 품질 담당 15명, 설비 담당 8명.
          </p>
        </SectionCard>
      </div>
    );
  }

  if (tab === "performance") {
    return (
      <div className="space-y-6">
        <SectionCard title="월간 경영리뷰 템플릿" icon="description">
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• 품질 KPI 실적 vs 목표</li>
            <li>• 고객 불만/요청 사항</li>
            <li>• 시정조치·예방조치 현황</li>
            <li>• 자원·역량 이슈</li>
            <li>• 개선과제 결정사항</li>
          </ul>
        </SectionCard>
        <SectionCard title="주간 리뷰 요약" icon="summarize">
          <p className="text-sm text-gray-600">
            매주 금요일 품질·생산·설비 담당 회의. 알람/이상 이력 검토, 우선조치 항목 선정.
          </p>
        </SectionCard>
      </div>
    );
  }

  if (tab === "improvement") {
    return (
      <div className="space-y-6">
        <SectionCard title="내부심사 흐름" icon="fact_check">
          <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
            <li>심사 계획 수립 (연 1회)</li>
            <li>담당자별 체크리스트 검토</li>
            <li>현장 관찰·인터뷰</li>
            <li>부적합 발견 시 시정조치 요구</li>
            <li>경영검토 회의 보고</li>
          </ol>
        </SectionCard>
        <SectionCard title="부적합 대응 흐름" icon="warning">
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• 부적합 발생 → 즉시 기록 (8D/CAPA)</li>
            <li>• 원인 분석 (5-Why, Fishbone)</li>
            <li>• 시정조치 + 재발방지 조치 수립</li>
            <li>• 효과성 검증 후 종료</li>
          </ul>
        </SectionCard>
      </div>
    );
  }

  return null;
}
