"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T extends object> {
  data: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  dateKey?: keyof T;
  idKey?: keyof T;
  title?: string;
  className?: string;
  /** 초기 정렬 컬럼 (미설정 시 정렬 없음) */
  initialSortKey?: keyof T | string;
  /** 초기 정렬 방향 (true: 오름차순, false: 내림차순) */
  initialSortAsc?: boolean;
}

export function DataTable<T extends object>({
  data,
  columns,
  searchKeys = [],
  dateKey,
  idKey,
  title,
  className = "",
  initialSortKey,
  initialSortAsc = true,
}: DataTableProps<T>) {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof T | string | null>(
    initialSortKey ?? dateKey ?? null
  );
  const [sortAsc, setSortAsc] = useState(initialSortAsc);

  const filtered = useMemo(() => {
    if (!search.trim() || searchKeys.length === 0) return data;
    const lower = search.toLowerCase();
    return data.filter((row) =>
      searchKeys.some((k) => String((row as Record<string, unknown>)[String(k)] ?? "").toLowerCase().includes(lower))
    );
  }, [data, search, searchKeys]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = (a as Record<string, unknown>)[String(sortKey)];
      const bv = (b as Record<string, unknown>)[String(sortKey)];
      if (av == null && bv == null) return 0;
      if (av == null) return sortAsc ? 1 : -1;
      if (bv == null) return sortAsc ? -1 : 1;
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortAsc ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortAsc]);

  const handleSort = (key: keyof T | string) => {
    if (sortKey === key) setSortAsc((a) => !a);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div
      className={`rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-colors duration-300 ${className}`}
    >
      {(title || searchKeys.length > 0) && (
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex flex-wrap items-center justify-between gap-3">
          {title && (
            <h3 className="font-bold text-slate-800 dark:text-slate-100">
              {title}
            </h3>
          )}
          {searchKeys.length > 0 && (
            <input
              type="search"
              placeholder={t("common.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm w-48 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#137fec]/40 focus:border-[#137fec]"
            />
          )}
        </div>
      )}
      <div className="overflow-x-auto max-h-[540px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold sticky top-0 z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="px-4 py-3.5 whitespace-nowrap border-b border-slate-200 dark:border-slate-700"
                >
                  {col.sortable !== false &&
                  (dateKey === col.key || col.sortable || col.key === "RPN" || col.key === "S" || col.key === "O" || col.key === "D") ? (
                    <button
                      type="button"
                      onClick={() => handleSort(col.key)}
                      className="flex items-center gap-1 hover:text-[#137fec] transition-colors"
                    >
                      {col.label}
                      {sortKey === col.key && (
                        <span className="material-symbols-outlined text-base">
                          {sortAsc ? "arrow_drop_up" : "arrow_drop_down"}
                        </span>
                      )}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/80">
            {sorted.map((row, idx) => (
              <tr
                key={idKey ? String((row as Record<string, unknown>)[String(idKey)]) : idx}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                {columns.map((col) => {
                  const val = (row as Record<string, unknown>)[String(col.key)];
                  const k = String(col.key);
                  const isRPN = k === "RPN";
                  const rpn = typeof val === "number" ? val : Number(val);
                  let rpnHighlight = "";
                  if (isRPN && !Number.isNaN(rpn)) {
                    if (rpn >= 180) rpnHighlight = "bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200 font-semibold";
                    else if (rpn >= 120) rpnHighlight = "bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 font-medium";
                  }
                  return (
                    <td
                      key={k}
                      className={`px-4 py-3 text-slate-700 dark:text-slate-300 align-top ${
                        isRPN && rpnHighlight ? `tabular-nums ${rpnHighlight}` : ""
                      }`}
                    >
                      {col.render ? col.render(row) : String(val ?? "")}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
