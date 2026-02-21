"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageProvider";

const NAV_ITEMS: { href: string; label: string; icon: string; disabled?: boolean }[] = [
  { href: "/", label: "home", icon: "home" },
  { href: "/fdc", label: "fdc", icon: "monitoring" },
  { href: "/management", label: "management", icon: "description" },
  { href: "/mes", label: "mes", icon: "factory", disabled: true },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function TopNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <nav
      className="shrink-0 bg-white dark:bg-slate-900 border-b border-[#e5e7eb] dark:border-slate-700 z-10 transition-colors duration-300"
      aria-label="Main navigation"
    >
      <div className="flex items-center min-h-[44px]">
        {/* Left: scrollable tab group */}
        <div className="flex-1 min-w-0 overflow-x-auto whitespace-nowrap px-2 py-1 no-scrollbar">
          <div className="inline-flex items-center gap-2">
            {NAV_ITEMS.map(({ href, label, icon, disabled }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              role="tab"
              aria-current={active ? "page" : undefined}
              aria-disabled={disabled}
              title={disabled ? "준비 중" : undefined}
              className={`
                inline-flex items-center gap-2 rounded-xl px-3 py-2.5 min-h-[40px] text-sm font-medium
                transition-all duration-200 border border-transparent
                ${disabled
                  ? "text-slate-400 dark:text-slate-500 opacity-70 cursor-default"
                  : active
                    ? "bg-[#137fec]/10 dark:bg-[#137fec]/15 text-[#137fec] border-[#137fec]/20 shadow-sm"
                    : "text-gray-500 dark:text-slate-400 hover:text-[#137fec] hover:bg-[#137fec]/5 dark:hover:bg-[#137fec]/10"
                }
              `}
            >
              <span
                className="material-symbols-outlined text-[1rem] shrink-0 [color:inherit]"
                aria-hidden
              >
                {icon}
              </span>
              <span>{t(`nav.${label}`)}</span>
              {disabled && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                  Soon
                </span>
              )}
            </Link>
          );
        })}
          </div>
        </div>
      </div>
    </nav>
  );
}
