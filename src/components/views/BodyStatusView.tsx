import { useState } from "react";
import {
  HeartPulse,
  Calendar,
  ChevronDown,
  Ruler,
  Scale,
  Activity,
  Flame,
  Dumbbell,
  Droplets,
  PieChart,
  CheckCircle2,
  BarChart3,
  Clock,
} from "lucide-react";
import type { TabType, UserStats } from "../../types/fitness";

interface BodyStatusViewProps {
  userStats?: UserStats;
  onSelectTab?: (tab: TabType) => void;
}

export default function BodyStatusView({
  userStats,
  onSelectTab,
}: BodyStatusViewProps) {
  const [timeRange, setTimeRange] = useState<"7 ngày" | "30 ngày" | "90 ngày">("30 ngày");
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState<"Cân nặng" | "Tỷ lệ mỡ" | "Khối cơ">("Cân nặng");
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Dynamic values or defaults from design
  const heightVal = userStats?.height || 175;
  const weightVal = userStats?.currentWeight || 68;
  const bmiVal = (weightVal / ((heightVal / 100) * (heightVal / 100))).toFixed(1);

  // Chart data configs
  const chartConfigs = {
    "Cân nặng": {
      unit: "kg",
      yTicks: ["70kg", "68kg", "66kg", "64kg"],
      data: [
        { day: "T2", val: 65.2 },
        { day: "T3", val: 66.8 },
        { day: "T4", val: 66.5 },
        { day: "T5", val: 66.9 },
        { day: "T6", val: 66.4 },
        { day: "T7", val: 67.5 },
        { day: "CN", val: 68.0 },
      ],
      minY: 64,
      maxY: 70,
    },
    "Tỷ lệ mỡ": {
      unit: "%",
      yTicks: ["18%", "16%", "14%", "12%"],
      data: [
        { day: "T2", val: 17.2 },
        { day: "T3", val: 16.8 },
        { day: "T4", val: 16.5 },
        { day: "T5", val: 16.2 },
        { day: "T6", val: 16.0 },
        { day: "T7", val: 15.9 },
        { day: "CN", val: 15.8 },
      ],
      minY: 12,
      maxY: 18,
    },
    "Khối cơ": {
      unit: "kg",
      yTicks: ["58kg", "56kg", "54kg", "52kg"],
      data: [
        { day: "T2", val: 54.0 },
        { day: "T3", val: 54.5 },
        { day: "T4", val: 55.0 },
        { day: "T5", val: 55.4 },
        { day: "T6", val: 55.8 },
        { day: "T7", val: 56.0 },
        { day: "CN", val: 56.3 },
      ],
      minY: 52,
      maxY: 58,
    },
  };

  const currentConfig = chartConfigs[activeChartTab];

  // Map data to SVG points
  const svgWidth = 560;
  const svgHeight = 160;
  const paddingLeft = 10;
  const paddingRight = 35;
  const paddingTop = 20;
  const paddingBottom = 20;

  const points = currentConfig.data.map((d, index) => {
    const x =
      paddingLeft +
      (index / (currentConfig.data.length - 1)) *
        (svgWidth - paddingLeft - paddingRight);
    const ratio = (d.val - currentConfig.minY) / (currentConfig.maxY - currentConfig.minY);
    const y = svgHeight - paddingBottom - ratio * (svgHeight - paddingTop - paddingBottom);
    return { x, y, day: d.day, val: d.val };
  });

  // Build SVG path
  const pathD = points.reduce((acc, p, i, arr) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = arr[i - 1];
    const cpX = (prev.x + p.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${p.y}, ${p.x} ${p.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingBottom} L ${points[0].x} ${svgHeight - paddingBottom} Z`;

  return (
    <div className="bs-container">
      {/* 1. Header */}
      <div className="bs-header">
        <div className="bs-header-left">
          <div className="bs-header-icon">
            <HeartPulse size={28} className="bs-pulse-svg" />
          </div>
          <div>
            <h1 className="bs-title">Thể trạng</h1>
            <p className="bs-subtitle">
              Theo dõi chỉ số cơ thể và cải thiện sức khỏe mỗi ngày
            </p>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="bs-time-dropdown-wrap">
          <button
            className="bs-time-btn"
            onClick={() => setShowTimeDropdown((prev) => !prev)}
          >
            <Calendar size={16} />
            <span>{timeRange}</span>
            <ChevronDown size={15} />
          </button>
          {showTimeDropdown && (
            <div className="bs-time-menu">
              {(["7 ngày", "30 ngày", "90 ngày"] as const).map((t) => (
                <button
                  key={t}
                  className={`bs-time-item ${timeRange === t ? "active" : ""}`}
                  onClick={() => {
                    setTimeRange(t);
                    setShowTimeDropdown(false);
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Top Row: Basic stats (Left) + Composition & Health (Right) */}
      <div className="bs-top-grid">
        {/* Left Card: Chỉ số cơ bản */}
        <div className="bs-card bs-card-basic">
          <div className="bs-basic-split">
            {/* Athlete 3D Avatar on Holographic platform */}
            <div className="bs-avatar-col">
              <div className="bs-avatar-stage">
                <div className="bs-avatar-halo" />
                <img
                  src="/images/body-athlete-full.png"
                  alt="Vóc dáng người tập"
                  className="bs-avatar-img"
                />
                <div className="bs-platform-ring bs-platform-ring-outer" />
                <div className="bs-platform-ring bs-platform-ring-inner" />
              </div>
            </div>

            {/* Metrics List */}
            <div className="bs-metrics-col">
              <h2 className="bs-card-title">Chỉ số cơ bản</h2>
              <div className="bs-metric-list">
                {/* 1. Chiều cao */}
                <div className="bs-metric-item">
                  <div className="bs-metric-icon bg-blue">
                    <Ruler size={18} />
                  </div>
                  <div className="bs-metric-info">
                    <span className="bs-metric-label">Chiều cao</span>
                    <span className="bs-metric-value">{heightVal} cm</span>
                  </div>
                </div>

                {/* 2. Cân nặng */}
                <div className="bs-metric-item">
                  <div className="bs-metric-icon bg-purple">
                    <Scale size={18} />
                  </div>
                  <div className="bs-metric-info">
                    <span className="bs-metric-label">Cân nặng</span>
                    <span className="bs-metric-value">{weightVal} kg</span>
                  </div>
                </div>

                {/* 3. BMI */}
                <div className="bs-metric-item">
                  <div className="bs-metric-icon bg-green">
                    <Activity size={18} />
                  </div>
                  <div className="bs-metric-info">
                    <span className="bs-metric-label">BMI</span>
                    <div className="bs-metric-value-row">
                      <span className="bs-metric-value">{bmiVal}</span>
                      <span className="bs-badge-normal">Bình thường</span>
                    </div>
                  </div>
                </div>

                {/* 4. Tỷ lệ mỡ */}
                <div className="bs-metric-item">
                  <div className="bs-metric-icon bg-orange">
                    <Flame size={18} />
                  </div>
                  <div className="bs-metric-info">
                    <span className="bs-metric-label">Tỷ lệ mỡ</span>
                    <span className="bs-metric-value">15.8%</span>
                  </div>
                </div>

                {/* 5. Khối cơ */}
                <div className="bs-metric-item">
                  <div className="bs-metric-icon bg-magenta">
                    <Dumbbell size={18} />
                  </div>
                  <div className="bs-metric-info">
                    <span className="bs-metric-label">Khối cơ</span>
                    <span className="bs-metric-value">56.3 kg</span>
                  </div>
                </div>

                {/* 6. Nước cơ thể */}
                <div className="bs-metric-item">
                  <div className="bs-metric-icon bg-cyan">
                    <Droplets size={18} />
                  </div>
                  <div className="bs-metric-info">
                    <span className="bs-metric-label">Nước cơ thể</span>
                    <span className="bs-metric-value">62.5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Thành phần cơ thể + Đánh giá sức khỏe */}
        <div className="bs-right-col">
          {/* Card: Thành phần cơ thể */}
          <div className="bs-card bs-card-comp">
            <div className="bs-card-head">
              <div className="bs-card-title-row">
                <PieChart size={18} className="bs-title-icon-cyan" />
                <span className="bs-card-title-text">Thành phần cơ thể</span>
              </div>
            </div>

            <div className="bs-comp-body">
              {/* Circular multi-arc gauge */}
              <div className="bs-gauge-wrap">
                <svg className="bs-gauge-svg" viewBox="0 0 140 140">
                  <circle
                    cx="70"
                    cy="70"
                    r="54"
                    fill="none"
                    stroke="#1e1842"
                    strokeWidth="12"
                  />
                  {/* Cyan arc: Water (offset background) */}
                  <circle
                    cx="70"
                    cy="70"
                    r="54"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="12"
                    strokeDasharray="339.29"
                    strokeDashoffset="120"
                    transform="rotate(-90 70 70)"
                    strokeLinecap="round"
                  />
                  {/* Green arc: Body fat */}
                  <circle
                    cx="70"
                    cy="70"
                    r="54"
                    fill="none"
                    stroke="#a3e635"
                    strokeWidth="12"
                    strokeDasharray="339.29"
                    strokeDashoffset="240"
                    transform="rotate(30 70 70)"
                    strokeLinecap="round"
                  />
                  {/* Purple arc: Muscle 78% */}
                  <circle
                    cx="70"
                    cy="70"
                    r="54"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="13"
                    strokeDasharray="339.29"
                    strokeDashoffset="75"
                    transform="rotate(-90 70 70)"
                    strokeLinecap="round"
                    style={{ filter: "drop-shadow(0 0 6px rgba(168, 85, 247, 0.6))" }}
                  />
                </svg>
                <div className="bs-gauge-center">
                  <span className="bs-gauge-percent">78%</span>
                  <span className="bs-gauge-label">Cơ bắp</span>
                </div>
              </div>

              {/* Legend & Breakdown */}
              <div className="bs-comp-legend">
                <div className="bs-legend-row">
                  <div className="bs-legend-dot bg-purple-dot" />
                  <span className="bs-legend-name">Cơ bắp</span>
                  <span className="bs-legend-val">56.3 kg <span className="bs-legend-pct">(78%)</span></span>
                </div>
                <div className="bs-legend-row">
                  <div className="bs-legend-dot bg-green-dot" />
                  <span className="bs-legend-name">Mỡ cơ thể</span>
                  <span className="bs-legend-val">15.8 kg <span className="bs-legend-pct">(15.8%)</span></span>
                </div>
                <div className="bs-legend-row">
                  <div className="bs-legend-dot bg-cyan-dot" />
                  <span className="bs-legend-name">Nước cơ thể</span>
                  <span className="bs-legend-val">62.5%</span>
                </div>
              </div>

              {/* 3D Wireframe Silhouette Anatomy */}
              <div className="bs-comp-anatomy">
                <img
                  src="/images/body-wireframe-anatomy.png"
                  alt="Mô hình giải phẫu 3D"
                  className="bs-anatomy-img"
                />
              </div>
            </div>
          </div>

          {/* Card: Đánh giá sức khỏe */}
          <div className="bs-card bs-card-health">
            <div className="bs-card-head">
              <div className="bs-card-title-row">
                <div className="bs-icon-pill-purple">
                  <HeartPulse size={16} />
                </div>
                <span className="bs-card-title-text">Đánh giá sức khỏe</span>
              </div>
              {/* Decorative green pulse line on top right */}
              <div className="bs-head-ecg">
                <svg width="100" height="24" viewBox="0 0 100 24" fill="none">
                  <path
                    d="M 0 12 L 20 12 L 28 4 L 36 20 L 44 8 L 52 14 L 60 12 L 100 12"
                    stroke="#10b981"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.8"
                  />
                </svg>
              </div>
            </div>

            <div className="bs-health-body">
              <div className="bs-health-left">
                <div className="bs-health-check-wrap">
                  <CheckCircle2 size={36} className="bs-green-check-icon" />
                </div>
                <div className="bs-health-verdict">
                  <div className="bs-verdict-title">Rất tốt!</div>
                  <p className="bs-verdict-desc">
                    Thể trạng của bạn đang ở mức lý tưởng. Hãy tiếp tục duy trì chế độ hiện tại nhé!
                  </p>
                </div>
              </div>

              <div className="bs-health-right-list">
                <div className="bs-health-bullet">
                  <CheckCircle2 size={16} className="bs-bullet-check" />
                  <span>Duy trì cân nặng hiện tại</span>
                </div>
                <div className="bs-health-bullet">
                  <CheckCircle2 size={16} className="bs-bullet-check" />
                  <span>Tăng cường tập luyện sức mạnh</span>
                </div>
                <div className="bs-health-bullet">
                  <CheckCircle2 size={16} className="bs-bullet-check" />
                  <span>Bổ sung đủ nước mỗi ngày</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: Biểu đồ chỉ số (Left) + Chỉ số gần đây (Right) */}
      <div className="bs-bottom-grid">
        {/* Left: Biểu đồ chỉ số */}
        <div className="bs-card bs-card-chart">
          <div className="bs-chart-head">
            <div className="bs-card-title-row">
              <BarChart3 size={18} className="bs-title-icon-purple" />
              <span className="bs-card-title-text">Biểu đồ chỉ số</span>
            </div>
            {/* Metric Selector Tabs */}
            <div className="bs-chart-tabs">
              {(["Cân nặng", "Tỷ lệ mỡ", "Khối cơ"] as const).map((tab) => (
                <button
                  key={tab}
                  className={`bs-chart-tab-btn ${activeChartTab === tab ? "active" : ""}`}
                  onClick={() => setActiveChartTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="bs-chart-canvas-area">
            {/* Y Axis ticks */}
            <div className="bs-chart-y-axis">
              {currentConfig.yTicks.map((tick, idx) => (
                <span key={idx} className="bs-y-tick">{tick}</span>
              ))}
            </div>

            {/* SVG Chart Graphic */}
            <div className="bs-chart-svg-container">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="bs-chart-svg"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="bsChartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                  </linearGradient>
                  <filter id="bsGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#a855f7" floodOpacity="0.8" />
                  </filter>
                </defs>

                {/* Subtle Horizontal grid guidelines */}
                {[0.15, 0.45, 0.75].map((ratio, i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={svgHeight * ratio}
                    x2={svgWidth}
                    y2={svgHeight * ratio}
                    stroke="#221b45"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Area Gradient */}
                <path d={areaD} fill="url(#bsChartGradient)" />

                {/* Smooth Curve Line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="3.2"
                  filter="url(#bsGlow)"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                {points.map((p, idx) => (
                  <g key={idx}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="4.5"
                      fill="#ffffff"
                      stroke="#8b5cf6"
                      strokeWidth="2.5"
                      className="bs-chart-dot"
                      onMouseEnter={() => setHoveredPoint(idx)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  </g>
                ))}
              </svg>

              {/* Floating Pill on Peak/Latest Point (CN) */}
              <div
                className="bs-chart-peak-pill"
                style={{
                  left: `${(points[points.length - 1].x / svgWidth) * 100}%`,
                  top: `${(points[points.length - 1].y / svgHeight) * 100}%`,
                }}
              >
                {points[points.length - 1].val} {currentConfig.unit}
              </div>

              {/* Interactive Tooltip on hover */}
              {hoveredPoint !== null && hoveredPoint !== points.length - 1 && (
                <div
                  className="bs-chart-hover-pill"
                  style={{
                    left: `${(points[hoveredPoint].x / svgWidth) * 100}%`,
                    top: `${(points[hoveredPoint].y / svgHeight) * 100}%`,
                  }}
                >
                  {points[hoveredPoint].val} {currentConfig.unit}
                </div>
              )}

              {/* X Axis labels */}
              <div className="bs-chart-x-axis">
                {currentConfig.data.map((d, idx) => (
                  <span key={idx} className="bs-x-tick">{d.day}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Chỉ số gần đây */}
        <div className="bs-card bs-card-recent">
          <div className="bs-recent-head">
            <div className="bs-card-title-row">
              <Clock size={18} className="bs-title-icon-purple" />
              <span className="bs-card-title-text">Chỉ số gần đây</span>
            </div>
            {onSelectTab && (
              <button
                className="bs-recent-detail-link"
                onClick={() => onSelectTab("Tiến độ")}
              >
                Xem chi tiết →
              </button>
            )}
          </div>

          <div className="bs-recent-list">
            {/* 1. Cân nặng */}
            <div className="bs-recent-row">
              <div className="bs-recent-item-left">
                <div className="bs-recent-icon bg-purple">
                  <Scale size={16} />
                </div>
                <span className="bs-recent-name">Cân nặng</span>
              </div>
              <div className="bs-recent-item-right">
                <span className="bs-recent-val">68 kg</span>
                <span className="bs-recent-badge badge-green">
                  ↑ +0.2
                </span>
              </div>
            </div>

            {/* 2. Tỷ lệ mỡ */}
            <div className="bs-recent-row">
              <div className="bs-recent-item-left">
                <div className="bs-recent-icon bg-orange">
                  <Flame size={16} />
                </div>
                <span className="bs-recent-name">Tỷ lệ mỡ</span>
              </div>
              <div className="bs-recent-item-right">
                <span className="bs-recent-val">15.8%</span>
                <span className="bs-recent-badge badge-green">
                  ↓ -0.1
                </span>
              </div>
            </div>

            {/* 3. Khối cơ */}
            <div className="bs-recent-row">
              <div className="bs-recent-item-left">
                <div className="bs-recent-icon bg-magenta">
                  <Dumbbell size={16} />
                </div>
                <span className="bs-recent-name">Khối cơ</span>
              </div>
              <div className="bs-recent-item-right">
                <span className="bs-recent-val">56.3 kg</span>
                <span className="bs-recent-badge badge-green">
                  ↑ +0.3
                </span>
              </div>
            </div>

            {/* 4. Nước cơ thể */}
            <div className="bs-recent-row">
              <div className="bs-recent-item-left">
                <div className="bs-recent-icon bg-cyan">
                  <Droplets size={16} />
                </div>
                <span className="bs-recent-name">Nước cơ thể</span>
              </div>
              <div className="bs-recent-item-right">
                <span className="bs-recent-val">62.5%</span>
                <span className="bs-recent-badge badge-green">
                  ↑ +0.5
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
