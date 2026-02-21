"use client";

import type { SideMenuItem } from "@/data/dummyData";
import { useLanguage } from "@/i18n/LanguageProvider";

interface SideTabsProps {
  items: SideMenuItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function SideTabs({ items, selectedId, onSelect }: SideTabsProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{t("sideMenu.menu")}</p>
      {items.map((item) => {
        const isSelected = selectedId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left transition ${
              isSelected ? "bg-[#137fec]/10 text-[#137fec]" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {item.icon && (
              <span className={`material-symbols-outlined text-xl ${isSelected ? "text-[#137fec]" : "text-slate-400"}`}>
                {item.icon}
              </span>
            )}
            <span className="text-sm font-medium">{t(item.labelKey)}</span>
          </button>
        );
      })}
    </div>
  );
}
