import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import HeaderActions from "@/src/components/layout/HeaderActions";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "통합 대시보드",
  description: "설비 예지보전, 경영, MES 통합 대시보드",
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
            __html: `(function(){var t=localStorage.getItem('theme');var d=!t&&window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||d)document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');})();`,
          }}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} antialiased bg-[#f6f7f8] text-[#111418] font-sans min-h-screen flex flex-col dark:bg-[#101922] dark:text-[#ededed]`}>
        {/* Top App Bar */}
        <header className="header-bar flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e5e7eb] bg-white px-6 py-3 z-20 shadow-sm h-16 dark:bg-[#182635] dark:border-[#2d3d4f]">
          <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
            <div className="size-8 flex items-center justify-center text-[#137fec] bg-[#137fec]/10 rounded-lg">
              <span className="material-symbols-outlined text-2xl">precision_manufacturing</span>
            </div>
            <h2 className="text-[#111418] dark:text-[#ededed] text-lg font-bold leading-tight tracking-[-0.015em]">통합 대시보드</h2>
          </Link>
          <div className="flex flex-1 justify-end gap-6 items-center">
            <HeaderActions />
            {/* User Profile */}
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-600">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-[#111418] dark:text-[#ededed] leading-none">Quality Manager</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">이주병</p>
              </div>
              <div className="bg-[#137fec] rounded-full size-9 flex items-center justify-center text-white font-bold text-sm">
                JB
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Layout - min-h-0 enables flex child to shrink; scroll happens in PageShell. bg ensures first page (home) is dark when theme is dark. */}
        <div className="flex flex-1 min-h-0 overflow-hidden bg-[#f6f7f8] dark:bg-[#101922]">
          {children}
        </div>

        {/* Clock Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function updateClock() {
                const now = new Date();
                const h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
                const time = [h, m, s].map(function(n) { return String(n).padStart(2, '0'); }).join(':');
                const el = document.getElementById('clock');
                if (el) el.textContent = time;
              }
              updateClock();
              setInterval(updateClock, 1000);
            `,
          }}
        />
      </body>
    </html>
  );
}
