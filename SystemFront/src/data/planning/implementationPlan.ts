/**
 * AURORA Mobility Semicon(AMS) 추진계획서 가상 데이터
 * 2026~2027 추진 (단위: 억원)
 */

export const IMPLEMENTATION_PLAN_META = {
  documentName: "2026~2027 추진계획서",
  baseDate: "2026.01.15",
  department: "PMO",
  version: "1.0",
};

export const GOALS_SCOPE_CSF = {
  goals: [
    "품질·생산·데이터 과제 추진",
    "PPM 80, OTD 95%, 수율 98.5% 달성",
    "IATF/ISO 26262/PPAP·고객 Audit Pass 유지",
  ],
  scope: [
    "제품: PMIC, MCU, SiC, ADAS",
    "품질: 기능안전, PPAP",
    "생산: OSAT/테스트 내재화",
    "데이터: MES/대시보드, 물류(AGV/OHT)",
  ],
  csf: [
    "PMO 주간·월간 리뷰, Stage-Gate 관리",
    "RACI 역할 명확화",
    "ERP/MES/SCADA 연동, 기간별 KPI",
  ],
};

export const ROADMAP_MILESTONES = [
  { quarter: "2026 Q1", items: ["MCU-200 EVT", "PMIC-300 PPAP", "MES 대시보드 1차"] },
  { quarter: "2026 Q2", items: ["SiC DVT", "FT 설비 입고", "OEE/수율 기간별"] },
  { quarter: "2026 Q3", items: ["ADAS EVT", "ASIL-B 검증", "AGV/물류 대시보드"] },
  { quarter: "2026 Q4", items: ["MCU-200 PVT", "Audit 2건 Pass", "PPM/OTD 리뷰"] },
  { quarter: "2027 H1", items: ["SiC 양산", "ASIL-D 대응", "알람/다운타임 대시보드"] },
];

export const WBS_STREAMS = [
  { id: "A", name: "제품 로드맵/테이프아웃", owner: "R&D", deliverables: "PRD, 테이프아웃 일정" },
  { id: "B", name: "기능안전/품질 인증", owner: "품질", deliverables: "ISO 26262 산출물, PPAP 패키지" },
  { id: "C", name: "공급망/장기계약", owner: "구매", deliverables: "웨이퍼/SiC 다중 공급원 확보" },
  { id: "D", name: "OSAT/테스트 내재화", owner: "생산", deliverables: "FT 설비 입고, 수율 개선" },
  { id: "E", name: "수율/PPM 개선", owner: "품질", deliverables: "SPC 룰, 리워크율 1% 이하" },
  { id: "F", name: "MES/대시보드 KPI 구축", owner: "데이터", deliverables: "OEE, PPM, CT, WIP, 물류 대시보드" },
];

export const RACI = [
  { task: "제품 로드맵/테이프아웃", R: "R&D", A: "PMO", C: "품질", I: "생산" },
  { task: "기능안전/품질 인증", R: "품질", A: "PMO", C: "R&D", I: "생산" },
  { task: "공급망/장기계약", R: "구매", A: "PMO", C: "생산", I: "재무" },
  { task: "OSAT/테스트 내재화", R: "생산", A: "PMO", C: "품질", I: "R&D" },
  { task: "MES/대시보드 KPI 구축", R: "데이터", A: "PMO", C: "생산", I: "품질" },
];

export const BUDGET_RESOURCES = {
  manpower: { count: 28, roles: "PMO 2, R&D 8, 품질 6, 생산 8, 데이터 4" },
  cost: [
    { category: "인건비", y2026: 42, y2027: 48 },
    { category: "검증/신뢰성 외주", y2026: 25, y2027: 20 },
    { category: "패키징/테스트 외주", y2026: 35, y2027: 30 },
    { category: "MES/데이터 인프라", y2026: 12, y2027: 10 },
    { category: "교육/인증", y2026: 6, y2027: 5 },
  ],
};

export const KPI_OKR = [
  { kpi: "출하 PPM", target: "≤80", baseline: 95, owner: "품질" },
  { kpi: "OTD(%)", target: "≥95", baseline: 92, owner: "생산" },
  { kpi: "공정 수율(%)", target: "≥98.5", baseline: 97.8, owner: "품질" },
  { kpi: "리워크율(%)", target: "≤1.0", baseline: 1.2, owner: "생산" },
  { kpi: "ASIL 산출물 적합률(%)", target: "100", baseline: 95, owner: "품질" },
  { kpi: "고객 Audit Pass", target: "2건/년", baseline: "1건", owner: "품질" },
  { kpi: "대시보드 가동률(%)", target: "≥99.5", baseline: 98, owner: "데이터" },
];

export const RISK_TOP10 = [
  { rank: 1, risk: "OSAT 리드타임 지연", impact: "중", owner: "구매", mitigation: "이중 파트너 확보" },
  { rank: 2, risk: "ISO 26262 산출물 부적합", impact: "높", owner: "품질", mitigation: "외부 컨설팅" },
  { rank: 3, risk: "SiC substrate 공급 불안", impact: "중", owner: "구매", mitigation: "다중 공급원" },
  { rank: 4, risk: "MES-ERP 연동 지연", impact: "중", owner: "데이터", mitigation: "외주 전문가 투입" },
  { rank: 5, risk: "고객 설계 변경 요청", impact: "저", owner: "R&D", mitigation: "Change Board 운영" },
  { rank: 6, risk: "물류(AGV/OHT) 장애로 WIP 지연", impact: "중", owner: "생산", mitigation: "대시보드 모니터링/예방정비" },
  { rank: 7, risk: "장비 다운타임 증가", impact: "중", owner: "생산", mitigation: "OEE 추적/예방정비" },
  { rank: 8, risk: "PPAP 품질 이슈", impact: "높", owner: "품질", mitigation: "PFMEA/Control Plan 강화" },
  { rank: 9, risk: "인력 이탈", impact: "저", owner: "PMO", mitigation: "교육/성과 인센티브" },
  { rank: 10, risk: "환율 변동", impact: "저", owner: "재무", mitigation: "계약 조항/헤징" },
];

/** 데이터/대시보드 과제 - KPI, 데이터 소스, 업데이트 주기 */
export const DASHBOARD_KPI_SOURCE = [
  { kpi: "OEE", source: "MES/장비 로그", update: "5분", notes: "가동률·성능률·양품률" },
  { kpi: "가동률", source: "SCADA/장비 상태", update: "최신", notes: "설비별" },
  { kpi: "수율", source: "MES/FT 로그", update: "5분", notes: "공정별/제품별" },
  { kpi: "PPM", source: "MES/품질 DB", update: "일배치", notes: "출하/고객" },
  { kpi: "리워크율", source: "MES/공정 로그", update: "일배치", notes: "" },
  { kpi: "CT(Cycle Time)", source: "MES/트랜잭션", update: "5분", notes: "공정별" },
  { kpi: "WIP", source: "MES/재고", update: "최신", notes: "공정별/제품별" },
  { kpi: "장비 다운타임", source: "SCADA/알람 로그", update: "최신", notes: "설비별" },
  { kpi: "알람 Top-N", source: "SCADA/알람 로그", update: "5분", notes: "주간/월간 집계" },
  { kpi: "물류(AGV/OHT) 이슈", source: "MES/물류 로그", update: "최신", notes: "자재/웨이퍼/패키지 이동" },
];
