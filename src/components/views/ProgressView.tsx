import { useState } from "react";
import {
  TrendingUp,
  Scale,
  Ruler,
  Calendar,
  Plus,
  Flame,
  Dumbbell,
  Award,
  ChevronDown,
  Camera,
  CheckCircle2,
  Zap,
  Target,
  Edit2,
  X,
  Sparkles,
} from "lucide-react";
import type { WeightRecord, BodyMeasurements, UserStats } from "../../types/fitness";

interface ProgressViewProps {
  weightRecords: WeightRecord[];
  measurements: BodyMeasurements;
  userStats: UserStats;
  onOpenAddWeight: () => void;
  onUpdateMeasurements: (m: BodyMeasurements) => void;
}

interface PRRecord {
  id: string;
  exercise: string;
  category: "Ngực" | "Lưng" | "Chân" | "Vai" | "Tay";
  maxWeight: number; // kg
  reps: number;
  oneRepMax: number;
  date: string;
  gain: string;
  icon: string;
}

export default function ProgressView({
  weightRecords,
  measurements,
  userStats,
  onOpenAddWeight,
  onUpdateMeasurements,
}: ProgressViewProps) {
  // Chart and filter state
  const [timeframe, setTimeframe] = useState<"7 ngày" | "30 ngày" | "90 ngày" | "1 năm">("30 ngày");
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [chartMetric, setChartMetric] = useState<"Cân nặng" | "Tỷ lệ mỡ" | "Khối lượng" | "1RM">("Cân nặng");
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Measurement edit state
  const [isEditingMeasure, setIsEditingMeasure] = useState(false);
  const [chest, setChest] = useState(measurements.chest.toString());
  const [waist, setWaist] = useState(measurements.waist.toString());
  const [hips, setHips] = useState(measurements.hips.toString());
  const [arms, setArms] = useState(measurements.arms.toString());
  const [thighs, setThighs] = useState(measurements.thighs.toString());
  const [calves, setCalves] = useState("38");

  // PR Records State
  const [prCategory, setPrCategory] = useState<string>("Tất cả");
  const [showAddPrModal, setShowAddPrModal] = useState(false);
  const [prList, setPrList] = useState<PRRecord[]>([
    {
      id: "pr-1",
      exercise: "Barbell Bench Press (Đẩy ngực ngang)",
      category: "Ngực",
      maxWeight: 75,
      reps: 5,
      oneRepMax: 84,
      date: "12/11/2026",
      gain: "+5 kg",
      icon: "🏋️",
    },
    {
      id: "pr-2",
      exercise: "Barbell Back Squat (Gánh tạ đùi)",
      category: "Chân",
      maxWeight: 95,
      reps: 5,
      oneRepMax: 107,
      date: "08/11/2026",
      gain: "+7.5 kg",
      icon: "🦵",
    },
    {
      id: "pr-3",
      exercise: "Conventional Deadlift (Kéo tạ lưng đùi)",
      category: "Lưng",
      maxWeight: 120,
      reps: 3,
      oneRepMax: 128,
      date: "02/11/2026",
      gain: "+10 kg",
      icon: "🔥",
    },
    {
      id: "pr-4",
      exercise: "Overhead Dumbbell Press (Đẩy vai đôi)",
      category: "Vai",
      maxWeight: 22,
      reps: 6,
      oneRepMax: 26,
      date: "10/11/2026",
      gain: "+2 kg/bên",
      icon: "💪",
    },
    {
      id: "pr-5",
      exercise: "Barbell Bent-Over Row (Kéo lưng xô)",
      category: "Lưng",
      maxWeight: 70,
      reps: 6,
      oneRepMax: 81,
      date: "25/10/2026",
      gain: "+4 kg",
      icon: "🎯",
    },
    {
      id: "pr-6",
      exercise: "Incline Dumbbell Bench (Đẩy ngực trên)",
      category: "Ngực",
      maxWeight: 26,
      reps: 6,
      oneRepMax: 30,
      date: "05/11/2026",
      gain: "+3 kg/bên",
      icon: "⚡",
    },
  ]);

  // New PR form state
  const [newPrExercise, setNewPrExercise] = useState("Barbell Bench Press");
  const [newPrCategory, setNewPrCategory] = useState<"Ngực" | "Lưng" | "Chân" | "Vai" | "Tay">("Ngực");
  const [newPrWeight, setNewPrWeight] = useState("80");
  const [newPrReps, setNewPrReps] = useState("5");

  const handleSaveMeasurements = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMeasurements({
      chest: parseFloat(chest) || measurements.chest,
      waist: parseFloat(waist) || measurements.waist,
      hips: parseFloat(hips) || measurements.hips,
      arms: parseFloat(arms) || measurements.arms,
      thighs: parseFloat(thighs) || measurements.thighs,
      lastUpdated: "Hôm nay, vừa cập nhật",
    });
    setIsEditingMeasure(false);
  };

  const handleAddNewPr = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(newPrWeight) || 0;
    const r = parseInt(newPrReps) || 1;
    const estimated1RM = Math.round(w * (1 + r / 30));

    const newEntry: PRRecord = {
      id: `pr-${Date.now()}`,
      exercise: newPrExercise,
      category: newPrCategory,
      maxWeight: w,
      reps: r,
      oneRepMax: estimated1RM,
      date: "Hôm nay",
      gain: "+Mới",
      icon: "🏆",
    };

    setPrList([newEntry, ...prList]);
    setShowAddPrModal(false);
  };

  // Calendar consistency data (November 2026: 30 days)
  // Intensity: 2 = Heavy workout, 1 = Light / Cardio, 0 = Rest
  const calendarData = [
    { day: 1, status: 0 },
    { day: 2, status: 2 },
    { day: 3, status: 2 },
    { day: 4, status: 0 },
    { day: 5, status: 2 },
    { day: 6, status: 1 },
    { day: 7, status: 0 },
    { day: 8, status: 2 },
    { day: 9, status: 2 },
    { day: 10, status: 2 },
    { day: 11, status: 0 },
    { day: 12, status: 2 },
    { day: 13, status: 1 },
    { day: 14, status: 0 },
    { day: 15, status: 2 },
    { day: 16, status: 2 },
    { day: 17, status: 2 },
    { day: 18, status: 0 },
    { day: 19, status: 2 },
    { day: 20, status: 1 },
    { day: 21, status: 0 },
    { day: 22, status: 2 },
    { day: 23, status: 2 },
    { day: 24, status: 2 },
    { day: 25, status: 0 },
    { day: 26, status: 2 },
    { day: 27, status: 1 },
    { day: 28, status: 0 },
    { day: 29, status: 2 },
    { day: 30, status: 2 },
  ];

  // Build dynamic points from weightRecords if available, or use defaults
  const dynamicWeightPoints =
    weightRecords && weightRecords.length > 0
      ? weightRecords.slice(-8).map((r) => ({ label: r.date, val: r.weight }))
      : [
          { label: "01/11", val: 66.5 },
          { label: "05/11", val: 66.8 },
          { label: "09/11", val: 67.1 },
          { label: "13/11", val: 66.9 },
          { label: "17/11", val: 67.4 },
          { label: "21/11", val: 67.6 },
          { label: "25/11", val: 67.8 },
          { label: "30/11", val: userStats.currentWeight || 68.0 },
        ];

  const weightVals = dynamicWeightPoints.map((p) => p.val);
  const minW = Math.floor(Math.min(...weightVals) - 1);
  const maxW = Math.ceil(Math.max(...weightVals) + 1);

  // Multi-metric chart datasets
  const chartDatasets = {
    "Cân nặng": {
      unit: "kg",
      points: dynamicWeightPoints,
      min: minW,
      max: maxW,
      yTicks: [`${maxW}kg`, `${Math.round((maxW + minW) / 2)}kg`, `${minW}kg`],
      start: `${dynamicWeightPoints[0]?.val} kg`,
      lowest: `${Math.min(...weightVals)} kg`,
      highest: `${Math.max(...weightVals)} kg`,
      current: `${dynamicWeightPoints[dynamicWeightPoints.length - 1]?.val} kg`,
      change: `+${(
        (dynamicWeightPoints[dynamicWeightPoints.length - 1]?.val || 68) -
        (dynamicWeightPoints[0]?.val || 66.5)
      ).toFixed(1)} kg`,
    },
    "Tỷ lệ mỡ": {
      unit: "%",
      points: [
        { label: "01/11", val: 17.0 },
        { label: "05/11", val: 16.7 },
        { label: "09/11", val: 16.5 },
        { label: "13/11", val: 16.2 },
        { label: "17/11", val: 16.1 },
        { label: "21/11", val: 16.0 },
        { label: "25/11", val: 15.9 },
        { label: "30/11", val: 15.8 },
      ],
      min: 14,
      max: 18,
      yTicks: ["18%", "16%", "14%", "12%"],
      start: "17.0%",
      lowest: "15.8%",
      highest: "17.0%",
      current: "15.8%",
      change: "-1.2% (Đốt mỡ tốt)",
    },
    "Khối lượng": {
      unit: "Tấn",
      points: [
        { label: "01/11", val: 32.5 },
        { label: "05/11", val: 34.0 },
        { label: "09/11", val: 36.2 },
        { label: "13/11", val: 37.5 },
        { label: "17/11", val: 39.0 },
        { label: "21/11", val: 40.5 },
        { label: "25/11", val: 41.8 },
        { label: "30/11", val: 42.5 },
      ],
      min: 30,
      max: 45,
      yTicks: ["45T", "40T", "35T", "30T"],
      start: "32.5 Tấn",
      lowest: "32.5 Tấn",
      highest: "42.5 Tấn",
      current: "42.5 Tấn",
      change: "+10.0 Tấn (+30.7%)",
    },
    "1RM": {
      unit: "kg",
      points: [
        { label: "01/11", val: 78 },
        { label: "05/11", val: 79 },
        { label: "09/11", val: 80 },
        { label: "13/11", val: 81 },
        { label: "17/11", val: 82 },
        { label: "21/11", val: 82.5 },
        { label: "25/11", val: 83.5 },
        { label: "30/11", val: 84.0 },
      ],
      min: 75,
      max: 86,
      yTicks: ["86kg", "83kg", "80kg", "77kg"],
      start: "78 kg",
      lowest: "78 kg",
      highest: "84 kg",
      current: "84 kg (Bench)",
      change: "+6.0 kg 1RM",
    },
  };

  const activeDataset = chartDatasets[chartMetric];

  // SVG Chart points calculation
  const svgW = 560;
  const svgH = 175;
  const padL = 20;
  const padR = 40;
  const padT = 25;
  const padB = 25;

  const chartCoords = activeDataset.points.map((pt, i) => {
    const x = padL + (i / (activeDataset.points.length - 1)) * (svgW - padL - padR);
    const ratio = (pt.val - activeDataset.min) / (activeDataset.max - activeDataset.min);
    const y = svgH - padB - ratio * (svgH - padT - padB);
    return { x, y, label: pt.label, val: pt.val };
  });

  let chartPathD = `M ${chartCoords[0].x} ${chartCoords[0].y}`;
  for (let i = 0; i < chartCoords.length - 1; i++) {
    const p1 = chartCoords[i];
    const p2 = chartCoords[i + 1];
    const cpX = (p1.x + p2.x) / 2;
    chartPathD += ` C ${cpX} ${p1.y}, ${cpX} ${p2.y}, ${p2.x} ${p2.y}`;
  }
  const chartAreaD = `${chartPathD} L ${chartCoords[chartCoords.length - 1].x} ${svgH - padB} L ${chartCoords[0].x} ${svgH - padB} Z`;

  // Filtered PRs
  const filteredPrs =
    prCategory === "Tất cả"
      ? prList
      : prList.filter((item) => item.category === prCategory);

  return (
    <div className="pv-container">
      {/* 1. Header */}
      <div className="pv-header">
        <div className="pv-header-left">
          <div className="pv-header-icon">
            <TrendingUp size={26} className="pv-pulse-icon" />
          </div>
          <div>
            <div className="pv-eyebrow">
              <span className="pv-tag-badge">HÀNH TRÌNH BIẾN ĐỔI</span>
              <span className="pv-streak-badge">🔥 Chuỗi 12 ngày liên tiếp</span>
            </div>
            <h1 className="pv-title">Tiến độ tập luyện & Biến đổi hình thể</h1>
            <p className="pv-subtitle">
              Quan sát sự phát triển cơ bắp, mức tạ kỷ lục và tính kỷ luật qua từng giai đoạn huấn luyện.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pv-header-actions">
          {/* Timeframe Dropdown */}
          <div className="pv-dropdown-wrap">
            <button
              className="pv-btn-timeframe"
              onClick={() => setShowTimeDropdown((v) => !v)}
            >
              <Calendar size={15} />
              <span>{timeframe}</span>
              <ChevronDown size={14} />
            </button>
            {showTimeDropdown && (
              <div className="pv-dropdown-menu">
                {(["7 ngày", "30 ngày", "90 ngày", "1 năm"] as const).map((t) => (
                  <button
                    key={t}
                    className={`pv-dropdown-item ${timeframe === t ? "active" : ""}`}
                    onClick={() => {
                      setTimeframe(t);
                      setShowTimeDropdown(false);
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="pv-btn-action secondary" onClick={() => setShowAddPrModal(true)}>
            <Award size={16} />
            <span>+ Kỷ lục PR</span>
          </button>

          <button className="pv-btn-action primary" onClick={onOpenAddWeight}>
            <Plus size={16} />
            <span>Ghi nhận cân nặng</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 Stat Cards */}
      <div className="pv-stats-grid">
        {/* Card 1: Cân nặng hiện tại */}
        <div className="pv-stat-card">
          <div className="pv-stat-top">
            <div className="pv-stat-icon bg-purple">
              <Scale size={20} />
            </div>
            <span className="pv-stat-badge green">↑ +1.4 kg cơ nạc</span>
          </div>
          <div className="pv-stat-label">Cân nặng hiện tại</div>
          <div className="pv-stat-num-row">
            <span className="pv-stat-main-num">{userStats.currentWeight || 68}</span>
            <span className="pv-stat-unit">kg</span>
            <span className="pv-stat-target">/ Mục tiêu {userStats.targetWeight || 72} kg</span>
          </div>
          {/* Progress bar to target */}
          <div className="pv-stat-progress-bar">
            <div className="pv-stat-progress-fill purple" style={{ width: "72%" }} />
          </div>
          <div className="pv-stat-foot-text">Đã hoàn thành 72% lộ trình tăng cơ</div>
        </div>

        {/* Card 2: Thành phần cơ thể */}
        <div className="pv-stat-card">
          <div className="pv-stat-top">
            <div className="pv-stat-icon bg-green">
              <Zap size={20} />
            </div>
            <span className="pv-stat-badge green">↓ -1.2% mỡ</span>
          </div>
          <div className="pv-stat-label">Tỷ lệ mỡ & Khối lượng cơ</div>
          <div className="pv-stat-num-row">
            <span className="pv-stat-main-num">15.8</span>
            <span className="pv-stat-unit">%</span>
            <span className="pv-stat-sep">•</span>
            <span className="pv-stat-sub-val">56.3 kg cơ</span>
          </div>
          <div className="pv-stat-progress-bar dual">
            <div className="pv-stat-progress-fill purple" style={{ width: "78%" }} title="Cơ bắp 78%" />
            <div className="pv-stat-progress-fill green" style={{ width: "16%" }} title="Mỡ 15.8%" />
          </div>
          <div className="pv-stat-foot-text">Vóc dáng săn chắc • Cấp độ thể thao</div>
        </div>

        {/* Card 3: Khối lượng tạ (Volume) */}
        <div className="pv-stat-card">
          <div className="pv-stat-top">
            <div className="pv-stat-icon bg-magenta">
              <Dumbbell size={20} />
            </div>
            <span className="pv-stat-badge magenta">↑ +15% so tháng trước</span>
          </div>
          <div className="pv-stat-label">Tổng khối lượng tập (Volume)</div>
          <div className="pv-stat-num-row">
            <span className="pv-stat-main-num">42.5</span>
            <span className="pv-stat-unit">Tấn</span>
          </div>
          {/* Mini sparkline bars */}
          <div className="pv-mini-bars">
            {[45, 60, 52, 70, 68, 85, 92, 100].map((h, i) => (
              <div key={i} className="pv-bar-col" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="pv-stat-foot-text">Tích lũy 18 buổi tập trong tháng</div>
        </div>

        {/* Card 4: Kỷ luật & Streak */}
        <div className="pv-stat-card">
          <div className="pv-stat-top">
            <div className="pv-stat-icon bg-orange">
              <Flame size={20} />
            </div>
            <span className="pv-stat-badge orange">Tỷ lệ đạt 91%</span>
          </div>
          <div className="pv-stat-label">Kỷ luật buổi tập tháng</div>
          <div className="pv-stat-num-row">
            <span className="pv-stat-main-num">19</span>
            <span className="pv-stat-unit">/ 21 buổi</span>
          </div>
          <div className="pv-stat-progress-bar">
            <div className="pv-stat-progress-fill orange" style={{ width: "91%" }} />
          </div>
          <div className="pv-stat-foot-text">Vượt 2 buổi so với chỉ tiêu tháng 10</div>
        </div>
      </div>

      {/* 3. Middle Grid: Interactive Main Chart (65%) + Body Transformation Milestone (35%) */}
      <div className="pv-middle-grid">
        {/* Left: Main Multi-Metric Chart Card */}
        <div className="pv-card pv-main-chart-card">
          <div className="pv-chart-header">
            <div>
              <div className="pv-card-title-row">
                <Target size={18} className="text-purple-glow" />
                <h2 className="pv-card-title">Phân tích xu hướng phát triển</h2>
              </div>
              <p className="pv-card-subtitle">
                Đường biểu diễn tiến trình theo từng tiêu chí lựa chọn
              </p>
            </div>

            {/* Metric Switcher Tabs */}
            <div className="pv-metric-tabs">
              {(["Cân nặng", "Tỷ lệ mỡ", "Khối lượng", "1RM"] as const).map((m) => (
                <button
                  key={m}
                  className={`pv-metric-tab-btn ${chartMetric === m ? "active" : ""}`}
                  onClick={() => setChartMetric(m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Chart Render */}
          <div className="pv-chart-viewport">
            <div className="pv-chart-y-axis">
              {activeDataset.yTicks.map((tick, idx) => (
                <span key={idx} className="pv-y-tick">{tick}</span>
              ))}
            </div>

            <div className="pv-chart-canvas-wrap">
              <svg
                viewBox={`0 0 ${svgW} ${svgH}`}
                className="pv-main-svg"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="pvGlowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                  </linearGradient>
                  <filter id="pvLineGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#a855f7" floodOpacity="0.8" />
                  </filter>
                </defs>

                {/* Gridlines */}
                {[0.2, 0.5, 0.8].map((ratio, i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={svgH * ratio}
                    x2={svgW}
                    y2={svgH * ratio}
                    stroke="#221b45"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Area fill */}
                <path d={chartAreaD} fill="url(#pvGlowGrad)" />

                {/* Neon curve */}
                <path
                  d={chartPathD}
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="3.4"
                  filter="url(#pvLineGlow)"
                  strokeLinecap="round"
                />

                {/* Points */}
                {chartCoords.map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredPointIndex === idx ? 7 : 5}
                    fill="#ffffff"
                    stroke="#8b5cf6"
                    strokeWidth="2.5"
                    className="pv-svg-dot"
                    onMouseEnter={() => setHoveredPointIndex(idx)}
                    onMouseLeave={() => setHoveredPointIndex(null)}
                  />
                ))}
              </svg>

              {/* Peak Floating Pill */}
              <div
                className="pv-peak-badge"
                style={{
                  left: `${(chartCoords[chartCoords.length - 1].x / svgW) * 100}%`,
                  top: `${(chartCoords[chartCoords.length - 1].y / svgH) * 100}%`,
                }}
              >
                {chartCoords[chartCoords.length - 1].val} {activeDataset.unit}
              </div>

              {/* Tooltip on hover */}
              {hoveredPointIndex !== null && hoveredPointIndex !== chartCoords.length - 1 && (
                <div
                  className="pv-hover-tooltip"
                  style={{
                    left: `${(chartCoords[hoveredPointIndex].x / svgW) * 100}%`,
                    top: `${(chartCoords[hoveredPointIndex].y / svgH) * 100}%`,
                  }}
                >
                  <span className="pv-tip-date">{chartCoords[hoveredPointIndex].label}</span>
                  <span className="pv-tip-val">
                    {chartCoords[hoveredPointIndex].val} {activeDataset.unit}
                  </span>
                </div>
              )}

              {/* X Axis Ticks */}
              <div className="pv-chart-x-axis">
                {activeDataset.points.map((pt, idx) => (
                  <span key={idx} className="pv-x-tick">{pt.label}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Chart Summary Stats Ribbon */}
          <div className="pv-chart-summary-bar">
            <div className="pv-summary-item">
              <span className="pv-sum-label">Xuất phát:</span>
              <span className="pv-sum-val">{activeDataset.start}</span>
            </div>
            <div className="pv-summary-item">
              <span className="pv-sum-label">Thấp nhất:</span>
              <span className="pv-sum-val">{activeDataset.lowest}</span>
            </div>
            <div className="pv-summary-item">
              <span className="pv-sum-label">Cao nhất:</span>
              <span className="pv-sum-val">{activeDataset.highest}</span>
            </div>
            <div className="pv-summary-item">
              <span className="pv-sum-label">Hiện tại:</span>
              <span className="pv-sum-val highlight">{activeDataset.current}</span>
            </div>
            <div className="pv-summary-item">
              <span className="pv-sum-label">Biến đổi:</span>
              <span className="pv-sum-badge green">{activeDataset.change}</span>
            </div>
          </div>
        </div>

        {/* Right: Body Transformation Milestone */}
        <div className="pv-card pv-trans-card">
          <div className="pv-card-title-row">
            <Camera size={18} className="text-purple-glow" />
            <h2 className="pv-card-title">Đối chiếu hình thể (Check-in)</h2>
          </div>
          <p className="pv-card-subtitle">
            Cột mốc biến đổi sau 60 ngày theo giáo trình FitAI
          </p>

          <div className="pv-trans-photos-box">
            <div className="pv-trans-stage">
              <img
                src="/images/body-athlete-full.png"
                alt="Hình thể hiện tại"
                className="pv-trans-img"
              />
              <div className="pv-trans-overlay">
                <span className="pv-trans-tag current">Hôm nay (68kg)</span>
                <span className="pv-trans-delta">+2.8kg cơ • Nét cơ bụng</span>
              </div>
            </div>
          </div>

          {/* AI Coach Review on Progress */}
          <div className="pv-ai-feedback-box">
            <div className="pv-ai-fb-header">
              <Sparkles size={16} className="text-lime" />
              <span>Nhận định từ HLV AI</span>
            </div>
            <p className="pv-ai-fb-text">
              "Tốc độ phát triển cơ ngực và vai của bạn đang đạt mức tối ưu. Vòng eo giảm 2.5cm chứng minh mỡ nội tạng đã giảm đáng kể trong khi khối lượng cơ nạc tăng trưởng đều."
            </p>
          </div>

          <button className="pv-btn-photo-upload" onClick={() => alert("Tính năng tải ảnh check-in đối chiếu lưu trữ bảo mật trong thư viện cá nhân của bạn!")}>
            <Camera size={15} />
            <span>Chụp ảnh check-in mới</span>
          </button>
        </div>
      </div>

      {/* 4. Lower Grid: Body Measurements (50%) + Consistency Heatmap (50%) */}
      <div className="pv-lower-grid">
        {/* Left: Body Measurements */}
        <div className="pv-card pv-measure-card">
          <div className="pv-card-head-split">
            <div className="pv-card-title-row">
              <Ruler size={18} className="text-purple-glow" />
              <div>
                <h3 className="pv-card-title">Số đo cơ thể chi tiết</h3>
                <span className="pv-update-time">{measurements.lastUpdated}</span>
              </div>
            </div>
            <button
              className="pv-btn-edit-measure"
              onClick={() => setIsEditingMeasure((v) => !v)}
            >
              <Edit2 size={13} />
              <span>{isEditingMeasure ? "Hủy" : "Chỉnh sửa số đo"}</span>
            </button>
          </div>

          {!isEditingMeasure ? (
            <div className="pv-measure-list">
              <div className="pv-measure-row">
                <div className="pv-m-left">
                  <span className="pv-m-icon">🎯</span>
                  <span className="pv-m-name">Vòng ngực</span>
                </div>
                <div className="pv-m-right">
                  <span className="pv-m-val">{measurements.chest} cm</span>
                  <span className="pv-m-badge plus">+3.0 cm</span>
                </div>
              </div>

              <div className="pv-measure-row">
                <div className="pv-m-left">
                  <span className="pv-m-icon">🔥</span>
                  <span className="pv-m-name">Vòng eo</span>
                </div>
                <div className="pv-m-right">
                  <span className="pv-m-val">{measurements.waist} cm</span>
                  <span className="pv-m-badge minus">-2.5 cm</span>
                </div>
              </div>

              <div className="pv-measure-row">
                <div className="pv-m-left">
                  <span className="pv-m-icon">⚡</span>
                  <span className="pv-m-name">Vòng mông</span>
                </div>
                <div className="pv-m-right">
                  <span className="pv-m-val">{measurements.hips} cm</span>
                  <span className="pv-m-badge plus">+1.5 cm</span>
                </div>
              </div>

              <div className="pv-measure-row">
                <div className="pv-m-left">
                  <span className="pv-m-icon">💪</span>
                  <span className="pv-m-name">Bắp tay (gồng)</span>
                </div>
                <div className="pv-m-right">
                  <span className="pv-m-val">{measurements.arms} cm</span>
                  <span className="pv-m-badge plus">+1.2 cm</span>
                </div>
              </div>

              <div className="pv-measure-row">
                <div className="pv-m-left">
                  <span className="pv-m-icon">🦵</span>
                  <span className="pv-m-name">Bắp đùi</span>
                </div>
                <div className="pv-m-right">
                  <span className="pv-m-val">{measurements.thighs} cm</span>
                  <span className="pv-m-badge plus">+2.0 cm</span>
                </div>
              </div>

              <div className="pv-measure-row">
                <div className="pv-m-left">
                  <span className="pv-m-icon">👟</span>
                  <span className="pv-m-name">Bắp chuối</span>
                </div>
                <div className="pv-m-right">
                  <span className="pv-m-val">{calves} cm</span>
                  <span className="pv-m-badge plus">+0.8 cm</span>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveMeasurements} className="pv-measure-edit-form">
              <div className="pv-measure-inputs-grid">
                <label className="pv-m-input-label">
                  <span>Vòng ngực (cm)</span>
                  <input
                    type="number"
                    step="0.5"
                    value={chest}
                    onChange={(e) => setChest(e.target.value)}
                    required
                  />
                </label>
                <label className="pv-m-input-label">
                  <span>Vòng eo (cm)</span>
                  <input
                    type="number"
                    step="0.5"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                    required
                  />
                </label>
                <label className="pv-m-input-label">
                  <span>Vòng mông (cm)</span>
                  <input
                    type="number"
                    step="0.5"
                    value={hips}
                    onChange={(e) => setHips(e.target.value)}
                    required
                  />
                </label>
                <label className="pv-m-input-label">
                  <span>Bắp tay (cm)</span>
                  <input
                    type="number"
                    step="0.5"
                    value={arms}
                    onChange={(e) => setArms(e.target.value)}
                    required
                  />
                </label>
                <label className="pv-m-input-label">
                  <span>Bắp đùi (cm)</span>
                  <input
                    type="number"
                    step="0.5"
                    value={thighs}
                    onChange={(e) => setThighs(e.target.value)}
                    required
                  />
                </label>
                <label className="pv-m-input-label">
                  <span>Bắp chuối (cm)</span>
                  <input
                    type="number"
                    step="0.5"
                    value={calves}
                    onChange={(e) => setCalves(e.target.value)}
                  />
                </label>
              </div>
              <div className="pv-m-form-actions">
                <button
                  type="button"
                  className="pv-btn-cancel"
                  onClick={() => setIsEditingMeasure(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="pv-btn-save-measure">
                  Lưu số đo mới
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right: Consistency Heatmap Calendar */}
        <div className="pv-card pv-heatmap-card">
          <div className="pv-card-head-split">
            <div className="pv-card-title-row">
              <Calendar size={18} className="text-purple-glow" />
              <div>
                <h3 className="pv-card-title">Kỷ luật tập luyện tháng 11/2026</h3>
                <span className="pv-update-time">Tổng 19 buổi tập hoàn thành</span>
              </div>
            </div>
            <span className="pv-badge-pill green">
              <CheckCircle2 size={13} /> 91% Chuyên cần
            </span>
          </div>

          {/* Calendar Day Matrix */}
          <div className="pv-calendar-matrix">
            {calendarData.map((d) => {
              const statusClass =
                d.status === 2
                  ? "heavy"
                  : d.status === 1
                  ? "light"
                  : "rest";
              return (
                <div
                  key={d.day}
                  className={`pv-cal-cell ${statusClass}`}
                  title={`Ngày ${d.day}: ${
                    d.status === 2
                      ? "Hoàn thành bài tập chính"
                      : d.status === 1
                      ? "Cardio / Phục hồi"
                      : "Nghỉ ngơi"
                  }`}
                >
                  <span className="pv-cal-day-num">{d.day}</span>
                  {d.status > 0 && <span className="pv-cal-dot" />}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="pv-heatmap-legend">
            <div className="pv-leg-item">
              <span className="pv-leg-swatch heavy" />
              <span>Tập chính (Kháng lực)</span>
            </div>
            <div className="pv-leg-item">
              <span className="pv-leg-swatch light" />
              <span>Cardio / Phục hồi</span>
            </div>
            <div className="pv-leg-item">
              <span className="pv-leg-swatch rest" />
              <span>Nghỉ ngơi (Rest)</span>
            </div>
          </div>

          {/* Consistency Footer Stats */}
          <div className="pv-consistency-stats">
            <div className="pv-c-stat">
              <span className="pv-c-label">Chuỗi dài nhất</span>
              <strong className="pv-c-val">14 ngày</strong>
            </div>
            <div className="pv-c-stat">
              <span className="pv-c-label">Tổng giờ tập</span>
              <strong className="pv-c-val">28.5 giờ</strong>
            </div>
            <div className="pv-c-stat">
              <span className="pv-c-label">Calo tiêu hao</span>
              <strong className="pv-c-val">14.850 kcal</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Personal Records (PR) Table Hub */}
      <div className="pv-card pv-pr-section">
        <div className="pv-pr-header">
          <div className="pv-card-title-row">
            <Dumbbell size={20} className="text-purple-glow" />
            <div>
              <h2 className="pv-card-title">Kỷ lục sức mạnh cá nhân (Personal Records - PR)</h2>
              <p className="pv-card-subtitle">
                Ghi nhận các mốc nâng tạ tối đa và công thức ước tính 1RM theo chuẩn quốc tế
              </p>
            </div>
          </div>

          <div className="pv-pr-head-actions">
            {/* Category filter pills */}
            <div className="pv-pr-cat-tabs">
              {(["Tất cả", "Ngực", "Lưng", "Chân", "Vai"] as const).map((cat) => (
                <button
                  key={cat}
                  className={`pv-pr-cat-pill ${prCategory === cat ? "active" : ""}`}
                  onClick={() => setPrCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              className="pv-btn-action primary compact"
              onClick={() => setShowAddPrModal(true)}
            >
              <Plus size={15} />
              <span>+ Thêm PR mới</span>
            </button>
          </div>
        </div>

        {/* PR Table */}
        <div className="pv-pr-table-wrapper">
          <table className="pv-pr-table">
            <thead>
              <tr>
                <th>BÀI TẬP</th>
                <th>NHÓM CƠ</th>
                <th>MỨC TẠ KỶ LỤC</th>
                <th>SỐ REPS</th>
                <th>ƯỚC TÍNH 1RM</th>
                <th>NGÀY THIẾT LẬP</th>
                <th>TIẾN BỘ</th>
                <th style={{ textAlign: "right" }}>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrs.map((pr) => (
                <tr key={pr.id}>
                  <td>
                    <div className="pv-pr-exercise-cell">
                      <span className="pv-pr-icon">{pr.icon}</span>
                      <strong className="pv-pr-ex-name">{pr.exercise}</strong>
                    </div>
                  </td>
                  <td>
                    <span className="pv-cat-tag">{pr.category}</span>
                  </td>
                  <td>
                    <span className="pv-pr-weight-highlight">{pr.maxWeight} kg</span>
                  </td>
                  <td>
                    <span className="pv-pr-reps-text">{pr.reps} reps</span>
                  </td>
                  <td>
                    <span className="pv-pr-1rm-badge">{pr.oneRepMax} kg</span>
                  </td>
                  <td className="pv-pr-date-text">{pr.date}</td>
                  <td>
                    <span className="pv-pr-gain-badge">↑ {pr.gain}</span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="pv-btn-update-pr"
                      onClick={() => {
                        setNewPrExercise(pr.exercise);
                        setNewPrCategory(pr.category);
                        setNewPrWeight(pr.maxWeight.toString());
                        setNewPrReps(pr.reps.toString());
                        setShowAddPrModal(true);
                      }}
                    >
                      Cập nhật
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Modal: Thêm / Cập nhật Kỷ lục PR */}
      {showAddPrModal && (
        <div className="pv-modal-backdrop" onClick={() => setShowAddPrModal(false)}>
          <div className="pv-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="pv-modal-head">
              <div className="pv-card-title-row">
                <Award size={20} className="text-purple-glow" />
                <h3 className="pv-modal-title">Ghi nhận Kỷ lục Sức mạnh mới (PR)</h3>
              </div>
              <button
                className="pv-modal-close-btn"
                onClick={() => setShowAddPrModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddNewPr} className="pv-modal-form">
              <div className="pv-form-group">
                <label>Tên bài tập</label>
                <input
                  type="text"
                  value={newPrExercise}
                  onChange={(e) => setNewPrExercise(e.target.value)}
                  placeholder="Ví dụ: Barbell Bench Press..."
                  required
                />
              </div>

              <div className="pv-form-group">
                <label>Nhóm cơ chính</label>
                <select
                  value={newPrCategory}
                  onChange={(e) => setNewPrCategory(e.target.value as any)}
                >
                  <option value="Ngực">Ngực (Chest)</option>
                  <option value="Lưng">Lưng (Back)</option>
                  <option value="Chân">Chân (Legs)</option>
                  <option value="Vai">Vai (Shoulder)</option>
                  <option value="Tay">Tay (Arms)</option>
                </select>
              </div>

              <div className="pv-form-row-2">
                <div className="pv-form-group">
                  <label>Mức tạ đạt được (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newPrWeight}
                    onChange={(e) => setNewPrWeight(e.target.value)}
                    required
                  />
                </div>
                <div className="pv-form-group">
                  <label>Số lần đẩy (Reps)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={newPrReps}
                    onChange={(e) => setNewPrReps(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Real-time 1RM Preview calculation */}
              <div className="pv-1rm-calc-preview">
                <span className="pv-calc-label">Ước tính 1RM (Mức tạ tối đa 1 rep):</span>
                <span className="pv-calc-val">
                  {Math.round(
                    (parseFloat(newPrWeight) || 0) * (1 + (parseInt(newPrReps) || 1) / 30)
                  )}{" "}
                  kg
                </span>
              </div>

              <div className="pv-modal-actions">
                <button
                  type="button"
                  className="pv-btn-cancel"
                  onClick={() => setShowAddPrModal(false)}
                >
                  Hủy bỏ
                </button>
                <button type="submit" className="pv-btn-action primary">
                  Lưu kỷ lục mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
