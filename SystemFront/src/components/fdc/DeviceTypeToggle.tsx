"use client";

export type DeviceType = "AGV" | "OHT";

export interface DeviceTypeToggleProps {
  value: DeviceType;
  onChange: (v: DeviceType) => void;
  size?: "sm" | "md";
  className?: string;
}

export function DeviceTypeToggle({
  value,
  onChange,
  size = "md",
  className = "",
}: DeviceTypeToggleProps) {
  const isSm = size === "sm";
  const py = isSm ? "py-1.5" : "py-2";
  const px = isSm ? "px-3" : "px-4";
  const textSize = isSm ? "text-xs" : "text-sm";

  return (
    <div className={className}>
      <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">
        장비 타입
      </label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange("AGV")}
          className={`flex-1 ${py} ${px} rounded-lg font-medium transition-all ${textSize} ${
            value === "AGV"
              ? "bg-[#137fec] text-white"
              : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700"
          }`}
        >
          AGV
        </button>
        <button
          type="button"
          onClick={() => onChange("OHT")}
          className={`flex-1 ${py} ${px} rounded-lg font-medium transition-all ${textSize} ${
            value === "OHT"
              ? "bg-[#137fec] text-white"
              : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700"
          }`}
        >
          OHT
        </button>
      </div>
    </div>
  );
}
