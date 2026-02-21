type KpiTileProps = {
  label: string;
  value: string | number;
  unit?: string;
  trend?: string;
  className?: string;
};

export function KpiTile({ label, value, unit = "", trend, className = "" }: KpiTileProps) {
  return (
    <div
      className={`rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 shadow-sm transition-colors duration-300 ${className}`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
        {label}
      </p>
      <div className="mt-0.5 flex items-baseline gap-1.5">
        <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
          {value}
          {unit}
        </span>
        {trend && trend !== "" && (
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{trend}</span>
        )}
      </div>
    </div>
  );
}
