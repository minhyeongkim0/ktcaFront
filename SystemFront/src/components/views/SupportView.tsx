import { Cpu, Users } from "lucide-react";
import { dummyData } from "@/data/dummyData";

type SupportViewProps = { selectedSideTab: string | null };

export function SupportView({ selectedSideTab }: SupportViewProps) {
  const support = dummyData.support ?? {};
  const orgChart = support.orgChart ?? { CEO: { name: "" }, departments: [] };
  const equipment = support.equipment ?? [];

  if (selectedSideTab === "org") {
    const depts = orgChart.departments ?? [];
    return (
      <div className="max-w-2xl space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <Users className="h-5 w-5 text-[#137fec]" />
            조직도
          </h2>
          <div className="mt-4">
            <div className="rounded-lg bg-slate-50 px-4 py-2 font-medium text-slate-800">CEO: {orgChart.CEO?.name ?? "-"}</div>
            <ul className="mt-4 space-y-2 pl-0 list-none">
              {depts.length > 0 ? (
                depts.map((d: { dept: string; members?: { title: string; name: string }[] }, i: number) => (
                  <li key={i} className="border-l-2 border-slate-200 pl-4">
                    <div className="font-medium text-slate-800">{d.dept}</div>
                    {d.members?.length ? (
                      <ul className="mt-1 space-y-0.5 text-sm text-slate-600">
                        {d.members.map((m: { title: string; name: string }, j: number) => (
                          <li key={j}>{m.name} ({m.title})</li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))
              ) : (
                <li className="text-slate-500">부서 데이터 없음</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (selectedSideTab === "equip") {
    return (
      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <Cpu className="h-5 w-5 text-[#137fec]" />
          장비
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {equipment.length > 0 ? (
            equipment.map((eq: { name: string; photo?: string; function: string; role: string; qty: number; spec: string; powerKW: number; throughput: string }, i: number) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                {eq.photo && (
                  <img
                    src={eq.photo}
                    alt={eq.name}
                    className="mb-3 h-24 w-full rounded-lg object-cover bg-slate-100"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                )}
                <h3 className="font-bold text-slate-800">{eq.name}</h3>
                <dl className="mt-2 space-y-1 text-sm text-slate-600">
                  <div><span className="text-slate-500">기능</span> {eq.function}</div>
                  <div><span className="text-slate-500">역할</span> {eq.role}</div>
                  <div><span className="text-slate-500">대수</span> {eq.qty}</div>
                  <div><span className="text-slate-500">SPEC</span> {eq.spec}</div>
                  <div><span className="text-slate-500">소비전력</span> {eq.powerKW} kW</div>
                  <div><span className="text-slate-500">생산량</span> {eq.throughput}</div>
                </dl>
              </div>
            ))
          ) : (
            <p className="col-span-full text-slate-500">장비 데이터 없음</p>
          )}
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
