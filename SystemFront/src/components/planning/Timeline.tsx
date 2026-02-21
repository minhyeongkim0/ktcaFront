"use client";

type TimelineItem = {
  quarter: string;
  items: string[];
};

type TimelineProps = {
  items: TimelineItem[];
  className?: string;
};

export function Timeline({ items, className = "" }: TimelineProps) {
  return (
    <div className={`space-y-0 ${className}`}>
      {items.map((item, idx) => (
        <div
          key={item.quarter}
          className="flex gap-6 pb-6 last:pb-0"
        >
          <div className="flex flex-col items-center shrink-0">
            <div className="w-4 h-4 rounded-full bg-[#137fec] dark:bg-blue-500 shrink-0 mt-0.5" />
            {idx < items.length - 1 && (
              <div className="w-0.5 flex-1 min-h-[40px] bg-slate-200 dark:bg-slate-600 mt-2" />
            )}
          </div>
          <div className="flex-1 min-w-0 pb-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1.5 text-sm">{item.quarter}</h4>
            <div className="flex flex-wrap gap-2">
              {item.items.map((text, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300">
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
