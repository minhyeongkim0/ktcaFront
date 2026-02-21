/**
 * AURORA Mobility Semicon(AMS) 사업계획서 가상 데이터
 * 2026년 사업계획 + 2026~2028 중기 (단위: 억원)
 */

export const BUSINESS_PLAN_META = {
  documentName: "2026년 사업계획서",
  baseDate: "2026.01.15",
  department: "경영전략팀",
  version: "1.0",
};

export const EXECUTIVE_SUMMARY = {
  summary: [
    "Fabless 자동차용 반도체 (MCU/PMIC/SiC/ADAS 센서 허브)",
    "2026 목표 매출 1,850억원 (+23%), Tier-1/OEM 장기 수주 확대",
    "R&D 18%, CAPEX 120억원·품질·기능안전 강화",
    "PPM 80, OTD 95%, IATF/ISO 26262/PPAP 유지",
    "공급망 다변화·고객 집중도 30% 이하 추진",
  ],
  kpis: [
    { label: "2026 목표 매출", value: "1,850", unit: "억원", trend: "+23%" },
    { label: "출하 PPM 목표", value: "80", unit: "", trend: "" },
    { label: "OTD 목표", value: "95", unit: "%", trend: "" },
    { label: "R&D 비중", value: "18", unit: "%", trend: "" },
    { label: "2026 CAPEX", value: "120", unit: "억원", trend: "" },
    { label: "PPAP 승인", value: "12", unit: "건/년", trend: "" },
  ],
};

export const ORDER_PIPELINE = [
  { customer: "Atlas Auto", product: "PMIC-300", qty: "50만", value: 280, status: "양산중", yyyy: "2026" },
  { customer: "NeoDrive", product: "MCU-200", qty: "80만", value: 420, status: "샘플 검증", yyyy: "2026" },
  { customer: "Tier-1 A", product: "SiC MOSFET", qty: "30만", value: 350, status: "설계완료", yyyy: "2026" },
  { customer: "Tier-1 B", product: "ADAS 허브", qty: "20만", value: 320, status: "EVT", yyyy: "2027" },
  { customer: "OEM C", product: "PMIC-500", qty: "100만", value: 520, status: "견적/협상", yyyy: "2027" },
];

export const REVENUE_BY_PRODUCT = [
  { product: "PMIC", y2025: 420, y2026: 520, y2027: 620, share: "35%" },
  { product: "MCU/SoC", y2025: 380, y2026: 480, y2027: 580, share: "32%" },
  { product: "SiC", y2025: 180, y2026: 280, y2027: 380, share: "18%" },
  { product: "ADAS/센서", y2025: 100, y2026: 170, y2027: 270, share: "15%" },
];

export const CAPEX_PLAN = [
  { category: "검증랩/신뢰성 장비", y2026: 45, y2027: 35, y2028: 25 },
  { category: "FT(최종검사) 내재화", y2026: 35, y2027: 20, y2028: 10 },
  { category: "EDA/시뮬레이션", y2026: 15, y2027: 12, y2028: 10 },
  { category: "MES/데이터 인프라", y2026: 12, y2027: 10, y2028: 8 },
  { category: "기타 설비/인프라", y2026: 13, y2027: 13, y2028: 12 },
];

export const RISK_MATRIX = [
  { risk: "웨이퍼/SiC 공급 차질", probability: "중", impact: "높", owner: "구매", response: "다중 공급원 확보" },
  { risk: "ASIL-D 산출물 적합성", probability: "중", impact: "높", owner: "R&D", response: "외부 인증 컨설팅" },
  { risk: "고객 집중(Atlas 30%)", probability: "저", impact: "중", owner: "영업", response: "신규 OEM/Tier-1 확대" },
  { risk: "환율 변동(USD/KRW)", probability: "중", impact: "중", owner: "재무", response: "헤징/계약조항" },
  { risk: "OSAT 리드타임 지연", probability: "중", impact: "중", owner: "생산", response: "이중 파트너" },
];
