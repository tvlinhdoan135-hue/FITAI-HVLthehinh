import { useState } from "react";
import type { WeightRecord } from "../../types/fitness";

interface WeightProgressChartProps {
  records: WeightRecord[];
  timeframe: "7 ngày" | "30 ngày" | "90 ngày";
  onTimeframeChange: (tf: "7 ngày" | "30 ngày" | "90 ngày") => void;
}

export default function WeightProgressChart({
  records,
  timeframe,
  onTimeframeChange,
}: WeightProgressChartProps) {
  const [activePointIndex, setActivePointIndex] = useState<number | null>(records.length - 1);

  // Y-axis fixed domain for visual consistency as shown in mockup: 0kg to 60kg
  const yLabels = ["60kg", "40kg", "20kg", "0kg"];
  const chartHeight = 160;
  const chartWidth = 520;
  const paddingLeft = 45;
  const paddingRight = 25;
  const paddingTop = 30;
  const paddingBottom = 30;

  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;

  // Map weight to Y coordinate (0kg = bottom, 60kg = top)
  const getY = (val: number) => {
    const clamped = Math.max(0, Math.min(60, val));
    return paddingTop + plotHeight - (clamped / 60) * plotHeight;
  };

  const getX = (idx: number) => {
    if (records.length <= 1) return paddingLeft + plotWidth / 2;
    return paddingLeft + (idx / (records.length - 1)) * plotWidth;
  };

  const coords = records.map((r, idx) => ({
    x: getX(idx),
    y: getY(r.weight),
    weight: r.weight,
    date: r.date,
  }));

  // Build smooth bezier curve
  let pathD = `M ${coords[0]?.x ?? 0} ${coords[0]?.y ?? 0}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const curr = coords[i];
    const next = coords[i + 1];
    const cpX = (curr.x + next.x) / 2;
    pathD += ` C ${cpX} ${curr.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
  }

  const areaD = `${pathD} L ${coords[coords.length - 1]?.x ?? 0} ${chartHeight - paddingBottom} L ${coords[0]?.x ?? 0} ${chartHeight - paddingBottom} Z`;

  const activeCoord = activePointIndex !== null && coords[activePointIndex] ? coords[activePointIndex] : coords[coords.length - 1];

  return (
    <div className="weight-chart-container">
      <div className="chart-header-row">
        <div className="chart-title-wrap">
          <div className="chart-icon-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 20V10" />
              <path d="M18 20V4" />
              <path d="M6 20v-4" />
            </svg>
          </div>
          <span className="chart-card-title">Tiến độ của bạn</span>
        </div>
        <div className="chart-tabs">
          {(["7 ngày", "30 ngày", "90 ngày"] as const).map((tf) => (
            <button
              key={tf}
              className={`chart-tab-pill ${timeframe === tf ? "active" : ""}`}
              onClick={() => onTimeframeChange(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-svg-wrapper">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="main-chart-svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="purpleAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
            </linearGradient>
            <filter id="neonLineGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Horizontal grid lines & Y labels */}
          {[0, 1, 2, 3].map((step) => {
            const y = paddingTop + (step / 3) * plotHeight;
            const label = yLabels[step];
            return (
              <g key={step}>
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  fill="#757195"
                  fontSize="11"
                  fontWeight="500"
                  textAnchor="end"
                >
                  {label}
                </text>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - paddingRight}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.07)"
                  strokeDasharray="4 4"
                />
              </g>
            );
          })}

          {/* Area fill */}
          <path d={areaD} fill="url(#purpleAreaGrad)" />

          {/* Glowing curve */}
          <path
            d={pathD}
            fill="none"
            stroke="#b366ff"
            strokeWidth="3.2"
            strokeLinecap="round"
            filter="url(#neonLineGlow)"
          />

          {/* Dots */}
          {coords.map((c, i) => {
            const isActive = activePointIndex === i;
            return (
              <g
                key={i}
                className="chart-dot-group"
                onClick={() => setActivePointIndex(i)}
                onMouseEnter={() => setActivePointIndex(i)}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={isActive ? 6 : 4}
                  fill="#c084fc"
                  stroke="#17152d"
                  strokeWidth={isActive ? 3 : 2}
                />
                {isActive && (
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={10}
                    fill="none"
                    stroke="#c084fc"
                    strokeWidth="1.5"
                    opacity="0.6"
                  />
                )}
              </g>
            );
          })}

          {/* X Axis Labels */}
          {coords.map((c, i) => (
            <text
              key={i}
              x={c.x}
              y={chartHeight - 8}
              fill={activePointIndex === i ? "#e9d5ff" : "#757195"}
              fontSize="11"
              fontWeight={activePointIndex === i ? "700" : "500"}
              textAnchor="middle"
            >
              {c.date}
            </text>
          ))}
        </svg>

        {/* Floating Tooltip Pill */}
        {activeCoord && (
          <div
            className="chart-tooltip-badge"
            style={{
              left: `${(activeCoord.x / chartWidth) * 100}%`,
              top: `${(activeCoord.y / chartHeight) * 100 - 18}%`,
            }}
          >
            <span>{activeCoord.weight}kg</span>
          </div>
        )}
      </div>
    </div>
  );
}
