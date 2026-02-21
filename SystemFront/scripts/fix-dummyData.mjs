import { writeFileSync } from "fs";

// Fix orgChart.ts
const orgChartContent = `/**
 * 조직도(Org Chart) 인력 데이터 - React Flow 시각화용
 * 전화/이메일은 가상 값(개인정보 이슈 방지)
 */

export interface OrgPerson {
  id: string;
  name: string;
  title: string;
  department: string;
  tenureYears: number;
  phone: string;
  email: string;
}

export interface OrgDept {
  id: string;
  nameKo: string;
  nameEn: string;
  roleSummary: string;
  employees: OrgPerson[];
}

export interface OrgCeo {
  id: string;
  name: string;
  title: string;
  tenureYears: number;
  phone: string;
  email: string;
}

export interface OrgChartData {
  ceo: OrgCeo;
  departments: OrgDept[];
}

function fakePhone(id: string): string {
  const n = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return \`010-\${String(1000 + (n % 9000))}-\${String(1000 + (n % 9000))}\`;
}

function fakeEmail(id: string, name: string): string {
  const local = name.replace(/\\s/g, ".").toLowerCase().replace(/[^a-z.]/g, "");
  return \`\${local || id}@qms.local\`;
}

export const orgChartData = {
  ceo: {
    id: "ceo-1",
    name: "김도현",
    title: "대표이사",
    tenureYears: 15,
    phone: "010-1234-5678",
    email: "ceo@qms.local",
  },
  departments: [
    {
      id: "dept-rd",
      nameKo: "연구개발",
      nameEn: "R&D",
      roleSummary: "제품·공정 연구개발",
      employees: [
        { id: "emp-os", name: "오세훈", title: "팀장", department: "연구개발", tenureYears: 12, phone: fakePhone("emp-os"), email: fakeEmail("emp-os", "Oh Se-hoon") },
        { id: "emp-jg", name: "정가은", title: "선임", department: "연구개발", tenureYears: 4, phone: fakePhone("emp-jg"), email: fakeEmail("emp-jg", "Jung Ga-eun") },
        { id: "emp-hj", name: "한지민", title: "연구원", department: "연구개발", tenureYears: 2, phone: fakePhone("emp-hj"), email: fakeEmail("emp-hj", "Han Ji-min") },
      ],
    },
    {
      id: "dept-purch",
      nameKo: "구매",
      nameEn: "Purchasing",
      roleSummary: "원자재·자재 구매",
      employees: [
        { id: "emp-kn", name: "김나영", title: "팀장", department: "구매", tenureYears: 7, phone: fakePhone("emp-kn"), email: fakeEmail("emp-kn", "Kim Na-young") },
        { id: "emp-yt", name: "윤태호", title: "대리", department: "구매", tenureYears: 4, phone: fakePhone("emp-yt"), email: fakeEmail("emp-yt", "Yoon Tae-ho") },
        { id: "emp-lms", name: "이민설", title: "주임", department: "구매", tenureYears: 3, phone: fakePhone("emp-lms"), email: fakeEmail("emp-lms", "Lee Min-seol") },
      ],
    },
    {
      id: "dept-prod",
      nameKo: "생산",
      nameEn: "Production",
      roleSummary: "생산·가공 관리",
      employees: [
        { id: "emp-pk", name: "박경수", title: "팀장", department: "생산", tenureYears: 10, phone: fakePhone("emp-pk"), email: fakeEmail("emp-pk", "Park Kyung-rim") },
        { id: "emp-lj", name: "이주원", title: "주임", department: "생산", tenureYears: 5, phone: fakePhone("emp-lj"), email: fakeEmail("emp-lj", "Lee Joo-byung") },
        { id: "emp-cm", name: "최민준", title: "엔지니어", department: "생산", tenureYears: 2, phone: fakePhone("emp-cm"), email: fakeEmail("emp-cm", "Choi Min-jun") },
        { id: "emp-kh", name: "김민늘", title: "엔지니어", department: "생산", tenureYears: 1, phone: fakePhone("emp-kh"), email: fakeEmail("emp-kh", "Kim Ha-neul") },
      ],
    },
    {
      id: "dept-qc",
      nameKo: "품질관리",
      nameEn: "Quality Control",
      roleSummary: "품질·검사 인증",
      employees: [
        { id: "emp-ps", name: "박소영", title: "팀장", department: "품질관리", tenureYears: 8, phone: fakePhone("emp-ps"), email: fakeEmail("emp-ps", "Park So-yeon") },
        { id: "emp-cy", name: "최유진", title: "선임", department: "품질관리", tenureYears: 5, phone: fakePhone("emp-cy"), email: fakeEmail("emp-cy", "Choi Yu-jin") },
        { id: "emp-lh", name: "윤한수", title: "분석", department: "품질관리", tenureYears: 2, phone: fakePhone("emp-lh"), email: fakeEmail("emp-lh", "Lee Han-sol") },
      ],
    },
  ],
};
`;
writeFileSync("src/data/support/orgChart.ts", orgChartContent, "utf8");
console.log("orgChart.ts fixed");

