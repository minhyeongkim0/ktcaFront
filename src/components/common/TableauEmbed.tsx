"use client";

import { useEffect, useRef, useState } from "react";

const TABLEAU_SCRIPT_ID = "tableau-js-api";
const TABLEAU_SCRIPT_URL = "https://public.tableau.com/javascripts/api/tableau-2.min.js";

declare global {
  interface Window {
    tableau?: {
      Viz: new (
        containerDiv: HTMLElement,
        url: string,
        options: { hideTabs?: boolean; hideToolbar?: boolean; width?: string; height?: string }
      ) => { dispose: () => void };
    };
  }
}

export interface TableauEmbedProps {
  /** 태블로 뷰 URL (나중에 변경 가능) */
  url?: string;
  /** 높이 (기본 420px) */
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

function loadTableauScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.tableau) return Promise.resolve();
  const existing = document.getElementById(TABLEAU_SCRIPT_ID);
  if (existing) {
    return new Promise((resolve) => {
      if (window.tableau) resolve();
      else existing.addEventListener("load", () => resolve());
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = TABLEAU_SCRIPT_ID;
    script.src = TABLEAU_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Tableau script failed to load"));
    document.head.appendChild(script);
  });
}

function buildUrlWithParams(url: string, filterParams?: Record<string, string>): string {
  if (!url?.trim()) return url;
  if (!filterParams || Object.keys(filterParams).length === 0) return url.trim();
  const sep = url.includes("?") ? "&" : "?";
  return url.trim() + sep + new URLSearchParams(filterParams).toString();
}

export default function TableauEmbed({
  url,
  height = "420px",
  hideToolbar = true,
  hideTabs = true,
  placeholder = "태블로 URL을 설정해 주세요.",
  filterParams,
  className = "",
}: TableauEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const vizRef = useRef<{ dispose: () => void } | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const effectiveUrl = buildUrlWithParams(url ?? "", filterParams);

  useEffect(() => {
    let cancelled = false;
    setLoadError(null);
    loadTableauScript()
      .then(() => {
        if (!cancelled) setScriptReady(true);
      })
      .catch((e) => {
        if (!cancelled) setLoadError(e?.message ?? "스크립트 로드 실패");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!scriptReady || !effectiveUrl || !containerRef.current || typeof window === "undefined" || !window.tableau) return;
    const container = containerRef.current;
    container.innerHTML = "";
    try {
      const viz = new window.tableau.Viz(container, effectiveUrl, {
        hideTabs,
        hideToolbar,
        width: "100%",
        height: typeof height === "number" ? `${height}px` : height,
      });
      vizRef.current = viz;
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Viz 초기화 실패");
    }
    return () => {
      try {
        if (vizRef.current) {
          vizRef.current.dispose();
          vizRef.current = null;
        }
      } catch {
        // ignore dispose errors
      }
    };
  }, [scriptReady, effectiveUrl, hideTabs, hideToolbar, height]);

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
      ref={containerRef}
      className={`rounded-lg overflow-hidden w-full ${className}`}
      style={{ width: "100%", minHeight: h }}
    />
  );
}
