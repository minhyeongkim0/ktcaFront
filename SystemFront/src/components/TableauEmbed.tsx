"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { tableauConfig } from "@/config/tableau";

/**
 * Tableau Public iframe 임베드 (URL 지정 또는 placeholder)
 * 상세: docs/tableau-embed.md
 * 디버그 패널: URL에 ?debugTableau=1 붙일 때만 노출 (기본 OFF, env/prop 무시)
 */

const LOAD_TIMEOUT_MS = 8000;

/** 기본 높이(보수적, 절대 잘림 방지 우선) */
const DEFAULT_HEIGHT_DESKTOP = 1200;
const DEFAULT_HEIGHT_MOBILE = 1500;
/** 모달 기본 높이 */
const MODAL_HEIGHT_DEFAULT = 1200;
const MOBILE_BREAKPOINT = 768;

const DARK_FILTER = "invert(1) hue-rotate(180deg) saturate(1.1) contrast(1.05)";

export interface TableauEmbedProps {
  /** Tableau Public embed URL (showVizHome=no, embed=yes 필수). 없으면 placeholder */
  src?: string;
  title: string;
  theme?: "light" | "dark";
  className?: string;
  /** 데스크탑 권장 높이(px). config에서 전달 */
  heightDesktop?: number;
  /** 모바일 권장 높이(px). config에서 전달 */
  heightMobile?: number;
}

