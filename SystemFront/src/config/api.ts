/**
 * FDC API 설정
 *
 * .env.local 예시:
 *   NEXT_PUBLIC_API_URL=http://localhost:8000
 *
 * 우선순위: 1) process.env.NEXT_PUBLIC_API_URL  2) 기본값 http://localhost:8000
 */
const DEFAULT_API_URL = "http://localhost:8000";

export function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL;
  const trimmed = String(url).trim();
  return trimmed || DEFAULT_API_URL;
}

/** 클라이언트: proxy 사용 시 /api/fdc 경로 (CORS 우회) */
export const FDC_API_BASE = "/api/fdc";
