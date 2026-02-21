import { Clock, MapPin, User } from "lucide-react";
import { dummyData } from "@/data/dummyData";

type HeaderProps = {
  user: { id: string; name: string; role: string } | null;
  nowKst: Date;
};

export function Header({ user, nowKst }: HeaderProps) {
  const formatKst = (d: Date) =>
    d.toLocaleString("ko-KR", { timeZone: "Asia/Seoul", dateStyle: "medium", timeStyle: "medium" });

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 shadow-sm">
      <h1 className="text-lg font-bold text-slate-800">{dummyData.header.title}</h1>
      <div className="flex items-center gap-6">
        <span className="flex items-center gap-2 text-sm text-slate-600">
          <Clock className="h-4 w-4" />
          {formatKst(nowKst)} KST
        </span>
        <span className="flex items-center gap-2 text-sm text-slate-600">
          <MapPin className="h-4 w-4" />
          {dummyData.branding.site}
        </span>
        {user && (
          <span className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-sm">
            <User className="h-4 w-4 text-[#137fec]" />
            <span className="font-medium text-slate-800">{user.name}</span>
            <span className="text-slate-500">({user.role})</span>
          </span>
        )}
      </div>
    </header>
  );
}