export function TableauEmbed({ src, title, theme = "light", className = "", heightDesktop, heightMobile }: TableauEmbedProps) {
  const [showDebug, setShowDebug] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShowDebug(new URLSearchParams(window.location.search).get("debugTableau") === "1");
    }
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [wrapperSize, setWrapperSize] = useState({ w: 0, h: 0 });
  const [useFilter, setUseFilter] = useState(true);
  const [expandOpen, setExpandOpen] = useState(false);
  const [heightOffset, setHeightOffset] = useState(0);
  const mountedRef = useRef(true);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    setIsMobile(mq.matches);
    const onMatch = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onMatch);
    return () => mq.removeEventListener("change", onMatch);
  }, []);

  const baseHeight = isMobile
    ? (heightMobile ?? DEFAULT_HEIGHT_MOBILE)
    : (heightDesktop ?? DEFAULT_HEIGHT_DESKTOP);
  const safeHeight = Math.max(560, baseHeight + heightOffset);

  const [modalHeight, setModalHeight] = useState(MODAL_HEIGHT_DEFAULT);
  useEffect(() => {
    if (!expandOpen || typeof window === "undefined") return;
    const update = () => setModalHeight(Math.min(1400, Math.max(900, window.innerHeight - 100)));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [expandOpen]);

  useEffect(() => {
    if (!expandOpen) return;
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setExpandOpen(false);
    window.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [expandOpen]);

  const isDark = theme === "dark";
  const iframeSrc = useMemo(() => {
    if (!src) return "";
    if (src.startsWith("http")) return src;
    if (isDark && tableauConfig.darkUrl) return tableauConfig.darkUrl;
    return tableauConfig.lightUrl;
  }, [src, isDark]);

  const showEmbed = Boolean(src);
  const applyFilter = showEmbed && isDark && !tableauConfig.darkUrl && useFilter;

  useEffect(() => {
    if (!showDebug) return;
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect) setWrapperSize({ w: Math.round(rect.width), h: Math.round(rect.height) });
    });
    ro.observe(el);
    setWrapperSize({ w: el.offsetWidth || 0, h: el.offsetHeight || 0 });
    return () => ro.disconnect();
  }, [showDebug]);

  useEffect(() => {
    if (!showEmbed || !iframeSrc) return;
    if (showDebug) console.log("[TableauEmbed] src=", iframeSrc);
    const t = setTimeout(() => {
      if (!loaded && mountedRef.current) {
        setLoadFailed(true);
        if (showDebug) console.log("[TableauEmbed] loaded=false, timeout=true");
      }
    }, LOAD_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [showEmbed, iframeSrc, loaded, showDebug]);

  const handleLoad = useCallback(() => {
    setLoaded(true);
    setLoadFailed(false);
    if (showDebug) console.log("[TableauEmbed] loaded=true");
  }, [showDebug]);

  if (!showEmbed) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 min-h-[400px] ${className}`}
      >
        <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">bar_chart</span>
        <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">대시보드 URL 설정 후 표시됩니다</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`w-full min-w-0 rounded-xl overflow-visible transition-colors duration-300 ${className}`}
      style={{
        background: "var(--panel-bg)",
        border: "1px solid var(--panel-border)",
        padding: "8px 12px",
        boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.3)" : undefined,
      }}
    >
      {showDebug && (
        <div className="mb-3 p-3 rounded-lg bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-600 text-xs space-y-2" aria-label="Tableau 디버그">
          <div className="font-mono truncate" title={iframeSrc}>
            <strong>src:</strong> {iframeSrc.slice(0, 80)}...
          </div>
          <div>
            <strong>height:</strong> {safeHeight}px (base {baseHeight} + offset {heightOffset}) | <strong>loaded:</strong> {String(loaded)}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setHeightOffset((o) => o - 100)} className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-600 hover:bg-slate-300">
              -100
            </button>
            <button type="button" onClick={() => setHeightOffset((o) => o + 100)} className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-600 hover:bg-slate-300">
              +100
            </button>
            <button type="button" onClick={() => setHeightOffset(0)} className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-600 hover:bg-slate-300">
              초기화
            </button>
            <a href={iframeSrc} target="_blank" rel="noopener noreferrer" className="text-[#137fec] hover:underline ml-2">
              새 탭으로 열기
            </a>
          </div>
        </div>
      )}
      {loadFailed && (
        <div className="mb-3 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm space-y-2">
          <p className="text-red-700 dark:text-red-300">차트 로딩에 실패했습니다. 아래 링크로 새 탭에서 확인해 보세요.</p>
          <a
            href={iframeSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#137fec] hover:underline font-medium"
          >
            새 탭에서 열기
            <span className="material-symbols-outlined text-base">open_in_new</span>
          </a>
        </div>
      )}
      <div className="flex justify-end gap-2 mb-2">
        <button
          type="button"
          onClick={() => setExpandOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[#137fec] hover:bg-[#137fec]/10 transition-colors"
          aria-label="확대 보기"
        >
          <span className="material-symbols-outlined text-lg">open_in_new</span>
          확대 보기
        </button>
        {isDark && !tableauConfig.darkUrl && (
          <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer" aria-hidden>
            <input type="checkbox" checked={useFilter} onChange={(e) => setUseFilter(e.target.checked)} className="rounded" />
            다크 UI에 맞추기
          </label>
        )}
      </div>
      <div className="relative rounded-lg overflow-hidden w-full" style={{ height: `${safeHeight}px` }}>
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-slate-100 dark:bg-slate-800 flex items-center justify-center z-10">
            <span className="text-slate-400 text-sm">로딩 중...</span>
          </div>
        )}
        <iframe
          src={iframeSrc}
          width="100%"
          scrolling="no"
          loading="lazy"
          title={title}
          style={{
            height: "100%",
            width: "100%",
            border: 0,
            display: "block",
            overflow: "hidden",
            filter: applyFilter ? DARK_FILTER : undefined,
            opacity: loaded ? 1 : 0,
            transition: "filter 150ms, opacity 200ms",
          }}
          onLoad={handleLoad}
        />
      </div>

      {expandOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="차트 확대 보기"
          onClick={(e) => e.target === e.currentTarget && setExpandOpen(false)}
        >
          <div
            className="relative flex flex-col w-[95vw] max-w-[1400px] rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-2xl"
            style={{ height: `${modalHeight}px` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between shrink-0 px-4 py-2 border-b border-slate-200 dark:border-slate-700">
              <span className="font-medium text-slate-800 dark:text-slate-100">{title}</span>
              <button
                type="button"
                onClick={() => setExpandOpen(false)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="닫기"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden rounded-b-xl">
              <iframe
                src={iframeSrc}
                width="100%"
                height="100%"
                scrolling="no"
                title={`${title} (확대)`}
                style={{
                  border: 0,
                  display: "block",
                  overflow: "hidden",
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
