"use client";

import { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  /** 섹션 간 간격 (기본: space-y-6) */
  className?: string;
}

/**
 * 모든 탭 페이지의 공통 레이아웃 컨테이너.
 * max-width, padding, 배경을 통일하여 탭 이동 시 레이아웃 SHIFT를 방지한다.
 */
export function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <div
      className={`w-full min-w-0 max-w-[1400px] mx-auto px-4 py-6 sm:px-6 sm:py-8 space-y-6 ${className}`}
    >
      {children}
    </div>
  );
}
