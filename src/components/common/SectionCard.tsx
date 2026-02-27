"use client";

interface SectionCardProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
}

export default function SectionCard({ title, icon, children, className = "" }: SectionCardProps) {
  return (
    <div className={`bg-white dark:bg-[#1e293b] rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-600 flex items-center gap-2">
        {icon && (
          <span className="material-symbols-outlined text-[#137fec]">{icon}</span>
        )}
        <h3 className="font-bold text-[#111418] dark:text-[#ededed]">{title}</h3>
      </div>
      <div className="p-6 text-[#111418] dark:text-[#e5e7eb]">
        {children}
      </div>
    </div>
  );
}
