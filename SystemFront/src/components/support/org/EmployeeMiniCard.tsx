"use client";

import type { Employee } from "@/data/supportOrg";

const STATUS_DOT: Record<Employee["status"], string> = {
  online: "bg-green-500",
  away: "bg-amber-500",
  offline: "bg-slate-400",
};

type EmployeeMiniCardProps = {
  employee: Employee;
};

export function EmployeeMiniCard({ employee }: EmployeeMiniCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/50 dark:bg-slate-800/50 p-3">
      <div className="relative shrink-0">
        <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 text-sm font-bold">
          {employee.nameEn.charAt(0)}
        </div>
        <span
          className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-slate-800 ${STATUS_DOT[employee.status]}`}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
          {employee.nameEn}
          <span className="text-slate-500 dark:text-slate-400 font-normal ml-1">({employee.nameKo})</span>
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {employee.roleEn} · {employee.tenureYears}y
        </p>
      </div>
    </div>
  );
}
