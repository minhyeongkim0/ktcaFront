"use client";

const CARDS = [
  {
    icon: "groups",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    label: "Customer Focus",
    value: "98.5%",
    sub: "Satisfaction Score",
  },
  {
    icon: "trending_up",
    iconBg: "bg-purple-100 dark:bg-purple-900/40",
    iconColor: "text-purple-600 dark:text-purple-400",
    label: "Improvement",
    value: "12",
    sub: "Active Projects YTD",
  },
  {
    icon: "gavel",
    iconBg: "bg-orange-100 dark:bg-orange-900/40",
    iconColor: "text-orange-600 dark:text-orange-400",
    label: "Regulatory",
    value: "100%",
    sub: "Audit Compliance",
  },
];

export function LeadershipKpiCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {CARDS.map((card, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between"
        >
          <div className="mb-4">
            <span
              className={`inline-flex items-center justify-center h-10 w-10 rounded-lg ${card.iconBg} ${card.iconColor}`}
            >
              <span className="material-symbols-outlined">{card.icon}</span>
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              {card.label}
            </p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{card.value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{card.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
