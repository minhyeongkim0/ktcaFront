type InfoFieldProps = {
  label: string;
  value: React.ReactNode;
  className?: string;
};

export function InfoField({ label, value, className = "" }: InfoFieldProps) {
  return (
    <div className={className}>
      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
        {label}
      </label>
      <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}
