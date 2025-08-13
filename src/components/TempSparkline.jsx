// src/components/TempSparkline.jsx
import React from "react";

/**
 * Simple, dependency-free sparkline chart.
 * props:
 *  - data: number[] temperatures
 *  - width, height: number
 *  - strokeWidth: number
 */
export default function TempSparkline({
  data = [],
  width = 260,
  height = 60,
  strokeWidth = 2,
}) {
  if (!data.length) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = Math.max(1, max - min); // avoid division by zero

  const stepX = width / (data.length - 1);
  const points = data
    .map((t, i) => {
      const x = i * stepX;
      // invert y, so higher temps go higher on chart
      const y = height - ((t - min) / range) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[60px]">
      {/* background line (baseline) */}
      <line
        x1="0"
        y1={height}
        x2={width}
        y2={height}
        stroke="currentColor"
        opacity="0.15"
      />
      {/* sparkline path */}
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        points={points}
      />
    </svg>
  );
}
