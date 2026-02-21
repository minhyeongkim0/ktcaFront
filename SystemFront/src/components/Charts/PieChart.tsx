"use client";

import { PieChart as RechartsPie, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface PieItem {
  name: string;
  value: number;
}

interface PieChartProps {
  data: PieItem[];
  title?: string;
  colors?: string[];
}

const DEFAULT_COLORS = ["#137fec", "#22c55e", "#eab308", "#ef4444", "#8b5cf6", "#ec4899"];

export function PieChart({ data, title, colors = DEFAULT_COLORS }: PieChartProps) {
  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-sm">
      {title && <h3 className="font-bold text-[#111418] mb-4">{title}</h3>}
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPie>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [value, "건수"]} />
            <Legend />
          </RechartsPie>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
