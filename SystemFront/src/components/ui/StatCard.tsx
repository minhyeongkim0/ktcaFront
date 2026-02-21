type StatCardProps = {
  label: string;
  value: string | number;
  sub?: string;
  barPercent?: number;
  className?: string;
};

export function StatCard({ label, value, sub, barPercent, className = "" }: StatCardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}
    >
      <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
        {label}
      </label>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-slate-800">{value}</span>
        {sub != null && sub !== "" && (
          <span className="text-xs text-slate-500">{sub}</span>
        )}
      </div>
      {barPercent != null && (
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600"
            style={{ width: `${Math.min(100, Math.max(0, barPercent))}%` }}
          />
        </div>
      )}
    </div>
  );
}
