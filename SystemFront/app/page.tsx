export default function Home() {
  return (
    <>
      {/* Sidebar Empty State */}
      <aside className="w-72 bg-white border-r border-[#e5e7eb] flex flex-col items-center pt-20 px-6 gap-6 relative z-10 hidden md:flex">
        <div className="p-6 rounded-full bg-[#f6f7f8] border-2 border-dashed border-gray-200">
          <span className="material-symbols-outlined text-4xl text-gray-300">menu_open</span>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-[#111418] text-base font-bold">No Menu Selected</h3>
          <p className="text-gray-500 text-sm leading-relaxed">Select a menu from the top tabs to view detailed options and tools.</p>
        </div>
      </aside>

      {/* Main Dashboard Area */}
      <main className="flex-1 relative flex flex-col items-center justify-center p-8 bg-[#f6f7f8] overflow-hidden">
        {/* Watermark Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.03]">
          <span className="material-symbols-outlined text-[600px] text-gray-900 select-none">precision_manufacturing</span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-2xl w-full text-center space-y-8 animate-fade-in">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider mb-4">
              <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
              System Operational
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#111418] tracking-tight leading-tight">
              Welcome to <span className="text-[#137fec]">MES Dashboard</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
              Access your quality management tools through the navigation tabs above. Select a module to begin operations.
            </p>
          </div>

          {/* Quick Action Placeholders */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex flex-col items-center p-4 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm">
              <span className="material-symbols-outlined text-3xl text-[#137fec] mb-2">analytics</span>
              <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Real-time Data</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm">
              <span className="material-symbols-outlined text-3xl text-[#137fec] mb-2">fact_check</span>
              <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Quality Checks</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm">
              <span className="material-symbols-outlined text-3xl text-[#137fec] mb-2">settings_suggest</span>
              <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Optimization</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
