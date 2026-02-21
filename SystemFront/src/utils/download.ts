/**
 * 브라우저에서 더미 텍스트 파일을 Blob으로 생성해 다운로드
 */
export function downloadTextFile(fileName: string, content: string, mimeType = "text/plain;charset=utf-8"): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Context 상세 화면 Export Report: 회사명 + 주요 지표를 텍스트 파일로 다운로드 */
export function exportContextReport(
  companyName: string,
  summary: Record<string, string>,
  kpi?: Record<string, string | number>
): void {
  const lines: string[] = [
    `Context Report: ${companyName}`,
    `Generated: ${new Date().toISOString()}`,
    "",
    "--- Company Summary ---",
    ...Object.entries(summary).map(([k, v]) => `${k}: ${v}`),
  ];
  if (kpi && Object.keys(kpi).length > 0) {
    lines.push("", "--- Key Metrics ---", ...Object.entries(kpi).map(([k, v]) => `${k}: ${v}`));
  }
  const safeName = companyName.replace(/[^\w\s-]/g, "").trim().slice(0, 50) || "report";
  downloadTextFile(`${safeName}_context_report.txt`, lines.join("\n"));
}

/** Leadership: 품질경영방침 서명본 더미 다운로드 (txt) */
export function downloadSignedPolicy(): void {
  const title = "품질경영방침 (Quality Management Policy)";
  const docId = "POL-QMS-001";
  const date = new Date().toISOString().slice(0, 10);
  const summary =
    "우리 회사는 자동차용 반도체(PMIC)의 기능 안전과 신뢰성을 최우선으로 하며, 표준화된 공정 운영과 데이터 기반 의사결정으로 품질 변동을 최소화한다. 협력사와 함께 공급망 품질을 강화하고, 지속적 개선을 통해 고객 요구를 초과 달성한다.";
  const content = [
    title,
    `Document ID: ${docId}`,
    `Date: ${date}`,
    "",
    "--- 본문 요약 ---",
    summary,
  ].join("\n");
  downloadTextFile("POL-QMS-001_signed_policy.txt", content);
}

/** 주간/월간 보고서 다운로드 (요약 텍스트) */
export function downloadReport(row: {
  week?: string;
  month?: string;
  title: string;
  summary?: string;
  generatedAt: string;
  fileName: string;
}): void {
  const period = row.week ?? row.month ?? "";
  const content = [
    row.title,
    `기간: ${period}`,
    `생성일시: ${row.generatedAt}`,
    "",
    "--- 요약 ---",
    row.summary ?? "-",
  ].join("\n");
  const name = (row.fileName || "report").replace(/\.(docx|pdf)$/i, "") || "report";
  downloadTextFile(`${name}.txt`, content);
}

/** Equipment: KPI + 장비 목록 요약 텍스트 다운로드 */
export function exportEquipmentReport(
  kpiSummary: Record<string, string>,
  equipmentSummary: string[]
): void {
  const lines: string[] = [
    "Equipment Management Report",
    `Generated: ${new Date().toISOString()}`,
    "",
    "--- KPI Summary ---",
    ...Object.entries(kpiSummary).map(([k, v]) => `${k}: ${v}`),
    "",
    "--- Equipment List ---",
    ...equipmentSummary,
  ];
  downloadTextFile("equipment_report.txt", lines.join("\n"));
}
