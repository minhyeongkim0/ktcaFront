/**
 * ISO Annex SL Clause 4~10 ↔ 대시보드 탭 매핑
 * 한 곳에서 관리, 모달/가이드에서 재사용
 */
export interface MappedTab {
  label: string;
  href?: string;
  disabled?: boolean;
  description: string;
}

export interface IsoClauseMapping {
  clause: number;
  title: string;
  summary: string;
  icon: string;
  tabs: MappedTab[];
}

export const ISO_CLAUSE_MAP: IsoClauseMapping[] = [
  {
    clause: 4,
    title: "조직의 맥락 (Context of the organization)",
    summary: "이해관계자, 내/외부 이슈, 적용범위를 파악합니다.",
    icon: "public",
    tabs: [
      {
        label: "경영 > 회사 개요&이해관계자",
        href: "/management?tab=overview",
        description: "SWOT, 고객/제품, 이해관계자 요구사항을 확인합니다.",
      },
    ],
  },
  {
    clause: 5,
    title: "리더십 (Leadership)",
    summary: "방침/책임/권한을 정의하고 리더십을 보여줍니다.",
    icon: "groups",
    tabs: [
      {
        label: "경영 > 리더십&방침",
        href: "/management?tab=leadership",
        description: "품질/운영 방침, 리더 메시지, 역할·책임 방향성을 확인합니다.",
      },
    ],
  },
  {
    clause: 6,
    title: "기획 (Planning)",
    summary: "리스크/기회 및 목표·계획을 수립합니다.",
    icon: "edit_calendar",
    tabs: [
      {
        label: "경영 > 목표/계획",
        href: "/management?tab=planning",
        description: "품질/운영 목표, 추진계획, 리스크 대응 계획을 확인합니다.",
      },
      {
        label: "설비예지보전 > 예측/진단",
        href: "/fdc?tab=prediction",
        description: "장비 위험도/고장 가능성 예측과 진단 요약을 확인합니다.",
      },
    ],
  },
  {
    clause: 7,
    title: "지원 (Support)",
    summary: "자원/역량, 문서화 정보, 커뮤니케이션을 확보합니다.",
    icon: "support",
    tabs: [
      {
        label: "경영 > 자원/역량",
        href: "/management?tab=resources",
        description: "조직/RACI, 인력·장비·문서화 정보 관리 항목을 확인합니다.",
      },
    ],
  },
  {
    clause: 8,
    title: "운영 (Operation)",
    summary: "계획을 실행하고 운영을 통제합니다.",
    icon: "precision_manufacturing",
    tabs: [
      {
        label: "설비예지보전 > 실시간 관제",
        href: "/fdc?tab=monitoring",
        description: "OHT/AGV 실시간 상태, 로그, 주요 공정·운영 지표를 모니터링합니다.",
      },
      {
        label: "설비예지보전 > 이상/알람",
        href: "/fdc?tab=alarms",
        description: "경고/위험 알람, 이상률, Top 원인과 최근 이벤트를 확인합니다.",
      },
      {
        label: "MES(생산/제조) (준비 중)",
        href: "/mes",
        disabled: true,
        description: "생산지시/추적/재공관리 기능은 현재 미구현입니다.",
      },
    ],
  },
  {
    clause: 9,
    title: "성과평가 (Performance evaluation)",
    summary: "모니터링/측정/분석/내부심사/경영검토로 성과를 평가합니다.",
    icon: "analytics",
    tabs: [
      {
        label: "설비예지보전 > 성능/KPI",
        href: "/fdc?tab=kpi",
        description: "가동률, MTBF/MTTR, 이상률 추이 등 핵심 KPI를 평가합니다.",
      },
      {
        label: "경영 > 성과/리뷰",
        href: "/management?tab=performance",
        description: "주간/월간 리뷰 요약, 경영검토 관점의 성과 정리를 확인합니다.",
      },
    ],
  },
  {
    clause: 10,
    title: "개선 (Improvement)",
    summary: "부적합 대응과 지속적 개선을 수행합니다.",
    icon: "trending_up",
    tabs: [
      {
        label: "설비예지보전 > 개선/조치",
        href: "/fdc?tab=improvement",
        description: "개선조치 이력, 효과성(전/후) 비교, 재발 방지 조치를 확인합니다.",
      },
      {
        label: "경영 > 개선/감사 대응",
        href: "/management?tab=improvement",
        description: "부적합/시정조치 프로세스와 감사 대응 체계를 확인합니다.",
      },
    ],
  },
];

/** 탭별 요약 (모달 하단용) */
export const TAB_SUMMARY = [
  {
    id: "fdc",
    label: "설비 예지보전(FDC)",
    description: "정량(로그/알람/예측/KPI/조치) - 실시간 관제, 이상감지, 예측진단, 성능 KPI, 개선조치",
    href: "/fdc",
    disabled: false,
  },
  {
    id: "management",
    label: "경영(Management)",
    description: "정성/운영체계 - 회사개요, 리더십, 목표·계획, 자원·역량, 성과리뷰, 감사대응",
    href: "/management",
    disabled: false,
  },
  {
    id: "mes",
    label: "MES(생산/제조)",
    description: "미구현 - 데이터 부재로 데모 범위에서 제외됨",
    href: "/mes",
    disabled: true,
  },
];
