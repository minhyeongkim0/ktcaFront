"use client";

import { downloadSignedPolicy } from "@/utils/download";

const PRIMARY = "#1e40af";

const POLICY_TITLE = "품질경영방침 (Quality Management Policy)";
const DOC_ID = "POL-QMS-001";
const BADGE_LABEL = "ACTIVE: REV 2026";
const POLICY_BODY = `우리 회사는 자동차용 반도체(PMIC)의 기능 안전과 신뢰성을 최우선으로 하며,
표준화된 공정 운영과 데이터 기반 의사결정으로 품질 변동을 최소화한다.
협력사와 함께 공급망 품질을 강화하고, 지속적 개선을 통해 고객 요구를 초과 달성한다.`;
const APPROVED_BY = "Approved by the Board of Directors";

const CHECK_ITEMS = [
  {
    title: "Customer Satisfaction",
    desc: "Understanding and meeting current and future customer needs and striving to exceed their expectations.",
  },
  {
    title: "Continuous Improvement",
    desc: "Empowering our people to identify inefficiencies and drive innovation in our processes.",
  },
  {
    title: "Compliance",
    desc: "Adhering strictly to ISO 9001:2015 standards and all applicable legal and regulatory requirements.",
  },
  {
    title: "Risk Management",
    desc: "Systematically identifying and mitigating risks that could impact quality or delivery.",
  },
];

export function QualityPolicyCard() {
  const handleDownload = () => downloadSignedPolicy();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{POLICY_TITLE}</h2>
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800">
          <span className="material-symbols-outlined text-xs">check_circle</span>
          {BADGE_LABEL}
        </span>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-mono">Document ID: {DOC_ID}</p>
      <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 mb-8">
        <p className="whitespace-pre-line leading-relaxed">{POLICY_BODY}</p>
      </div>
      <ul className="space-y-4 mb-8">
        {CHECK_ITEMS.map((item, i) => (
          <li key={i} className="flex items-start gap-4">
            <div
              className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full"
              style={{ backgroundColor: `${PRIMARY}20`, color: PRIMARY }}
            >
              <span className="material-symbols-outlined text-sm font-bold">check</span>
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h4>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-6 gap-4">
        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{APPROVED_BY}</span>
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm text-sm font-medium text-slate-700 dark:text-white bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">download</span>
          Download Signed Policy (PDF)
        </button>
      </div>
    </div>
  );
}
