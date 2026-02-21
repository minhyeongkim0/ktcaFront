"use client";

import { useState, useMemo, useCallback } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import {
  orgDirectoryPeople,
  getDepartments,
  getTitles,
  RACI_OPTIONS,
  ORG_DIRECTORY_UPDATED_AT,
  raciSummary,
  type OrgDirectoryPerson,
  type RaciRole,
} from "@/data/support/orgDirectory";

type SortKey = "name" | "title" | "department" | "tenureYears";

const SORT_KEYS: { key: SortKey; labelKey: string }[] = [
  { key: "name", labelKey: "sortByName" },
  { key: "tenureYears", labelKey: "sortByTenure" },
  { key: "title", labelKey: "sortByTitle" },
  { key: "department", labelKey: "sortByDepartment" },
];

function searchText(p: OrgDirectoryPerson, q: string): boolean {
  if (!q.trim()) return true;
  const lower = q.toLowerCase();
  const fields = [
    p.name,
    p.title,
    p.department,
    p.phone,
    p.email,
    p.roleSummary ?? "",
    raciSummary(p.raci),
  ];
  return fields.some((f) => String(f).toLowerCase().includes(lower));
}

export function OrgDirectory() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState<string>("");
  const [filterTitle, setFilterTitle] = useState<string>("");
  const [filterRaci, setFilterRaci] = useState<string>("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [selected, setSelected] = useState<OrgDirectoryPerson | null>(null);

  const departments = useMemo(() => getDepartments(), []);
  const titles = useMemo(() => getTitles(), []);

  const filtered = useMemo(() => {
    return orgDirectoryPeople.filter((p) => {
      if (!searchText(p, search)) return false;
      if (filterDept && p.department !== filterDept) return false;
      if (filterTitle && p.title !== filterTitle) return false;
      if (filterRaci && (!p.raci?.summary || !String(p.raci.summary).includes(filterRaci))) return false;
      return true;
    });
  }, [search, filterDept, filterTitle, filterRaci]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const aNum = typeof av === "number" ? av : 0;
      const bNum = typeof bv === "number" ? bv : 0;
      if (sortKey === "tenureYears") {
        return sortAsc ? aNum - bNum : bNum - aNum;
      }
      const aStr = String(av ?? "");
      const bStr = String(bv ?? "");
      const cmp = aStr.localeCompare(bStr, "ko", { numeric: true });
      return sortAsc ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortAsc]);

  const byDepartment = useMemo(() => {
    const map = new Map<string, OrgDirectoryPerson[]>();
    sorted.forEach((p) => {
      const list = map.get(p.department) ?? [];
      list.push(p);
      map.set(p.department, list);
    });
    return map;
  }, [sorted]);

  const ceo = useMemo(() => orgDirectoryPeople.find((p) => p.isCeo), []);
  const totalPeople = orgDirectoryPeople.length;
  const deptCount = departments.length;
  const raciCount = orgDirectoryPeople.filter((p) => p.raci?.summary && /[RA]/.test(p.raci.summary)).length;

  const handleReset = useCallback(() => {
    setSearch("");
    setFilterDept("");
    setFilterTitle("");
    setFilterRaci("");
    setSortKey("name");
    setSortAsc(true);
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          {t("support.orgDirectoryTitle")}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {t("support.orgDirectoryIntro")}
        </p>
      </div>

      {/* Summary: KPI tiles + CEO card */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-4">
          <div className="text-2xl font-bold text-[#137fec]">{totalPeople}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{t("support.totalPeople")}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-4">
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{deptCount}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{t("support.departmentCount")}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-4">
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{raciCount}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{t("support.raciKeyRoles")}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-4">
          <div className="text-sm font-medium text-slate-800 dark:text-slate-100">{ORG_DIRECTORY_UPDATED_AT}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t("support.lastUpdated")}</div>
        </div>
      </div>

      {ceo && (
        <div className="rounded-2xl border-2 border-[#137fec]/40 bg-[#137fec]/5 dark:bg-slate-800/80 p-5 shadow-sm">
          <div className="font-bold text-slate-800 dark:text-slate-100 text-lg">{ceo.name}</div>
          <div className="text-sm text-[#137fec] font-medium mt-0.5">{ceo.title}</div>
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-600 dark:text-slate-300">
            <a href={`tel:${ceo.phone.replace(/\s/g, "")}`} className="flex items-center gap-1.5 hover:text-[#137fec]">
              <span className="material-symbols-outlined text-base">call</span>
              {ceo.phone}
            </a>
            <a href={`mailto:${ceo.email}`} className="flex items-center gap-1.5 truncate hover:text-[#137fec]">
              <span className="material-symbols-outlined text-base">mail</span>
              <span className="truncate max-w-[200px]">{ceo.email}</span>
            </a>
            <span className="flex items-center gap-1.5">근속 {ceo.tenureYears}년</span>
          </div>
        </div>
      )}

      {/* Control bar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            placeholder={t("common.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm w-48 min-w-[140px] bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#137fec]/40"
          />
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#137fec]/40"
          >
            <option value="">{t("support.filterDept")} (전체)</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select
            value={filterTitle}
            onChange={(e) => setFilterTitle(e.target.value)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#137fec]/40"
          >
            <option value="">{t("support.filterTitle")} (전체)</option>
            {titles.map((tit) => (
              <option key={tit} value={tit}>{tit}</option>
            ))}
          </select>
          <select
            value={filterRaci}
            onChange={(e) => setFilterRaci(e.target.value)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#137fec]/40"
          >
            <option value="">{t("support.filterRaci")} (전체)</option>
            {RACI_OPTIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#137fec]/40"
          >
            {SORT_KEYS.map(({ key, labelKey }) => (
              <option key={key} value={key}>{t(`support.${labelKey}`)}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setSortAsc((a) => !a)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            title={sortAsc ? t("support.descending") : t("support.ascending")}
          >
            <span className="material-symbols-outlined align-middle text-lg">
              {sortAsc ? "arrow_upward" : "arrow_downward"}
            </span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 rounded-lg text-sm bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            {t("support.resetFilters")}
          </button>
        </div>
      </div>

      {/* Main: department sections + table */}
      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400 font-medium">{t("support.noMatchingPeople")}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {departments.map((dept) => {
            const list = byDepartment.get(dept);
            if (!list?.length) return null;
            return (
              <div
                key={dept}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
              >
                <div className="px-5 py-3 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-100">
                  {dept} ({list.length}명)
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold">
                      <tr>
                        <th className="px-4 py-3 text-left whitespace-nowrap border-b border-slate-200 dark:border-slate-700">{t("support.dirName")}</th>
                        <th className="px-4 py-3 text-left whitespace-nowrap border-b border-slate-200 dark:border-slate-700">{t("support.dirTitle")}</th>
                        <th className="px-4 py-3 text-left whitespace-nowrap border-b border-slate-200 dark:border-slate-700">{t("support.dirTenure")}</th>
                        <th className="px-4 py-3 text-left whitespace-nowrap border-b border-slate-200 dark:border-slate-700">{t("support.dirContact")}</th>
                        <th className="px-4 py-3 text-left whitespace-nowrap border-b border-slate-200 dark:border-slate-700">{t("support.dirEmail")}</th>
                        <th className="px-4 py-3 text-left whitespace-nowrap border-b border-slate-200 dark:border-slate-700">{t("support.dirRaciSummary")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/80">
                      {list.map((p) => (
                        <tr
                          key={p.id}
                          onClick={() => setSelected(p)}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                        >
                          <td className="px-4 py-3 text-slate-800 dark:text-slate-200 font-medium">{p.name}</td>
                          <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{p.title}</td>
                          <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{p.tenureYears}년</td>
                          <td className="px-4 py-3">
                            <a href={`tel:${p.phone.replace(/\s/g, "")}`} className="text-[#137fec] hover:underline" onClick={(e) => e.stopPropagation()}>
                              {p.phone}
                            </a>
                          </td>
                          <td className="px-4 py-3 truncate max-w-[180px]">
                            <a href={`mailto:${p.email}`} className="text-[#137fec] hover:underline truncate block" onClick={(e) => e.stopPropagation()} title={p.email}>
                              {p.email}
                            </a>
                          </td>
                          <td className="px-4 py-3">
                            {p.raci?.summary ? (
                              <span className="inline-flex px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-600 text-xs text-slate-700 dark:text-slate-200">
                                {p.raci.summary}
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
          aria-label="인원 상세"
        >
          <div
            className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{selected.name}</h3>
                <p className="text-sm text-[#137fec] font-medium mt-0.5">{selected.title} · {selected.department}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                aria-label={t("common.close")}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <p className="text-slate-600 dark:text-slate-400">{t("support.dirRoleSummary")}: {selected.roleSummary ?? "-"}</p>
              <p>
                <span className="text-slate-500">{t("support.dirContact")}</span>{" "}
                <a href={`tel:${selected.phone.replace(/\s/g, "")}`} className="text-[#137fec]">{selected.phone}</a>
              </p>
              <p>
                <span className="text-slate-500">{t("support.dirEmail")}</span>{" "}
                <a href={`mailto:${selected.email}`} className="text-[#137fec] truncate block">{selected.email}</a>
              </p>
              <p><span className="text-slate-500">{t("support.dirTenure")}</span> {selected.tenureYears}년</p>
              {selected.raci && (
                <div>
                  <p className="text-slate-500 mb-1">{t("support.dirRaciSummary")} (요약)</p>
                  <p className="text-slate-700 dark:text-slate-300">{selected.raci.summary ?? "-"}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
