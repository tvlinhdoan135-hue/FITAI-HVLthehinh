import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  ShieldAlert,
  CalendarCheck,
  Bot,
  Copy,
  Check,
} from "lucide-react";
import type { UserStats, WorkoutDay } from "../../types/fitness";

interface AICoachViewProps {
  userStats: UserStats;
  onApplyAIWorkoutPlan?: (plan: WorkoutDay) => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
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
}

export default function AICoachView({
  userStats,
  onApplyAIWorkoutPlan,
}: AICoachViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-1",
      sender: "ai",
      text: `Xin chào **${userStats.name}**! 👋 Mình là FitAI Coach - Huấn luyện viên thể hình cá nhân của bạn.

Hiện tại mình đã đồng bộ thông số thể trạng của bạn:
- **Cân nặng**: ${userStats.currentWeight} kg (Mục tiêu: ${userStats.targetWeight} kg)
- **Mục tiêu**: ${userStats.goal}
- **Trình độ**: ${userStats.experienceLevel}

Hôm nay bạn cần mình hỗ trợ điều gì? Lên giáo trình tập, tính toán thực đơn dinh dưỡng hay giải đáp kỹ thuật bài tập?`,
      timestamp: "10:00",
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickPrompts = [
    "Lên lịch tập 4 buổi/tuần tăng cơ",
    "Thực đơn tăng cơ nạc 2.200 kcal",
    "Hướng dẫn Bench Press chuẩn form không đau vai",
    "Bài tập thay thế khi đau khớp gối",
  ];

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

    // Simulate smart AI response
    setTimeout(() => {
      const lower = textToSend.toLowerCase();
      let aiReply = "";
      let planObj: ChatMessage["structuredPlan"] | undefined = undefined;

      if (lower.includes("lịch tập") || lower.includes("giáo trình") || lower.includes("buổi")) {
        aiReply = `Dựa trên thể trạng ${userStats.currentWeight}kg và mục tiêu **${userStats.goal}**, mình đã tối ưu riêng cho bạn giáo trình **Upper / Lower 4 buổi/tuần**:

- **Thứ Hai (Upper A)**: Tập trung Đẩy ngực & Kéo xô nặng
- **Thứ Ba (Lower A)**: Squat & Đùi trước chủ đạo
- **Thứ Tư**: Nghỉ ngơi & phục hồi chủ động
- **Thứ Năm (Upper B)**: Vai & Tay sau / Tay trước
- **Thứ Sáu (Lower B)**: Romanian Deadlift & Đùi sau / Mông
- **Thứ Bảy & CN**: Giãn cơ, nạp đủ protein

Dưới đây là cấu trúc chi tiết buổi tập hôm nay mà bạn có thể nhấn **Áp dụng vào lịch tập** ngay bên dưới:`;

        planObj = {
          title: "Upper Body Hypertrophy (Tối ưu bởi FitAI)",
          focus: "Kích thích phì đại cơ ngực, vai và lưng xô",
          exercises: [
            { name: "Incline Barbell Bench Press", sets: 4, reps: "8-10 reps", rest: "90s", tip: "Hạ tạ 2-3s có kiểm soát" },
            { name: "Lat Pulldown kéo xô", sets: 4, reps: "10-12 reps", rest: "75s", tip: "Ép chặt xương bả vai ở đáy" },
            { name: "Seated Dumbbell Shoulder Press", sets: 3, reps: "10-12 reps", rest: "75s", tip: "Không ưỡn lưng dưới" },
            { name: "Cable Lateral Raise", sets: 3, reps: "12-15 reps", rest: "60s", tip: "Nâng tạ bằng khuỷu tay" },
            { name: "Triceps Rope Pushdown", sets: 3, reps: "12-15 reps", rest: "60s", tip: "Tách dây sang hai bên ở điểm cuối" },
          ],
        };
      } else if (lower.includes("thực đơn") || lower.includes("ăn") || lower.includes("calo") || lower.includes("dinh dưỡng")) {
        aiReply = `Dưới đây là thực đơn mẫu **2.200 kcal (Protein: 150g, Carbs: 250g, Fat: 65g)** được tính toán chuẩn theo chỉ số TDEE của bạn:

1. **Bữa sáng (7:30)**:
   - 60g yến mạch nấu sữa đậu nành
   - 2 quả trứng gà luộc + 1 quả chuối tiêu
   - *450 kcal | 26g Protein*

2. **Bữa trưa (12:00)**:
   - 1 chén rưỡi cơm gạo lứt (200g)
   - 200g ức gà áp chảo sốt tiêu đen
   - 1 đĩa bông cải xanh & cà rốt luộc
   - *620 kcal | 52g Protein*

3. **Bữa phụ trước tập (16:30)**:
   - 1 củ khoai lang luộc + 1 muỗng Whey Protein
   - *280 kcal | 28g Protein*

4. **Bữa tối (19:30)**:
   - 150g cá hồi hoặc thịt bò áp chảo
   - 1 củ khoai tây nướng + salad rau xanh dầu ôliu
   - *550 kcal | 38g Protein*

💡 **Mẹo:** Uống ít nhất 2.5 lít nước/ngày và chia đều lượng đạm để tối ưu khả năng tổng hợp cơ bắp (MPS)!`;
      } else if (lower.includes("bench press") || lower.includes("ngực") || lower.includes("vai")) {
        aiReply = `Để đẩy ngực **Barbell Bench Press** mà không bị đau khớp vai, hãy chú ý 3 quy tắc vàng sau:

1. **Retract & Depress Scapula (Khóa xương bả vai):**
   - Ép hai xương bả vai lại với nhau và ghì xuống về phía mông trước khi nhấc tạ ra khỏi giá. Giữ nguyên vị trí này suốt toàn bộ hiệp tập.

2. **Góc khuỷu tay (Elbow Flare):**
   - Không mở khuỷu tay vuông góc 90 độ với thân người (dễ gây cạ khớp vai). Hãy khép góc khuỷu tay vào khoảng **45 - 60 độ** so với sườn.

3. **Điểm hạ tạ:**
   - Hạ đòn tạ chạm nhẹ phần chân ngực (ngay dưới núm vú), không hạ lên phần xương đòn hay cổ. Hít sâu gồng bụng (Bracing) khi hạ và thở ra dứt khoát khi đẩy lên.`;
      } else {
        aiReply = `Cảm ơn bạn đã hỏi! Với thói quen tập luyện và chỉ số hiện tại (${userStats.currentWeight}kg, mục tiêu ${userStats.goal}):

- Hãy luôn duy trì nguyên tắc **Progressive Overload (Tăng tiến tải trọng)**: ghi lại mức tạ mỗi buổi tập và cố gắng thêm 1 lần lặp (rep) hoặc 1-2kg mỗi 1-2 tuần.
- Đảm bảo giấc ngủ đủ 7-8 tiếng mỗi đêm vì 90% hormone tăng trưởng cơ bắp (GH) được tiết ra trong giai đoạn ngủ sâu.
- Bạn có muốn mình tạo một kế hoạch tập riêng cho nhóm cơ cụ thể nào không? Hãy cho mình biết nhé!`;
      }

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: "ai",
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        structuredPlan: planObj,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1100);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="ai-coach-page-layout">
      {/* Top AI Header */}
      <div className="ai-coach-header">
        <div className="ai-coach-branding">
          <div className="ai-coach-avatar">
            <Sparkles size={24} />
          </div>
          <div>
            <div className="ai-coach-title-row">
              <h2>FitAI Coach</h2>
              <span className="ai-badge-chip">TRỢ LÝ THÔNG MINH</span>
            </div>
            <div className="ai-coach-status">
              <span className="live-dot" /> Trực tuyến · Sẵn sàng đồng hành cùng {userStats.name}
            </div>
          </div>
        </div>

        {/* User Context Quick Pill */}
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
      </div>

      {/* Safety Notice */}
      <div className="ai-safety-alert">
        <ShieldAlert size={16} className="safety-icon" />
        <span>
          <strong>Lưu ý an toàn:</strong> Gợi ý của FitAI Coach dựa trên khoa học thể hình tổng quan. Nếu bạn có tiền sử chấn thương hoặc bệnh lý tim mạch, hãy tham khảo ý kiến bác sĩ chuyên khoa trước khi bắt đầu bài tập nặng.
        </span>
      </div>

      {/* Chat Messages Log */}
      <div className="ai-chat-messages-container">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-bubble-row ${msg.sender === "user" ? "user-row" : "ai-row"}`}
          >
            {msg.sender === "ai" && (
              <div className="chat-avatar ai">
                <Bot size={18} />
              </div>
            )}

            <div className={`chat-bubble-card ${msg.sender}`}>
              <div className="chat-bubble-text">
                {msg.text.split("\n").map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>

              {/* Render Structured Plan if available */}
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
                        alert("Đã áp dụng giáo trình AI vào Chương trình tập!");
                      }
                    }}
                  >
                    <CalendarCheck size={16} /> Áp dụng vào lịch tập của tôi
                  </button>
                </div>
              )}

              <div className="chat-bubble-footer">
                <span className="chat-time">{msg.timestamp}</span>
                {msg.sender === "ai" && (
                  <button
                    className="copy-text-btn"
                    onClick={() => handleCopy(msg.id, msg.text)}
                    title="Sao chép nội dung"
                  >
                    {copiedId === msg.id ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                )}
              </div>
            </div>

            {msg.sender === "user" && (
              <div className="chat-avatar user">
                <img src={userStats.avatar} alt="User" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="chat-bubble-row ai-row">
            <div className="chat-avatar ai">
              <Bot size={18} />
            </div>
            <div className="typing-indicator-box">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-text">HLV FitAI đang suy nghĩ câu trả lời...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="quick-prompts-bar">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            className="quick-prompt-chip"
            onClick={() => handleSend(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Composer */}
      <form
        className="ai-chat-composer"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          type="text"
          className="composer-input"
          placeholder="Hỏi FitAI Coach về bài tập, lịch tập, thực đơn dinh dưỡng..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="composer-send-btn"
          disabled={!input.trim()}
          aria-label="Gửi tin nhắn"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
