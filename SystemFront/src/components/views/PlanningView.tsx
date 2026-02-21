import { FileText, Target, TrendingUp } from "lucide-react";
import { dummyData } from "@/data/dummyData";

type PlanningViewProps = { selectedSideTab: string | null };

export function PlanningView({ selectedSideTab }: PlanningViewProps) {
  const planning = dummyData.planning ?? {};
  const fmea = planning.fmea ?? [];
  const business = planning.businessPlan;
  const objectives = planning.qualityObjectivePlan ?? [];

  if (selectedSideTab === "fmea") {
    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h2 className="font-bold text-slate-800">FMEA</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
                <th className="p-3 font-medium">공정</th>
                <th className="p-3 font-medium">고장모드</th>
                <th className="p-3 font-medium">영향</th>
                <th className="p-3 font-medium">S</th>
                <th className="p-3 font-medium">O</th>
                <th className="p-3 font-medium">D</th>
                <th className="p-3 font-medium">RPN</th>
                <th className="p-3 font-medium">조치</th>
                <th className="p-3 font-medium">담당</th>
                <th className="p-3 font-medium">기한</th>
              </tr>
            </thead>
            <tbody>
              {fmea.length > 0 ? (
                fmea.map((row, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3 text-slate-800">{row.process}</td>
                    <td className="p-3 text-slate-700">{row.failureMode}</td>
                    <td className="p-3 text-slate-700">{row.effect}</td>
                    <td className="p-3">{row.S}</td>
                    <td className="p-3">{row.O}</td>
                    <td className="p-3">{row.D}</td>
                    <td className="p-3 font-medium">{row.RPN}</td>
                    <td className="p-3 text-slate-700">{row.action}</td>
                    <td className="p-3 text-slate-600">{row.owner}</td>
                    <td className="p-3 text-slate-600">{row.due}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={10} className="p-6 text-center text-slate-500">데이터 없음</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (selectedSideTab === "business") {
    const bp = business ?? {};
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <TrendingUp className="h-5 w-5 text-[#137fec]" />
            사업계획서 요약
          </h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div><span className="text-slate-500">연도</span> <span className="font-medium text-slate-800">{bp.year}</span></div>
            <div><span className="text-slate-500">비전</span> <p className="font-medium text-[#137fec]">{bp.vision}</p></div>
            <div><span className="text-slate-500">주요 제품</span> <p className="font-medium text-slate-800">{(bp.keyProducts ?? []).join(", ")}</p></div>
            <div><span className="text-slate-500">타겟 산업</span> <p className="font-medium text-slate-800">{(bp.targetIndustries ?? []).join(", ")}</p></div>
            <div><span className="text-slate-500">생산 목표</span> <p className="font-medium text-slate-800">{bp.productionGoal}</p></div>
            <div><span className="text-slate-500">품질 목표</span> <p className="font-medium text-slate-800">{bp.qualityGoal}</p></div>
            <div><span className="text-slate-500">CAPEX</span> <p className="font-medium text-slate-800">{bp.capex}</p></div>
          </dl>
        </div>
      </div>
    );
  }

  if (selectedSideTab === "objectives") {
    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h2 className="flex items-center gap-2 font-bold text-slate-800">
            <Target className="h-5 w-5 text-[#137fec]" />
            추진계획서
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
                <th className="p-3 font-medium">목표</th>
                <th className="p-3 font-medium">KPI</th>
                <th className="p-3 font-medium">기준</th>
                <th className="p-3 font-medium">목표치</th>
                <th className="p-3 font-medium">추진계획</th>
                <th className="p-3 font-medium">담당</th>
                <th className="p-3 font-medium">기한</th>
              </tr>
            </thead>
            <tbody>
              {objectives.length > 0 ? (
                objectives.map((row, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3 text-slate-800">{row.objective}</td>
                    <td className="p-3">{row.kpi}</td>
                    <td className="p-3">{row.baseline}</td>
                    <td className="p-3">{row.target}</td>
                    <td className="p-3 text-slate-700">{row.plan}</td>
                    <td className="p-3">{row.owner}</td>
                    <td className="p-3">{row.deadline}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={7} className="p-6 text-center text-slate-500">데이터 없음</td></tr>
              )}
            </tbody>
          </table>
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
