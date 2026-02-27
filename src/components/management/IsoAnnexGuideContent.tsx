"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ISO_CLAUSE_MAP, TAB_SUMMARY } from "@/src/config/isoMapping";
import type { MappedTab } from "@/src/config/isoMapping";

/**
 * ISO Annex SL 운영체계 가이드 공용 컴포넌트
 * 홈 가이드라인 모달에서 사용, Clause별 연결 탭 배지 + 설명 제공
 */
interface IsoAnnexGuideContentProps {
  compact?: boolean;
  onClose?: () => void;
}

function TabBadge({
  tab,
  onNavigate,
  onShowToast,
}: {
  tab: MappedTab;
  onNavigate: (href: string) => void;
  onShowToast: (msg: string) => void;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    if (tab.disabled) {
      onShowToast("MES 모듈은 준비 중입니다.");
      return;
    }
    if (tab.href) {
      onNavigate(tab.href);
    }
  };

  return (
    <span
      className="relative group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        type="button"
        onClick={handleClick}
        disabled={tab.disabled}
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
          tab.disabled
            ? "bg-amber-100 text-amber-700 cursor-not-allowed opacity-75"
            : "bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 cursor-pointer"
        }`}
      >
        <span className="material-symbols-outlined text-sm">
          {tab.disabled ? "schedule" : "arrow_forward"}
        </span>
        {tab.label}
      </button>
      {showTooltip && (
        <span
          className="absolute left-0 top-full mt-1 z-20 px-3 py-2 rounded-lg bg-gray-900 text-white text-xs shadow-lg max-w-[240px]"
          role="tooltip"
        >
          {tab.description}
        </span>
      )}
    </span>
  );
}

export default function IsoAnnexGuideContent({ compact = false, onClose }: IsoAnnexGuideContentProps) {
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);

  const sectionSpacing = compact ? "space-y-4" : "space-y-6";
  const cardPadding = compact ? "p-4" : "p-5";
  const textSize = compact ? "text-sm" : "text-base";

  const handleNavigate = (href: string) => {
    onClose?.();
    router.push(href);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const benefits = [
    { label: "일관된 구조", desc: "모든 ISO MSS가 동일한 고수준 구조(Clause 4~10)를 따릅니다." },
    { label: "통합 용이", desc: "품질·환경·안전 등 다중 경영시스템을 하나로 통합하기 쉽습니다." },
    { label: "효율적 이행", desc: "PDCA 사이클에 따른 명확한 흐름으로 이행이 용이합니다." },
  ];

  return (
    <div className={sectionSpacing}>
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-4 py-3 rounded-lg bg-amber-600 text-white text-sm font-medium shadow-lg animate-fade-in">
          {toast}
        </div>
      )}

      {/* Annex SL 개요 */}
      <section className={`bg-white rounded-xl border border-gray-200 shadow-sm ${cardPadding}`}>
        <h3 className="text-lg font-bold text-[#111418] mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#137fec] text-xl">description</span>
          ISO Annex SL이란?
        </h3>
        <p className={`${textSize} text-gray-600 leading-relaxed`}>
          ISO Annex SL(이전 ISO Guide 83)은 모든 ISO 경영시스템 표준(ISO 9001, 14001, 45001 등)에 공통으로 적용되는
          <strong className="text-[#111418]"> 고수준 구조(HLS)</strong>입니다.
          본 대시보드는 운영체계(ISO) 맥락을 참고해 Clause 4~10의 흐름에 맞게 구성되었습니다.
        </p>
      </section>

      {/* Clause 흐름 + 연결 탭 배지 */}
      <section className={`bg-white rounded-xl border border-gray-200 shadow-sm ${cardPadding}`}>
        <h3 className="text-lg font-bold text-[#111418] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#137fec] text-xl">account_tree</span>
          Clause 4~10 흐름 · 연결 탭
        </h3>
        <div className={`grid ${compact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"} gap-3`}>
          {ISO_CLAUSE_MAP.map((c) => (
            <div
              key={c.clause}
              className="flex gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100 hover:border-[#137fec]/30 transition-colors"
            >
              <div className="shrink-0 size-10 rounded-lg bg-[#137fec]/10 flex items-center justify-center text-[#137fec]">
                <span className="material-symbols-outlined">{c.icon}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-[#111418] text-sm">
                  Clause {c.clause}: {c.title}
                </p>
                <p className={`${textSize} text-gray-500 mt-0.5`}>{c.summary}</p>
                {/* 연결 탭 배지 */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {c.tabs.map((tab) => (
                    <TabBadge
                      key={tab.label}
                      tab={tab}
                      onNavigate={handleNavigate}
                      onShowToast={showToast}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 이점 카드 */}
      <section className={`bg-white rounded-xl border border-gray-200 shadow-sm ${cardPadding}`}>
        <h3 className="text-lg font-bold text-[#111418] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#137fec] text-xl">verified</span>
          Annex SL 적용 이점
        </h3>
        <div className={`grid ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-3"} gap-4`}>
          {benefits.map((b) => (
            <div key={b.label} className="p-4 rounded-lg bg-green-50 border border-green-100">
              <p className="font-bold text-green-800 text-sm">{b.label}</p>
              <p className={`${textSize} text-green-700/90 mt-1`}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 탭별 무엇을 보나 - 요약 */}
      <section className={`bg-white rounded-xl border border-gray-200 shadow-sm ${cardPadding}`}>
        <h3 className="text-lg font-bold text-[#111418] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#137fec] text-xl">view_list</span>
          탭별 무엇을 보나
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TAB_SUMMARY.map((t) => (
            <div
              key={t.id}
              className={`p-4 rounded-lg border ${
                t.disabled ? "bg-gray-50 border-gray-200" : "bg-white border-gray-200"
              }`}
            >
              <p className="font-bold text-[#111418] text-sm flex items-center gap-1">
                {t.disabled && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-700">
                    준비 중
                  </span>
                )}
                {t.label}
              </p>
              <p className={`${textSize} text-gray-500 mt-1`}>{t.description}</p>
              {!t.disabled && (
                <button
                  type="button"
                  onClick={() => handleNavigate(t.href!)}
                  className="mt-3 flex items-center gap-1 text-xs font-medium text-[#137fec] hover:underline"
                >
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  대표로 이동
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
