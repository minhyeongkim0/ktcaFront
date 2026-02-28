"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import IsoAnnexGuideContent from "@/src/components/management/IsoAnnexGuideContent";

export default function Home() {
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    if (guideOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [guideOpen]);

  return (
    <>
      {/* Main Dashboard Area */}
      <main className="flex-1 relative flex flex-col items-center justify-center p-8 bg-[#f6f7f8] dark:bg-[#101922] overflow-hidden min-h-0">
        {/* Watermark Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.03] dark:opacity-[0.05]">
          <span className="material-symbols-outlined text-[600px] text-gray-900 dark:text-gray-100 select-none">precision_manufacturing</span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl w-full text-center space-y-10 animate-fade-in">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-bold uppercase tracking-wider mb-4">
              <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
              System Operational
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#111418] dark:text-[#ededed] tracking-tight leading-tight">
              통합 대시보드
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
              업무 영역을 선택하세요. (설비 예지보전 / 경영 / MES)
            </p>
          </div>

          {/* 3 Cards: 설비 예지보전 / 경영 / MES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <Link
              href="/fdc"
              className="group flex flex-col items-center p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-[#182635] hover:border-[#137fec] hover:shadow-lg transition-all duration-300"
            >
              <span className="material-symbols-outlined text-5xl text-[#137fec] mb-4 group-hover:scale-110 transition-transform">
                monitoring
              </span>
              <h3 className="text-xl font-bold text-[#111418] dark:text-[#ededed] mb-2">설비 예지보전(FDC)</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                실시간 관제 · 이상/알람 · 예측/진단 · KPI · 조치
              </p>
            </Link>
            <Link
              href="/management"
              className="group flex flex-col items-center p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-[#182635] hover:border-[#137fec] hover:shadow-lg transition-all duration-300"
            >
              <span className="material-symbols-outlined text-5xl text-[#137fec] mb-4 group-hover:scale-110 transition-transform">
                business_center
              </span>
              <h3 className="text-xl font-bold text-[#111418] dark:text-[#ededed] mb-2">경영(Management)</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                회사 개요 · 리더십 · 목표/계획 · 자원/역량 · 리뷰/감사
              </p>
            </Link>
            <Link
              href="/mes"
              className="group relative flex flex-col items-center p-8 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-600 bg-gray-50/80 dark:bg-[#1e293b]/80 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-[#1e293b] transition-all duration-300 opacity-90"
              title="준비 중입니다"
            >
              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-200">
                미구현
              </span>
              <span className="material-symbols-outlined text-5xl text-gray-400 dark:text-gray-500 mb-4">
                factory
              </span>
              <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400 mb-2">MES(생산/제조)</h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center">
                생산지시 · 공정추적 · 재공/완제품 · 품질검사 (준비 중)
              </p>
            </Link>
          </div>
        </div>

        {/* Footer: Guideline Button */}
        <div className="relative z-10 mt-8 flex justify-end w-full max-w-4xl px-4">
          <button
            onClick={() => setGuideOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#137fec] hover:bg-white/80 dark:hover:bg-[#182635] border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all"
          >
            <span className="material-symbols-outlined text-lg">info</span>
            가이드라인(ISO Annex SL)
          </button>
        </div>
      </main>

      {/* Guideline Modal */}
      {guideOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="guide-modal-title"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setGuideOpen(false)}
          />
          <div
            className="relative bg-white dark:bg-[#182635] rounded-xl shadow-xl max-w-5xl w-full max-h-[80vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-600"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="shrink-0 px-6 py-4 border-b border-gray-200 dark:border-gray-600 flex items-start justify-between gap-4">
              <div>
                <h2 id="guide-modal-title" className="text-xl font-bold text-[#111418] dark:text-[#ededed]">
                  ISO Annex SL 운영체계 가이드
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  본 대시보드는 운영체계(ISO) 맥락을 참고해 구성되었습니다.
                </p>
              </div>
              <button
                onClick={() => setGuideOpen(false)}
                className="shrink-0 p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-[#111418] dark:hover:text-[#ededed] transition-colors"
                aria-label="닫기"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <IsoAnnexGuideContent compact onClose={() => setGuideOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

