import { useState, useRef, useEffect } from "react";
import {
  Send,
  ShieldAlert,
  CalendarCheck,
  Copy,
  Check,
  RotateCcw,
  Camera,
  Mic,
  Utensils,
  Dumbbell,
  CheckCircle2,
  X,
  Upload,
} from "lucide-react";
import type { UserStats, WorkoutDay, FoodItem } from "../../types/fitness";

interface AICoachViewProps {
  userStats: UserStats;
  onApplyAIWorkoutPlan?: (plan: WorkoutDay) => void;
  onAddFoodToLog?: (food: Omit<FoodItem, "id">) => void;
}

export type CoachPersona = "alex" | "sarah" | "elena";

interface CoachProfile {
  id: CoachPersona;
  name: string;
  role: string;
  avatarIcon: string;
  badgeColor: string;
  welcomeMessage: string;
  quickPrompts: string[];
}

const COACH_PROFILES: Record<CoachPersona, CoachProfile> = {
  alex: {
    id: "alex",
    name: "Coach Alex",
    role: "Chuyên gia Tăng cơ & Sức mạnh (Hypertrophy)",
    avatarIcon: "🦾",
    badgeColor: "from-purple-600 to-indigo-600",
    welcomeMessage: `Chào bạn! Tôi là **Coach Alex** - Chuyên gia Thể hình & Sức mạnh cá nhân của bạn.
    
Tôi đã đồng bộ chỉ số thể chất của bạn: **${68}kg · 175cm · Mục tiêu: Tăng cơ nạc**.
Hôm nay bạn muốn tối ưu giáo trình tập, tăng mức tạ hay chỉnh sửa kỹ thuật động tác nào?`,
    quickPrompts: [
      "Tối ưu lịch tập 4 buổi Upper/Lower",
      "Hướng dẫn Bench Press chuẩn form không đau vai",
      "Cách áp dụng Progressive Overload chuẩn",
      "Phương pháp khắc phục ngực lệch hai bên",
    ],
  },
  sarah: {
    id: "sarah",
    name: "Coach Sarah",
    role: "Chuyên gia Dinh dưỡng & Tính toán Macro",
    avatarIcon: "🥗",
    badgeColor: "from-emerald-600 to-teal-600",
    welcomeMessage: `Xin chào! Tôi là **Coach Sarah** - Chuyên gia Dinh dưỡng Thể thao FitAI.
    
Dựa trên chỉ số thể trạng của bạn, mức tiêu hao năng lượng TDEE ước tính khoảng **2.570 kcal/ngày**.
Bạn cần tôi lên thực đơn tăng cơ nạc, tính calo hay giải đáp về Whey, Creatine & Supplement?`,
    quickPrompts: [
      "Lên thực đơn 2.200 kcal tăng cơ nạc",
      "Nên nạp bao nhiêu gram đạm mỗi ngày?",
      "Ăn gì trước và sau khi tập để tối đa hóa cơ?",
      "Thời điểm uống Whey & Creatine tốt nhất",
    ],
  },
  elena: {
    id: "elena",
    name: "Coach Elena",
    role: "Chuyên gia Giãn cơ & Phục hồi chấn thương",
    avatarIcon: "🧘‍♀️",
    badgeColor: "from-sky-600 to-blue-600",
    welcomeMessage: `Chào bạn! Tôi là **Coach Elena** - Chuyên gia Phục hồi chức năng & Vận động học.
    
Cơ bắp chỉ thực sự phát triển và phòng tránh chấn thương khi khớp xương linh hoạt và cơ được phục hồi tốt.
Hôm nay bạn có bị đau mỏi nhóm cơ nào, hay cần bài giãn cơ toàn thân sau tập không?`,
    quickPrompts: [
      "Bài tập khắc phục đau mỏi lưng dưới",
      "Giãn cơ toàn thân 10 phút sau buổi tập",
      "Khắc phục khớp vai kêu lục cục khi đẩy tạ",
      "Khởi động khớp háng trước khi tập Squat",
    ],
  },
};

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  coachId?: CoachPersona;
  text: string;
  timestamp: string;
  structuredPlan?: {
    title: string;
    focus: string;
    exercises: {
      name: string;
      sets: number;
      reps: string;
      rest: string;
      tip: string;
    }[];
  };
  structuredMeals?: {
    title: string;
    totalCalories: number;
    macros: { protein: number; carbs: number; fat: number };
    meals: {
      name: string;
      calories: number;
      protein: number;
      items: string;
    }[];
  };
}

