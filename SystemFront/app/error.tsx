"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[App Error]", error?.message ?? error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">문제가 발생했습니다</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center max-w-md">
        일시적인 오류일 수 있습니다. 새로고침 후 다시 시도해 주세요.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-[#137fec] px-4 py-2 text-sm font-medium text-white hover:bg-[#0d6bd8]"
      >
        다시 시도
      </button>
    </div>
  );
}
