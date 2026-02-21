"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDev = typeof process !== "undefined" && process.env.NODE_ENV === "development";

  useEffect(() => {
    console.error("[Global Error]", error?.message ?? error, error?.stack);
  }, [error]);

  return (
    <html lang="ko">
      <body style={{ margin: 0, fontFamily: "system-ui", background: "#f6f7f8", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: 24, maxWidth: 560 }}>
          <h1 style={{ fontSize: 18, color: "#1e293b" }}>앱을 불러오는 중 문제가 발생했습니다</h1>
          {isDev && error?.message && (
            <pre style={{ marginTop: 12, padding: 12, background: "#fef2f2", color: "#b91c1c", fontSize: 12, textAlign: "left", overflow: "auto" }}>
              {error.message}
            </pre>
          )}
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 8 }}>새로고침(F5) 해 보세요.</p>
          <button
            type="button"
            onClick={() => reset()}
            style={{ marginTop: 16, padding: "10px 20px", background: "#137fec", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14 }}
          >
            다시 시도
          </button>
        </div>
      </body>
    </html>
  );
}
