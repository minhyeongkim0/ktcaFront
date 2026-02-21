"use client";

import Image from "next/image";

const PRIMARY = "#1e40af";

const CEO_NAME = "김도현";
const CEO_TITLE = "Chief Executive Officer";
const QUOTE =
  "품질은 한 부서의 일이 아니라, 모든 구성원의 책임입니다. 우리는 자동차용 PMIC의 고객 안전과 신뢰성을 위해 표준과 데이터를 기준으로 운영합니다.";
const AUTHENTICATED_BY = "김도현";

/** 김도현 CEO 더미 사진 (public/ceo-placeholder.svg) */
const CEO_IMAGE_SRC = "/ceo-placeholder.svg";

export function CeoProfileCard() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-full">
      <div className="relative h-48 sm:h-64 w-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
        <Image
          src={CEO_IMAGE_SRC}
          alt={`${CEO_NAME} CEO`}
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 100vw, 400px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h3 className="text-2xl font-bold">{CEO_NAME}</h3>
          <p className="text-sm font-medium text-slate-200">{CEO_TITLE}</p>
        </div>
      </div>
      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
        <div>
          <span className="material-symbols-outlined text-4xl block mb-4" style={{ color: PRIMARY }}>
            format_quote
          </span>
          <blockquote className="text-lg italic text-slate-700 dark:text-slate-300 leading-relaxed">
            {QUOTE}
          </blockquote>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Authenticated By
          </p>
          <div className="h-14 w-28 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center">
            <span className="text-xl text-slate-600 dark:text-slate-400 -rotate-2 font-serif">
              {AUTHENTICATED_BY}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
