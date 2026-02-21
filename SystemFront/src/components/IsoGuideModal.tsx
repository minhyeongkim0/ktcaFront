"use client";

import { type ReactNode } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { GuidelineView } from "@/components/guideline/GuidelineView";

interface IsoGuideModalProps {
  open: boolean;
  onClose: () => void;
  onNavigate?: (url: string) => void;
  children?: ReactNode;
}

export function IsoGuideModal({ open, onClose, onNavigate }: IsoGuideModalProps) {
  const { t } = useLanguage();
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="iso-modal-title"
    >
      <div
        className="relative flex flex-col w-full max-w-4xl max-h-[90vh] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 id="iso-modal-title" className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {t("guideline.modalTitle")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center size-10 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label={t("guideline.modalClose")}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto p-6">
          <GuidelineView onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}
