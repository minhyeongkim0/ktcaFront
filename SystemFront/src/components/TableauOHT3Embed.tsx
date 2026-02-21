"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { tableauConfig } from "@/config/tableau";

/**
 * Tableau Public OHT_3 차트 iframe 임베딩
 * 상세: docs/tableau-embed.md (앱에서 가능한 조치 / Tableau 쪽 수정)
 */

const DEBOUNCE_MS = 200;

/** iframe 높이: 반응형 + clamp + 하단 여백 보정. (빈 공간 최소화) */
const EMBED_HEIGHT = {
  min: 1200,
  max: 1850,
  /** 폭별 기본값. 범례/필터 잘리면 해당 구간만 +100px 미세 조정 */
  widthBreakpoints: {
    xl: 1320,   // width >= 1280
    lg: 1450,   // 1024 <= width < 1280
    md: 1600,   // 900 <= width < 1024
    sm: 1800,   // width < 900
  },
  /** 하단 여백 최소화용 보정. 한 번에 조정 가능 (좁은 폭은 잘림 방지로 작게) */
  bottomPaddingAllowance: { default: 120, narrow: 80 },
} as const;

const DARK_FILTER =
  "invert(1) hue-rotate(180deg) saturate(1.1) contrast(1.05)";

function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/**
 * 컨테이너 폭에 따른 embed 높이 (base - allowance 후 clamp)
 * - >= 1280: 1320 - 120
 * - 1024~1279: 1450 - 120
 * - 900~1023: 1600 - 120
 * - < 900: 1800 - 80 (좁은 폭은 allowance 축소로 잘림 방지)
 */
function getEmbedHeight(width: number): number {
  let base: number;
  if (width >= 1280) base = EMBED_HEIGHT.widthBreakpoints.xl;
  else if (width >= 1024) base = EMBED_HEIGHT.widthBreakpoints.lg;
  else if (width >= 900) base = EMBED_HEIGHT.widthBreakpoints.md;
  else base = EMBED_HEIGHT.widthBreakpoints.sm;
  const allowance = width < 900
    ? EMBED_HEIGHT.bottomPaddingAllowance.narrow
    : EMBED_HEIGHT.bottomPaddingAllowance.default;
  const h = base - allowance;
  return Math.min(EMBED_HEIGHT.max, Math.max(EMBED_HEIGHT.min, h));
}

function clampHeight(value: number): number {
  return Math.min(EMBED_HEIGHT.max, Math.max(EMBED_HEIGHT.min, value));
}

export interface TableauOHT3EmbedProps {
  height?: number;
  theme?: "light" | "dark";
  preserveOriginalInDark?: boolean;
  className?: string;
}

export function TableauOHT3Embed({
  height: heightProp,
  theme = "light",
  preserveOriginalInDark = false,
  className = "",
}: TableauOHT3EmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(
    EMBED_HEIGHT.widthBreakpoints.xl - EMBED_HEIGHT.bottomPaddingAllowance.default
  );
  const [loaded, setLoaded] = useState(false);
  const [useFilter, setUseFilter] = useState(true);
  const mountedRef = useRef(true);

  const isDark = theme === "dark";
  const hasDarkUrl = Boolean(tableauConfig.darkUrl);

  const iframeSrc = useMemo(() => {
    if (isDark && hasDarkUrl) return tableauConfig.darkUrl!;
    return tableauConfig.lightUrl;
  }, [isDark, hasDarkUrl]);

  const applyFilter = isDark && !hasDarkUrl && !preserveOriginalInDark && useFilter;

  const updateHeightFromWidth = useCallback((width: number) => {
    if (!mountedRef.current) return;
    const next = heightProp ?? getEmbedHeight(width);
    setHeight((prev) => (prev !== next ? next : prev));
  }, [heightProp]);

  const debouncedUpdate = useMemo(
    () => debounce((w: number) => updateHeightFromWidth(w), DEBOUNCE_MS),
    [updateHeightFromWidth]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined" || typeof ResizeObserver === "undefined") {
      const w = typeof window !== "undefined" ? window.innerWidth : 1280;
      updateHeightFromWidth(w);
      return;
    }

    mountedRef.current = true;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = entry.contentRect.width;
      debouncedUpdate(w);
    });
    ro.observe(container);
    debouncedUpdate(container.offsetWidth || window.innerWidth);

    return () => {
      mountedRef.current = false;
      ro.disconnect();
    };
  }, [debouncedUpdate, updateHeightFromWidth]);

  const h = clampHeight(heightProp ?? height);
  const showControl = isDark && !hasDarkUrl;

  return (
    <div
      ref={containerRef}
      className={`w-full min-w-0 rounded-xl overflow-hidden transition-colors duration-300 ${className}`}
      style={{
        background: "var(--panel-bg)",
        border: "1px solid var(--panel-border)",
        padding: "8px 12px",
        boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.3)" : undefined,
      }}
    >
      <div
        className="flex justify-end items-center min-h-[32px] mb-2"
        style={{ minWidth: 220 }}
        aria-hidden={!showControl}
      >
        <div
          className="flex items-center justify-end w-[220px] flex-shrink-0"
          style={{ visibility: showControl ? "visible" : "hidden" }}
        >
          <label className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={useFilter}
              onChange={(e) => setUseFilter(e.target.checked)}
              className="rounded border-slate-500"
            />
            다크 UI에 맞추기
          </label>
        </div>
      </div>

      <div
        className="relative rounded-lg overflow-hidden w-full min-w-0 block"
        style={{ minHeight: h, height: h }}
      >
        {!loaded && (
          <div
            className="absolute inset-0 animate-pulse z-10"
            style={{
              background: isDark ? "#1e293b" : "#f1f5f9",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-slate-400 dark:text-slate-500 text-sm">로딩 중...</span>
            </div>
          </div>
        )}

        <iframe
          src={iframeSrc}
          width="100%"
          height={h}
          loading="lazy"
          title="OHT 설비 통합 관제판"
          style={{
            border: 0,
            display: "block",
            filter: applyFilter ? DARK_FILTER : undefined,
            transition: "filter 150ms ease, opacity 200ms ease",
            opacity: loaded ? 1 : 0,
          }}
          onLoad={() => setLoaded(true)}
          className="block"
        />
      </div>
    </div>
  );
}
