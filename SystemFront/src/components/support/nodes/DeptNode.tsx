"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";

export type DeptNodeData = {
  nameKo: string;
  nameEn: string;
  roleSummary: string;
  count: number;
};

export function DeptNode({ data }: NodeProps<DeptNodeData>) {
  return (
    <div
      className="rounded-xl border-2 border-[#137fec]/40 bg-[#137fec]/5 dark:bg-slate-800/80 px-5 py-3 w-[260px] min-h-[100px] box-border"
      style={{ width: 260, minHeight: 100 }}
    >
      <div className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate" title={data.nameKo}>
        {data.nameKo}
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2" title={`${data.count}명 · ${data.roleSummary}`}>
        {data.count}명 · {data.roleSummary}
      </div>
      <Handle type="target" position={Position.Top} id="t" />
      <Handle type="source" position={Position.Bottom} id="b" />
    </div>
  );
}
