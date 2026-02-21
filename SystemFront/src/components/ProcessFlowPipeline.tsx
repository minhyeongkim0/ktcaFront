"use client";

import FlowArrow from "./FlowArrow";
import type { FlowStep } from "@/data/processFlow";

type Props = {
  steps: FlowStep[];
};

function StepCard({ step }: { step: FlowStep }) {
  const typeStyles = {
    raw: "border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30",
    process: "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50",
    semi: "border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30",
    finished: "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30",
  };
  const style = typeStyles[step.type];

  return (
    <div
      className={`flex flex-col shrink-0 w-[100px] sm:w-[110px] md:w-[120px] rounded-lg border-2 overflow-hidden shadow-sm transition-colors duration-300 ${style}`}
    >
      <div className="aspect-square w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={step.imageUrl}
          alt={step.label}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-2 text-center min-w-0">
        <p className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-snug break-words">
          {step.label}
        </p>
        {step.subLabel && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug break-words">
            {step.subLabel}
          </p>
        )}
      </div>
    </div>
  );
}

function FlowRow({ steps }: { steps: FlowStep[] }) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 flex-nowrap">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center gap-1 sm:gap-2 shrink-0">
          <StepCard step={step} />
          {i < steps.length - 1 && <FlowArrow direction="right" />}
        </div>
      ))}
    </div>
  );
}

/** 2줄 균등 분할 (7개 + 7개) */
const ROW_LENGTH = 7;

export default function ProcessFlowPipeline({ steps }: Props) {
  const row1 = steps.slice(0, ROW_LENGTH);
  const row2 = steps.slice(ROW_LENGTH);

  return (
    <div className="w-full overflow-hidden">
      <div className="flex flex-col items-center gap-2 sm:gap-3">
        <FlowRow steps={row1} />
        <FlowArrow direction="down" />
        <FlowRow steps={row2} />
      </div>
    </div>
  );
}
