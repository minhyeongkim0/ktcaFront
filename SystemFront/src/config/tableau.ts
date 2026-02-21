/** @see isoMapping.ts for ISO Clause mapping */

/**
 * Tableau Public 임베드 URL 설정
 *
 * embed 전용 파라미터: showVizHome=no, embed=yes (필수)
 * env 예시 (.env.local):
 *   NEXT_PUBLIC_TABLEAU_LIGHT_URL=... (전체 URL 지정 시 사용)
 *   NEXT_PUBLIC_TABLEAU_DARK_URL=... (선택)
 *   NEXT_PUBLIC_TABLEAU_HIDE_TOOLBAR=true (QA 시 toolbar 숨김, 범례 공간 확보용)
 */

const WORKBOOK = "OHT_BI_predictions";
const SHEET = "OHT_3";

/** embed 전용 URL로 정규화 (share link → embed URL) */
export function normalizeTableauEmbedUrl(
  baseUrl?: string,
  opts?: { toolbar?: boolean; language?: string }
): string {
  const workbook = WORKBOOK;
  const sheet = SHEET;
  const base = baseUrl ?? `https://public.tableau.com/views/${workbook}/${sheet}`;
  const params = new URLSearchParams();
  params.set(":showVizHome", "no");
  params.set(":embed", "yes");
  params.set(":tabs", "no");
  params.set(":toolbar", opts?.toolbar !== false ? "yes" : "no");
  params.set(":language", opts?.language ?? "ko-KR");
  params.set(":device", "desktop");
  const sep = base.includes("?") ? "&" : "?";
  return base.split("?")[0] + sep + params.toString().replace(/=/g, "=");
}

const BASE_PARAMS = "?:showVizHome=no&:embed=yes&:tabs=no&:toolbar=yes&:language=ko-KR&:device=desktop";
const DEFAULT_BASE =
  `https://public.tableau.com/views/${WORKBOOK}/${SHEET}` + BASE_PARAMS;

function getEnv(name: string): string | undefined {
  if (typeof process === "undefined") return undefined;
  return (process as NodeJS.Process & { env?: Record<string, string> }).env?.[name];
}

function buildLightUrl(): string {
  const custom = getEnv("NEXT_PUBLIC_TABLEAU_LIGHT_URL");
  if (custom) return normalizeTableauEmbedUrl(custom);
  const hideToolbar = getEnv("NEXT_PUBLIC_TABLEAU_HIDE_TOOLBAR") === "true";
  return DEFAULT_BASE.replace(":toolbar=yes", hideToolbar ? ":toolbar=no" : ":toolbar=yes");
}

export const tableauConfig = {
  get lightUrl() {
    return buildLightUrl();
  },
  darkUrl: getEnv("NEXT_PUBLIC_TABLEAU_DARK_URL") || undefined,
} as const;
