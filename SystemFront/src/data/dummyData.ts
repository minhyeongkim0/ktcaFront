/**
 * MES dashboard dummy data (NeoDrive Semiconductor)
 */

export type UserRole = "QMS Admin" | "Production" | "QA";

export const dummyData = {
  accounts: [
    { id: "admin", password: "Admin!1234", name: "Admin(Quality)", role: "QMS Admin", lastLogin: "2026-01-29 09:12" },
    { id: "ops01", password: "Ops!1234", name: "Field Ops", role: "Production", lastLogin: "2026-01-29 08:45" },
    { id: "qa01", password: "Qa!1234", name: "QA", role: "QA", lastLogin: "2026-01-28 18:20" },
  ],
  branding: {
    companyName: "NeoDrive Semiconductor",
    site: "A-Plant (Cheonan)",
    logoWatermark: "neodrive_logo_gray.png",
  },
  header: {
    title: "Integrated Dashboard",
  },
  context: {
    companies: [
      { sideKey: "RawMaterials", companyName: "SiTech Wafer", type: "원자재", founded: "2010", ceo: "김철수", location: "경기 성남", customers: "NeoDrive, AMS", products: "8인치 웨이퍼", capacity: "월 50K wafer", leadTimeDays: 14 },
      { sideKey: "Suppliers", companyName: "OSAT Solutions", type: "납품업체", founded: "2012", ceo: "이영희", location: "충남 천안", customers: "현대차 Tier-1", products: "FT/패키징", capacity: "월 500K units", leadTimeDays: 21 },
      { sideKey: "Headquarters", companyName: "NeoDrive Semiconductor", type: "본사", founded: "2018", ceo: "박대표", location: "충남 천안 A-Plant", customers: "현대자동차, Atlas Auto", products: "MCU, PMIC, SiC", capacity: "월 300K units", leadTimeDays: 7 },
      { sideKey: "Customers", companyName: "현대자동차 / Atlas Auto", type: "고객", founded: "-", ceo: "-", location: "국내/해외", customers: "OEM", products: "자동차", capacity: "-", leadTimeDays: 0 },
    ],
    overviewKpi: [
      { label: "타깃 고객", value: "현대자동차, Atlas Auto", icon: "groups" },
      { label: "주력제품 TOP3", value: "MCU, PMIC, SiC", icon: "inventory_2" },
      { label: "주요 강점", value: "품질/데이터 기반", icon: "star" },
    ],
  },
  leadership: {
    ceoMessage: "품질은 선택이 아닌 필수입니다. 데이터 기반 의사결정으로 고객 신뢰를 구축합니다.",
    qualityPolicy: "고객 요구사항 충족, 지속적 개선, 과정 접근법을 통해 품질경영시스템을 운영합니다.",
    raci: [
      { process: "이상 대응", R: "생산", A: "품질", C: "R&D", I: "PMO" },
      { process: "변경관리", R: "R&D", A: "품질", C: "생산", I: "구매" },
      { process: "내부감사", R: "품질", A: "경영", C: "PMO", I: "전 부서" },
      { process: "시정조치", R: "해당 부서", A: "품질", C: "PMO", I: "경영" },
    ],
  },
  planning: {
    fmea: [
      { process: "FT 검사", failureMode: "프로브 오정렬", effect: "미검출 불량", S: 8, O: 4, D: 5, RPN: 160, action: "정렬 절차 강화", owner: "생산", due: "2026-02" },
      { process: "패키징", failureMode: "외관 불량", effect: "고객 Complain", S: 7, O: 5, D: 4, RPN: 140, action: "검사 체크리스트 보강", owner: "품질", due: "2026-01" },
    ],
    businessPlan: { year: "2026", vision: "자동차용 반도체 리더", keyProducts: ["MCU", "PMIC", "SiC"], targetIndustries: ["EV", "ADAS"], productionGoal: "월 300K", qualityGoal: "PPM 80", capex: "120억원" },
    qualityObjectivePlan: [
      { objective: "PPM 개선", kpi: "출하 PPM", baseline: "95", target: "80", plan: "SPC 강화", owner: "품질", deadline: "2026-06" },
      { objective: "수율 향상", kpi: "공정 수율", baseline: "97.8%", target: "98.5%", plan: "FT 프로세스 개선", owner: "생산", deadline: "2026-03" },
    ],
    riskRegister: [
      { risk: "리콜 리스크", impact: "높", probability: "중", response: "테스트 강화, PPAP 관리" },
      { risk: "공급망 차질", impact: "중", probability: "중", response: "다중 공급원 확보" },
    ],
  },
  support: {
    equipment: [
      { name: "FT 테스터 A", qty: 2, status: "가동중" },
      { name: "프로버 B", qty: 1, status: "가동중" },
      { name: "검사장비 C", qty: 1, status: "점검중" },
    ],
    equipmentNeeded: [
      { name: "고속 프로버", reason: "테스트 용량 확대" },
      { name: "AOI 장비", reason: "외관 검사 자동화" },
    ],
    documents: [
      { name: "품질매뉴얼", type: "절차서", status: "승인", revised: "2025-12-01" },
      { name: "내부감사 절차", type: "절차서", status: "승인", revised: "2025-11-15" },
      { name: "시정조치 양식", type: "양식", status: "승인", revised: "2026-01-10" },
    ],
    orgManpower: { total: 28, depts: "PMO 2, R&D 8, 품질 6, 생산 8, 데이터 4" },
  },
  operation: {},
  performance: {
    kpiBoard: [
      { dept: "품질", kpi: "PPM", target: "80", actual: "85", rate: "94%" },
      { dept: "생산", kpi: "OTD", target: "95%", actual: "93%", rate: "98%" },
      { dept: "품질", kpi: "수율", target: "98.5%", actual: "98.2%", rate: "99.7%" },
    ],
    auditSchedule: [
      { date: "2026-01-15", type: "내부감사", result: "합격", nc: 0, obs: 2, status: "완료" },
      { date: "2026-03-10", type: "고객 Audit", result: "-", nc: 0, obs: 0, status: "예정" },
    ],
    mgmtReview: { issues: ["PPM 개선 필요"], decisions: ["Q2 CAPEX 승인"], actions: ["SPC 룰 개정"] },
  },
  improvement: {
    history: [
      { date: "2026-01-20", target: "FT 수율", cause: "프로브 정렬 불량", action: "정렬 절차 강화", owner: "생산", status: "완료" },
      { date: "2026-01-15", target: "PPM", cause: "외관 검사 누락", action: "검사 체크리스트 보강", owner: "품질", status: "완료" },
      { date: "2026-01-10", target: "OEE", cause: "장비 예열 부족", action: "예열 SOP 수정", owner: "생산", status: "진행중" },
    ],
    effectiveness: { before: { ppm: 95, yield: 97.8, oee: 80 }, after: { ppm: 85, yield: 98.2, oee: 82 } },
  },
  reports: {
    history: [
      { name: "주간보고_2026-W04.pdf", date: "2026-01-27", type: "주간" },
      { name: "월간보고_2026-01.pdf", date: "2026-01-25", type: "월간" },
    ],
  },
  qualityGoals: [
    { goal: "불량률(PPM)", definition: "출하 PPM", cycle: "월", dept: "품질", progress: "on" },
    { goal: "MTBF", definition: "평균고장간격", cycle: "분기", dept: "생산", progress: "on" },
    { goal: "경고비율", definition: "설비 경고/전체", cycle: "주", dept: "데이터", progress: "caution" },
  ],
  uiMenus: { topTabs: [], sideTabs: {} },
};

export type DummyData = typeof dummyData;
export type ModuleId = keyof typeof dummyData.uiMenus.sideTabs;
export interface SideMenuItem { id: string; labelKey: string; icon?: string; }
export const getSideMenuItems = () => [];
export const CONTEXT_SIDE_TO_TYPE = {};
export function getContextCompanyBySideKey(sideKey: string | null) {
  if (!sideKey) return null;
  return dummyData.context.companies.find((c) => (c as { sideKey?: string }).sideKey === sideKey) ?? null;
}
export const sideMenuByModule = {};