export default function AICoachView({
  userStats,
  onApplyAIWorkoutPlan,
  onAddFoodToLog,
}: AICoachViewProps) {
  const [activePersona, setActivePersona] = useState<CoachPersona>("alex");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-init",
      sender: "ai",
      coachId: "alex",
      text: COACH_PROFILES.alex.welcomeMessage,
      timestamp: "10:00",
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSwitchPersona = (newPersona: CoachPersona) => {
    if (newPersona === activePersona) return;
    setActivePersona(newPersona);
    const profile = COACH_PROFILES[newPersona];
    const welcomeMsg: ChatMessage = {
      id: `switch-${Date.now()}`,
      sender: "ai",
      coachId: newPersona,
      text: profile.welcomeMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, welcomeMsg]);
    triggerToast(`Đã kết nối với ${profile.name} (${profile.role})`);
  };

  const handleResetChat = () => {
    const profile = COACH_PROFILES[activePersona];
    setMessages([
      {
        id: `reset-${Date.now()}`,
        sender: "ai",
        coachId: activePersona,
        text: profile.welcomeMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    triggerToast("Đã bắt đầu phiên tư vấn mới!");
  };

  const handleSend = (textToSend = input) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const lower = textToSend.toLowerCase();
      let aiReply = "";
      let planObj: ChatMessage["structuredPlan"] | undefined = undefined;
      let mealObj: ChatMessage["structuredMeals"] | undefined = undefined;

      if (lower.includes("lịch tập") || lower.includes("giáo trình") || lower.includes("buổi")) {
        aiReply = `Dựa trên thể trạng ${userStats.currentWeight}kg và mục tiêu **${userStats.goal}**, tôi đã tối ưu riêng cho bạn giáo trình **Upper / Lower 4 buổi/tuần**:

- **Thứ Hai (Upper A)**: Tập trung Đẩy ngực & Kéo xô nặng
- **Thứ Ba (Lower A)**: Squat & Đùi trước chủ đạo
- **Thứ Tư**: Nghỉ ngơi & phục hồi chủ động
- **Thứ Năm (Upper B)**: Vai & Tay sau / Tay trước
- **Thứ Sáu (Lower B)**: Romanian Deadlift & Đùi sau / Mông
- **Thứ Bảy & CN**: Giãn cơ, nạp đủ protein

Dưới đây là cấu trúc chi tiết buổi tập hôm nay mà bạn có thể nhấn **Áp dụng vào lịch tập** ngay bên dưới:`;

        planObj = {
          title: "Upper Body Hypertrophy (Tối ưu bởi Coach Alex)",
          focus: "Kích thích phì đại cơ ngực, vai và lưng xô",
          exercises: [
            { name: "Barbell Bench Press (Đẩy ngực tạ đòn)", sets: 4, reps: "8-10 reps", rest: "90s", tip: "Khép cùi chỏ 45-60 độ, hạ tạ 2-3s có kiểm soát" },
            { name: "Lat Pulldown (Kéo xô máy cáp)", sets: 4, reps: "10-12 reps", rest: "75s", tip: "Ép chặt xương bả vai ở đáy chuyển động" },
            { name: "Seated Dumbbell Shoulder Press", sets: 3, reps: "10-12 reps", rest: "75s", tip: "Cố định cột sống, không ưỡn lưng dưới" },
            { name: "Cable Lateral Raise (Vai giữa)", sets: 3, reps: "12-15 reps", rest: "60s", tip: "Nâng tạ bằng khuỷu tay, ngón út hơi nhếch lên" },
            { name: "Triceps Rope Pushdown (Tay sau)", sets: 3, reps: "12-15 reps", rest: "60s", tip: "Tách dây sang hai bên ở điểm cuối để siết tối đa" },
          ],
        };
      } else if (lower.includes("thực đơn") || lower.includes("ăn") || lower.includes("calo") || lower.includes("dinh dưỡng")) {
        aiReply = `Dưới đây là thực đơn tăng cơ nạc mẫu **2.200 kcal (Protein: 155g, Carbs: 245g, Fat: 60g)** được tính toán chuẩn theo chỉ số TDEE của bạn:

- Bữa ăn được phân bổ đều đặn giúp duy trì trạng thái đồng hóa cơ bắp (Muscle Protein Synthesis - MPS) liên tục trong ngày.
- Hãy uống tối thiểu 2.5 lít nước mỗi ngày để tối ưu chuyển hóa năng lượng.`;

        mealObj = {
          title: "Thực đơn Tăng Cơ Nạc Chuẩn Khoa Học (2.200 kcal)",
          totalCalories: 2200,
          macros: { protein: 155, carbs: 245, fat: 60 },
          meals: [
            { name: "Bữa sáng (07:30)", calories: 480, protein: 32, items: "60g yến mạch nấu sữa tươi không đường, 2 quả trứng gà luộc, 1 quả chuối tiêu" },
            { name: "Bữa trưa (12:00)", calories: 650, protein: 50, items: "200g cơm gạo lứt, 200g ức gà áp chảo sốt tiêu đen, 1 đĩa bông cải xanh luộc" },
            { name: "Bữa phụ trước tập (16:30)", calories: 350, protein: 28, items: "1 củ khoai lang nướng (150g), 1 muỗng Whey Isolate, 10 hạt hạnh nhân" },
            { name: "Bữa tối (19:30)", calories: 570, protein: 45, items: "180g cá hồi hoặc nạc thăn bò áp chảo, 150g khoai tây nghiền, salad dầu ôliu" },
          ],
        };
      } else if (lower.includes("bench press") || lower.includes("ngực") || lower.includes("vai")) {
        aiReply = `Để đẩy ngực **Barbell Bench Press** mà không bị đau khớp vai, hãy chú ý 3 quy tắc vàng sau:

1. **Retract & Depress Scapula (Khóa xương bả vai):**
   - Ép hai xương bả vai lại với nhau và ghì xuống về phía mông trước khi nhấc tạ ra khỏi giá. Giữ nguyên vị trí này suốt toàn bộ hiệp tập.

2. **Góc khuỷu tay (Elbow Flare):**
   - Không mở khuỷu tay vuông góc 90 độ với thân người (dễ gây cạ khớp vai). Hãy khép góc khuỷu tay vào khoảng **45 - 60 độ** so với sườn.

3. **Điểm hạ tạ:**
   - Hạ đòn tạ chạm nhẹ phần chân ngực (ngay dưới núm vú), không hạ lên phần xương đòn hay cổ. Hít sâu gồng bụng (Bracing) khi hạ và thở ra dứt khoát khi đẩy lên.`;
      } else if (lower.includes("lưng") || lower.includes("đau") || lower.includes("giãn cơ") || lower.includes("phục hồi")) {
        aiReply = `Nếu bạn cảm thấy mỏi hoặc căng tức vùng lưng dưới sau buổi tập Squat/Deadlift, hãy áp dụng ngay quy trình phục hồi 3 bước:

1. **Tư thế Cat-Cow (Mèo - Bò):** Thực hiện 10 nhịp thở nhẹ nhàng để giải tỏa áp lực đĩa đệm thắt lưng.
2. **Tư thế Child's Pose (Em bé):** Giữ yên 45-60 giây, hít thở sâu bằng bụng.
3. **Giãn cơ đùi sau & cơ gập hông (Hip Flexor Stretch):** Vì cơ gập hông bị căng cứng chính là nguyên nhân hàng đầu gây kéo lệch xương chậu và đau lưng dưới.`;
      } else {
        aiReply = `Cảm ơn bạn đã trao đổi! Dựa trên chỉ số thể chất (${userStats.currentWeight}kg, mục tiêu: ${userStats.goal}):

- Hãy luôn duy trì nguyên tắc **Progressive Overload (Tăng tiến tải trọng)**: ghi lại mức tạ mỗi buổi tập và cố gắng thêm 1 lần lặp (rep) hoặc 1-2kg mỗi 1-2 tuần.
- Đảm bảo giấc ngủ đủ 7-8 tiếng mỗi đêm vì 90% hormone tăng trưởng cơ bắp (GH) được tiết ra trong giai đoạn ngủ sâu.
- Bạn có thể hỏi tôi bất kỳ thắc mắc nào về bài tập, mức tạ, calo hoặc kỹ thuật động tác nhé!`;
      }

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: "ai",
        coachId: activePersona,
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        structuredPlan: planObj,
        structuredMeals: mealObj,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    triggerToast("Đã sao chép nội dung vào khay nhớ tạm!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to render formatted text with bolding and lists
  const renderFormattedText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      if (!line.trim()) return <div key={idx} className="my-1.5" />;

      // Parse bolding **word**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedParts = parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={pIdx} className="text-white font-bold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      // Check if bullet point
      if (line.trim().startsWith("- ") || line.trim().startsWith("• ")) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1 pl-2">
            <span className="text-purple-400 mt-1 text-xs">•</span>
            <span className="text-slate-200 text-[13px] leading-relaxed">
              {renderedParts}
            </span>
          </div>
        );
      }

      // Check if numbered list (e.g. "1. ")
      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <div key={idx} className="my-1.5 pl-2">
            <span className="text-slate-200 text-[13px] leading-relaxed">
              {renderedParts}
            </span>
          </div>
        );
      }

      return (
        <p key={idx} className="text-slate-200 text-[13px] leading-relaxed my-1">
          {renderedParts}
        </p>
      );
    });
  };

  const currentCoach = COACH_PROFILES[activePersona];

  return (
    <div className="ai-coach-page-layout">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="vault-toast-banner">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP BAR: Coach Selector & Controls */}
      <div className="ai-coach-header">
        <div className="ai-coach-header-top">
          <div className="ai-coach-branding">
            <div className="ai-coach-avatar">
              <span className="text-xl">{currentCoach.avatarIcon}</span>
            </div>
            <div>
              <div className="ai-coach-title-row">
                <h2>{currentCoach.name}</h2>
                <span className="ai-badge-chip">HLV TRÍ TUỆ NHÂN TẠO 24/7</span>
              </div>
              <div className="ai-coach-status">
                <span className="live-dot" /> {currentCoach.role}
              </div>
            </div>
          </div>

          {/* Right actions: User context & Reset button */}
          <div className="ai-header-right-actions">
            <div className="ai-user-context-pill">
              <div className="context-item">
                <span className="ctx-label">Thể trạng:</span>
                <strong>{userStats.currentWeight}kg / {userStats.height}cm</strong>
              </div>
              <div className="context-divider" />
              <div className="context-item">
                <span className="ctx-label">Mục tiêu:</span>
                <strong>{userStats.goal}</strong>
              </div>
            </div>

            <button
              className="ai-reset-chat-btn"
              onClick={handleResetChat}
              title="Bắt đầu cuộc trò chuyện mới"
            >
              <RotateCcw size={13} />
              <span>Làm mới</span>
            </button>
          </div>
        </div>

        {/* Coach Persona Selector Bar (Dedicated Sub-Row, Never Clipped) */}
        <div className="ai-coach-header-sub">
          <div className="coach-persona-switcher">
            <button
              className={`persona-tab-btn ${activePersona === "alex" ? "active" : ""}`}
              onClick={() => handleSwitchPersona("alex")}
              title="Coach Alex - Chuyên gia Tăng cơ & Thể hình"
            >
              <span>🦾</span>
              <span className="persona-name">Coach Alex (Tăng cơ)</span>
            </button>
            <button
              className={`persona-tab-btn ${activePersona === "sarah" ? "active" : ""}`}
              onClick={() => handleSwitchPersona("sarah")}
              title="Coach Sarah - Chuyên gia Dinh dưỡng & Calo"
            >
              <span>🥗</span>
              <span className="persona-name">Coach Sarah (Dinh dưỡng)</span>
            </button>
            <button
              className={`persona-tab-btn ${activePersona === "elena" ? "active" : ""}`}
              onClick={() => handleSwitchPersona("elena")}
              title="Coach Elena - Chuyên gia Giãn cơ & Phục hồi"
            >
              <span>🧘‍♀️</span>
              <span className="persona-name">Coach Elena (Phục hồi)</span>
            </button>
          </div>

          <div className="ai-coach-active-badge">
            <span className="text-[11.5px] text-purple-300/80">
              Chuyên môn: <strong className="text-white font-medium">{currentCoach.role}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Safety Notice (Compact & Slim) */}
      <div className="ai-safety-alert">
        <ShieldAlert size={14} className="safety-icon flex-shrink-0" />
        <span>
          <strong>Lưu ý:</strong> Gợi ý của HLV FitAI dựa trên khoa học thể hình chuẩn quốc tế. Luôn khởi động kỹ trước khi tập nặng để tránh chấn thương.
        </span>
      </div>

      {/* CHAT MESSAGES LOG */}
      <div className="ai-chat-messages-container">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          const msgCoach = msg.coachId ? COACH_PROFILES[msg.coachId] : currentCoach;

          return (
            <div
              key={msg.id}
              className={`chat-bubble-row ${isUser ? "user-row" : "ai-row"}`}
            >
              {!isUser && (
                <div className="chat-avatar ai">
                  <span>{msgCoach.avatarIcon}</span>
                </div>
              )}

              <div className={`chat-bubble-card ${msg.sender}`}>
                {!isUser && (
                  <div className="chat-coach-header-small">
                    <strong>{msgCoach.name}</strong>
                    <span>{msgCoach.role}</span>
                  </div>
                )}

                <div className="chat-bubble-text">
                  {renderFormattedText(msg.text)}
                </div>

                {/* Structured Workout Plan Box */}
                {msg.structuredPlan && (
                  <div className="ai-generated-plan-box">
                    <div className="plan-box-header">
                      <CalendarCheck size={18} className="plan-icon" />
                      <div>
                        <strong>{msg.structuredPlan.title}</strong>
                        <span>{msg.structuredPlan.focus}</span>
                      </div>
                    </div>

                    <div className="plan-exercises-table">
                      {msg.structuredPlan.exercises.map((item, exIdx) => (
                        <div key={exIdx} className="plan-ex-row">
                          <div className="plan-ex-info">
                            <span className="plan-ex-name">{item.name}</span>
                            <span className="plan-ex-tip">💡 {item.tip}</span>
                          </div>
                          <div className="plan-ex-stats">
                            <span>{item.sets} hiệp × {item.reps}</span>
                            <small>Nghỉ {item.rest}</small>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      className="apply-plan-btn"
                      onClick={() => {
                        if (onApplyAIWorkoutPlan && msg.structuredPlan) {
                          onApplyAIWorkoutPlan({
                            id: `plan-${Date.now()}`,
                            dayName: "T2",
                            dayTitle: "Hôm nay",
                            title: msg.structuredPlan.title,
                            focus: msg.structuredPlan.focus,
                            durationMinutes: 60,
                            exercises: msg.structuredPlan.exercises.map((e, i) => ({
                              id: `ex-ai-${i}`,
                              name: e.name,
                              targetMuscle: "Toàn thân",
                              equipment: "Tạ phòng gym",
                              difficulty: "Trung bình",
                              sets: e.sets,
                              reps: `${e.sets} x ${e.reps}`,
                              restSeconds: parseInt(e.rest) || 60,
                              instructions: [e.tip],
                              tips: e.tip,
                            })),
                          });
                          triggerToast("✨ Đã áp dụng giáo trình AI vào Lịch tập thành công!");
                        }
                      }}
                    >
                      <CalendarCheck size={15} /> Áp dụng vào lịch tập của tôi
                    </button>
                  </div>
                )}

                {/* Structured Nutrition Meal Box */}
                {msg.structuredMeals && (
                  <div className="ai-generated-meal-box">
                    <div className="meal-box-header">
                      <Utensils size={18} className="meal-icon" />
                      <div>
                        <strong>{msg.structuredMeals.title}</strong>
                        <span>
                          Tổng calo: {msg.structuredMeals.totalCalories} kcal (P: {msg.structuredMeals.macros.protein}g · C: {msg.structuredMeals.macros.carbs}g · F: {msg.structuredMeals.macros.fat}g)
                        </span>
                      </div>
                    </div>

                    <div className="meal-list-table">
                      {msg.structuredMeals.meals.map((meal, mIdx) => (
                        <div key={mIdx} className="meal-item-row">
                          <div className="meal-item-info">
                            <strong>{meal.name}</strong>
                            <span>{meal.items}</span>
                          </div>
                          <div className="meal-item-cals">
                            <span>{meal.calories} kcal</span>
                            <small>{meal.protein}g Protein</small>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      className="apply-meal-btn"
                      onClick={() => {
                        if (onAddFoodToLog && msg.structuredMeals) {
                          onAddFoodToLog({
                            name: "Thực đơn dinh dưỡng tối ưu bởi Coach Sarah",
                            category: "Bữa trưa",
                            calories: 650,
                            protein: 50,
                            carbs: 70,
                            fat: 15,
                            portion: "1 phần đầy đủ",
                            emoji: "🥗",
                          });
                          triggerToast("✨ Đã thêm thực đơn mẫu vào Nhật ký dinh dưỡng!");
                        } else {
                          triggerToast("✨ Đã lưu thực đơn dinh dưỡng vào nhật ký!");
                        }
                      }}
                    >
                      <Utensils size={15} /> Thêm vào nhật ký ăn uống hôm nay
                    </button>
                  </div>
                )}

                <div className="chat-bubble-footer">
                  <span className="chat-time">{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      className="copy-text-btn"
                      onClick={() => handleCopy(msg.id, msg.text)}
                      title="Sao chép nội dung"
                    >
                      {copiedId === msg.id ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    </button>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="chat-avatar user">
                  <img src={userStats.avatar} alt="User" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="chat-bubble-row ai-row">
            <div className="chat-avatar ai">
              <span>{currentCoach.avatarIcon}</span>
            </div>
            <div className="typing-indicator-box">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-text">{currentCoach.name} đang suy nghĩ câu trả lời...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* QUICK PROMPTS BAR */}
      <div className="quick-prompts-bar">
        <span className="quick-prompt-label">Gợi ý cho {currentCoach.name}:</span>
        {currentCoach.quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            className="quick-prompt-chip"
            onClick={() => handleSend(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* INPUT COMPOSER */}
      <form
        className="ai-chat-composer"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        {/* Multimodal Actions: Camera & Voice */}
        <div className="composer-addon-buttons">
          <button
            type="button"
            className="addon-btn"
            onClick={() => setShowUploadModal(true)}
            title="Quét ảnh đĩa ăn phân tích calo hoặc chấm điểm form tập"
          >
            <Camera size={18} />
          </button>

          <button
            type="button"
            className={`addon-btn ${isListening ? "listening" : ""}`}
            onClick={() => {
              setIsListening(!isListening);
              if (!isListening) {
                triggerToast("🎙️ Đang lắng nghe giọng nói... Hãy nói câu hỏi của bạn!");
                setTimeout(() => {
                  setInput("Hướng dẫn kỹ thuật hít thở khi tập Squat nặng?");
                  setIsListening(false);
                }, 2500);
              }
            }}
            title="Nhập bằng giọng nói"
          >
            <Mic size={18} />
          </button>
        </div>

        <input
          type="text"
          className="composer-input"
          placeholder={`Hỏi ${currentCoach.name} về giáo trình, kỹ thuật, thực đơn dinh dưỡng...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          type="submit"
          className="composer-send-btn"
          disabled={!input.trim()}
          aria-label="Gửi tin nhắn"
        >
          <Send size={16} />
        </button>
      </form>

      {/* Simulated Vision / Camera Upload Modal */}
      {showUploadModal && (
        <div className="modal-backdrop-fullscreen" onClick={() => setShowUploadModal(false)}>
          <div className="modal-standard-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title">
                <Camera size={20} className="text-purple-400" />
                <div>
                  <h3 className="text-white text-base font-bold">Thị giác AI (AI Fitness Vision)</h3>
                  <span className="text-xs text-slate-400">Phân tích calo qua ảnh món ăn hoặc chấm điểm tư thế tập</span>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setShowUploadModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div
                className="border-2 border-dashed border-purple-500/30 rounded-xl p-8 flex flex-col items-center justify-center gap-3 bg-purple-950/10 cursor-pointer hover:border-purple-500/60 transition"
                onClick={() => {
                  setShowUploadModal(false);
                  handleSend("Phân tích dinh dưỡng đĩa ăn: 200g ức gà, 1 chén cơm gạo lứt và súp lơ xanh");
                }}
              >
                <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <Upload size={24} />
                </div>
                <div className="text-center">
                  <strong className="text-white text-sm block">Tải ảnh hoặc Kéo thả ảnh vào đây</strong>
                  <span className="text-xs text-slate-400 mt-1 block">Hỗ trợ định dạng JPG, PNG (tối đa 10MB)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 text-left hover:border-purple-500/40 transition"
                  onClick={() => {
                    setShowUploadModal(false);
                    handleSend("Chấm điểm tư thế động tác Barbell Back Squat từ video quay góc nghiêng");
                  }}
                >
                  <Dumbbell size={16} className="text-purple-400 mb-1" />
                  <strong className="text-white text-xs block">Chấm điểm tư thế Form</strong>
                  <span className="text-[11px] text-slate-400">Nhận diện lỗi cong lưng, chụm gối</span>
                </button>

                <button
                  type="button"
                  className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 text-left hover:border-emerald-500/40 transition"
                  onClick={() => {
                    setShowUploadModal(false);
                    handleSend("Phân tích lượng Calo và Protein trong đĩa cơm trưa");
                  }}
                >
                  <Utensils size={16} className="text-emerald-400 mb-1" />
                  <strong className="text-white text-xs block">Phân tích đĩa ăn</strong>
                  <span className="text-[11px] text-slate-400">Tự động ước tính Calo & Macro P/C/F</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
