"use client";

import type { Department } from "@/data/supportOrg";
import { EmployeeMiniCard } from "./EmployeeMiniCard";

const PRIMARY = "#1e40af";

type DepartmentCardProps = {
  department: Department;
};

export function DepartmentCard({ department }: DepartmentCardProps) {
  const handleDeptMenu = () => console.log("dept menu", department.id);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm flex flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-5 py-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${PRIMARY}15`, color: PRIMARY }}>
            <span className="material-symbols-outlined">business</span>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white">
              {department.nameEn}
              <span className="text-slate-500 dark:text-slate-400 font-normal ml-1">({department.nameKo})</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {department.employees.length} members
              {department.floor ? ` · ${department.floor}` : ""}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDeptMenu}
          className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          aria-label="Department menu"
        >
          <span className="material-symbols-outlined text-xl">more_vert</span>
        </button>
      </div>
      <div className="p-4 space-y-2">
        {department.employees.length > 0 ? (
          department.employees.map((emp) => (
            <EmployeeMiniCard key={emp.id} employee={emp} />
          ))
        ) : (
          <p className="text-sm text-slate-400 py-2">No members</p>
        )}
      </div>
    </div>
  );
}
