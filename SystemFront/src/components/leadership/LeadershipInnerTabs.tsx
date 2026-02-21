"use client";

import { useState } from "react";

const PRIMARY = "#1e40af";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "policy", label: "Policy" },
  { id: "roles", label: "Roles & Responsibilities" },
  { id: "customer", label: "Customer Focus" },
] as const;

export function LeadershipInnerTabs() {
  const [activeId, setActiveId] = useState<string>("policy");

  return (
    <div className="border-b border-slate-200 dark:border-slate-700 mb-8">
      <nav aria-label="Tabs" className="-mb-px flex space-x-8">
        {TABS.map((tab) => {
          const isActive = activeId === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveId(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                isActive ? "" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300"
              }`}
              style={isActive ? { borderColor: PRIMARY, color: PRIMARY } : undefined}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
