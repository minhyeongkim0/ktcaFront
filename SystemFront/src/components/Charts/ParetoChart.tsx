"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from "recharts";

interface ParetoItem {
  name: string;
  count: number;
  pct?: number;
}

interface ParetoChartProps {
  data: ParetoItem[];
  title?: string;
}

export function ParetoChart({ data, title }: ParetoChartProps) {
  const withCumulative = data.map((d, i, arr) => {
    const cum = arr.slice(0, i + 1).reduce((s, x) => s + x.count, 0);
    const total = arr.reduce((s, x) => s + x.count, 0);
    return { ...d, cumulative: total ? (cum / total) * 100 : 0 };
  });

  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-sm">
      {title && <h3 className="font-bold text-[#111418] mb-4">{title}</h3>}
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={withCumulative} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#64748b" />
            <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#64748b" />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#64748b" tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(value: number, name: string) => (name === "cumulative" ? [`${value.toFixed(1)}%`, "누적%"] : [value, "건수"])} />
            <Legend />
            <Bar yAxisId="left" dataKey="count" fill="#137fec" name="건수" radius={[4, 4, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="#e11d48" strokeWidth={2} dot={{ r: 4 }} name="누적%" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
