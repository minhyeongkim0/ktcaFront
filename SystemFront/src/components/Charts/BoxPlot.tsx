"use client";

export interface BoxPlotSeries {
  name: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
}

interface BoxPlotProps {
  data: BoxPlotSeries[];
  title?: string;
  width?: number;
  height?: number;
}

export function BoxPlot({ data, title, width = 400, height = 220 }: BoxPlotProps) {
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const allValues = data.flatMap((d) => [d.min, d.max]);
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const range = maxVal - minVal || 1;
  const n = data.length;
  const boxW = Math.max(20, (chartWidth / n) * 0.6);
  const gap = chartWidth / n;

  const toY = (v: number) => padding.top + chartHeight - ((v - minVal) / range) * chartHeight;

  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-sm">
      {title && <h3 className="font-bold text-[#111418] mb-4">{title}</h3>}
      <svg width={width} height={height} className="overflow-visible">
        {/* Y axis scale */}
        <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + chartHeight} stroke="#e5e7eb" strokeWidth={1} />
        <text x={padding.left - 6} y={padding.top} textAnchor="end" fontSize={10} fill="#64748b">{maxVal}</text>
        <text x={padding.left - 6} y={padding.top + chartHeight} textAnchor="end" fontSize={10} fill="#64748b">{minVal}</text>
        {data.map((d, i) => {
          const cx = padding.left + gap * (i + 0.5);
          const yMin = toY(d.min);
          const yQ1 = toY(d.q1);
          const yMed = toY(d.median);
          const yQ3 = toY(d.q3);
          const yMax = toY(d.max);
          return (
            <g key={d.name}>
              <line x1={cx} y1={yMin} x2={cx} y2={yMax} stroke="#137fec" strokeWidth={1} />
              <rect x={cx - boxW / 2} y={yQ3} width={boxW} height={yQ1 - yQ3} fill="#137fec" fillOpacity={0.3} stroke="#137fec" strokeWidth={1} />
              <line x1={cx - boxW / 2} y1={yMed} x2={cx + boxW / 2} y2={yMed} stroke="#137fec" strokeWidth={2} />
              <line x1={cx} y1={yMax} x2={cx} y2={yMax} stroke="#137fec" strokeWidth={2} />
              <line x1={cx} y1={yMin} x2={cx} y2={yMin} stroke="#137fec" strokeWidth={2} />
              <text x={cx} y={height - 8} textAnchor="middle" fontSize={10} fill="#64748b">{d.name}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
