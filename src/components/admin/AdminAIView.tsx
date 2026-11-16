import { useState } from "react";
import {
  Bot,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Clock,
  Coins,
} from "lucide-react";
import type { PromptVersion, PromptTask, AIMetrics } from "../../types/admin";

interface AdminAIViewProps {
  promptVersions: PromptVersion[];
  metrics: AIMetrics;
  onPublishVersion: (versionId: string) => void;
  onCreateVersion: (version: PromptVersion) => void;
}

export default function AdminAIView({
  promptVersions,
  metrics,
  onPublishVersion,
  onCreateVersion,
}: AdminAIViewProps) {
  const [selectedTask, setSelectedTask] = useState<PromptTask>("generate_workout_plan");
  const [selectedModel, setSelectedModel] = useState("gemini-1.5-flash");
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.95);
  const [maxTokens, setMaxTokens] = useState(2048);

  // Playground state
  const [playgroundInput, setPlaygroundInput] = useState(
    "Tôi là nam 28 tuổi, cao 1m75, nặng 72kg, muốn tập tăng cơ ngực và vai trong 45 phút, chỉ có tạ đơn."
  );
  const [playgroundOutput, setPlaygroundOutput] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simMetrics, setSimMetrics] = useState<{ latency: number; tokens: number } | null>(null);

  // Draft editing state
  const currentTaskVersions = promptVersions.filter((pv) => pv.task === selectedTask);
  const activeVersion = currentTaskVersions.find((pv) => pv.status === "published") || currentTaskVersions[0];
  const [editablePromptText, setEditablePromptText] = useState(activeVersion?.promptText || "");
  const [changeLogNote, setChangeLogNote] = useState("");
  const [showSaveNotice, setShowSaveNotice] = useState(false);

  // Handle switching tasks
  const handleSelectTask = (task: PromptTask) => {
    setSelectedTask(task);
    const targetVer = promptVersions.find((pv) => pv.task === task && pv.status === "published") ||
      promptVersions.find((pv) => pv.task === task);
    if (targetVer) {
      setEditablePromptText(targetVer.promptText);
    }
  };

  // Run AI Playground Simulation
  const handleRunPlayground = () => {
    if (!playgroundInput.trim()) return;
    setIsSimulating(true);
    setPlaygroundOutput("");
    setSimMetrics(null);

    setTimeout(() => {
      let mockReply = "";
      if (selectedTask === "generate_workout_plan") {
        mockReply = `🏋️ **GIÁO TRÌNH TĂNG CƠ NGỰC & VAI VỚI TẠ ĐƠN (45 PHÚT)**

⏱ **Khởi động (5 phút):** Xoay khớp bả vai, Arm Circles, Đẩy ngực không tạ x 15 reps.

🔥 **Khối lượng bài tập chính:**
1. **Dumbbell Floor Press (Đẩy ngực trên sàn):** 4 hiệp x 10-12 lần. Nghỉ 75s.
   *Lưu ý:* Ép chặt bả vai, cùi chỏ tạo góc 45 độ với thân người để bảo vệ khớp vai.
2. **Dumbbell Incline Push-up (Chống đẩy kê cao tay):** 3 hiệp x 12-15 lần. Nghỉ 60s.
3. **Seated Dumbbell Shoulder Press (Đẩy vai ngồi):** 4 hiệp x 8-10 lần. Nghỉ 90s.
4. **Dumbbell Lateral Raise (Dang tạ đơn cơ vai bên):** 3 hiệp x 15 lần (Drop-set hiệp cuối). Nghỉ 60s.
5. **Dumbbell Rear Delt Fly (Gập người bay tạ vai sau):** 3 hiệp x 15 lần. Nghỉ 60s.

💧 **Giãn cơ & Phục hồi (5 phút):** Kéo giãn cơ ngực qua tường, giãn cơ delta sau. Uống 300ml nước.`;
      } else if (selectedTask === "nutrition_advisor") {
        mockReply = `🥗 **KHUYẾN NGHỊ DINH DƯỠNG FITAI PRO:**
- Mục tiêu: Tăng cơ nạc (Lean Bulking).
- Calo mục tiêu: 2,650 kcal/ngày (Thặng dư +300 kcal).
- Phân bổ Macros:
  + Đạm (Protein): 160g (Ức gà, bò tái lăn, trứng vịt lộn/trứng gà).
  + Tinh bột (Carbs): 310g (Cơm gạo lứt tím than, khoai lang nướng, yến mạch).
  + Chất béo tốt: 60g (Bơ đậu phộng, dầu ô liu, các loại hạt hạnh nhân).`;
      } else {
        mockReply = `✅ Phản hồi kỹ thuật theo tiêu chuẩn FitAI Biomechanics v2.4: Đảm bảo kiểm soát pha eccentric 3 giây và thở ra khi phát lực.`;
      }

      setPlaygroundOutput(mockReply);
      setIsSimulating(false);
      setSimMetrics({
        latency: Math.floor(280 + Math.random() * 220),
        tokens: Math.floor(450 + Math.random() * 200),
      });
    }, 700);
  };

  const handleCreateNewDraft = () => {
    const newVer: PromptVersion = {
      id: `pv-${Date.now()}`,
      task: selectedTask,
      taskLabel:
        selectedTask === "generate_workout_plan"
          ? "Lập giáo trình tập luyện"
          : selectedTask === "explain_exercise"
          ? "Giải thích kỹ thuật bài tập"
          : selectedTask === "nutrition_advisor"
          ? "Tư vấn dinh dưỡng & Macros"
          : "Bộ lọc an toàn & Cảnh báo y tế",
      version: `v2.${currentTaskVersions.length + 1}-draft`,
      status: "draft",
      createdBy: "Quản trị viên (admin@fitai.vn)",
      createdAt: new Date().toLocaleDateString("vi-VN"),
      changeLog: changeLogNote.trim() || "Cập nhật prompt tùy chỉnh mới từ Admin Console",
      promptText: editablePromptText,
    };
    onCreateVersion(newVer);
    setChangeLogNote("");
    setShowSaveNotice(true);
    setTimeout(() => setShowSaveNotice(false), 3000);
  };

  return (
    <div className="admin-page-container">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Quản lý Huấn luyện viên AI & Prompts</h2>
          <p className="admin-page-desc">
            Cấu hình System Prompts, tham số mô hình LLM, bộ quy chuẩn an toàn bắt buộc và Sandbox thử nghiệm.
          </p>
        </div>
        <div className="admin-ai-badge">
          <Zap size={15} color="#eab308" />
          <span>LLM Engine: Gemini 2.5 Flash</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="admin-mini-stat-strip">
        <div className="admin-mini-stat-item">
          <div className="mini-stat-label">Tổng số Prompt Calls</div>
          <div className="mini-stat-val">{(metrics.totalRequests).toLocaleString()}</div>
        </div>
        <div className="admin-mini-stat-item">
          <div className="mini-stat-label">Tỷ lệ thành công</div>
          <div className="mini-stat-val text-green">{metrics.successRate}%</div>
        </div>
        <div className="admin-mini-stat-item">
          <div className="mini-stat-label">Độ trễ trung bình</div>
          <div className="mini-stat-val text-purple">{metrics.avgLatencyMs} ms</div>
        </div>
        <div className="admin-mini-stat-item">
          <div className="mini-stat-label">Chi phí ước tính</div>
          <div className="mini-stat-val text-amber">${metrics.estimatedCostUsd} / tháng</div>
        </div>
      </div>

      {/* Main Grid: Left Prompt Editor & Model Controls, Right Playground Simulator */}
      <div className="admin-ai-two-col-grid">
        {/* Left Column: Model Config & System Prompt */}
        <div className="admin-subcard ai-editor-card">
          <div className="admin-card-inner-header">
            <Bot size={18} className="text-purple" />
            <h3 className="admin-subcard-title">Cấu hình Mô hình & System Prompt</h3>
          </div>

          {/* Task Pills */}
          <div className="admin-task-tabs">
            {(
              [
                { id: "generate_workout_plan", label: "Tạo lịch tập" },
                { id: "explain_exercise", label: "Kỹ thuật động tác" },
                { id: "nutrition_advisor", label: "Tư vấn dinh dưỡng" },
                { id: "safety_guardrails", label: "Bộ lọc an toàn" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                className={`admin-task-tab-btn ${selectedTask === t.id ? "active" : ""}`}
                onClick={() => handleSelectTask(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* LLM & Model Parameters */}
          <div className="admin-model-params-box">
            <div className="param-row">
              <label>Mô hình AI (LLM):</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="admin-select sm"
              >
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Tối ưu độ trễ & chi phí)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Suy luận sâu, logic phức tạp)</option>
                <option value="gpt-4o">GPT-4o (Đa phương tiện cao cấp)</option>
                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet (Văn phong mượt mà)</option>
              </select>
            </div>

            <div className="param-sliders-grid">
              <div className="slider-group">
                <div className="slider-label">
                  <span>Nhiệt độ (Temperature):</span>
                  <span className="slider-val">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                />
              </div>

              <div className="slider-group">
                <div className="slider-label">
                  <span>Top-P Sampling:</span>
                  <span className="slider-val">{topP}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={topP}
                  onChange={(e) => setTopP(parseFloat(e.target.value))}
                />
              </div>

              <div className="slider-group">
                <div className="slider-label">
                  <span>Giới hạn Tokens:</span>
                  <span className="slider-val">{maxTokens}</span>
                </div>
                <input
                  type="range"
                  min="512"
                  max="4096"
                  step="256"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* System Prompt Textarea */}
          <div className="admin-prompt-editor-wrap">
            <div className="editor-top-meta">
              <div className="version-tag">
                <span>Phiên bản:</span>
                <strong>{activeVersion?.version || "v2.4"}</strong>
                <span className="status-badge published">Đang hoạt động</span>
              </div>
              <button
                className="admin-ghost-btn"
                onClick={() => setEditablePromptText(activeVersion?.promptText || "")}
                title="Khôi phục mặc định"
              >
                <RotateCcw size={14} /> Khôi phục
              </button>
            </div>

            <textarea
              className="admin-prompt-textarea"
              rows={9}
              value={editablePromptText}
              onChange={(e) => setEditablePromptText(e.target.value)}
              placeholder="Nhập System Prompt cho huấn luyện viên FitAI..."
            />

            <div className="changelog-input-wrap">
              <input
                type="text"
                placeholder="Ghi chú thay đổi (Changelog note) trước khi lưu..."
                value={changeLogNote}
                onChange={(e) => setChangeLogNote(e.target.value)}
              />
              <button
                className="admin-primary-btn"
                onClick={handleCreateNewDraft}
              >
                <Plus size={16} /> Lưu phiên bản mới
              </button>
            </div>

            {showSaveNotice && (
              <div className="admin-notice-toast">
                <CheckCircle2 size={16} color="#34d399" />
                <span>Đã lưu bản nháp thành công! Có thể bấm Phát hành bên dưới.</span>
              </div>
            )}
          </div>

          {/* Mandatory Safety Filters Banner */}
          <div className="admin-safety-banner">
            <div className="safety-title">
              <AlertTriangle size={16} color="#f59e0b" />
              <span>Quy chuẩn an toàn bắt buộc (FR-06 Guardrails)</span>
            </div>
            <div className="safety-tags-row">
              <span className="safety-tag locked">
                <CheckCircle2 size={13} /> Chặn tư vấn y tế & chấn thương nặng
              </span>
              <span className="safety-tag locked">
                <CheckCircle2 size={13} /> Từ chối Steroids & Doping
              </span>
              <span className="safety-tag locked">
                <CheckCircle2 size={13} /> Giới hạn calo tối thiểu an toàn (&gt;1,200 kcal)
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: AI Playground Simulator */}
        <div className="admin-subcard ai-playground-card">
          <div className="admin-card-inner-header">
            <Sparkles size={18} className="text-amber" />
            <h3 className="admin-subcard-title">Playground: Thử nghiệm Realtime</h3>
          </div>

          <div className="playground-body">
            <div className="admin-form-group">
              <label>Câu hỏi / Yêu cầu giả lập từ học viên:</label>
              <textarea
                className="admin-test-input"
                rows={3}
                value={playgroundInput}
                onChange={(e) => setPlaygroundInput(e.target.value)}
                placeholder="Nhập câu lệnh để kiểm tra độ thích ứng của Prompt..."
              />
            </div>

            <div className="playground-actions-row">
              <button
                className={`admin-primary-btn ${isSimulating ? "loading" : ""}`}
                onClick={handleRunPlayground}
                disabled={isSimulating}
              >
                <Play size={16} />
                <span>{isSimulating ? "AI đang tính toán..." : "Chạy thử nghiệm Prompt"}</span>
              </button>
            </div>

            {/* Simulation Response Output */}
            <div className="playground-output-container">
              <div className="output-header">
                <span className="output-label">Kết quả phản hồi từ FitAI Engine:</span>
                {simMetrics && (
                  <div className="output-metrics">
                    <span className="metric-pill">
                      <Clock size={12} /> {simMetrics.latency}ms
                    </span>
                    <span className="metric-pill">
                      <Coins size={12} /> {simMetrics.tokens} tokens
                    </span>
                  </div>
                )}
              </div>

              <div className="output-text-box">
                {isSimulating ? (
                  <div className="ai-loading-pulse">
                    <div className="ai-dot-pulse" />
                    <span>Đang gọi LLM API với System Prompt hiện tại...</span>
                  </div>
                ) : playgroundOutput ? (
                  <pre className="ai-rendered-output">{playgroundOutput}</pre>
                ) : (
                  <div className="text-muted placeholder">
                    Bấm &quot;Chạy thử nghiệm Prompt&quot; để quan sát phản hồi trực tiếp của mô hình.
                  </div>
                )}
              </div>
            </div>

            {/* Version History Table */}
            <div className="version-history-box">
              <h4 className="version-history-title">Lịch sử các phiên bản Prompts ({currentTaskVersions.length})</h4>
              <div className="version-items-list">
                {currentTaskVersions.map((v) => (
                  <div key={v.id} className="version-item-row">
                    <div className="version-meta">
                      <span className="ver-number">{v.version}</span>
                      <span className="ver-author">{v.createdBy}</span>
                      <span className="ver-date">{v.createdAt}</span>
                    </div>
                    <div className="ver-log">{v.changeLog}</div>
                    <div className="ver-actions">
                      {v.status === "published" ? (
                        <span className="admin-badge role pro">Đang phát hành</span>
                      ) : (
                        <button
                          className="admin-btn-sm-publish"
                          onClick={() => onPublishVersion(v.id)}
                        >
                          Phát hành ngay
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
