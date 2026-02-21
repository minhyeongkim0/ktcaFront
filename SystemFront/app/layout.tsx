import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { LayoutHeader } from "@/components/LayoutHeader";
import { AuthProvider } from "@/components/AuthProvider";
import { AuthGate } from "@/components/AuthGate";
import { AlarmsProvider } from "@/context/AlarmsContext";

export const metadata: Metadata = {
  title: "통합 대시보드",
  description: "FDC 기반 설비 예지보전/관제 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('mes-theme');var l=localStorage.getItem('app.lang');if(l)document.documentElement.lang=l;if(t==='dark'||(!t&&typeof window!=='undefined'&&window.matchMedia&&window.matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark');else document.documentElement.classList.add('light');}catch(e){document.documentElement.classList.add('light');}})();`,
          }}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#f6f7f8] dark:bg-[#0f172a] text-[#111418] dark:text-[#f1f5f9] font-sans h-screen flex flex-col overflow-hidden transition-colors duration-300">
        <ThemeProvider>
          <LanguageProvider>
            <AlarmsProvider>
              <AuthProvider>
                <AuthGate>
                {/* Top App Bar: 로고/홈만, 고정 */}
                <LayoutHeader />

                {/* Main Content Layout: flex-1 + min-h-0 */}
                <div className="flex flex-1 min-h-0 overflow-hidden">
                  {children}
                </div>
              </AuthGate>
              </AuthProvider>
            </AlarmsProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
