/**
 * AGV / OHT 설비별 Tableau 대시보드 설정
 * 각 설비마다 3개 대시보드 슬롯 (URL 없으면 placeholder)
 */

const EMBED_PARAMS = "?:showVizHome=no&:embed=yes&:tabs=no&:toolbar=yes&:language=ko-KR";

export interface TableauDashboardItem {
  id: string;
  title: string;
  /** Tableau Public embed URL. 없으면 placeholder 표시 */
  url?: string;
  /** 데스크탑 권장 높이(px). 절대 잘리지 않도록 보수적으로 설정 */
  heightDesktop?: number;
  /** 모바일 권장 높이(px) */
  heightMobile?: number;
}

/** AGV 설비 대시보드 3개 */
export const AGV_DASHBOARDS: TableauDashboardItem[] = [
  { id: "agv-1", title: "AGV 운행 현황", url: undefined },
  { id: "agv-2", title: "AGV 장애·이상 감지", url: undefined },
  { id: "agv-3", title: "AGV 가동률·효율", url: undefined },
];

/** FDC 기간별 설비 상태 모니터링 (메인 슬롯) */
export const FDC_MONITORING_DASHBOARD: TableauDashboardItem = {
  id: "fdc_monitoring",
  title: "기간별 설비 상태 모니터링",
  url: `https://public.tableau.com/views/OHT_BI/OHT${EMBED_PARAMS}`,
  heightDesktop: 1100,
  heightMobile: 1400,
};

/** OHT 설비 대시보드 3개 */
export const OHT_DASHBOARDS: TableauDashboardItem[] = [
  { id: "oht-1", title: "OHT 운행 현황", url: undefined },
  {
    id: "oht_anomaly",
    title: "예측 기반 이상/위험 탐지 관제",
    url: `https://public.tableau.com/views/OHT_BI_predictions/OHT_3${EMBED_PARAMS}`,
    heightDesktop: 1400,
    heightMobile: 1600,
  },
  {
    id: "oht_live",
    title: "기간별 OHT 상태 모니터링",
    url: `https://public.tableau.com/views/OHT_BI/OHT${EMBED_PARAMS}`,
    heightDesktop: 1200,
    heightMobile: 1500,
  },
];
