"use client";

const PRIMARY = "#1e40af";

type KpiCardProps = {
  title: string;
  value: string;
  sub: string;
  icon: string;
  iconBgClass?: string;
  iconColorClass?: string;
};

export function KpiCard({
  title,
  value,
  sub,
  icon,
  iconBgClass = "bg-blue-100 dark:bg-blue-900/40",
  iconColorClass = "text-blue-600 dark:text-blue-400",
}: KpiCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <span className={`inline-flex items-center justify-center h-10 w-10 rounded-lg shrink-0 ${iconBgClass} ${iconColorClass}`}>
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </span>
      </div>
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{title}</p>
      <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{sub}</p>
    </div>
  );
}
