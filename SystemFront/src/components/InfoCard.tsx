"use client";

import { ReactNode } from "react";

interface InfoCardProps {
  title: string;
  children: ReactNode;
  icon?: string;
  className?: string;
}

export function InfoCard({ title, children, icon, className = "" }: InfoCardProps) {
  return (
    <div className={`bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden ${className}`}>
      <div className="px-5 py-4 border-b border-[#e5e7eb] flex items-center gap-2">
        {icon && (
          <span className="material-symbols-outlined text-[#137fec] text-xl">{icon}</span>
        )}
        <h3 className="text-[#111418] font-bold">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

interface KeyValueRowProps {
  label: string;
  value: string | number | ReactNode;
}

export function KeyValueRow({ label, value }: KeyValueRowProps) {
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
      <span className="text-slate-500 text-sm shrink-0">{label}</span>
      <span className="text-[#111418] text-sm font-medium text-right break-words">{value}</span>
    </div>
  );
}
