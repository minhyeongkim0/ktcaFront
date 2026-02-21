"use client";

import { exportContextReport } from "@/utils/download";
import type { ContextCompany } from "../contextTypes";
import { getDummyKpi, getCompanySummaryForExport } from "../contextTypes";
import { useLanguage } from "@/i18n/LanguageProvider";

const PRIMARY = "#1e40af";

type CustomerViewProps = {
  company: ContextCompany | null;
};

export function CustomerView({ company }: CustomerViewProps) {
  const { t } = useLanguage();
  if (!company) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
        선택된 고객 정보가 없습니다.
      </div>
    );
  }

  const customers = Array.isArray(company.customers) ? company.customers.join(", ") : String(company.customers ?? "");
  const products = Array.isArray(company.products) ? company.products : [];

  const handleExport = () => {
    exportContextReport(
      company.companyName,
      getCompanySummaryForExport(company),
      getDummyKpi(company)
    );
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <nav aria-label="Breadcrumb" className="flex text-slate-500 text-sm mb-1">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">home</span>
              <span className="font-medium" style={{ color: PRIMARY }}>{t("org.customers")}</span>
            </span>
          </nav>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{company.companyName}</h2>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all shadow-md"
            style={{ backgroundColor: PRIMARY }}
          >
            <span className="material-symbols-outlined text-lg">download</span>
            {t("org.exportReport")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/3 bg-slate-50 dark:bg-slate-800/50 p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
            <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 mb-4 flex items-center justify-center overflow-hidden">
              <span className="material-symbols-outlined text-4xl text-slate-400">groups</span>
            </div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-white">{company.companyName}</h4>
            <p className="text-sm font-semibold mt-1" style={{ color: PRIMARY }}>{company.ceo}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{company.type}</p>
          </div>
          <div className="md:w-2/3 p-8 flex flex-col justify-center relative">
            <span className="material-symbols-outlined text-6xl text-slate-100 dark:text-slate-800 absolute top-4 left-4 -z-0">format_quote</span>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">{t("context.partnership")}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                자동차 제조 및 완성차 브랜드로서 반도체·전장품 품질과 공급 안정성을 최우선으로 합니다. 장기 협력 관계를 유지합니다.
              </p>
              <div className="flex items-center gap-2" style={{ color: PRIMARY }}>
                <span className="w-8 h-px bg-current" />
                <span className="text-xs font-bold uppercase tracking-wider">{t("context.founded")} {company.founded}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: `${PRIMARY}20`, color: PRIMARY }}>
              <span className="material-symbols-outlined">verified</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">{t("context.keyInfo")}</h3>
          </div>
          <div className="border-l-4 p-4 mb-6 italic bg-slate-50 dark:bg-slate-800/50 rounded-r" style={{ borderColor: PRIMARY }}>
            <p className="text-slate-800 dark:text-slate-200 font-medium text-lg">
              {company.location} · {t("context.industry")}
            </p>
          </div>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-xl shrink-0" style={{ color: PRIMARY }}>check_circle</span>
              <div>
                <p className="font-bold text-sm text-slate-800 dark:text-white">{t("common.location")}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{company.location}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-xl shrink-0" style={{ color: PRIMARY }}>check_circle</span>
              <div>
                <p className="font-bold text-sm text-slate-800 dark:text-white">{t("context.keyContact")}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{company.ceo}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-xl shrink-0" style={{ color: PRIMARY }}>check_circle</span>
              <div>
                <p className="font-bold text-sm text-slate-800 dark:text-white">{t("context.productsSegment")}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{products.length > 0 ? products.join(", ") : "—"}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-xl shrink-0" style={{ color: PRIMARY }}>check_circle</span>
              <div>
                <p className="font-bold text-sm text-slate-800 dark:text-white">{t("context.related")}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{customers || "—"}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
        <span className="material-symbols-outlined text-slate-400">analytics</span>
        {t("context.partnerKpis")}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20">
            <span className="material-symbols-outlined">assignment_turned_in</span>
          </div>
          <h4 className="font-bold mb-2 text-slate-800 dark:text-white">{t("context.lastAuditStatus")}</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t("context.auditDate")}</p>
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">PASS</span>
            <span className="material-symbols-outlined text-slate-400 text-sm">arrow_forward</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20">
            <span className="material-symbols-outlined">star</span>
          </div>
          <h4 className="font-bold mb-2 text-slate-800 dark:text-white">{t("context.qualityRating")}</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t("context.qualityTarget")}</p>
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded">A+</span>
            <span className="material-symbols-outlined text-slate-400 text-sm">arrow_forward</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-amber-600 bg-amber-50 dark:bg-amber-900/20">
            <span className="material-symbols-outlined">handshake</span>
          </div>
          <h4 className="font-bold mb-2 text-slate-800 dark:text-white">{t("context.partnershipStatus")}</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t("context.activePartner")}</p>
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">{t("context.active")}</span>
            <span className="material-symbols-outlined text-slate-400 text-sm">arrow_forward</span>
          </div>
        </div>
      </div>
    </div>
  );
}
