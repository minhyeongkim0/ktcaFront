"use client";

import Link from "next/link";

export default function MesPage() {
  return (
    <main className="flex-1 overflow-y-auto bg-[#f6f7f8] dark:bg-[#101922] flex flex-col items-center justify-center p-8">
      <div className="max-w-lg w-full text-center space-y-8 animate-fade-in">
        <div className="p-6 rounded-full bg-gray-100 dark:bg-[#182635] border-2 border-dashed border-gray-200 dark:border-gray-600 inline-block">
          <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-500">factory</span>
        </div>
        <div className="space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
            준비 중
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-[#111418] dark:text-[#ededed]">
            MES(생산/제조) 모듈
          </h1>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
            현재는 운송 설비 로그 중심 데이터만 보유하여 MES 기능은 데모 범위에서 제외되었습니다.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium bg-[#137fec] text-white hover:bg-[#0d6bd6] transition-colors"
          >
            <span className="material-symbols-outlined text-lg">home</span>
            홈으로
          </Link>
          <Link
            href="/fdc"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium bg-white dark:bg-[#182635] border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-[#137fec] hover:text-[#137fec] transition-colors"
          >
            <span className="material-symbols-outlined text-lg">monitoring</span>
            설비 예지보전으로 이동
          </Link>
        </div>
      </div>
    </main>
  );
}
