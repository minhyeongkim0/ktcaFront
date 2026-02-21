type SectionCardProps = {
  title: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function SectionCard({ title, icon, badge, children, className = "" }: SectionCardProps) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm transition-colors duration-300 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-6 py-5">
        <h3 className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100 transition-colors duration-300">
          {icon}
          {title}
        </h3>
        {badge != null && badge}
      </div>
      <div className="px-6 pt-6 pb-3">{children}</div>
    </div>
  );
}
