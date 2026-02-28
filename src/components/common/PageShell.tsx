"use client";

import Link from "next/link";
import IsoMappingBadge, { IsoMappingItem } from "@/src/components/common/IsoMappingBadge";

interface PageShellProps {
  title: string;
  description: string;
  breadcrumb?: { label: string; href?: string }[];
  isoMapping: IsoMappingItem[];
  isoNote?: string;
  aboveTabs?: React.ReactNode;
  tabs: { id: string; label: string; icon?: string }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode;
}

export default function PageShell({
  title,
  description,
  breadcrumb = [],
  isoMapping,
  isoNote,
  aboveTabs,
  tabs,
  activeTab,
  onTabChange,
  children,
}: PageShellProps) {
  return (
    <main className="flex-1 min-h-0 bg-[#f6f7f8] dark:bg-[#101922] w-full">
      <div className="w-full min-w-0 px-3 py-4 md:px-5 md:py-5 space-y-4">
        {/* Breadcrumb - compact */}
        {breadcrumb.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-[#137fec] transition">홈</Link>
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                {b.href ? (
                  <Link href={b.href} className="hover:text-[#137fec] transition">{b.label}</Link>
                ) : (
                  <span className="text-gray-900 dark:text-[#ededed] font-medium">{b.label}</span>
                )}
              </span>
            ))}
          </div>
        )}

        {/* Header: Title + Description + ISO - single line feel */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#111418] dark:text-[#ededed] tracking-tight">{title}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{description}</p>
          </div>
          <IsoMappingBadge items={isoMapping} note={isoNote} />
        </div>

        {aboveTabs && <div className="flex-shrink-0">{aboveTabs}</div>}

        {/* Secondary Tabs - full width */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-[#182635] rounded-t-lg px-2 pt-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#f6f7f8] dark:bg-[#101922] text-[#137fec] border-b-2 border-[#137fec] -mb-px"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1e293b] hover:text-[#137fec]"
              }`}
            >
              {tab.icon && <span className="material-symbols-outlined text-lg">{tab.icon}</span>}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content - 전체 페이지 스크롤 시 헤더가 위로 사라지도록 고정 높이 제거 */}
        <div className="w-full min-w-0 overflow-hidden bg-white dark:bg-[#182635] rounded-b-lg rounded-tr-lg border border-gray-200 dark:border-gray-600 border-t-0 shadow-sm flex flex-col">
          <div className="flex-1 min-h-0 overflow-x-hidden px-4 md:px-6 py-4 md:py-6">
            <div className="w-full max-w-[1200px] min-w-0 mx-auto flex flex-col items-stretch" style={{ width: "100%", maxWidth: "1200px" }}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
