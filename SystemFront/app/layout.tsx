import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MES Quality Management",
  description: "MES Quality Management Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} antialiased bg-[#f6f7f8] text-[#111418] font-sans min-h-screen flex flex-col overflow-hidden`}>
        {/* Top App Bar */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e5e7eb] bg-white px-6 py-3 z-20 shadow-sm h-16">
          <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
            <div className="size-8 flex items-center justify-center text-[#137fec] bg-[#137fec]/10 rounded-lg">
              <span className="material-symbols-outlined text-2xl">precision_manufacturing</span>
            </div>
            <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em]">MES Quality Management</h2>
          </Link>
          <div className="flex flex-1 justify-end gap-6 items-center">
            <div className="hidden md:flex gap-3">
              {/* Clock */}
              <div className="flex items-center justify-center rounded-lg h-9 px-4 bg-[#f6f7f8] border border-transparent text-sm font-bold text-gray-600">
                <span className="material-symbols-outlined text-lg mr-2 text-[#137fec]">schedule</span>
                <span id="clock">--:--:--</span>
              </div>
              {/* Notifications */}
              <button className="flex items-center justify-center rounded-lg size-9 bg-[#f6f7f8] hover:bg-gray-200 text-gray-600 transition-colors relative">
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
            {/* User Profile */}
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-[#111418] leading-none">Jane Doe</p>
                <p className="text-xs text-gray-500 mt-1">Plant Manager</p>
              </div>
              <div className="bg-[#137fec] rounded-full size-9 flex items-center justify-center text-white font-bold">
                J
              </div>
            </div>
          </div>
        </header>

        {/* Horizontal Tab Bar */}
        <nav className="bg-white border-b border-[#e5e7eb] px-6 sticky top-0 z-10">
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            <Link href="/context" className="group flex flex-col items-center justify-center min-w-[100px] border-b-[3px] border-transparent hover:border-[#137fec]/30 px-4 py-4 transition-all">
              <span className="text-sm font-medium text-gray-500 group-hover:text-[#137fec] transition-colors">Context</span>
            </Link>
            <Link href="/leadership" className="group flex flex-col items-center justify-center min-w-[100px] border-b-[3px] border-transparent hover:border-[#137fec]/30 px-4 py-4 transition-all">
              <span className="text-sm font-medium text-gray-500 group-hover:text-[#137fec] transition-colors">Leadership</span>
            </Link>
            <Link href="/planning" className="group flex flex-col items-center justify-center min-w-[100px] border-b-[3px] border-transparent hover:border-[#137fec]/30 px-4 py-4 transition-all">
              <span className="text-sm font-medium text-gray-500 group-hover:text-[#137fec] transition-colors">Planning</span>
            </Link>
            <Link href="/support" className="group flex flex-col items-center justify-center min-w-[100px] border-b-[3px] border-transparent hover:border-[#137fec]/30 px-4 py-4 transition-all">
              <span className="text-sm font-medium text-gray-500 group-hover:text-[#137fec] transition-colors">Support</span>
            </Link>
            <Link href="/operation" className="group flex flex-col items-center justify-center min-w-[100px] border-b-[3px] border-transparent hover:border-[#137fec]/30 px-4 py-4 transition-all">
              <span className="text-sm font-medium text-gray-500 group-hover:text-[#137fec] transition-colors">Operation</span>
            </Link>
            <Link href="/performance" className="group flex flex-col items-center justify-center min-w-[100px] border-b-[3px] border-transparent hover:border-[#137fec]/30 px-4 py-4 transition-all">
              <span className="text-sm font-medium text-gray-500 group-hover:text-[#137fec] transition-colors">Performance</span>
            </Link>
            <Link href="/improvement" className="group flex flex-col items-center justify-center min-w-[100px] border-b-[3px] border-transparent hover:border-[#137fec]/30 px-4 py-4 transition-all">
              <span className="text-sm font-medium text-gray-500 group-hover:text-[#137fec] transition-colors">Improvement</span>
            </Link>
          </div>
        </nav>

        {/* Main Content Layout */}
        <div className="flex flex-1 overflow-hidden h-full">
          {children}
        </div>

        {/* Clock Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function updateClock() {
                const now = new Date();
                const time = now.toLocaleTimeString('en-US', { hour12: false, timeZone: 'UTC' });
                const el = document.getElementById('clock');
                if (el) el.textContent = time + ' UTC';
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
