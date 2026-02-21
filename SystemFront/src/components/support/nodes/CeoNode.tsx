"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";

export type CeoNodeData = {
  name: string;
  title: string;
  tenureYears: number;
  phone: string;
  email: string;
};

export function CeoNode({ data }: NodeProps<CeoNodeData>) {
  return (
    <div
      className="rounded-2xl border-2 border-[#137fec] bg-white dark:bg-slate-900 shadow-md px-6 py-4 w-[260px] min-h-[170px] box-border flex flex-col"
      style={{ width: 260, minHeight: 170 }}
    >
      <div className="font-bold text-slate-800 dark:text-slate-100 text-lg truncate" title={data.name}>
        {data.name}
      </div>
      <div className="text-sm text-[#137fec] font-medium mt-0.5 truncate" title={data.title}>
        {data.title}
      </div>
      <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-300 mt-2 w-fit">
        근속 {data.tenureYears}년
      </div>
      <div className="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-300 min-w-0">
        <a href={`tel:${data.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-[#137fec] min-w-0">
          <span className="material-symbols-outlined text-base shrink-0">call</span>
          <span className="truncate">{data.phone}</span>
        </a>
        <a href={`mailto:${data.email}`} className="flex items-center gap-2 truncate hover:text-[#137fec] min-w-0">
          <span className="material-symbols-outlined text-base shrink-0">mail</span>
          <span className="truncate">{data.email}</span>
        </a>
      </div>
      <Handle type="source" position={Position.Bottom} id="b" />
    </div>
  );
}
