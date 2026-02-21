import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Activity, BarChart3, Zap } from "lucide-react";
import { dummyData } from "@/data/dummyData";

type OperationViewProps = { selectedSideTab: string | null };

const COLORS = ["#137fec", "#22c55e", "#eab308", "#ef4444", "#8b5cf6"];

export function OperationView({ selectedSideTab }: OperationViewProps) {
  const operation = dummyData.operation ?? {};
  const processFlow = operation.processFlow ?? [];
  const processVariables = operation.processVariables ?? [];
  const controlLimits = operation.controlLimits ?? {};
  const kpis = operation.kpis ?? {};

  if (selectedSideTab === "flow") {
    return (
      <div className="max-w-2xl">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
          <Activity className="h-5 w-5 text-[#137fec]" />
          공정흐름도
        </h2>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <ol className="space-y-3">
            {processFlow.length > 0 ? (
              processFlow.map((step: string, i: number) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#137fec]/10 text-sm font-bold text-[#137fec]">{i + 1}</span>
                  <span className="font-medium text-slate-800">{step}</span>
                  {i < processFlow.length - 1 && <span className="text-slate-400">→</span>}
                </li>
              ))
            ) : (
              <li className="text-slate-500">공정 흐름 데이터 없음</li>
            )}
          </ol>
        </div>
      </div>
    );
  }

  if (selectedSideTab === "control") {
    const chartData = processVariables.map((p: { timestamp: string; tempC: number; pressureBar: number; flowLpm: number }) => ({
      time: p.timestamp.slice(11, 16),
      온도: p.tempC,
      압력: p.pressureBar,
      유량: p.flowLpm,
    }));

    const pieData = [
      { name: "설비 이상률", value: (kpis.equipmentAnomalyRate ?? 0) * 100, color: COLORS[0] },
      { name: "불량률", value: (kpis.defectRate ?? 0) * 100, color: COLORS[1] },
      { name: "기타", value: 100 - ((kpis.equipmentAnomalyRate ?? 0) + (kpis.defectRate ?? 0)) * 100, color: COLORS[2] },
    ].filter((d) => d.value > 0);

    const tempLimits = controlLimits.tempC ?? {};
    const pressureLimits = controlLimits.pressureBar ?? {};
    const flowLimits = controlLimits.flowLpm ?? {};

    return (
      <div className="space-y-8">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <BarChart3 className="h-5 w-5 text-[#137fec]" />
          공정관리
        </h2>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-bold text-slate-800">온도 / 압력 / 유량 (시간축)</h3>
          {chartData.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="온도" stroke={COLORS[0]} strokeWidth={2} dot={{ r: 3 }} />
                  <Line yAxisId="left" type="monotone" dataKey="압력" stroke={COLORS[1]} strokeWidth={2} dot={{ r: 3 }} />
                  <Line yAxisId="right" type="monotone" dataKey="유량" stroke={COLORS[2]} strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-slate-500">공정 변수 데이터 없음</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">온도 관리 한계</span>
            </div>
            <p className="mt-2 text-lg font-bold text-slate-800">LCL {tempLimits.LCL ?? "-"} / UCL {tempLimits.UCL ?? "-"} ℃</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm font-medium">압력 관리 한계</span>
            </div>
            <p className="mt-2 text-lg font-bold text-slate-800">LCL {pressureLimits.LCL ?? "-"} / UCL {pressureLimits.UCL ?? "-"} bar</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <Activity className="h-4 w-4" />
              <span className="text-sm font-medium">유량 관리 한계</span>
            </div>
            <p className="mt-2 text-lg font-bold text-slate-800">LCL {flowLimits.LCL ?? "-"} / UCL {flowLimits.UCL ?? "-"} L/min</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-bold text-slate-800">KPI (도넛)</h3>
            {pieData.length > 0 ? (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value" nameKey="name">
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={pieData[i].color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => `${v.toFixed(2)}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-slate-500">KPI 데이터 없음</p>
            )}
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-bold text-slate-800">KPI 카드</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between rounded-lg bg-slate-50 px-4 py-2">
                <span className="text-slate-600">설비 이상률</span>
                <span className="font-bold text-slate-800">{((kpis.equipmentAnomalyRate ?? 0) * 100).toFixed(2)}%</span>
              </li>
              <li className="flex justify-between rounded-lg bg-slate-50 px-4 py-2">
                <span className="text-slate-600">불량률</span>
                <span className="font-bold text-slate-800">{((kpis.defectRate ?? 0) * 100).toFixed(2)}%</span>
              </li>
              <li className="flex justify-between rounded-lg bg-slate-50 px-4 py-2">
                <span className="text-slate-600">에너지 소비율</span>
                <span className="font-bold text-slate-800">{kpis.energyConsumptionRate ?? "-"}</span>
              </li>
            </ul>
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
