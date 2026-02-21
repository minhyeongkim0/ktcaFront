/**
 * Management (경영) 영역 더미 데이터
 * ISO Annex SL Clause 4~10 매핑
 */

export const OVERVIEW_KPI = [
  { label: "타깃 고객", value: "현대자동차, Atlas Auto", icon: "groups" },
  { label: "주력제품 TOP3", value: "MCU, PMIC, SiC", icon: "inventory_2" },
  { label: "주요 강점", value: "품질/데이터 기반", icon: "star" },
];

export const SWOT_SUMMARY = {
  strengths: ["품질 인증(IATF/ISO 26262)", "대시보드/FDC 기반 관제"],
  weaknesses: ["테스트 장비 부족"],
  risks: ["리콜 리스크"],
};

export const LEADERSHIP = {
  ceoMessage: "품질은 선택이 아닌 필수입니다. 데이터 기반 의사결정으로 고객 신뢰를 구축합니다.",
  qualityPolicy: "고객 요구사항 충족, 지속적 개선, 과정 접근법을 통해 품질경영시스템을 운영합니다.",
  raci: [
    { process: "이상 대응", R: "생산", A: "품질", C: "R&D", I: "PMO" },
    { process: "변경관리", R: "R&D", A: "품질", C: "생산", I: "구매" },
    { process: "내부감사", R: "품질", A: "경영", C: "PMO", I: "전 부서" },
    { process: "시정조치", R: "해당 부서", A: "품질", C: "PMO", I: "경영" },
  ],
};

export const RISK_REGISTER = [
  { risk: "리콜 리스크", impact: "높", probability: "중", response: "테스트 강화, PPAP 관리" },
  { risk: "공급망 차질", impact: "중", probability: "중", response: "다중 공급원 확보" },
  { risk: "인증 산출물 부적합", impact: "높", probability: "저", response: "외부 컨설팅" },
];

export const KPI_BOARD = [
  { dept: "품질", kpi: "PPM", target: "80", actual: "85", rate: "94%" },
  { dept: "생산", kpi: "OTD", target: "95%", actual: "93%", rate: "98%" },
  { dept: "품질", kpi: "수율", target: "98.5%", actual: "98.2%", rate: "99.7%" },
  { dept: "생산", kpi: "OEE", target: "85%", actual: "82%", rate: "96%" },
];

export const AUDIT_SCHEDULE = [
  { date: "2026-01-15", type: "내부감사", result: "합격", nc: 0, obs: 2, status: "완료" },
  { date: "2026-03-10", type: "고객 Audit", result: "-", nc: 0, obs: 0, status: "예정" },
];

export const MGMT_REVIEW = {
  issues: ["PPM 개선 필요", "테스트 장비 확충 검토"],
  decisions: ["Q2 CAPEX 승인", "외부 컨설팅 진행"],
  actions: ["SPC 룰 개정", "장비 RFQ 발행"],
};

export const IMPROVEMENT_HISTORY = [
  { date: "2026-01-20", target: "FT 수율", cause: "프로브 정렬 불량", action: "정렬 절차 강화", owner: "생산", status: "완료" },
  { date: "2026-01-15", target: "PPM", cause: "외관 검사 누락", action: "검사 체크리스트 보강", owner: "품질", status: "완료" },
  { date: "2026-01-10", target: "OEE", cause: "장비 예열 부족", action: "예열 SOP 수정", owner: "생산", status: "진행중" },
];

export const EFFECTIVENESS_VERIFICATION = {
  before: { ppm: 95, yield: 97.8, oee: 80 },
  after: { ppm: 85, yield: 98.2, oee: 82 },
};

export const REPORT_HISTORY = [
  { name: "주간보고_2026-W04.pdf", date: "2026-01-27", type: "주간" },
  { name: "월간보고_2026-01.pdf", date: "2026-01-25", type: "월간" },
  { name: "주간보고_2026-W03.pdf", date: "2026-01-20", type: "주간" },
];

export const QUALITY_GOALS = [
  { goal: "불량률(PPM)", definition: "출하 PPM", cycle: "월", dept: "품질", progress: "on" },
  { goal: "MTBF", definition: "평균고장간격", cycle: "분기", dept: "생산", progress: "on" },
  { goal: "경고비율", definition: "설비 경고/전체", cycle: "주", dept: "데이터", progress: "caution" },
  { goal: "Audit Pass", definition: "내부/고객 감사 합격", cycle: "연", dept: "품질", progress: "on" },
  { goal: "시정조치 이행률", definition: "완료/총 건수", cycle: "월", dept: "품질", progress: "off" },
];

export const RESOURCE_EQUIPMENT = [
  { name: "FT 테스터 A", qty: 2, status: "가동중" },
  { name: "프로버 B", qty: 1, status: "가동중" },
  { name: "검사장비 C", qty: 1, status: "점검중" },
];

export const RESOURCE_NEEDED = [
  { name: "고속 프로버", reason: "테스트 용량 확대" },
  { name: "AOI 장비", reason: "외관 검사 자동화" },
];

export const DOCUMENTS = [
  { name: "품질매뉴얼", type: "절차서", status: "승인", revised: "2025-12-01" },
  { name: "내부감사 절차", type: "절차서", status: "승인", revised: "2025-11-15" },
  { name: "시정조치 양식", type: "양식", status: "승인", revised: "2026-01-10" },
  { name: "점검 체크리스트", type: "점검표", status: "초안", revised: "-" },
];
