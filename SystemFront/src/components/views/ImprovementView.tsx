import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Award, ClipboardList, Search } from "lucide-react";
import { dummyData } from "@/data/dummyData";

type ImprovementViewProps = { selectedSideTab: string | null };

const BAR_COLORS = { before: "#94a3b8", after: "#22c55e" };

export function ImprovementView({ selectedSideTab }: ImprovementViewProps) {
  const improvement = dummyData.improvement ?? {};
  const capaLog = improvement.capaLog ?? [];
  const defectsBeforeAfter = improvement.defectsBeforeAfter ?? [];
  const effectivenessBy = improvement.effectivenessBy ?? { byEquipment: [], byOperator: [] };

  const [capaSearch, setCapaSearch] = useState("");
  const [capaSortAsc, setCapaSortAsc] = useState(true);

  const filteredCapa = useMemo(() => {
    let list = [...capaLog];
    if (capaSearch.trim()) {
      const q = capaSearch.toLowerCase();
      list = list.filter(
        (row: { equipment?: string; rootCause?: string; action?: string; owner?: string }) =>
          [row.equipment, row.rootCause, row.action, row.owner].some((s) => String(s ?? "").toLowerCase().includes(q))
      );
    }
    list.sort((a: { date: string }, b: { date: string }) => {
      const cmp = a.date.localeCompare(b.date);
      return capaSortAsc ? cmp : -cmp;
    });
    return list;
  }, [capaLog, capaSearch, capaSortAsc]);

  const barData = useMemo(() => {
    return defectsBeforeAfter.map((d: { defect: string; beforeCount: number; afterCount: number }) => ({
      name: d.defect,
      개선전: d.beforeCount,
      개선후: d.afterCount,
      감소율: d.beforeCount > 0 ? ((d.beforeCount - d.afterCount) / d.beforeCount) * 100 : 0,
    }));
  }, [defectsBeforeAfter]);

  const top3Reduction = useMemo(() => {
    return [...barData].sort((a, b) => b.감소율 - a.감소율).slice(0, 3);
  }, [barData]);

  const [effectivenessTab, setEffectivenessTab] = useState<"equipment" | "operator">("equipment");
  const byEquipment = effectivenessBy.byEquipment ?? [];
  const byOperator = effectivenessBy.byOperator ?? [];

  if (selectedSideTab === "capa") {
    return (
      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <ClipboardList className="h-5 w-5 text-[#137fec]" />
          개선조치 이력관리
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="설비명 / 원인 / 조치 / 담당자 검색"
              value={capaSearch}
              onChange={(e) => setCapaSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 text-sm focus:border-[#137fec] focus:outline-none focus:ring-1 focus:ring-[#137fec]"
            />
          </div>
          <button
            type="button"
            onClick={() => setCapaSortAsc((v) => !v)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            날짜 {capaSortAsc ? "↑ 오름차순" : "↓ 내림차순"}
          </button>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
                <th className="p-3 font-medium">일자</th>
                <th className="p-3 font-medium">장비</th>
                <th className="p-3 font-medium">근본원인</th>
                <th className="p-3 font-medium">조치</th>
                <th className="p-3 font-medium">담당</th>
              </tr>
            </thead>
            <tbody>
              {filteredCapa.length > 0 ? (
                filteredCapa.map((row: { date: string; equipment: string; rootCause: string; action: string; owner: string }, i: number) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3 text-slate-800">{row.date}</td>
                    <td className="p-3 text-slate-700">{row.equipment}</td>
                    <td className="p-3 text-slate-700">{row.rootCause}</td>
                    <td className="p-3 text-slate-700">{row.action}</td>
                    <td className="p-3 text-slate-600">{row.owner}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="p-6 text-center text-slate-500">검색 결과 없음</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (selectedSideTab === "effectiveness") {
    return (
      <div className="space-y-8">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <Award className="h-5 w-5 text-[#137fec]" />
          효과성 검증
        </h2>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-bold text-slate-800">불량종류별 개선 전/후</h3>
            {barData.length > 0 ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" angle={-25} textAnchor="end" height={60} tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="개선전" fill={BAR_COLORS.before} name="개선 전" />
                    <Bar dataKey="개선후" fill={BAR_COLORS.after} name="개선 후" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-slate-500">데이터 없음</p>
            )}
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-bold text-slate-800">감소율 Top 3</h3>
            <ul className="space-y-3">
              {top3Reduction.length > 0 ? (
                top3Reduction.map((row, i) => (
                  <li key={i} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                    <span className="font-medium text-slate-800">{row.name}</span>
                    <span className="rounded bg-[#22c55e]/20 px-2 py-0.5 text-sm font-bold text-[#22c55e]">{row.감소율.toFixed(0)}%</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-500">데이터 없음</li>
              )}
            </ul>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex border-b border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={() => setEffectivenessTab("equipment")}
              className={`px-6 py-3 text-sm font-medium ${effectivenessTab === "equipment" ? "border-b-2 border-[#137fec] text-[#137fec]" : "text-slate-600 hover:text-slate-800"}`}
            >
              설비별
            </button>
            <button
              type="button"
              onClick={() => setEffectivenessTab("operator")}
              className={`px-6 py-3 text-sm font-medium ${effectivenessTab === "operator" ? "border-b-2 border-[#137fec] text-[#137fec]" : "text-slate-600 hover:text-slate-800"}`}
            >
              작업자별
            </button>
          </div>
          <div className="overflow-x-auto">
            {effectivenessTab === "equipment" ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
                    <th className="p-3 font-medium">장비</th>
                    <th className="p-3 font-medium">개선 전 불량률</th>
                    <th className="p-3 font-medium">개선 후 불량률</th>
                  </tr>
                </thead>
                <tbody>
                  {byEquipment.length > 0 ? (
                    byEquipment.map((row: { equipment: string; beforeDefectRate: number; afterDefectRate: number }, i: number) => (
                      <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-3 font-medium text-slate-800">{row.equipment}</td>
                        <td className="p-3">{(row.beforeDefectRate * 100).toFixed(2)}%</td>
                        <td className="p-3">{(row.afterDefectRate * 100).toFixed(2)}%</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={3} className="p-6 text-center text-slate-500">데이터 없음</td></tr>
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
                    <th className="p-3 font-medium">작업자</th>
                    <th className="p-3 font-medium">개선 전 불량률</th>
                    <th className="p-3 font-medium">개선 후 불량률</th>
                  </tr>
                </thead>
                <tbody>
                  {byOperator.length > 0 ? (
                    byOperator.map((row: { operator: string; beforeDefectRate: number; afterDefectRate: number }, i: number) => (
                      <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-3 font-medium text-slate-800">{row.operator}</td>
                        <td className="p-3">{(row.beforeDefectRate * 100).toFixed(2)}%</td>
                        <td className="p-3">{(row.afterDefectRate * 100).toFixed(2)}%</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={3} className="p-6 text-center text-slate-500">데이터 없음</td></tr>
                  )}
                </tbody>
              </table>
            )}
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
