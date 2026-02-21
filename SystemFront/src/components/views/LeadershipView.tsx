import { FileText, MessageSquare, User } from "lucide-react";
import { dummyData } from "@/data/dummyData";

export function LeadershipView() {
  const leadership = dummyData.leadership ?? {};
  const policy = leadership.qualityPolicy ?? [];
  const ceoName = leadership.ceoName ?? "";
  const ceoPhoto = leadership.ceoPhoto ?? "";
  const ceoMessage = leadership.ceoMessage ?? "";

  return (
    <div className="max-w-3xl space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">대표</h2>
        <div className="mt-4 flex gap-6">
          {ceoPhoto && (
            <img
              src={ceoPhoto}
              alt={ceoName}
              className="h-32 w-24 rounded-lg object-cover bg-slate-100"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-[#137fec]" />
              <span className="font-bold text-slate-800">{ceoName}</span>
            </div>
            {ceoMessage && (
              <div className="mt-4 flex gap-2">
                <MessageSquare className="h-5 w-5 shrink-0 text-slate-400" />
                <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">{ceoMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <FileText className="h-5 w-5 text-[#137fec]" />
          품질방침
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600">
          {policy.length > 0 ? policy.map((line, i) => <li key={i}>{line}</li>) : <li>품질방침 데이터가 없습니다.</li>}
        </ul>
      </div>
    </div>
  );
}
