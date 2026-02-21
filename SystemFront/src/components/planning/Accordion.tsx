"use client";

import { useState } from "react";

type AccordionItemProps = {
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

function AccordionItem({ title, icon, defaultOpen = false, children }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <span className="flex items-center gap-2">
          {icon}
          {title}
        </span>
        <span className="material-symbols-outlined text-slate-500 transition-transform" style={{ transform: open ? "rotate(180deg)" : undefined }}>
          expand_more
        </span>
      </button>
      {open && <div className="px-6 pb-6 pt-0 border-t border-slate-200 dark:border-slate-700">{children}</div>}
    </div>
  );
}

type AccordionProps = {
  items: { title: string; icon?: React.ReactNode; defaultOpen?: boolean; content: React.ReactNode }[];
  className?: string;
};

export function Accordion({ items, className = "" }: AccordionProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <AccordionItem
          key={item.title}
          title={item.title}
          icon={item.icon}
          defaultOpen={item.defaultOpen}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
}
