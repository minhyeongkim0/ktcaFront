"use client";

import type { Ceo } from "@/data/supportOrg";

const PRIMARY = "#1e40af";

type CeoCardProps = {
  ceo: Ceo;
};

export function CeoCard({ ceo }: CeoCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-48 shrink-0 h-40 sm:h-auto sm:min-h-[180px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <div className="h-24 w-24 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-2xl font-bold text-slate-600 dark:text-slate-300">
            {ceo.nameEn.charAt(0)}
          </div>
        </div>
        <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500 shrink-0" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Online</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            {ceo.nameEn}
            <span className="text-slate-500 dark:text-slate-400 font-normal ml-2">({ceo.nameKo})</span>
          </h2>
          <p className="text-sm font-semibold mt-1" style={{ color: PRIMARY }}>Chief Executive Officer</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{ceo.tenureYears} years tenure</p>
          <div className="mt-4 space-y-1 text-sm text-slate-600 dark:text-slate-400">
            <p>{ceo.email}</p>
            <p>{ceo.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
