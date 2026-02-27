"use client";

import { useState } from "react";

export type IsoClause =
  | "Context"
  | "Leadership"
  | "Planning"
  | "Support"
  | "Operation"
  | "Performance"
  | "Improvement";

export interface IsoMappingItem {
  iso: IsoClause;
  label: string;
}

const ISO_LABELS: Record<IsoClause, string> = {
  Context: "조직의 맥락 (Clause 4)",
  Leadership: "리더십 (Clause 5)",
  Planning: "기획 (Clause 6)",
  Support: "지원 (Clause 7)",
  Operation: "운영 (Clause 8)",
  Performance: "성과평가 (Clause 9)",
  Improvement: "개선 (Clause 10)",
};

interface IsoMappingBadgeProps {
  items: IsoMappingItem[];
  note?: string;
}

export default function IsoMappingBadge({ items, note }: IsoMappingBadgeProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">ISO 매핑:</span>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item.iso}
            className="relative group"
            onMouseEnter={() => setHovered(item.iso)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-[#1e293b] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-[#1e3a5f] hover:border-blue-200 dark:hover:border-[#137fec] hover:text-blue-800 dark:hover:text-[#7eb8f7] transition-colors">
              <span className="material-symbols-outlined text-sm">verified</span>
              {item.label}
            </span>
            {hovered === item.iso && (
              <span
                className="absolute left-0 top-full mt-1 z-20 px-3 py-2 rounded-lg bg-gray-900 dark:bg-[#0f172a] text-white text-xs shadow-lg whitespace-nowrap border border-gray-700"
                role="tooltip"
              >
                Annex SL {ISO_LABELS[item.iso]}
              </span>
            )}
          </span>
        ))}
      </div>
      {note && <span className="text-xs text-gray-400 dark:text-gray-500">{note}</span>}
    </div>
  );
}
