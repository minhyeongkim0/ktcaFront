"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { strings as koStrings } from "./strings.ko";
import { ko } from "./locales/ko";
import { en } from "./locales/en";

const STORAGE_KEY = "app.lang";

export type Lang = "ko" | "en";

type Ko = typeof ko;
type En = typeof en;

const locales: Record<Lang, Ko | En> = { ko, en };

export type TKey = string;

export type TParams = Record<string, string | number>;

function getNested(obj: Record<string, unknown>, path: string): string | undefined {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : undefined;
}

function interpolate(str: string, params?: TParams): string {
  if (!params) return str;
  return str.replace(/\{\{(\w+)\}\}/g, (_, k) => String(params[k] ?? ""));
}

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (key: TKey, params?: TParams) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getStoredLang(): Lang {
  if (typeof window === "undefined") return "ko";
  const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
  if (stored === "ko" || stored === "en") return stored;
  return "ko";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ko");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLangState(getStoredLang());
    setMounted(true);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.lang = next === "ko" ? "ko" : "en";
    }
  }, []);

  const toggleLang = useCallback(() => {
    const next = lang === "ko" ? "en" : "ko";
    setLang(next);
  }, [lang, setLang]);

  const MISSING_FALLBACK = "(번역 누락)";

  const t = useCallback(
    (key: TKey, params?: TParams): string => {
      const res = getNested(locales[lang] as Record<string, unknown>, key);
      const missing = res == null;
      if (missing) {
        if (typeof process !== "undefined" && process.env?.NODE_ENV === "development") {
          console.warn(`[i18n] missing key: "${key}"`);
        }
        const koFallback = getNested(ko as unknown as Record<string, unknown>, key);
        const raw = koFallback ?? MISSING_FALLBACK;
        return interpolate(raw, params);
      }
      return interpolate(res, params);
    },
    [lang, mounted]
  );

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = lang === "ko" ? "ko" : "en";
    }
  }, [lang, mounted]);

  const value: LanguageContextValue = { lang, setLang, toggleLang, t };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

/** Alias for useLanguage().t */
export function useT() {
  const { t } = useLanguage();
  return t;
}

/** Inline translation component: <T k="common.refresh" /> */
export function T({ k, params }: { k: TKey; params?: TParams }) {
  const { t } = useLanguage();
  return <>{t(k, params)}</>;
}
