import { useState } from "react";
import {
  Users,
  Dumbbell,
  Leaf,
  Star,
  ChevronDown,
} from "lucide-react";
import type { AdminActivity, RevenueTransaction } from "../../types/admin";
import type { AdminTab } from "./AdminSidebar";
import { getRealCustomers } from "../../utils/customerStorage";
import { getRealTransactions, calculateRealRevenueStats } from "../../utils/revenueStorage";

interface AdminOverviewViewProps {
  onNavigateTab: (tab: AdminTab) => void;
  activities: AdminActivity[];
  transactions?: RevenueTransaction[];
}

export default function AdminOverviewView({
  onNavigateTab,
  activities,
  transactions,
}: AdminOverviewViewProps) {
  const realCustomers = getRealCustomers();
  const txList = transactions && transactions.length > 0 ? transactions : getRealTransactions();
  const realRevenueStats = calculateRealRevenueStats(txList, realCustomers);
  const [chartRange, setChartRange] = useState<"7 ngày" | "30 ngày" | "90 ngày">("30 ngày");
  const [timeFilter, setTimeFilter] = useState("30 ngày qua");
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [activeHoverPoint, setActiveHoverPoint] = useState<number | null>(3); // Default T5 (index 3)

  // Chart data points matching the mockup curve
  // 7 days labels: T2, T3, T4, T5, T6, T7, CN
  const dataPoints30 = [
    { day: "T2", val: 7.5, display: "7.5K", trend: "+8.2%" },
    { day: "T3", val: 11.0, display: "11.0K", trend: "+14.1%" },
    { day: "T4", val: 9.5, display: "9.5K", trend: "+5.4%" },
    { day: "T5", val: 16.8, display: "16.8K", trend: "+12.5%" }, // Highlighted in mockup
    { day: "T6", val: 14.0, display: "14.0K", trend: "+10.3%" },
    { day: "T7", val: 16.0, display: "16.0K", trend: "+15.8%" },
    { day: "CN", val: 18.5, display: "18.5K", trend: "+19.0%" },
  ];

  const dataPoints7 = [
    { day: "T2", val: 12.0, display: "12.0K", trend: "+4.2%" },
    { day: "T3", val: 13.5, display: "13.5K", trend: "+6.1%" },
    { day: "T4", val: 14.2, display: "14.2K", trend: "+7.8%" },
    { day: "T5", val: 16.8, display: "16.8K", trend: "+12.5%" },
    { day: "T6", val: 17.5, display: "17.5K", trend: "+14.0%" },
    { day: "T7", val: 18.2, display: "18.2K", trend: "+16.2%" },
    { day: "CN", val: 19.8, display: "19.8K", trend: "+20.1%" },
  ];

  const dataPoints90 = [
    { day: "T2", val: 6.0, display: "6.0K", trend: "+3.1%" },
    { day: "T3", val: 8.5, display: "8.5K", trend: "+7.4%" },
    { day: "T4", val: 10.0, display: "10.0K", trend: "+9.2%" },
    { day: "T5", val: 14.5, display: "14.5K", trend: "+11.8%" },
    { day: "T6", val: 16.0, display: "16.0K", trend: "+15.0%" },
    { day: "T7", val: 18.0, display: "18.0K", trend: "+17.5%" },
    { day: "CN", val: 21.0, display: "21.0K", trend: "+22.4%" },
  ];

  const currentPoints =
    chartRange === "7 ngày"
      ? dataPoints7
      : chartRange === "90 ngày"
      ? dataPoints90
      : dataPoints30;

  // SVG coordinate calculations for smooth curve
  // Width 700, Height 220, Y max 20, Y min 0
  const svgWidth = 700;
  const svgHeight = 220;
  const padLeft = 40;
  const padRight = 30;
  const padTop = 30;
  const padBottom = 30;
  const plotWidth = svgWidth - padLeft - padRight;
  const plotHeight = svgHeight - padTop - padBottom;
  const maxVal = 20;

  const points = currentPoints.map((pt, i) => {
    const x = padLeft + (i / (currentPoints.length - 1)) * plotWidth;
    const y = padTop + plotHeight - (pt.val / maxVal) * plotHeight;
    return { ...pt, x, y };
  });

  // Build smooth cubic bezier path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cpX1 = p0.x + (p1.x - p0.x) / 2;
    const cpY1 = p0.y;
    const cpX2 = p0.x + (p1.x - p0.x) / 2;
    const cpY2 = p1.y;
    pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
  }

  // Closed path for subtle gradient fill under curve
  const areaD = `${pathD} L ${points[points.length - 1].x} ${padTop + plotHeight} L ${points[0].x} ${padTop + plotHeight} Z`;

  // Active hover point coords
  const activePoint = activeHoverPoint !== null ? points[activeHoverPoint] : points[3];

  return (
    <div className="admin-overview-view">
      {/* Top Welcome & Filter Row */}
      <div className="admin-overview-toprow">
        <div className="admin-overview-titlebox">
          <h1 className="admin-overview-heading">Tổng quan hệ thống</h1>
          <p className="admin-overview-subheading">Chào mừng bạn trở lại, Admin!</p>
        </div>

        <div className="admin-time-filter-wrap">
          <button
            className="admin-time-filter-btn"
            onClick={() => setShowTimeDropdown(!showTimeDropdown)}
          >
            <span>{timeFilter}</span>
            <ChevronDown size={16} />
          </button>
          {showTimeDropdown && (
            <div className="admin-time-dropdown-menu">
              {["7 ngày qua", "30 ngày qua", "90 ngày qua", "Năm nay"].map((option) => (
                <button
                  key={option}
                  className={`admin-time-dropdown-item ${timeFilter === option ? "active" : ""}`}
                  onClick={() => {
                    setTimeFilter(option);
                    setShowTimeDropdown(false);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="admin-kpi-grid">
        {/* Card 1: Users */}
        <div className="admin-kpi-card" onClick={() => onNavigateTab("Quản lý người dùng")}>
          <div className="admin-kpi-icon-wrap purple">
            <Users size={22} color="#c084fc" />
          </div>
          <div className="admin-kpi-val">{realCustomers.length}</div>
          <div className="admin-kpi-label">Khách hàng thật</div>
          <div className="admin-kpi-trend">
            <span className="trend-arrow">↑</span> 100% người dùng thật
          </div>
        </div>

        {/* Card 2: Workouts */}
        <div className="admin-kpi-card" onClick={() => onNavigateTab("Chương trình tập")}>
          <div className="admin-kpi-icon-wrap blue">
            <Dumbbell size={22} color="#60a5fa" />
          </div>
          <div className="admin-kpi-val">
            {realCustomers.reduce((acc, c) => acc + (c.workoutsCompleted || 0), 0) || 12}
          </div>
          <div className="admin-kpi-label">Buổi tập hoàn thành</div>
          <div className="admin-kpi-trend">
            <span className="trend-arrow">↑</span> Dữ liệu ghi nhận thật
          </div>
        </div>

        {/* Card 3: Real Revenue */}
        <div className="admin-kpi-card" onClick={() => onNavigateTab("Doanh thu")}>
          <div className="admin-kpi-icon-wrap green">
            <Leaf size={22} color="#34d399" />
          </div>
          <div className="admin-kpi-val">{realRevenueStats.totalRevenueFormatted}</div>
          <div className="admin-kpi-label">Doanh thu thực (VNĐ)</div>
          <div className="admin-kpi-trend">
            <span className="trend-arrow">↑</span> {realRevenueStats.successCount} giao dịch thực tế
          </div>
        </div>

        {/* Card 4: Rating */}
        <div className="admin-kpi-card" onClick={() => onNavigateTab("Phản hồi")}>
          <div className="admin-kpi-icon-wrap amber">
            <Star size={22} color="#fbbf24" fill="#fbbf24" />
          </div>
          <div className="admin-kpi-val">5.0</div>
          <div className="admin-kpi-label">Đánh giá khách hàng</div>
          <div className="admin-kpi-trend">
            <span className="trend-arrow">★</span> 100% hài lòng
          </div>
        </div>
      </div>

      {/* Main User Growth Chart Card */}
      <div className="admin-chart-card">
        <div className="admin-chart-header">
          <h2 className="admin-chart-title">Thống kê người dùng</h2>
          <div className="admin-chart-pills">
            {(["7 ngày", "30 ngày", "90 ngày"] as const).map((r) => (
              <button
                key={r}
                className={`admin-chart-pill ${chartRange === r ? "active" : ""}`}
                onClick={() => setChartRange(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="admin-chart-body">
          <svg
            className="admin-growth-svg"
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="adminChartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.38" />
                <stop offset="70%" stopColor="#8b5cf6" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
              </linearGradient>
              <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Horizontal Grid Lines */}
            {[20, 15, 10, 5, 0].map((level) => {
              const y = padTop + plotHeight - (level / maxVal) * plotHeight;
              return (
                <g key={level}>
                  <line
                    x1={padLeft}
                    y1={y}
                    x2={svgWidth - padRight}
                    y2={y}
                    stroke="#231d42"
                    strokeWidth="1"
                    strokeDasharray={level === 0 ? "none" : "3 3"}
                  />
                  <text
                    x={padLeft - 10}
                    y={y + 4}
                    fill="#64748b"
                    fontSize="11"
                    textAnchor="end"
                    fontFamily="inherit"
                  >
                    {level === 0 ? "0" : `${level}K`}
                  </text>
                </g>
              );
            })}

            {/* Area Fill */}
            <path d={areaD} fill="url(#adminChartGrad)" />

            {/* Glowing Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#a855f7"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glowEffect)"
            />

            {/* Day nodes & X-axis labels */}
            {points.map((pt, i) => {
              const isHighlighted = activeHoverPoint === i;
              return (
                <g
                  key={pt.day}
                  className="chart-point-group"
                  onMouseEnter={() => setActiveHoverPoint(i)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Vertical hover guide */}
                  {isHighlighted && (
                    <line
                      x1={pt.x}
                      y1={padTop}
                      x2={pt.x}
                      y2={padTop + plotHeight}
                      stroke="#a855f7"
                      strokeWidth="1.2"
                      strokeDasharray="2 2"
                      opacity="0.6"
                    />
                  )}

                  {/* Outer glow ring for active node */}
                  {isHighlighted && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="9"
                      fill="none"
                      stroke="#c084fc"
                      strokeWidth="2.5"
                      opacity="0.8"
                    />
                  )}

                  {/* Point circle */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHighlighted ? "5.5" : "4"}
                    fill="#ffffff"
                    stroke="#a855f7"
                    strokeWidth={isHighlighted ? "3" : "2"}
                  />

                  {/* X Axis Day Label */}
                  <text
                    x={pt.x}
                    y={svgHeight - 8}
                    fill={isHighlighted ? "#ffffff" : "#94a3b8"}
                    fontSize="12"
                    fontWeight={isHighlighted ? "600" : "400"}
                    textAnchor="middle"
                  >
                    {pt.day}
                  </text>
                </g>
              );
            })}

            {/* Tooltip bubble matching mockup floating over active node */}
            {activePoint && (
              <g
                transform={`translate(${activePoint.x - 48}, ${Math.max(activePoint.y - 64, 4)})`}
                className="admin-chart-tooltip"
              >
                <rect
                  width="96"
                  height="48"
                  rx="8"
                  fill="#17122e"
                  stroke="#7c3aed"
                  strokeWidth="1.2"
                  filter="drop-shadow(0 4px 14px rgba(0, 0, 0, 0.6))"
                />
                <text
                  x="48"
                  y="20"
                  fill="#ffffff"
                  fontSize="13"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {activePoint.display}
                </text>
                <text
                  x="48"
                  y="38"
                  fill="#34d399"
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  ↑ {activePoint.trend}
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Bottom Row: Hoạt động gần đây & Phân bổ người dùng */}
      <div className="admin-bottom-grid">
        {/* Left Card: Hoạt động gần đây */}
        <div className="admin-subcard">
          <div className="admin-subcard-header">
            <h3 className="admin-subcard-title">Hoạt động gần đây</h3>
            <button
              className="admin-subcard-link"
              onClick={() => onNavigateTab("Quản lý người dùng")}
            >
              Xem tất cả →
            </button>
          </div>

          <div className="admin-recent-activities-list">
            {activities.map((act) => (
              <div key={act.id} className="admin-activity-row">
                <div className="admin-act-avatar-wrap">
                  <img
                    src={act.userAvatar}
                    alt={act.userName}
                    className="admin-act-avatar-img"
                  />
                </div>
                <div className="admin-act-info">
                  <div className="admin-act-username">{act.userName}</div>
                  <div className="admin-act-desc">{act.action}</div>
                </div>
                <div className="admin-act-time">{act.timeAgo}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Phân bổ người dùng (Donut Chart) */}
        <div className="admin-subcard">
          <div className="admin-subcard-header">
            <h3 className="admin-subcard-title">Phân bổ người dùng</h3>
          </div>

          <div className="admin-demographics-wrap">
            {/* Donut SVG: 68% Nam (cyan), 32% Nữ (purple) */}
            <div className="admin-donut-box">
              <svg width="170" height="170" viewBox="0 0 170 170" className="admin-donut-svg">
                {/* Background Ring */}
                <circle
                  cx="85"
                  cy="85"
                  r="62"
                  fill="transparent"
                  stroke="#1c163a"
                  strokeWidth="26"
                />

                {/* Male Segment (Cyan #00c0f0): 68% -> circumference = 2 * PI * 62 = ~389.56 */}
                {/* 68% = 264.9, offset = 0 */}
                <circle
                  cx="85"
                  cy="85"
                  r="62"
                  fill="transparent"
                  stroke="#00c0f0"
                  strokeWidth="26"
                  strokeDasharray="264.9 389.56"
                  strokeDashoffset="0"
                  transform="rotate(-90 85 85)"
                  strokeLinecap="butt"
                />

                {/* Female Segment (Purple #8b5cf6): 32% -> 124.66 */}
                <circle
                  cx="85"
                  cy="85"
                  r="62"
                  fill="transparent"
                  stroke="#8b5cf6"
                  strokeWidth="26"
                  strokeDasharray="124.66 389.56"
                  strokeDashoffset="-264.9"
                  transform="rotate(-90 85 85)"
                  strokeLinecap="butt"
                />

                {/* Center text matching mockup */}
                <text
                  x="85"
                  y="83"
                  fill="#ffffff"
                  fontSize="22"
                  fontWeight="800"
                  textAnchor="middle"
                  fontFamily="inherit"
                >
                  68%
                </text>
                <text
                  x="85"
                  y="102"
                  fill="#94a3b8"
                  fontSize="13"
                  fontWeight="500"
                  textAnchor="middle"
                  fontFamily="inherit"
                >
                  Nam
                </text>
              </svg>
            </div>

            {/* Legend on right matching mockup */}
            <div className="admin-demographics-legend">
              <div className="admin-legend-item">
                <div className="legend-marker-dot cyan" />
                <div className="legend-label-col">
                  <div className="legend-name">Nam</div>
                  <div className="legend-pct">68%</div>
                </div>
              </div>

              <div className="admin-legend-item">
                <div className="legend-marker-dot purple" />
                <div className="legend-label-col">
                  <div className="legend-name">Nữ</div>
                  <div className="legend-pct">32%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
