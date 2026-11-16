import { useMemo, useState } from "react";
import {
  Zap,
  ArrowRight,
  PlayCircle,
  Bot,
  CalendarCheck,
  Timer,
  Users,
  Flame,
  Scale,
  Trophy,
  Target,
  BarChart3,
  ClipboardList,
  Check,
  Send,
  Apple,
  Award,
  Crown,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import Sparkline from "../common/Sparkline";
import type {
  UserStats,
  Exercise,
  WeightRecord,
  TabType,
} from "../../types/fitness";

interface DashboardViewProps {
  userStats: UserStats;
  todayExercises: Exercise[];
  onToggleExercise: (id: string) => void;
  weightRecords: WeightRecord[];
  onSelectTab: (tab: TabType) => void;
  onStartWorkout: () => void;
  onJoinChallenge: () => void;
  onOpenProModal?: () => void;
}

type Timeframe = "7 ngày" | "30 ngày" | "90 ngày";

interface ChatMsg {
  from: "ai" | "user";
  text: string;
}

const heroSlides = [
  {
    badge: "Huấn luyện thông minh",
    line1: "Chinh phục phiên bản",
    highlight: "mạnh mẽ hơn",
    line2: "của bạn",
    desc: "FitAI đồng hành cùng bạn với AI cá nhân hóa, chế độ tập luyện và dinh dưỡng khoa học.",
  },
  {
    badge: "Dinh dưỡng khoa học",
    line1: "Ăn đúng cách,",
    highlight: "cơ bắp bứt phá",
    line2: "mỗi ngày",
    desc: "Thực đơn được AI tính toán theo calo, macro và mục tiêu cơ thể riêng của bạn.",
  },
  {
    badge: "Theo dõi tiến độ",
    line1: "Từng con số",
    highlight: "đều có ý nghĩa",
    line2: "với bạn",
    desc: "Biểu đồ cân nặng, buổi tập và thành tích giúp bạn luôn giữ vững động lực.",
  },
];

const aiQuickReplies: Record<string, string> = {
  "Lập lịch tập Giảm mỡ":
    "Gợi ý tuần này: 3 buổi HIIT 25 phút (T2-T4-T6) + 2 buổi tạ toàn thân (T3-T5). Giữ thâm hụt ~400 kcal/ngày nhé! 🔥",
  "Thực đơn ăn uống Tăng cơ":
    "Mỗi ngày ~2.600 kcal: 150g protein (ức gà, trứng, cá hồi), 320g carb (cơm gạo lứt, yến mạch), 70g fat lành mạnh. 💪",
};

export default function DashboardView({
  userStats,
  todayExercises,
  onToggleExercise,
  weightRecords,
  onSelectTab,
  onStartWorkout,
  onOpenProModal,
}: DashboardViewProps) {
  const [slide, setSlide] = useState(0);
  const [timeframe, setTimeframe] = useState<Timeframe>("7 ngày");
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([
    { from: "ai", text: "Xin chào! 👋\nBạn cần tư vấn gì hôm nay?" },
  ]);

  const hero = heroSlides[slide];

  // ---------- Stats ----------
  const completedCount = todayExercises.filter((e) => e.completed).length;
  const allDone = todayExercises.length > 0 && completedCount === todayExercises.length;
  const weeklyDone = Math.min(5, 4 + (allDone ? 1 : 0));
  const weeklyTarget = 5;

  const firstWeight = weightRecords[0]?.weight ?? userStats.currentWeight;
  const prevWeight =
    weightRecords.length > 1
      ? weightRecords[weightRecords.length - 2].weight
      : userStats.currentWeight;
  const weightDelta = +(userStats.currentWeight - prevWeight).toFixed(1);

  const goalPercent = useMemo(() => {
    const total = Math.abs(userStats.targetWeight - firstWeight);
    if (total < 0.1) return 78;
    const done = Math.abs(userStats.currentWeight - firstWeight);
    return Math.max(5, Math.min(100, Math.round((done / total) * 100) || 78));
  }, [userStats.currentWeight, userStats.targetWeight, firstWeight]);

  // ---------- Chart ----------
  const chartRecords = useMemo(() => {
    const n = timeframe === "7 ngày" ? 7 : timeframe === "30 ngày" ? 30 : 90;
    const list = weightRecords.slice(-n);
    return list.length >= 2
      ? list
      : [
          { id: "a", date: "T2", weight: userStats.currentWeight - 1 },
          { id: "b", date: "CN", weight: userStats.currentWeight },
        ];
  }, [weightRecords, timeframe, userStats.currentWeight]);

  const W = 520;
  const H = 210;
  const padL = 46;
  const padR = 18;
  const padT = 20;
  const padB = 30;
  const weights = chartRecords.map((r) => r.weight);
  const yMin = Math.floor((Math.min(...weights) - 3) / 10) * 10;
  const yMax = Math.ceil((Math.max(...weights) + 3) / 10) * 10;
  const yTicks: number[] = [];
  for (let v = yMax; v >= yMin; v -= Math.max(5, Math.round((yMax - yMin) / 3 / 5) * 5)) yTicks.push(v);

  const pts = chartRecords.map((r, i) => ({
    ...r,
    x: padL + (i / (chartRecords.length - 1)) * (W - padL - padR),
    y: padT + (1 - (r.weight - yMin) / (yMax - yMin || 1)) * (H - padT - padB),
  }));
  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${H - padB} L ${pts[0].x} ${H - padB} Z`;
  const activeIdx = hoverIdx ?? pts.length - 1;
  const activePt = pts[activeIdx];
  const labelEvery = Math.ceil(pts.length / 7);

  // ---------- AI chat ----------
  const sendMessage = (text: string) => {
    const t = text.trim();
    if (!t) return;
    const reply =
      aiQuickReplies[t] ??
      "Mình đã ghi nhận câu hỏi! Mở mục Huấn luyện AI để được tư vấn chi tiết hơn nhé. 🤖";
    setMessages((prev): ChatMsg[] =>
      [...prev, { from: "user" as const, text: t }, { from: "ai" as const, text: reply }].slice(-4)
    );
    setChatInput("");
  };

  // ---------- Nutrition ----------
  const macros = [
    { label: "Protein", cur: 120, max: 150, color: "#38bdf8" },
    { label: "Carb", cur: 280, max: 350, color: "#f59e0b" },
    { label: "Fat", cur: 45, max: 70, color: "#facc15" },
  ];
  const nutritionPct = 82;
  const ringR = 34;
  const ringC = 2 * Math.PI * ringR;

  const goalR = 18;
  const goalC = 2 * Math.PI * goalR;

  return (
    <div className="hm-container">
      {/* ================= HERO ================= */}
      <section className="hm-hero">
        <div className="hm-hero-bg">
          <img src="/images/home-hero-athlete.jpg" alt="FitAI athlete" />
        </div>
        <div className="hm-hero-shade" />
        <div className="hm-hero-stripe" />

        <div className="hm-hero-content">
          <span className="hm-hero-badge">
            <Zap size={13} fill="#facc15" color="#facc15" />
            {hero.badge}
          </span>
          <h1 className="hm-hero-title">
            {hero.line1}
            <br />
            <span className="hm-hero-highlight">{hero.highlight}</span> {hero.line2}
          </h1>
          <p className="hm-hero-desc">{hero.desc}</p>
          <div className="hm-hero-actions">
            <button className="hm-btn-lime" onClick={onStartWorkout}>
              <PlayCircle size={17} />
              Bắt đầu luyện tập
            </button>
            <button className="hm-btn-ghost" onClick={() => onSelectTab("Huấn luyện AI")}>
              Khám phá thêm
              <span className="hm-btn-ghost-icon">
                <ArrowRight size={13} />
              </span>
            </button>
          </div>
        </div>

        <div className="hm-hero-features">
          {[
            { icon: Bot, title: "AI Coach", sub: "Tư vấn cá nhân", tab: "Huấn luyện AI" as TabType, accent: true },
            { icon: CalendarCheck, title: "Lịch tập thông minh", sub: "Tối ưu hiệu quả", tab: "Lịch tập" as TabType },
            { icon: Timer, title: "Theo dõi tiến độ", sub: "Đo lường rõ ràng", tab: "Tiến độ" as TabType },
            { icon: Users, title: "Cộng đồng FitAI", sub: "Cùng nhau tiến bộ", tab: "Cộng đồng" as TabType },
          ].map(({ icon: Icon, title, sub, tab, accent }) => (
            <button key={title} className="hm-feature-item" onClick={() => onSelectTab(tab)}>
              <span className="hm-feature-icon">
                <Icon size={17} />
              </span>
              <span className="hm-feature-text">
                <strong className={accent ? "lime" : ""}>{title}</strong>
                <small>{sub}</small>
              </span>
            </button>
          ))}
          <div className="hm-hero-pager">
            <button onClick={() => setSlide((slide + heroSlides.length - 1) % heroSlides.length)} aria-label="Trước">
              <ChevronLeft size={13} />
            </button>
            <span>
              {slide + 1} / {heroSlides.length}
            </span>
            <button onClick={() => setSlide((slide + 1) % heroSlides.length)} aria-label="Sau">
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="hm-stats">
        <div className="hm-stat-card">
          <span className="hm-stat-icon orange">
            <Flame size={20} />
          </span>
          <div className="hm-stat-body">
            <span className="hm-stat-label">Calorie hôm nay</span>
            <span className="hm-stat-value">
              {userStats.caloriesBurnedToday.toLocaleString("vi-VN")} <small>kcal</small>
            </span>
            <span className="hm-stat-trend up">↑ +12%</span>
          </div>
          <Sparkline color="#a855f7" points={[520, 610, 580, 720, 690, 810, userStats.caloriesBurnedToday]} width={80} height={40} />
        </div>

        <div className="hm-stat-card">
          <span className="hm-stat-icon purple">
            <Scale size={20} />
          </span>
          <div className="hm-stat-body">
            <span className="hm-stat-label">Cân nặng hiện tại</span>
            <span className="hm-stat-value">
              {userStats.currentWeight} <small>kg</small>
            </span>
            <span className={`hm-stat-trend ${weightDelta >= 0 ? "up" : "down"}`}>
              {weightDelta >= 0 ? "↑ +" : "↓ "}
              {weightDelta}
            </span>
          </div>
          <Sparkline color="#38bdf8" points={weightRecords.slice(-7).map((r) => r.weight)} width={80} height={40} />
        </div>

        <div className="hm-stat-card">
          <span className="hm-stat-icon amber">
            <Trophy size={20} />
          </span>
          <div className="hm-stat-body grow">
            <span className="hm-stat-label">Buổi tập tuần này</span>
            <span className="hm-stat-value">
              {weeklyDone} / {weeklyTarget}
            </span>
            <div className="hm-stat-bar">
              <div style={{ width: `${(weeklyDone / weeklyTarget) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="hm-stat-card">
          <span className="hm-stat-icon green">
            <Target size={20} />
          </span>
          <div className="hm-stat-body grow">
            <span className="hm-stat-label">Tiến độ mục tiêu</span>
            <span className="hm-stat-value">{goalPercent}%</span>
          </div>
          <svg width="46" height="46" viewBox="0 0 46 46">
            <circle cx="23" cy="23" r={goalR} stroke="#1f2937" strokeWidth="5" fill="none" />
            <circle
              cx="23"
              cy="23"
              r={goalR}
              stroke="#84cc16"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={goalC}
              strokeDashoffset={goalC * (1 - goalPercent / 100)}
              transform="rotate(-90 23 23)"
            />
          </svg>
        </div>
      </section>

      {/* ================= MIDDLE ================= */}
      <section className="hm-middle">
        {/* Chart */}
        <div className="hm-card">
          <div className="hm-card-head">
            <h3>
              <BarChart3 size={16} className="hm-head-icon" /> Biểu đồ tiến độ thể hình
            </h3>
            <div className="hm-tabs">
              {(["7 ngày", "30 ngày", "90 ngày"] as Timeframe[]).map((tf) => (
                <button
                  key={tf}
                  className={timeframe === tf ? "active" : ""}
                  onClick={() => {
                    setTimeframe(tf);
                    setHoverIdx(null);
                  }}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} className="hm-chart" onMouseLeave={() => setHoverIdx(null)}>
            <defs>
              <linearGradient id="hmArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
              </linearGradient>
            </defs>
            {yTicks.map((v) => {
              const y = padT + (1 - (v - yMin) / (yMax - yMin || 1)) * (H - padT - padB);
              return (
                <g key={v}>
                  <line x1={padL} x2={W - padR} y1={y} y2={y} stroke="rgba(255,255,255,0.06)" />
                  <text x={padL - 8} y={y + 4} fill="#94a3b8" fontSize="11" textAnchor="end">
                    {v}kg
                  </text>
                </g>
              );
            })}
            {pts.map((p, i) => (
              <line key={`v${i}`} x1={p.x} x2={p.x} y1={padT} y2={H - padB} stroke="rgba(255,255,255,0.04)" />
            ))}
            <path d={areaPath} fill="url(#hmArea)" />
            <path d={linePath} stroke="#a855f7" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
            {pts.map((p, i) => (
              <g key={p.id} onMouseEnter={() => setHoverIdx(i)} style={{ cursor: "pointer" }}>
                <circle cx={p.x} cy={p.y} r="12" fill="transparent" />
                <circle cx={p.x} cy={p.y} r={i === activeIdx ? 5 : 3.5} fill="#e9d5ff" stroke="#a855f7" strokeWidth="2" />
                {i % labelEvery === 0 || i === pts.length - 1 ? (
                  <text x={p.x} y={H - 10} fill={i === activeIdx ? "#fff" : "#94a3b8"} fontSize="11" textAnchor="middle">
                    {p.date}
                  </text>
                ) : null}
              </g>
            ))}
            <g transform={`translate(${Math.min(activePt.x - 26, W - padR - 54)}, ${Math.max(activePt.y - 34, 2)})`}>
              <rect width="54" height="22" rx="7" fill="#7c3aed" />
              <text x="27" y="15" fill="#fff" fontSize="11" fontWeight="700" textAnchor="middle">
                {activePt.weight}kg
              </text>
            </g>
          </svg>
        </div>

        {/* Today plan */}
        <div className="hm-card">
          <div className="hm-card-head">
            <h3>
              <ClipboardList size={16} className="hm-head-icon" /> Kế hoạch tập luyện hôm nay
            </h3>
            <button className="hm-link" onClick={() => onSelectTab("Bài tập")}>
              Xem chi tiết <ArrowRight size={12} />
            </button>
          </div>
          <div className="hm-plan-body">
            <img src="/images/home-pushup.jpg" alt="Workout" className="hm-plan-img" />
            <div className="hm-plan-list">
              <span className="hm-plan-tag">Buổi 1 - Ngực + Tay sau</span>
              {todayExercises.slice(0, 4).map((ex) => (
                <button
                  key={ex.id}
                  className={`hm-plan-item ${ex.completed ? "done" : ""}`}
                  onClick={() => onToggleExercise(ex.id)}
                >
                  <span className="hm-check">{ex.completed && <Check size={11} strokeWidth={3} />}</span>
                  <span>
                    {ex.name} {ex.sets} x {ex.reps}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <button className="hm-btn-purple" onClick={onStartWorkout}>
            <PlayCircle size={16} /> Bắt đầu tập luyện
            <span className="hm-btn-purple-arrow">
              <ChevronRight size={14} />
            </span>
          </button>
        </div>

        {/* AI assistant */}
        <div className="hm-card hm-ai-card">
          <div className="hm-card-head">
            <h3>
              <Bot size={16} className="hm-head-icon" /> Trợ lý AI FitAI
            </h3>
          </div>
          <img src="/images/home-ai-robot.jpg" alt="AI robot" className="hm-ai-robot" />
          <div className="hm-ai-chat">
            {messages.map((m, i) => (
              <div key={i} className={`hm-bubble ${m.from}`}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="hm-ai-quick">
            {Object.keys(aiQuickReplies).map((q) => (
              <button key={q} onClick={() => sendMessage(q)}>
                {q.replace(" Giảm", "\nGiảm").replace(" Tăng", "\nTăng")}
              </button>
            ))}
          </div>
          <form
            className="hm-ai-input"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(chatInput);
            }}
          >
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Nhập câu hỏi của bạn..."
            />
            <button type="submit" aria-label="Gửi">
              <Send size={13} />
            </button>
          </form>
        </div>
      </section>

      {/* ================= BOTTOM ================= */}
      <section className="hm-bottom">
        {/* Nutrition */}
        <div className="hm-card">
          <div className="hm-card-head">
            <h3>
              <Apple size={16} className="hm-head-icon" /> Dinh dưỡng thông minh
            </h3>
            <button className="hm-link" onClick={() => onSelectTab("Dinh dưỡng")}>
              Xem chi tiết <ArrowRight size={12} />
            </button>
          </div>
          <div className="hm-nutri-body">
            <div className="hm-ring">
              <svg width="84" height="84" viewBox="0 0 84 84">
                <circle cx="42" cy="42" r={ringR} stroke="#1f2937" strokeWidth="8" fill="none" />
                <circle
                  cx="42"
                  cy="42"
                  r={ringR}
                  stroke="#84cc16"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={ringC}
                  strokeDashoffset={ringC * (1 - nutritionPct / 100)}
                  transform="rotate(-90 42 42)"
                />
              </svg>
              <span>{nutritionPct}%</span>
            </div>
            <div className="hm-nutri-goal">
              <span>Mục tiêu</span>
              <strong>
                Protein <em>120g</em>
              </strong>
            </div>
            <div className="hm-macros">
              {macros.map((m) => (
                <div key={m.label} className="hm-macro">
                  <div className="hm-macro-row">
                    <span>{m.label}</span>
                    <span>
                      {m.cur}g / {m.max}g
                    </span>
                  </div>
                  <div className="hm-macro-bar">
                    <div style={{ width: `${(m.cur / m.max) * 100}%`, background: m.color }} />
                  </div>
                </div>
              ))}
            </div>
            <img src="/images/home-food-bowl.jpg" alt="Healthy food" className="hm-food" />
          </div>
        </div>

        {/* Achievements */}
        <div className="hm-card">
          <div className="hm-card-head">
            <h3>
              <Award size={16} className="hm-head-icon" /> Thành tích của bạn
            </h3>
            <button className="hm-link" onClick={() => onSelectTab("Tiến độ")}>
              Xem tất cả <ArrowRight size={12} />
            </button>
          </div>
          <div className="hm-achievements">
            <div className="hm-ach">
              <span className="hm-ach-badge gold">
                <Crown size={22} />
              </span>
              <strong>Thách thức</strong>
              <small>{userStats.streakDays} ngày</small>
            </div>
            <div className="hm-ach">
              <span className="hm-ach-badge orange">
                <Flame size={22} />
              </span>
              <strong>Đốt cháy</strong>
              <small>{(userStats.xp * 40).toLocaleString("vi-VN")} kcal</small>
            </div>
            <div className="hm-ach">
              <span className="hm-ach-badge yellow">
                <Star size={22} fill="currentColor" />
              </span>
              <strong>Hoàn thành</strong>
              <small>10 mục tiêu</small>
            </div>
          </div>
        </div>

        {/* Upgrade */}
        <div className="hm-card hm-upgrade">
          <div className="hm-upgrade-text">
            <h3>
              Nâng cấp lên FitAI <span>Pro</span>
            </h3>
            <p>Mở khóa nhiều tính năng cao cấp hơn với chi phí cực kỳ hợp lý!</p>
            <button className="hm-btn-lime small" onClick={onOpenProModal}>
              Khám phá gói <ArrowRight size={14} />
            </button>
          </div>
          <Crown size={84} className="hm-upgrade-crown" />
        </div>
      </section>
    </div>
  );
}