// Fix dummyData (minimal - need to expand for full app)
const content = `/**
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
  context: { companies: [] },
  leadership: {},
  planning: {},
  support: {},
  operation: {},
  performance: {},
  improvement: {},
  uiMenus: { topTabs: [], sideTabs: {} },
};

export type DummyData = typeof dummyData;
export type ModuleId = keyof typeof dummyData.uiMenus.sideTabs;
export interface SideMenuItem { id: string; labelKey: string; icon?: string; }
export const getSideMenuItems = () => [];
export const CONTEXT_SIDE_TO_TYPE = {};
export function getContextCompanyBySideKey() { return null; }
export const sideMenuByModule = {};
`;

writeFileSync("src/data/dummyData.ts", content, "utf8");
console.log("dummyData.ts fixed (minimal)");

// Fix ko.ts - minimal complete locale
const koContent = `/** Korean locale - restored */\nexport const ko = { nav: { home: "홈", fdc: "설비 예지보전", management: "경영", mes: "MES" }, header: { title: "통합 대시보드", titleFdc: "설비 예지보전(FDC)", titleManagement: "경영(Management)", titleMes: "MES(생산/제조) - 준비 중", plantManager: "공장관리자", switchToEn: "영어로 전환", switchToKo: "한국어로 전환" }, lang: { ko: "한국어", en: "English", switchKo: "KO", switchEn: "EN" }, auth: { id: "ID", password: "비밀번호", login: "로그인", logout: "로그아웃", invalidCredentials: "ID 또는 비밀번호가 올바르지 않습니다." }, sideMenu: { menu: "메뉴", noItems: "메뉴 항목 없음", selectSubmenu: "서브메뉴를 선택하세요", selectSubmenuDesc: "좌측 메뉴에서 항목을 선택하세요.", noMenuSelected: "메뉴 미선택", noMenuSelectedDesc: "상단 탭에서 메뉴를 선택하면 상세 화면을 볼 수 있습니다.", selectFromContext: "좌측 메뉴에서 원자재업체 / 납품업체 / 본사 / 고객 중 하나를 선택하세요." }, state: { loading: "불러오는 중", empty: "데이터 없음", error: "오류 발생", retry: "재시도", noSearchResult: "검색 결과 없음" }, common: { search: "검색", searchPlaceholder: "검색...", searchEquipment: "설비명, ID, 스펙으로 검색...", searchCapa: "설비명 / 원인 / 조치 / 담당자 검색", filter: "필터", export: "내보내기", refresh: "새로고침", download: "다운로드", close: "닫기", confirm: "확인", status: "상태", type: "유형", all: "전체", capacity: "용량", leadTime: "리드타임", products: "제품", location: "위치", days: "일", units: "대", oee: "OEE", breadcrumb: "브레드크럼" }, org: { rawMaterial: "원자재업체", suppliers: "납품업체", headquarters: "본사", customers: "고객", swot: "SWOT 분석", swotSubtitle: "품질/리콜 리스크 중심", exportReport: "보고서 내보내기" }, context: { rawMaterialCommitmentDesc: "고품질 웨이퍼 공급과 안정적인 납기를 약속합니다.", noRawMaterialCompany: "선택된 원자재업체 정보가 없습니다.", capacityWafer: "월 {{count}}장(wafer)", capacityModule: "월 {{count}}EA(모듈)", capacityPackage: "월 {{count}}EA(패키지 기준)", supplyCommitment: "공급 약속", supplyAndCapacity: "공급 및 용량", keyCustomers: "주요 고객", supplierKpis: "공급업체 KPI", lastAuditStatus: "최근 감사 결과", lastAuditDesc: "최근 품질 감사 결과입니다.", auditPass: "합격", qualityRating: "품질 등급", qualityRatingDesc: "공급업체 품질 등급.", avgLeadTime: "평균 리드타임", founded: "설립", partnership: "파트너십", keyInfo: "주요 정보", keyContact: "주요 담당", productsSegment: "제품/세그먼트", productsServices: "제품/서비스", related: "관련", partnerKpis: "파트너 KPI", partnershipStatus: "파트너십 상태", activePartner: "활성 파트너", active: "활성", qualityAsPromise: "품질 약속", productLineup: "제품 라인업", qualityKpis: "품질 KPI", productionYield: "생산 수율", lineYieldDesc: "현재 라인 수율.", internalQualityDesc: "내부 품질 등급.", excellent: "우수", efficiencyRate: "효율률", industry: "산업: 자동차 제조", auditDate: "감사 일자: 2024-01-15", qualityTarget: "목표: A (90%)" }, support: { orgChart: "조직도", orgChartIntro: "ISO Annex SL 운영체계를 지원하기 위한 역할/책임(RACI) 기반 구조입니다.", orgDirectoryTitle: "조직도(디렉터리)", orgDirectoryIntro: "ISO Annex SL 운영체계를 지원하기 위한 역할/책임(RACI) 기반 조직 디렉터리입니다.", totalPeople: "총 인원", departmentCount: "부서 수", raciKeyRoles: "핵심 역할(R/A)", lastUpdated: "업데이트 기준", filterDept: "부서", filterTitle: "직책", filterRaci: "RACI 역할", sortBy: "정렬", sortByName: "이름", sortByTenure: "근속", sortByTitle: "직책", sortByDepartment: "부서", ascending: "오름차순", descending: "내림차순", resetFilters: "초기화", noMatchingPeople: "조건에 해당하는 인원이 없습니다.", dirName: "이름", dirTitle: "직책", dirDepartment: "부서", dirTenure: "근속(년)", dirContact: "연락처", dirEmail: "이메일", dirRaciSummary: "RACI", dirRoleSummary: "담당 업무", equipment: "장비 관리", equipmentDesc: "생산 설비의 상태, 성능, 정비 일정을 확인합니다." }, planning: { fmea: "FMEA (리스크평가)", businessPlan: "사업계획", implementationPlan: "추진계획", executiveSummary: "Executive Summary" }, management: { overview: "회사 개요", isoGuide: "운영체계(ISO)", organization: "조직/RACI", qualityGoals: "품질 목표" }, home: { title: "통합 대시보드", subtitle: "업무 영역을 선택하세요.", fdcTitle: "설비 예지보전(FDC)", fdcDesc: "기간별 관제", managementTitle: "경영(Management)", managementDesc: "회사 개요", mesTitle: "MES(생산/제조)", mesDesc: "준비 중", guidelineButton: "가이드라인", enter: "바로 가기" }, fdc: { monitoring: "기간별 설비 상태 모니터링", alarms: "이상/알람", prediction: "예측/진단", reports: "리포트", assets: "자산/장비" }, mes: { title: "MES 모듈", description: "준비 중", goHome: "홈으로", goFdc: "설비 예지보전으로" }, swot: { recallRiskDriver: "리콜 리스크", testGap: "테스트 갭", top6Actions: "Top 6 과제", driver: "리스크 드라이버", indicator: "지표", responseProcess: "대응 프로세스", sla: "목표", gap: "갭", impact: "영향", current: "현재", target: "목표", actionPlan: "조치", timeline: "타임라인", linkedActions: "연결 과제" }, table: { status: "상태", time: "시간", equipment: "설비", line: "라인", yield: "수율", ppm: "PPM", date: "일자", owner: "담당", action: "조치", rootCause: "근본원인", defectType: "불량 유형" }, leadership: { title: "리더십 & 헌신" }, guideline: { heroLabel: "ISO 가이드라인", heroTitle: "통합 대시보드", heroSubtitle: "Annex SL 기반 구조" } };\n`;
writeFileSync("src/i18n/locales/ko.ts", koContent, "utf8");
console.log("ko.ts fixed");

