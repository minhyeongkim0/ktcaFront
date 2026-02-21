/**
 * SWOT 분석 가상 데이터 (AMS 자동차용 반도체)
 * 현대자동차 납품 기준 품질/리콜 리스크 중심
 */

export const SWOT_META = {
  baseDate: "2026.02",
  version: "1.0",
};

export const EXECUTIVE_SUMMARY = {
  summary: [
    "강점: 품질 중심 운영 + MES/대시보드 기반 품질관리, 현대차 PPAP/감사 대응 역량",
    "약점: FT/신뢰성 장비 부족, 테스트 커버리지 제한(78%), 공급망 다양화 미흡",
    "기회: EV/ADAS 수요 확대, 현대차 Tier-1 장기 계약, 신규 OEM 확대",
    "위협: 리콜 리스크(필드 불량·SW/FW 오류), 원자재 가격·환율 변동, 경쟁 심화",
    "핵심 대응: 72h 이내 리콜 대응, 테스트 커버리지 90% 확보, 대시보드 모니터링 강화",
  ],
  kpis: [
    { label: "출하 PPM", value: "120→60", unit: "", trend: "2025→2026" },
    { label: "공정 수율", value: "96.8→98.2", unit: "%", trend: "" },
    { label: "OTD", value: "92→97", unit: "%", trend: "" },
    { label: "리드타임", value: "18→14", unit: "일", trend: "" },
    { label: "리콜 대응", value: "72h", unit: "이내 격리/분석", trend: "" },
    { label: "테스트 커버리지", value: "78→90", unit: "%", trend: "" },
  ],
};

export type SwotCardType = "strength" | "weakness" | "opportunity" | "threat";

export interface SwotCardData {
  type: SwotCardType;
  title: string;
  summary: string;
  metrics: string[];
  priority: "H" | "M" | "L";
  linkedActions: string[];
}

export const SWOT_CARDS: SwotCardData[] = [
  {
    type: "strength",
    title: "강점 (Strength)",
    summary: "품질 중심 운영 + MES/대시보드 기반 품질관리로 현대차 PPAP·감사 대응 역량 보유",
    metrics: ["PPAP 승인률 98%", "고객 Audit Pass 2건/년", "IATF/ISO 26262 인증"],
    priority: "H",
    linkedActions: ["대시보드 KPI(OEE/PPM/CT) 확대", "SPC 룰 강화", "Traceability(LOT) 연동"],
  },
  {
    type: "weakness",
    title: "약점 (Weakness)",
    summary: "FT·신뢰성 장비 부족으로 테스트 커버리지 78%, 공급망 다양화 미흡",
    metrics: ["테스트 커버리지 78%", "FT 설비 2대(병목)", "OSAT 의존 85%"],
    priority: "H",
    linkedActions: ["FT 내재화 1라인 증설", "신뢰성 장비 투자", "OSAT 이중 파트너 확보"],
  },
  {
    type: "opportunity",
    title: "기회 (Opportunity)",
    summary: "EV/ADAS 수요 확대, 현대차 Tier-1 장기 계약, 신규 OEM 확대 가능",
    metrics: ["EV PMIC 수요 +25% YoY", "장기 수주 3건 협상중", "OEM 2사 견적 진행"],
    priority: "M",
    linkedActions: ["장기 계약 체결", "신규 OEM PPAP 준비", "ECR/ECO 변경관리 체계화"],
  },
  {
    type: "threat",
    title: "위협 (Threat)",
    summary: "리콜 리스크(필드 불량·SW/FW 오류)가 최대 위협, 원자재·환율 변동",
    metrics: ["리콜 72h 대응 SLA", "SW/FW 오류 Zero", "LOT 추적 100%"],
    priority: "H",
    linkedActions: ["72h 내 격리·FA·CAPA 착수", "8D/CAPA 프로세스 고도화", "대시보드 알람·이상탐지"],
  },
];

/** 리콜 리스크 드라이버 & 방어 체계 */
export const RECALL_RISK_TABLE = [
  { driver: "Escape defect (출하 전 미탐지)", indicator: "PPM·FT 커버리지", process: "SPC·테스트 강화", owner: "품질", sla: "PPM≤60" },
  { driver: "SW/FW 오류", indicator: "변경관리·릴리스", process: "ECR/ECO·버전 잠금", owner: "R&D", sla: "변경 100% 승인" },
  { driver: "공정 변동", indicator: "수율·알람 Top-N", process: "대시보드 모니터링·CAPA", owner: "공정", sla: "24h 이내 조치" },
  { driver: "공급망 변경", indicator: "공급사 Audit·PPAP", process: "PPAP 재승인·LOT 추적", owner: "SCM", sla: "변경 시 PPAP" },
  { driver: "EOL 부품", indicator: "재고·LOT 추적", process: "EOL 관리·대체품 검증", owner: "구매", sla: "6개월 전 통보" },
];

/** 테스트/신뢰성 갭 & 투자/완화 계획 */
export const TEST_GAP_TABLE = [
  { gap: "FT 설비 부족", impact: "병목·리드타임", current: "78%", target: "90%", action: "FT 1라인 내재화", timeline: "2026 Q2" },
  { gap: "신뢰성 장비 부족", impact: "ASIL 검증 지연", current: "2대", target: "4대", action: "검증랩 장비 증설", timeline: "2026 Q3" },
  { gap: "테스트 커버리지", impact: "Escape risk", current: "78%", target: "90%", action: "테스트 레시피 확장", timeline: "2026 Q4" },
  { gap: "외주 FT 의존", impact: "리드타임·품질", current: "85%", target: "60%", action: "내재화·이중 파트너", timeline: "2027 H1" },
];

/** Top 6 실행 과제 */
export const TOP_ACTIONS = [
  { title: "72h 리콜 대응 체계", desc: "필드 이슈 발생 시 72h 이내 격리·FA·CAPA 착수. 8D 프로세스 고도화.", kpi: "대응율 100%", deadline: "2026 Q2", owner: "품질" },
  { title: "FT 내재화 1라인 증설", desc: "테스트 장비 투자로 커버리지 78%→90% 달성. 병목 해소.", kpi: "커버리지 90%", deadline: "2026 Q2", owner: "공정" },
  { title: "데이터/대시보드 기반 품질관리", desc: "PPM·수율·리워크율·다운타임·알람 Top-N·CT·WIP KPI 수집. ERP/MES/SCADA/LOG 연동.", kpi: "PPM·수율·리워크율·다운타임·알람 Top-N·CT·WIP / 기간별(초/분)·5분·일배치", deadline: "2026 Q1", owner: "데이터" },
  { title: "Traceability(LOT) 연동", desc: "LOT 추적 100%. PPAP·변경관리(ECR/ECO) 체계화.", kpi: "LOT 추적 100%", deadline: "2026 Q3", owner: "SCM" },
  { title: "OSAT 이중 파트너", desc: "공급망 다변화. 현재 85% 의존→60%로 축소.", kpi: "외주 60%", deadline: "2027 H1", owner: "SCM" },
  { title: "SPC·알람 룰 강화", desc: "공정 이상 조기 탐지. 대시보드 알람 Top-N·이상탐지 모니터링.", kpi: "24h 조치율 95%", deadline: "2026 Q2", owner: "품질" },
];
