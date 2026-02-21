import {
  Building2,
  Crown,
  ClipboardList,
  LifeBuoy,
  Settings,
  BarChart3,
  RefreshCcw,
  type LucideIcon,
} from "lucide-react";
import { dummyData } from "@/data/dummyData";
import { useLanguage } from "@/i18n/LanguageProvider";

export type TopTabKey = (typeof dummyData.uiMenus.topTabs)[number]["key"];

const TAB_ICONS: Record<TopTabKey, LucideIcon> = {
  context: Building2,
  leadership: Crown,
  planning: ClipboardList,
  support: LifeBuoy,
  operation: Settings,
  performance: BarChart3,
  improvement: RefreshCcw,
};

/** topTab.key → nav i18n key (context → organization) */
function getNavLabelKey(key: TopTabKey): string {
  return key === "context" ? "organization" : key;
}

type TopTabsProps = {
  selected: TopTabKey;
  onSelect: (key: TopTabKey) => void;
};

export function TopTabs({ selected, onSelect }: TopTabsProps) {
  const { t } = useLanguage();
  const tabs = dummyData.uiMenus.topTabs ?? [];

  return (
    <nav
      className="shrink-0 flex border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-start gap-2 overflow-x-auto whitespace-nowrap px-2 py-1 min-h-[44px] no-scrollbar">
        {tabs.map((tab) => {
          const key = tab.key as TopTabKey;
          const active = selected === key;
          const Icon = TAB_ICONS[key];
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-current={active ? "page" : undefined}
              onClick={() => onSelect(key)}
              className={`
                inline-flex items-center gap-2 rounded-xl px-3 py-2.5 min-h-[40px] text-sm font-medium
                transition-all duration-200 border border-transparent
                ${active
                  ? "bg-[#137fec]/10 dark:bg-[#137fec]/15 text-[#137fec] border-[#137fec]/20 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-[#137fec] hover:bg-[#137fec]/5 dark:hover:bg-[#137fec]/10"
                }
              `}
            >
              {Icon && (
                <Icon
                  className="h-4 w-4 shrink-0 [color:inherit]"
                  aria-hidden
                />
              )}
              <span>{t(`nav.${getNavLabelKey(key)}`)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
