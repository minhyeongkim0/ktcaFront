"use client";

import { ReactNode } from "react";
import { SideTabs } from "./SideTabs";
import type { SideMenuItem } from "@/data/dummyData";
import { useLanguage } from "@/i18n/LanguageProvider";

interface ShellLayoutProps {
  /** 현재 모듈(탭) id */
  currentModule: string;
  /** 세로 메뉴 목록 (빈 배열이면 "No Menu Selected" 표시) */
  sideMenuItems: SideMenuItem[];
  /** 선택된 세로 메뉴 id (없으면 null) */
  selectedMenuId: string | null;
  /** 세로 메뉴 클릭 시 (라우팅 또는 setState) */
  onSelectMenu: (id: string) => void;
  /** 메인 영역 콘텐츠. 선택 전이면 빈 상태 UI를 레이아웃 내부에서 처리해도 됨 */
  children: ReactNode;
  /** 메인 영역 배경 워터마크 아이콘명 (Material Symbols) */
  watermarkIcon?: string;
}

/**
 * 업무영역 페이지 내부에서 사용. aside + main 담당.
 * 기존 Context 페이지 스타일(aside + main, Material Symbols, Tailwind) 유지.
 */
export function ShellLayout({
  currentModule,
  sideMenuItems,
  selectedMenuId,
  onSelectMenu,
  children,
  watermarkIcon = "precision_manufacturing",
}: ShellLayoutProps) {
  const { t } = useLanguage();
  const hasSideMenu = sideMenuItems.length > 0;
  const showEmptyState = !selectedMenuId && hasSideMenu;

  return (
    <div className="flex flex-1 min-w-0 min-h-0 overflow-hidden">
      {/* Aside: 고정폭 카드형 사이드메뉴, lg에서 sticky */}
      <aside className="w-[260px] shrink-0 hidden lg:flex flex-col overflow-y-auto relative z-10 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 backdrop-blur p-3 m-3 transition-colors duration-300">
          {!hasSideMenu ? (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{t("sideMenu.menu")}</p>
              <p className="py-2 text-sm text-slate-400 dark:text-slate-500">{t("state.empty")}</p>
            </div>
          ) : (
            <SideTabs
              items={sideMenuItems}
              selectedId={selectedMenuId}
              onSelect={onSelectMenu}
            />
          )}
        </div>
      </aside>

      {/* Main: flex-1 + min-h-0 → 메인 콘텐츠 영역 */}
      <main className="flex-1 min-h-0 flex flex-col min-w-0 bg-[#f6f7f8] dark:bg-[#0f172a] transition-colors duration-300">
        {/* Watermark: 스크롤 영역 뒤에 고정 배경 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.03] z-0">
          <span className="material-symbols-outlined text-[600px] text-gray-900 dark:text-slate-100 select-none" style={{ fontVariationSettings: "'FILL' 0" }}>
            {watermarkIcon}
          </span>
        </div>

        {showEmptyState ? (
          <div className="relative z-10 flex flex-col items-center justify-center flex-1 min-h-0 p-8">
            <div className="max-w-2xl w-full text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-black text-[#111418] dark:text-slate-100 tracking-tight transition-colors duration-300">
                  {t("sideMenu.selectSubmenu")}
                </h1>
                <p className="text-gray-500 dark:text-slate-400 transition-colors duration-300">
                  {t("sideMenu.selectSubmenuDesc")}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative z-10 flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-gutter-stable">
            {children}
          </div>
        )}
      </main>
    </div>
  );
}
