import { useState } from "react";
import {
  Flame,
  PieChart,
  Droplets,
  Plus,
  Utensils,
  Target,
  CheckCircle2,
  Lightbulb,
  Trash2,
  X,
  Sparkles,
} from "lucide-react";
import type { FoodItem, UserStats } from "../../types/fitness";

interface NutritionViewProps {
  foodLogs: FoodItem[];
  onAddFoodClick: () => void;
  onDeleteFood: (id: string) => void;
  userStats: UserStats;
  onUpdateWater: (amountMl: number) => void;
}

interface DefaultMeal {
  id: string;
  category: "Bữa sáng" | "Bữa trưa" | "Bữa tối" | "Bữa phụ";
  time: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image: string;
  recorded: boolean;
}

export default function NutritionView({
  foodLogs,
  onAddFoodClick,
  onDeleteFood,
  userStats,
  onUpdateWater,
}: NutritionViewProps) {
  // Water tracker: 8 glasses of 250ml each (total 2000ml)
  // Default to 5 filled glasses (1250ml) if user has water logged
  const currentGlasses = Math.min(
    8,
    Math.max(1, Math.round((userStats.waterDrunkMl || 1250) / 250))
  );

  const handleGlassClick = (glassIndex: number) => {
    const newCount = glassIndex === currentGlasses ? glassIndex - 1 : glassIndex;
    onUpdateWater(newCount * 250);
  };

  // Default meal cards matching mockup design
  const defaultMeals: DefaultMeal[] = [
    {
      id: "meal-1",
      category: "Bữa sáng",
      time: "07:30",
      name: "Yến mạch, sữa hạt & 2 quả trứng gà luộc",
      calories: 520,
      protein: 32,
      carbs: 45,
      fat: 20,
      image: "/images/meal-breakfast.png",
      recorded: true,
    },
    {
      id: "meal-2",
      category: "Bữa trưa",
      time: "12:30",
      name: "Cơm gạo lứt, 200g cá hồi áp chảo & bông cải xanh",
      calories: 650,
      protein: 45,
      carbs: 60,
      fat: 18,
      image: "/images/meal-lunch.png",
      recorded: true,
    },
    {
      id: "meal-3",
      category: "Bữa tối",
      time: "18:30",
      name: "Cá hồi áp chảo, khoai lang nướng & măng tây",
      calories: 520,
      protein: 40,
      carbs: 45,
      fat: 16,
      image: "/images/meal-dinner.png",
      recorded: true,
    },
    {
      id: "meal-4",
      category: "Bữa phụ",
      time: "21:00",
      name: "1 hũ sữa chua Hy Lạp, bơ đậu phộng & nho khô",
      calories: 190,
      protein: 12,
      carbs: 18,
      fat: 6,
      image: "/images/meal-snack.png",
      recorded: true,
    },
  ];

  // TDEE calculator state
  const [calcGender, setCalcGender] = useState<"Nam" | "Nữ">(userStats.gender || "Nam");
  const [calcHeight, setCalcHeight] = useState(userStats.height?.toString() || "175");
  const [calcAge, setCalcAge] = useState(userStats.age?.toString() || "24");
  const [calcWeight, setCalcWeight] = useState(
    (userStats.currentWeight || 68).toString()
  );
  const [calcActivity, setCalcActivity] = useState<number>(1.55); // 1.2, 1.375, 1.55, 1.725
  const [tdeeResult, setTdeeResult] = useState<{
    bmr: number;
    tdee: number;
    fatLoss: number;
    muscleGain: number;
  } | null>(null);

  const handleCalculateTdee = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(calcWeight) || 68;
    const h = parseFloat(calcHeight) || 175;
    const a = parseFloat(calcAge) || 24;

    // Mifflin-St Jeor Equation
    let bmr = 10 * w + 6.25 * h - 5 * a;
    bmr += calcGender === "Nam" ? 5 : -161;

    const tdee = Math.round(bmr * calcActivity);
    setTdeeResult({
      bmr: Math.round(bmr),
      tdee,
      fatLoss: Math.round(tdee - 500),
      muscleGain: Math.round(tdee + 300),
    });
  };

  return (
    <div className="nt-container">
      {/* 1. Greeting Top Header */}
      <div className="nt-top-header">
        <h1 className="nt-greeting-title">
          👋 Chào bạn, {userStats.name || "Nguyễn Văn A"}!
        </h1>
        <p className="nt-greeting-subtitle">
          Dinh dưỡng hợp lý là nền tảng cho một cơ thể khỏe mạnh và bền bỉ.
        </p>
      </div>

      {/* 2. Top Row: 3 Metric Cards */}
      <div className="nt-kpi-grid">
        {/* Card 1: Năng lượng hôm nay */}
        <div className="nt-card nt-card-energy">
          <div className="nt-card-head">
            <div className="nt-card-head-title">
              <Flame size={18} className="nt-icon-orange" />
              <span>Năng lượng hôm nay</span>
            </div>
            <span className="nt-badge-trend green">↑ +8%</span>
          </div>

          <div className="nt-energy-body">
            {/* Circular Flame Gauge */}
            <div className="nt-energy-gauge-wrap">
              <svg className="nt-energy-svg" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#1c163b"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#ntEnergyGrad)"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset="75"
                  transform="rotate(-90 50 50)"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="ntEnergyGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="nt-gauge-center-icon">
                <div className="nt-droplet-glow">
                  <Flame size={20} className="nt-flame-inner" />
                </div>
              </div>
            </div>

            {/* 3 Metric Columns */}
            <div className="nt-energy-stats">
              <div className="nt-stat-col">
                <span className="nt-stat-val white">1680</span>
                <span className="nt-stat-unit">kcal</span>
                <span className="nt-stat-lbl">Đã nạp</span>
              </div>
              <div className="nt-stat-col">
                <span className="nt-stat-val orange">892</span>
                <span className="nt-stat-unit">kcal</span>
                <span className="nt-stat-lbl">Đã tiêu</span>
              </div>
              <div className="nt-stat-col">
                <span className="nt-stat-val green">720</span>
                <span className="nt-stat-unit">kcal</span>
                <span className="nt-stat-lbl">Còn lại</span>
              </div>
            </div>
          </div>

          {/* Bottom Target Bar */}
          <div className="nt-target-bar-wrap">
            <div className="nt-target-meta">
              <span className="nt-target-pct">Tỷ lệ đạt mục tiêu: 70%</span>
              <span className="nt-target-max">Mục tiêu: 2400 kcal</span>
            </div>
            <div className="nt-target-track">
              <div className="nt-target-fill" style={{ width: "70%" }} />
            </div>
          </div>
        </div>

        {/* Card 2: Chất đa lượng (Macronutrients) */}
        <div className="nt-card nt-card-macros">
          <div className="nt-card-head">
            <div className="nt-card-head-title">
              <PieChart size={18} className="nt-icon-purple" />
              <span>Chất đa lượng (Macronutrients)</span>
            </div>
          </div>

          <div className="nt-macros-list">
            {/* Protein */}
            <div className="nt-macro-group">
              <div className="nt-macro-meta">
                <span className="nt-macro-name text-blue">Đạm (Protein)</span>
                <span className="nt-macro-vals">137g / 160g</span>
              </div>
              <div className="nt-macro-track">
                <div
                  className="nt-macro-fill bg-blue"
                  style={{ width: "85%" }}
                />
              </div>
            </div>

            {/* Carbs */}
            <div className="nt-macro-group">
              <div className="nt-macro-meta">
                <span className="nt-macro-name text-peach">Tinh bột (Carbs)</span>
                <span className="nt-macro-vals">167g / 250g</span>
              </div>
              <div className="nt-macro-track">
                <div
                  className="nt-macro-fill bg-peach"
                  style={{ width: "67%" }}
                />
              </div>
            </div>

            {/* Fat */}
            <div className="nt-macro-group">
              <div className="nt-macro-meta">
                <span className="nt-macro-name text-yellow">Chất béo (Fat)</span>
                <span className="nt-macro-vals">45g / 70g</span>
              </div>
              <div className="nt-macro-track">
                <div
                  className="nt-macro-fill bg-yellow"
                  style={{ width: "64%" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Nước uống trong ngày */}
        <div className="nt-card nt-card-water">
          <div className="nt-card-head">
            <div className="nt-card-head-title">
              <Droplets size={18} className="nt-icon-blue" />
              <span>Nước uống trong ngày</span>
            </div>
            <span className="nt-badge-water">
              {(currentGlasses * 250)} / 2000 ml
            </span>
          </div>

          {/* 8 Water Glasses Row */}
          <div className="nt-water-glasses-row">
            {Array.from({ length: 8 }).map((_, idx) => {
              const isFilled = idx < currentGlasses;
              return (
                <button
                  key={idx}
                  className={`nt-glass-btn ${isFilled ? "filled" : ""}`}
                  onClick={() => handleGlassClick(idx + 1)}
                  title={`Cốc ${idx + 1}: ${(idx + 1) * 250}ml (Click để ghi nhận)`}
                  aria-label={`Uống ${(idx + 1) * 250} ml nước`}
                >
                  <svg
                    className="nt-glass-svg"
                    viewBox="0 0 24 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Glass Outline */}
                    <path
                      d="M3 4 L5.5 28 C5.8 30.5 7.8 32 10 32 L14 32 C16.2 32 18.2 30.5 18.5 28 L21 4 Z"
                      stroke={isFilled ? "#38bdf8" : "#475569"}
                      strokeWidth="2"
                      fill={isFilled ? "rgba(56, 189, 248, 0.2)" : "transparent"}
                    />
                    {/* Water Level */}
                    {isFilled && (
                      <path
                        d="M4.5 12 L5.5 28 C5.8 30 7.2 31 9.5 31 L14.5 31 C16.8 31 18.2 30 18.5 28 L19.5 12 Z"
                        fill="url(#ntWaterGrad)"
                      />
                    )}
                    <defs>
                      <linearGradient id="ntWaterGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#0284c7" />
                      </linearGradient>
                    </defs>
                  </svg>
                </button>
              );
            })}
          </div>

          {/* Water Tip */}
          <div className="nt-water-tip-box">
            <Lightbulb size={16} className="nt-tip-bulb" />
            <p className="nt-tip-text">
              Sức uống đủ nước giúp tăng cường trao đổi chất và cải thiện hiệu suất tập luyện.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Nhật ký từng bữa ăn */}
      <div className="nt-meals-section">
        <div className="nt-meals-head">
          <div className="nt-meals-title-wrap">
            <Utensils size={18} className="nt-icon-purple" />
            <h2 className="nt-meals-title">Nhật ký từng bữa ăn</h2>
          </div>
          <button className="nt-btn-add-meal" onClick={onAddFoodClick}>
            <Plus size={16} />
            <span>Thêm bữa ăn</span>
          </button>
        </div>

        {/* 4 Meal Cards Grid */}
        <div className="nt-meals-grid">
          {defaultMeals.map((meal) => (
            <div key={meal.id} className="nt-meal-card">
              <div className="nt-meal-top-row">
                <div className="nt-meal-tag-group">
                  <span className="nt-meal-cat-name">{meal.category}</span>
                  <span className="nt-meal-time-tag">{meal.time}</span>
                </div>
                <div className="nt-meal-recorded-badge">
                  <CheckCircle2 size={13} />
                  <span>Đã ghi nhận</span>
                </div>
              </div>

              <div className="nt-meal-main-info">
                <div className="nt-meal-img-box">
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="nt-meal-img"
                  />
                </div>
                <div className="nt-meal-details">
                  <h3 className="nt-meal-food-name">{meal.name}</h3>
                  <div className="nt-meal-macros-pills">
                    <span className="nt-macro-pill cal">
                      <Flame size={12} /> {meal.calories} kcal
                    </span>
                    <span className="nt-macro-pill p">
                      {meal.protein}g Đạm
                    </span>
                    <span className="nt-macro-pill c">
                      {meal.carbs}g Carb
                    </span>
                    <span className="nt-macro-pill f">
                      {meal.fat}g Fat
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom food items logged by user if any */}
        {foodLogs && foodLogs.length > 0 && (
          <div className="nt-custom-logs-box">
            <h4 className="nt-custom-logs-title">Món ăn bổ sung thêm hôm nay:</h4>
            <div className="nt-custom-food-list">
              {foodLogs.map((item) => (
                <div key={item.id} className="nt-custom-food-row">
                  <div className="nt-custom-left">
                    <span className="nt-custom-emoji">{item.emoji || "🥗"}</span>
                    <div>
                      <strong className="nt-custom-name">{item.name}</strong>
                      <span className="nt-custom-portion">
                        {item.portion} • {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="nt-custom-right">
                    <span className="nt-custom-kcal">{item.calories} kcal</span>
                    <span className="nt-custom-macro">P: {item.protein}g</span>
                    <span className="nt-custom-macro">C: {item.carbs}g</span>
                    <span className="nt-custom-macro">F: {item.fat}g</span>
                    <button
                      className="nt-custom-del-btn"
                      onClick={() => onDeleteFood(item.id)}
                      title="Xóa món ăn"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Bottom Section: Công cụ tính chỉ số TDEE & Mục tiêu Calo */}
      <div className="nt-tdee-section">
        <div className="nt-tdee-header">
          <div className="nt-tdee-title-row">
            <div className="nt-tdee-icon-wrap">
              <Target size={20} className="nt-icon-purple" />
            </div>
            <div>
              <h2 className="nt-tdee-title">
                Công cụ tính chỉ số TDEE & Mục tiêu Calo
              </h2>
              <p className="nt-tdee-subtitle">
                Xác định chính xác lượng calo cơ thể cần mỗi ngày để đạt mục tiêu tăng, giảm hoặc duy trì cân nặng.
              </p>
            </div>
          </div>
        </div>

        {/* TDEE Form & Tool Area */}
        <form onSubmit={handleCalculateTdee} className="nt-tdee-form-box">
          <div className="nt-tdee-inputs-row">
            {/* 3D Calculator Icon */}
            <div className="nt-calc-3d-wrap">
              <img
                src="/images/nutri-calc-3d.png"
                alt="TDEE Calculator"
                className="nt-calc-3d-img"
              />
            </div>

            {/* Gender */}
            <div className="nt-tdee-input-group">
              <label>Giới tính</label>
              <select
                value={calcGender}
                onChange={(e) => setCalcGender(e.target.value as "Nam" | "Nữ")}
                className="nt-tdee-select"
              >
                <option value="Nam">♂ Nam</option>
                <option value="Nữ">♀ Nữ</option>
              </select>
            </div>

            {/* Height */}
            <div className="nt-tdee-input-group">
              <label>Chiều cao (cm)</label>
              <input
                type="number"
                value={calcHeight}
                onChange={(e) => setCalcHeight(e.target.value)}
                className="nt-tdee-input"
                required
              />
            </div>

            {/* Age */}
            <div className="nt-tdee-input-group">
              <label>Tuổi</label>
              <input
                type="number"
                value={calcAge}
                onChange={(e) => setCalcAge(e.target.value)}
                className="nt-tdee-input"
                required
              />
            </div>

            {/* Weight */}
            <div className="nt-tdee-input-group">
              <label>Cân nặng (kg)</label>
              <input
                type="number"
                value={calcWeight}
                onChange={(e) => setCalcWeight(e.target.value)}
                className="nt-tdee-input"
                required
              />
            </div>

            {/* Activity Level */}
            <div className="nt-tdee-input-group wide">
              <label>Mức độ vận động</label>
              <select
                value={calcActivity}
                onChange={(e) => setCalcActivity(parseFloat(e.target.value))}
                className="nt-tdee-select"
              >
                <option value={1.2}>Ít vận động (Dân văn phòng)</option>
                <option value={1.375}>Nhẹ (Tập 1 - 3 ngày/tuần)</option>
                <option value={1.55}>Vừa phải (Tập 3 - 5 ngày/tuần)</option>
                <option value={1.725}>Nhiều (Tập 6 - 7 ngày/tuần)</option>
              </select>
            </div>

            {/* Submit Button */}
            <button type="submit" className="nt-btn-calc-tdee">
              <Sparkles size={16} />
              <span>Tính toán TDEE của tôi →</span>
            </button>
          </div>
        </form>

        {/* TDEE Calculation Result Modal/Card */}
        {tdeeResult && (
          <div className="nt-tdee-results-card">
            <div className="nt-tdee-res-head">
              <div className="nt-card-head-title">
                <CheckCircle2 size={18} className="nt-icon-green" />
                <span className="nt-res-head-text">
                  Kết quả phân tích Năng lượng TDEE cá nhân
                </span>
              </div>
              <button
                className="nt-res-close"
                onClick={() => setTdeeResult(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="nt-tdee-res-grid">
              <div className="nt-tdee-box">
                <span className="nt-res-label">BMR (Trao đổi chất cơ bản)</span>
                <span className="nt-res-num purple">{tdeeResult.bmr}</span>
                <span className="nt-res-unit">kcal / ngày</span>
              </div>

              <div className="nt-tdee-box highlight">
                <span className="nt-res-label">TDEE (Duy trì cân nặng)</span>
                <span className="nt-res-num blue">{tdeeResult.tdee}</span>
                <span className="nt-res-unit">kcal / ngày</span>
              </div>

              <div className="nt-tdee-box">
                <span className="nt-res-label">Mục tiêu Giảm mỡ (-500 kcal)</span>
                <span className="nt-res-num green">{tdeeResult.fatLoss}</span>
                <span className="nt-res-unit">kcal / ngày</span>
              </div>

              <div className="nt-tdee-box">
                <span className="nt-res-label">Mục tiêu Tăng cơ (+300 kcal)</span>
                <span className="nt-res-num orange">{tdeeResult.muscleGain}</span>
                <span className="nt-res-unit">kcal / ngày</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
