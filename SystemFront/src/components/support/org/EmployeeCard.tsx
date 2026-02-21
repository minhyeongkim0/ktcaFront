"use client";

import type { Employee } from "@/data/supportOrg";

const PRIMARY = "#1e40af";
const STATUS_DOT: Record<Employee["status"], string> = {
  online: "bg-green-500",
  away: "bg-amber-500",
  offline: "bg-slate-400",
};

type EmployeeCardProps = {
  employee: Employee;
};

export function EmployeeCard({ employee }: EmployeeCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-200 text-base font-bold">
            {employee.nameEn.charAt(0)}
          </div>
          <span
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900 ${STATUS_DOT[employee.status]}`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-800 dark:text-white">
            {employee.nameEn}
            <span className="text-slate-500 dark:text-slate-400 font-normal ml-1">({employee.nameKo})</span>
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {employee.roleEn} ({employee.roleKo}) · {employee.tenureYears}y
          </p>
          {employee.extra && (
            <p className="text-xs mt-1 font-medium" style={{ color: PRIMARY }}>{employee.extra}</p>
          )}
          {employee.skills && employee.skills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {employee.skills.map((s, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                >
                  {s.name} {s.level} {s.percent != null ? `${s.percent}%` : ""}
                </span>
              ))}
            </div>
          )}
          {employee.tags && employee.tags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {employee.tags.map((t, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
