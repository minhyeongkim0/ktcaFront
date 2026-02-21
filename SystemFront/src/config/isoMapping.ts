/**
 * ISO Annex SL Clause 4~10 mapping to dashboard screens
 */
export interface IsoMappingTarget {
  route: string;
  /** 경영: section (context, leadership, planning, support, performance) */
  section?: string;
  /** 경영: 세부 메뉴 ID (RawMaterials, Swot 등) */
  menuId?: string;
  /** FDC: tab (processFlow, monitoring, topN, modeling) */
  tab?: string;
}
export interface IsoMappingItem {
  clause: number;
  titleKo: string;
  titleEn: string;
  descriptionKo: string;
  locationKo: string;
  target: IsoMappingTarget;
}
export const ISO_MAPPING: IsoMappingItem[] = [
  { clause: 4, titleKo: "조직 상황", titleEn: "Context", descriptionKo: "내·외부 이슈, 이해관계자", locationKo: "경영 > 회사/고객·공급망 개요", target: { route: "/management", section: "context", menuId: "RawMaterials" } },
  { clause: 5, titleKo: "리더십", titleEn: "Leadership", descriptionKo: "경영 방침, RACI", locationKo: "경영 > 경영 방침·책임 체계", target: { route: "/management", section: "policy" } },
  { clause: 6, titleKo: "기획", titleEn: "Planning", descriptionKo: "리스크, 품질목표, 사업계획", locationKo: "경영 > 목표·계획·리스크 관리", target: { route: "/management", section: "planning" } },
  { clause: 7, titleKo: "지원", titleEn: "Support", descriptionKo: "조직도, 장비, 문서화", locationKo: "경영 > 자원·역량·문서화", target: { route: "/management", section: "support", menuId: "org" } },
  { clause: 8, titleKo: "운용", titleEn: "Operation", descriptionKo: "공정 흐름, 설비 모니터링", locationKo: "설비 예지보전 > 공정 흐름 / 기간별 모니터링", target: { route: "/fdc", tab: "processFlow" } },
  { clause: 9, titleKo: "성과 평가", titleEn: "Performance", descriptionKo: "KPI 리뷰, 내부감사", locationKo: "경영 > 감사·점검·성과 리뷰", target: { route: "/management", section: "performance" } },
  { clause: 10, titleKo: "개선", titleEn: "Improvement", descriptionKo: "시정조치, 지속개선", locationKo: "경영 > 개선·시정조치 관리", target: { route: "/management", section: "improvement" } },
];
export function buildIsoNavigationUrl(target: IsoMappingTarget): string {
  const params = new URLSearchParams();
  if (target.section) params.set("section", target.section);
  if (target.menuId) params.set("menu", target.menuId);
  if (target.tab) params.set("tab", target.tab);
  const qs = params.toString();
  return qs ? target.route + "?" + qs : target.route;
}