// Fix en.ts
const enContent = `export const en = { nav: { home: "Home", fdc: "Equipment (FDC)", management: "Governance", mes: "MES" }, header: { title: "Integrated Dashboard", titleFdc: "Equipment Predictive Maintenance (FDC)", titleManagement: "Governance (Management)", titleMes: "MES (Production) - Coming Soon", plantManager: "Plant Manager", switchToEn: "Switch to English", switchToKo: "Switch to Korean" }, lang: { ko: "Korean", en: "English", switchKo: "KO", switchEn: "EN" }, auth: { id: "ID", password: "Password", login: "Login", logout: "Logout", invalidCredentials: "Invalid ID or password." }, sideMenu: { menu: "Menu", noItems: "No items", selectSubmenu: "Select a submenu", selectSubmenuDesc: "Choose an item from the left menu.", noMenuSelected: "No Menu Selected", noMenuSelectedDesc: "Select a menu from the top tabs.", selectFromContext: "Select one of Raw Material / Suppliers / Headquarters / Customers." }, state: { loading: "Loading", empty: "No data", error: "Error", retry: "Retry", noSearchResult: "No search results" }, common: { search: "Search", searchPlaceholder: "Search...", searchEquipment: "Search by name, ID, or spec...", searchCapa: "Search by equipment / cause / action / owner", filter: "Filter", export: "Export", refresh: "Refresh", download: "Download", close: "Close", confirm: "Confirm", status: "Status", type: "Type", all: "All", capacity: "Capacity", leadTime: "Lead Time", products: "Products", location: "Location", days: "days", units: "units", oee: "OEE", breadcrumb: "Breadcrumb" }, org: { rawMaterial: "Raw Material", suppliers: "Suppliers", headquarters: "Headquarters", customers: "Customers", swot: "SWOT Analysis", swotSubtitle: "Quality/recall risk", exportReport: "Export Report" }, context: { rawMaterialCommitmentDesc: "We promise high-quality wafer supply.", noRawMaterialCompany: "No raw material company selected.", capacityWafer: "{{count}} wafer/month", capacityModule: "{{count}} modules/month", capacityPackage: "{{count}} pcs/month", supplyCommitment: "Supply Commitment", supplyAndCapacity: "Supply & Capacity", keyCustomers: "Key Customers", supplierKpis: "Supplier KPIs", lastAuditStatus: "Last Audit Status", lastAuditDesc: "Most recent quality audit result.", auditPass: "PASS", qualityRating: "Quality Rating", qualityRatingDesc: "Supplier quality grade.", avgLeadTime: "Avg. Lead Time", founded: "Founded", partnership: "Partnership", keyInfo: "Key Info", keyContact: "Key Contact", productsSegment: "Products / Segment", productsServices: "Products / Services", related: "Related", partnerKpis: "Partner KPIs", partnershipStatus: "Partnership Status", activePartner: "Active partner", active: "Active", qualityAsPromise: "Quality as a Promise", productLineup: "Product Lineup", qualityKpis: "Quality KPIs", productionYield: "Production Yield", lineYieldDesc: "Current line yield.", internalQualityDesc: "Internal quality grade.", excellent: "Excellent", efficiencyRate: "Efficiency Rate", industry: "Industry: Automotive", auditDate: "Audit date: 2024-01-15", qualityTarget: "Target: A (90%)" }, support: { orgChart: "Organization Chart", orgChartIntro: "RACI-based structure for ISO Annex SL.", orgDirectoryTitle: "Organization Directory", orgDirectoryIntro: "RACI-based organization directory.", totalPeople: "Total People", departmentCount: "Departments", raciKeyRoles: "Key Roles (R/A)", lastUpdated: "Last Updated", filterDept: "Department", filterTitle: "Title", filterRaci: "RACI Role", sortBy: "Sort", sortByName: "Name", sortByTenure: "Tenure", sortByTitle: "Title", sortByDepartment: "Department", ascending: "Ascending", descending: "Descending", resetFilters: "Reset", noMatchingPeople: "No people match the filters.", dirName: "Name", dirTitle: "Title", dirDepartment: "Department", dirTenure: "Tenure (yr)", dirContact: "Contact", dirEmail: "Email", dirRaciSummary: "RACI", dirRoleSummary: "Role Summary", equipment: "Equipment Management", equipmentDesc: "Monitor status and maintenance." }, planning: { fmea: "FMEA", businessPlan: "Business Plan", implementationPlan: "Implementation Plan", executiveSummary: "Executive Summary" }, management: { overview: "Company Overview", isoGuide: "ISO Guide", organization: "Organization", qualityGoals: "Quality Goals" }, home: { title: "Integrated Dashboard", subtitle: "Select your area.", fdcTitle: "Equipment (FDC)", fdcDesc: "Monitoring", managementTitle: "Governance", managementDesc: "Company overview", mesTitle: "MES (Production)", mesDesc: "Coming Soon", guidelineButton: "Guideline", enter: "Enter" }, fdc: { monitoring: "Equipment Status", alarms: "Alarms", prediction: "Prediction", reports: "Reports", assets: "Assets" }, mes: { title: "MES Module", description: "Coming Soon", goHome: "Go to Home", goFdc: "Go to Equipment" }, swot: { recallRiskDriver: "Recall Risk", testGap: "Test Gap", top6Actions: "Top 6 Actions", driver: "Risk Driver", indicator: "Indicator", responseProcess: "Response", sla: "Target", gap: "Gap", impact: "Impact", current: "Current", target: "Target", actionPlan: "Action", timeline: "Timeline", linkedActions: "Linked Actions" }, table: { status: "Status", time: "Time", equipment: "Equipment", line: "Line", yield: "Yield", ppm: "PPM", date: "Date", owner: "Owner", action: "Action", rootCause: "Root Cause", defectType: "Defect Type" }, leadership: { title: "Leadership" }, guideline: { heroLabel: "ISO Guideline", heroTitle: "Integrated Dashboard", heroSubtitle: "Annex SL structure" } };\n`;
writeFileSync("src/i18n/locales/en.ts", enContent, "utf8");
console.log("en.ts fixed");
