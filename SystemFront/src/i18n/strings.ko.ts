/**
 * MES 대시보드 UI 문자열 카탈로그 (한국어)
 * i18n 토글 추가 전, 텍스트 통일용. 키 기반으로 정리하여 향후 다국어 전환 용이.
 */

export const strings = {
  /** 상단 네비게이션 */
  nav: {
    organization: "조직 상황",
    leadership: "리더십",
    planning: "기획",
    support: "지원",
    operation: "운용",
    performance: "성과평가",
    improvement: "개선",
  },

  /** 사이드 메뉴 */
  sideMenu: {
    menu: "메뉴",
    noItems: "메뉴 항목 없음",
    selectSubmenu: "서브메뉴를 선택하세요",
    selectSubmenuDesc: "좌측 메뉴에서 항목을 선택하세요.",
    noMenuSelected: "메뉴 미선택",
    noMenuSelectedDesc: "상단 탭에서 메뉴를 선택하면 상세 화면을 볼 수 있습니다.",
    selectFromContext: "좌측 메뉴에서 원자재업체 / 납품업체 / 본사 / 고객 중 하나를 선택하세요.",
  },

  /** 조직 상황(Org) */
  org: {
    rawMaterial: "원자재업체",
    suppliers: "납품업체",
    headquarters: "본사",
    customers: "고객",
    swot: "SWOT 분석",
    swotSubtitle: "현대자동차 납품 기준의 품질/리콜 리스크를 중심으로 정리",
    exportReport: "보고서 내보내기",
  },

  /** 기획 */
  planning: {
    fmea: "FMEA (리스크평가)",
    businessPlan: "사업계획",
    implementationPlan: "추진계획",
    executiveSummary: "Executive Summary",
  },

  /** 지원 */
  support: {
    orgChart: "조직도",
    equipment: "장비 관리",
    equipmentDesc: "생산 설비의 상태, 성능, 정비 일정을 확인합니다.",
    filter: "필터",
    addEmployee: "직원 추가",
    registerEquipment: "장비 등록",
    totalEquipment: "총 설비",
    operationRate: "가동률",
    maintenanceDue: "정비 예정",
    powerUsage: "전력 사용량",
  },

  /** 운용 */
  operation: {
    flow: "공정흐름도",
    agv: "AGV 설비 관제",
    oht: "OHT 설비 관제",
    qc7: "QC 7도구 (관리도·파레토)",
  },

  /** 성과평가 */
  performance: {
    monitor: "모니터링",
    weeklyReport: "주간보고서",
    monthlyReport: "월간보고서",
    kpiEval: "KPI평가",
    employeeKpi: "작업자 KPI",
  },

  /** 개선 */
  improvement: {
    capa: "개선조치 이력관리",
    effectiveness: "효과성 검증",
    capaLog: "CAPA 로그",
    defectsBeforeAfter: "불량 전/후",
  },

  /** 공통 */
  common: {
    search: "검색",
    searchPlaceholder: "검색...",
    searchEquipment: "설비명, ID, 스펙으로 검색...",
    filter: "필터",
    export: "내보내기",
    refresh: "새로고침",
    download: "다운로드",
    status: "상태",
    type: "유형",
    all: "전체",
  },

  /** 상태 */
  state: {
    loading: "불러오는 중",
    empty: "데이터 없음",
    error: "오류 발생",
    noSearchResult: "검색 결과 없음",
    systemOperational: "시스템 가동 중",
    realtimeData: "최신 상태",
    qualityChecks: "품질 점검",
    optimization: "최적화",
  },

  /** 심각도/상태 배지 */
  severity: {
    normal: "정상",
    warning: "경고",
    caution: "주의",
    critical: "심각",
  },

  /** 상태 범례 */
  statusLegend: {
    online: "온라인",
    away: "부재",
    offline: "오프라인",
  },

  /** 헤더/레이아웃 */
  header: {
    title: "MES 품질관리",
    dashboard: "MES 대시보드",
    welcome: "MES 대시보드에 오신 것을 환영합니다",
    welcomeDesc: "상단 탭에서 모듈을 선택하여 작업을 시작하세요.",
    plantManager: "공장관리자",
  },

  /** 리더십 */
  leadership: {
    title: "리더십 & 헌신",
  },
} as const;

export type Strings = typeof strings;
