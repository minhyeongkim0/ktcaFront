"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";

export type PersonNodeData = {
  name: string;
  title: string;
  tenureYears: number;
  phone: string;
  email: string;
};

export function PersonNode({ data }: NodeProps<PersonNodeData>) {
  const tenureText = data.tenureYears >= 1
    ? `${data.tenureYears}년`
    : `${Math.round(data.tenureYears * 10) / 10}년`;

  return (
    <div
      className="rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 shadow-sm px-4 py-3 w-[220px] min-h-[140px] box-border flex flex-col"
      style={{ width: 220, minHeight: 140 }}
      title={`${data.name} / ${data.title}`}
    >
      <div className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate" title={data.name}>
        {data.name}
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 truncate" title={data.title}>
        {data.title}
      </div>
      <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 min-w-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[14px] text-[#137fec] shrink-0" aria-hidden>
            schedule
          </span>
          <span className="truncate">{tenureText}</span>
        </div>
        <a
          href={`tel:${data.phone.replace(/\s/g, "")}`}
          className="flex items-center gap-2 truncate hover:text-[#137fec] min-w-0"
        >
          <span className="material-symbols-outlined text-[14px] shrink-0" aria-hidden>
            call
          </span>
          <span className="truncate" title={data.phone}>{data.phone}</span>
        </a>
        <a
          href={`mailto:${data.email}`}
          className="flex items-center gap-2 truncate hover:text-[#137fec] min-w-0"
        >
          <span className="material-symbols-outlined text-[14px] shrink-0" aria-hidden>
            mail
          </span>
          <span className="truncate" title={data.email}>{data.email}</span>
        </a>
      </div>
      <Handle type="target" position={Position.Top} id="t" />
    </div>
  );
}
