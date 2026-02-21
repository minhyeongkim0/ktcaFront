"use client";

import type { EquipmentItem } from "@/data/equipment";
import { Sparkline } from "./Sparkline";

const STATUS_BAR: Record<EquipmentItem["status"], string> = {
  Operating: "bg-green-500",
  Maintenance: "bg-amber-500",
  Idle: "bg-slate-400",
};

type EquipmentRowProps = {
  item: EquipmentItem;
};

export function EquipmentRow({ item }: EquipmentRowProps) {
  const handleActions = () => console.log("actions", item.id);
  const barClass = STATUS_BAR[item.status];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex">
      <div className={`w-1 shrink-0 ${barClass}`} aria-hidden />
      <div className="flex-1 min-w-0 p-4 flex flex-col md:flex-row md:items-center gap-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 md:gap-4 flex-1 min-w-0">
          <div className="md:col-span-2">
            <p className="font-semibold text-slate-800 dark:text-white truncate">{item.machineName}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">ID #{item.id}</p>
          </div>
          <div>
            <p className="text-sm text-slate-700 dark:text-slate-300">{item.role}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{item.function}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-white">{item.status}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{item.statusDetail}</p>
          </div>
          <div>
            <p className="text-sm text-slate-700 dark:text-slate-300 truncate">{item.capacity}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.spec}</p>
          </div>
          <div className="flex items-center gap-2">
            {item.sparklineData && item.sparklineData.length >= 2 ? (
              <Sparkline
                data={item.sparklineData}
                declining={item.sparklineDeclining}
                width={80}
                height={28}
              />
            ) : (
              <span className="text-xs text-slate-400 italic">{item.efficiencyLabel}</span>
            )}
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden md:inline">
              {item.efficiencyLabel}
            </span>
          </div>
        </div>
        <div className="shrink-0 flex items-center justify-end">
          <button
            type="button"
            onClick={handleActions}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            aria-label="Actions"
          >
            <span className="material-symbols-outlined text-xl">more_vert</span>
          </button>
        </div>
      </div>
    </div>
  );
}
