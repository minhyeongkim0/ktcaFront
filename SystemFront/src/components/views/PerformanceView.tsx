import { BarChart3, Download, FileText, TrendingUp, Users } from "lucide-react";
import { dummyData } from "@/data/dummyData";
import { downloadTextFile } from "@/utils/download";

type PerformanceViewProps = { selectedSideTab: string | null };

export function PerformanceView({ selectedSideTab }: PerformanceViewProps) {
  const performance = dummyData.performance ?? {};
  const reports = performance.reports ?? { weekly: [], monthly: [] };
  const weekly = reports.weekly ?? [];
  const monthly = reports.monthly ?? [];
  const employeeKpi = performance.employeeKpi ?? [];
  const monitoring = performance.monitoring ?? {};

  const handleDownload = (fileName: string, title: string, period: string) => {
    const content = `${title}\n기간: ${period}\n\n(더미 보고서)\n\n생성일: ${new Date().toISOString()}`;
    downloadTextFile(fileName.replace(/\.docx$/, ".txt"), content);
  };

  if (selectedSideTab === "monthly") {
    const list = monthly;
    return (
      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <FileText className="h-5 w-5 text-[#137fec]" />
          월간보고서
        </h2>
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <ul className="divide-y divide-slate-200">
            {list.length > 0 ? (
              list.map((r: { month: string; title: string; generatedAt: string; fileName: string }, i: number) => (
                <li key={i} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50">
                  <div>
                    <p className="font-medium text-slate-800">{r.title}</p>
                    <p className="text-sm text-slate-500">{r.month} · 생성 {r.generatedAt}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDownload(r.fileName, r.title, r.month)}
                    className="flex items-center gap-2 rounded-lg bg-[#137fec] px-4 py-2 text-sm font-medium text-white hover:bg-[#0d6bd8]"
                  >
                    <Download className="h-4 w-4" />
                    다운로드
                  </button>
                </li>
              ))
            ) : (
              <li className="px-6 py-8 text-center text-slate-500">데이터 없음</li>
            )}
          </ul>
        </div>
      </div>
    );
  }

  if (selectedSideTab === "weekly") {
    const list = weekly;
    return (
      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <FileText className="h-5 w-5 text-[#137fec]" />
          주간보고서
        </h2>
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <ul className="divide-y divide-slate-200">
            {list.length > 0 ? (
              list.map((r: { week: string; title: string; generatedAt: string; fileName: string }, i: number) => (
                <li key={i} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50">
                  <div>
                    <p className="font-medium text-slate-800">{r.title}</p>
                    <p className="text-sm text-slate-500">{r.week} · 생성 {r.generatedAt}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDownload(r.fileName, r.title, r.week)}
                    className="flex items-center gap-2 rounded-lg bg-[#137fec] px-4 py-2 text-sm font-medium text-white hover:bg-[#0d6bd8]"
                  >
                    <Download className="h-4 w-4" />
                    다운로드
                  </button>
                </li>
              ))
            ) : (
              <li className="px-6 py-8 text-center text-slate-500">데이터 없음</li>
            )}
          </ul>
        </div>
      </div>
    );
  }

  if (selectedSideTab === "kpi") {
    return (
      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <Users className="h-5 w-5 text-[#137fec]" />
          KPI평가
        </h2>
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
                <th className="p-3 font-medium">이름</th>
                <th className="p-3 font-medium">부서</th>
                <th className="p-3 font-medium">KPI</th>
                <th className="p-3 font-medium">목표</th>
                <th className="p-3 font-medium">실적</th>
                <th className="p-3 font-medium">달성률</th>
              </tr>
            </thead>
            <tbody>
              {employeeKpi.length > 0 ? (
                employeeKpi.map((row: { name: string; dept: string; kpi: string; target: number; actual: number; achievementRate: number }, i: number) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-800">{row.name}</td>
                    <td className="p-3 text-slate-600">{row.dept}</td>
                    <td className="p-3 text-slate-700">{row.kpi}</td>
                    <td className="p-3">{row.target}</td>
                    <td className="p-3">{row.actual}</td>
                    <td className="p-3 font-medium">{((row.achievementRate ?? 0) * 100).toFixed(0)}%</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="p-6 text-center text-slate-500">데이터 없음</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (selectedSideTab === "monitor") {
    const prod = monitoring.productionStatus ?? {};
    const equip = monitoring.equipmentStatus ?? [];
    const factory = monitoring.factoryStatus ?? {};
    const quality = monitoring.qualityStatus ?? {};
    const util = monitoring.utilizationStatus ?? {};

    return (
      <div className="space-y-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <BarChart3 className="h-5 w-5 text-[#137fec]" />
          모니터링
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">생산 현황</h3>
            <ul className="mt-2 space-y-1 text-sm text-slate-800">
              <li>금일 계획: {prod.todayPlan ?? "-"}</li>
              <li>금일 실적: {prod.todayOutput ?? "-"}</li>
              <li>WIP: {prod.wip ?? "-"}</li>
              <li>라인: {prod.line ?? "-"}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">설비 상태</h3>
            <ul className="mt-2 space-y-1 text-sm text-slate-800">
              {equip.length > 0 ? equip.map((e: { eq: string; state: string; alarm: number }, i: number) => (
                <li key={i}>{e.eq}: {e.state} (알람 {e.alarm})</li>
              )) : <li>-</li>}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">공장 환경</h3>
            <p className="mt-2 text-sm text-slate-800">
              {factory.temperatureC ?? "-"}℃, 습도 {factory.humidityPct ?? "-"}%, {factory.cleanroomClass ?? "-"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">품질 현황</h3>
            <p className="mt-2 text-sm text-slate-800">
              PPM {quality.ppm ?? "-"}, 불량률 {quality.defectRate ?? "-"}, 주요 불량 {quality.topDefect ?? "-"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="flex items-center gap-1 text-sm font-medium text-slate-500">
              <TrendingUp className="h-4 w-4" /> 가동 현황
            </h3>
            <p className="mt-2 text-sm text-slate-800">
              OEE {util.oee ?? "-"}, 가용률 {util.availability ?? "-"}, 성능률 {util.performance ?? "-"}, 품질률 {util.quality ?? "-"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <p className="text-slate-500">좌측 메뉴에서 항목을 선택하세요.</p>
    </div>
  );
}
