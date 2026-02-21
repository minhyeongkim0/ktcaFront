"use client";

type SparklineProps = {
  /** 0–1 normalized values, left to right */
  data: number[];
  /** true = declining trend (orange/red stroke) */
  declining?: boolean;
  width?: number;
  height?: number;
  className?: string;
};

export function Sparkline({
  data,
  declining = false,
  width = 80,
  height = 28,
  className = "",
}: SparklineProps) {
  if (!data || data.length < 2) return null;

  const padding = 2;
  const w = width - padding * 2;
  const h = height - padding * 2;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);

  const points = data.map((v, i) => {
    const x = padding + i * step;
    const y = padding + h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  const pathD = `M ${points.join(" L ")}`;
  const areaD = `M ${padding},${padding + h} L ${points.join(" L ")} L ${padding + w},${padding + h} Z`;

  const strokeColor = declining ? "#f59e0b" : "#1e40af";
  const fillColor = declining ? "rgba(245,158,11,0.15)" : "rgba(30,64,175,0.15)";

  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      <path d={areaD} fill={fillColor} />
      <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
