import { Building2, Calendar, MapPin, User } from "lucide-react";
import { dummyData } from "@/data/dummyData";

type ContextViewProps = { selectedSideTab: string | null };

export function ContextView({ selectedSideTab }: ContextViewProps) {
  const companies = dummyData.context?.companies ?? [];
  const company = selectedSideTab
    ? companies.find((c) => c.type === selectedSideTab)
    : companies[0];

  if (!company) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-slate-500">선택된 회사 정보가 없습니다.</p>
      </div>
    );
  }

  const customers = Array.isArray(company.customers) ? company.customers.join(", ") : String(company.customers ?? "");
  const products = Array.isArray(company.products) ? company.products.join(", ") : String(company.products ?? "");

  return (
    <div className="max-w-2xl">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#137fec]/10">
            <Building2 className="h-6 w-6 text-[#137fec]" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{company.type}</span>
            <h2 className="mt-2 text-xl font-bold text-slate-800">{company.companyName}</h2>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex gap-2">
                <Calendar className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="text-slate-600">설립</span>
                <span className="font-medium text-slate-800">{company.founded}</span>
              </div>
              <div className="flex gap-2">
                <User className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="text-slate-600">대표이사</span>
                <span className="font-medium text-slate-800">{company.ceo}</span>
              </div>
              <div className="flex gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="text-slate-600">위치</span>
                <span className="font-medium text-slate-800">{company.location}</span>
              </div>
              <div>
                <span className="text-slate-600">고객사</span>
                <p className="font-medium text-slate-800">{customers || "-"}</p>
              </div>
              <div>
                <span className="text-slate-600">생산품목</span>
                <p className="font-medium text-slate-800">{products || "-"}</p>
              </div>
              <div>
                <span className="text-slate-600">생산량</span>
                <p className="font-medium text-slate-800">{company.capacity ?? "-"}</p>
              </div>
              <div>
                <span className="text-slate-600">리드타임</span>
                <p className="font-medium text-slate-800">{company.leadTimeDays != null ? `${company.leadTimeDays}일` : "-"}</p>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
