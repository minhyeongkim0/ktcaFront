export default function Loading() {
  return (
    <div className="flex flex-1 min-h-0 items-center justify-center bg-[#f6f7f8] dark:bg-[#0f172a] p-8">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#137fec] border-t-transparent" />
        <p className="text-sm text-slate-500 dark:text-slate-400">로딩 중...</p>
      </div>
    </div>
  );
}
