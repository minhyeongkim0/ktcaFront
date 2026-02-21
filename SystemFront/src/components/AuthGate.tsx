"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { LoginView } from "@/components/views/LoginView";

const isDev = typeof process !== "undefined" && process.env.NODE_ENV === "development";

type AuthGateProps = {
  children: ReactNode;
};

const LOADING_TIMEOUT_MS = 3000;
const LONG_LOADING_MS = 8000;

export function AuthGate({ children }: AuthGateProps) {
  const router = useRouter();
  const { user, login, isReady } = useAuth();
  const [error, setError] = useState("");
  const [forceShow, setForceShow] = useState(false);
  const [longWait, setLongWait] = useState(false);

  useEffect(() => {
    if (isDev) console.log("[AuthGate] mounted", { isReady, user: user?.id ?? null });
    const t1 = setTimeout(() => setForceShow(true), LOADING_TIMEOUT_MS);
    const t2 = setTimeout(() => setLongWait(true), LONG_LOADING_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isReady, user]);

  const handleLogin = (id: string, password: string) => {
    setError("");
    const result = login(id, password);
    if (result.ok) {
      router.push("/");
    } else {
      setError(result.error ?? "");
    }
  };

  if (!isReady && !forceShow) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f6f7f8] dark:bg-[#0f172a]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#137fec] border-t-transparent" />
        <p className="text-sm text-slate-500 dark:text-slate-400">잠시만 기다려 주세요...</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">화면이 계속 이대로면 새로고침(F5) 해 보세요.</p>
      </div>
    );
  }

  if (!isReady && forceShow && longWait) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f6f7f8] dark:bg-[#0f172a] p-4">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">연결이 지연되고 있습니다.</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center max-w-xs">새로고침 후 다시 시도해 주세요.</p>
        <button
          type="button"
          onClick={() => typeof window !== "undefined" && window.location.reload()}
          className="rounded-lg bg-[#137fec] px-4 py-2 text-sm font-medium text-white hover:bg-[#0d6bd8]"
        >
          새로고침
        </button>
      </div>
    );
  }

  if (user === null) {
    return <LoginView onLogin={handleLogin} error={error} />;
  }

  return <>{children}</>;
}
