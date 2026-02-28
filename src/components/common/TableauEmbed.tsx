"use client";

import { useRef, useState } from "react";

export interface TableauEmbedProps {
  /** 태블로 뷰 URL (나중에 변경 가능) */
  url?: string;
  /** 높이 (기본 560px) */
  height?: string | number;
  /** 툴바 숨김 (기본 true) */
  hideToolbar?: boolean;
  /** 탭 숨김 (기본 true) */
  hideTabs?: boolean;
  /** URL 없을 때 표시할 플레이스홀더 텍스트 */
  placeholder?: string;
  /** 장비 유형 등 필터 파라미터 (태블로/API 연동 시 URL에 추가) */
  filterParams?: Record<string, string>;
  className?: string;
}

function buildUrlWithParams(url: string, filterParams?: Record<string, string>): string {
  if (!url?.trim()) return url;
  if (!filterParams || Object.keys(filterParams).length === 0) return url.trim();
  const sep = url.includes("?") ? "&" : "?";
  return url.trim() + sep + new URLSearchParams(filterParams).toString();
}

export default function TableauEmbed({
  url,
  height = "560px",
  hideToolbar = true,
  hideTabs = true,
  placeholder = "태블로 URL을 설정해 주세요.",
  filterParams,
  className = "",
}: TableauEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const effectiveUrl = buildUrlWithParams(url ?? "", filterParams);

  const h = typeof height === "number" ? `${height}px` : height;
  const noUrl = !url?.trim();

  if (noUrl) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#1e293b] text-gray-400 dark:text-gray-500 ${className}`}
        style={{ minHeight: h }}
      >
        <span className="text-sm">{placeholder}</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-sm ${className}`}
        style={{ minHeight: h }}
      >
        {loadError}
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-lg overflow-hidden w-full ${className}`}
      style={{ width: "100%", minHeight: h }}
    >
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#1e293b] text-gray-400 dark:text-gray-500 text-sm z-10">
          차트 로딩 중…
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={effectiveUrl}
        title="Tableau chart"
        className="w-full h-full"
        style={{ border: "none", minHeight: h }}
        onLoad={() => setLoaded(true)}
        onError={() => setLoadError("차트를 불러오지 못했습니다.")}
      />
    </div>
  );
}
