"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export interface ControlChartPoint {
  date: string;
  value: number;
  ucl: number;
  lcl: number;
  cl: number;
}

interface ControlChartProps {
  data: ControlChartPoint[];
  valueKey?: string;
  title?: string;
}

export function ControlChart({ data, valueKey = "value", title }: ControlChartProps) {
  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-sm">
      {title && <h3 className="font-bold text-[#111418] mb-4">{title}</h3>}
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#64748b" />
            <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
            <Tooltip />
            <Legend />
            <ReferenceLine y={data[0]?.ucl} stroke="#ef4444" strokeDasharray="3 3" name="UCL" />
            <ReferenceLine y={data[0]?.cl} stroke="#22c55e" name="CL" />
            <ReferenceLine y={data[0]?.lcl} stroke="#ef4444" strokeDasharray="3 3" name="LCL" />
            <Line type="monotone" dataKey={valueKey} stroke="#137fec" strokeWidth={2} dot={{ r: 4 }} name="측정값" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
