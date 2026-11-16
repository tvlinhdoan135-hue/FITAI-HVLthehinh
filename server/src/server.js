import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());

app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:5174",
      "http://localhost:5173",
      "http://localhost:5175",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

// In-memory data store for Admin module (FR-09 & FR-10)
let adminMetrics = {
  totalRequests: 14820,
  successRate: 98.4,
  errorRate: 1.6,
  avgLatencyMs: 485,
  p95LatencyMs: 890,
  totalTokens: 18450000,
  estimatedCostUsd: 14.76,
};

let promptVersions = [
  {
    id: "pv-1",
    task: "generate_workout_plan",
    taskLabel: "Lập giáo trình tập luyện",
    version: "v2.4",
    status: "published",
    createdBy: "admin@fitai.vn",
    createdAt: "2026-11-01",
    publishedAt: "2026-11-02",
    changeLog: "Tối ưu hóa Progressive Overload và gộp bài tập theo nhóm cơ đối kháng.",
  },
  {
    id: "pv-2",
    task: "generate_workout_plan",
    taskLabel: "Lập giáo trình tập luyện",
    version: "v2.5-draft",
    status: "draft",
    createdBy: "tuananh@fitai.vn",
    createdAt: "2026-11-10",
    changeLog: "Bổ sung cơ chế tự động hạ tạ Deload vào tuần thứ 5.",
  },
  {
    id: "pv-4",
    task: "explain_exercise",
    taskLabel: "Giải thích kỹ thuật bài tập",
    version: "v1.8",
    status: "published",
    createdBy: "tuananh@fitai.vn",
    createdAt: "2026-11-05",
    publishedAt: "2026-11-06",
    changeLog: "Bổ sung hướng dẫn khóa xương bả vai (Retract Scapula).",
  },
  {
    id: "pv-6",
    task: "safety_guardrails",
    taskLabel: "Bộ lọc an toàn & Cảnh báo y tế",
    version: "v1.0",
    status: "published",
    createdBy: "system_security",
    createdAt: "2026-10-01",
    publishedAt: "2026-10-01",
    changeLog: "Bảo vệ bắt buộc theo tiêu chuẩn an toàn y tế thể thao.",
  },
];

let featureFlags = [
  { key: "ai_workout_generator", name: "Tạo kế hoạch tập bằng AI", enabled: true, category: "AI Core" },
  { key: "ai_exercise_explainer", name: "Hướng dẫn kỹ thuật động tác", enabled: true, category: "AI Core" },
  { key: "ai_meal_planner", name: "Tư vấn dinh dưỡng & Macros", enabled: true, category: "AI Core" },
  { key: "food_camera_scanner", name: "Quét ảnh món ăn AI Vision", enabled: true, category: "Computer Vision" },
  { key: "safety_guardrails_mandatory", name: "Bộ lọc an toàn bắt buộc", enabled: true, mandatory: true, category: "Safety" },
];

let auditLogs = [
  {
    id: "audit-1",
    adminName: "admin@fitai.vn",
    action: "PUBLISH_PROMPT",
    resourceType: "PROMPT",
    resourceId: "pv-1",
    details: "Phát hành phiên bản chính thức v2.4 cho tác vụ 'generate_workout_plan'.",
    timestamp: "2026-11-10 14:20:10",
  },
];

// 0. Trang chào mừng Root
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Chào mừng bạn đến với FitAI API Backend Server!",
    frontendUrl: "http://localhost:5173",
    note: "Giao diện người dùng Web của FitAI đang chạy tại cổng Frontend: http://localhost:5173",
    availableEndpoints: [
      "/api/status",
      "/api/admin/ai/metrics",
      "/api/admin/ai/prompts",
      "/api/admin/ai/settings",
      "/api/admin/ai/audit",
    ],
  });
});

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "FitAI API Root. Vui lòng truy cập /api/status để kiểm tra trạng thái.",
  });
});

// 1. Kiểm tra trạng thái Backend
app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    message: "FitAI Backend & Admin API đang hoạt động!",
    data: {
      application: "FitAI",
      version: "2.4.0",
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
    },
  });
});

// 2. Admin AI Metrics (GET /api/admin/ai/metrics)
app.get("/api/admin/ai/metrics", (req, res) => {
  res.json({
    success: true,
    data: adminMetrics,
  });
});

// 3. Admin Prompts List (GET /api/admin/ai/prompts)
app.get("/api/admin/ai/prompts", (req, res) => {
  res.json({
    success: true,
    data: promptVersions,
  });
});

// 4. Admin Create Draft Prompt (POST /api/admin/ai/prompts)
app.post("/api/admin/ai/prompts", (req, res) => {
  const { task, promptText, changeLog } = req.body;
  if (!promptText) {
    return res.status(400).json({ success: false, message: "Thiếu nội dung prompt." });
  }

  const newDraft = {
    id: `pv-${Date.now()}`,
    task: task || "generate_workout_plan",
    taskLabel: "Bản nháp mới",
    version: `v${(promptVersions.length + 1).toFixed(1)}-draft`,
    status: "draft",
    promptText,
    changeLog: changeLog || "Bản nháp tạo bởi Admin",
    createdBy: "admin@fitai.vn",
    createdAt: new Date().toISOString().slice(0, 10),
  };

  promptVersions.unshift(newDraft);
  auditLogs.unshift({
    id: `audit-${Date.now()}`,
    adminName: "admin@fitai.vn",
    action: "CREATE_PROMPT_DRAFT",
    resourceType: "PROMPT",
    resourceId: newDraft.id,
    details: `Tạo bản nháp ${newDraft.version} cho tác vụ ${newDraft.task}`,
    timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
  });

  res.status(201).json({ success: true, data: newDraft });
});

// 5. Admin Publish Prompt (POST /api/admin/ai/prompts/:id/publish)
app.post("/api/admin/ai/prompts/:id/publish", (req, res) => {
  const { id } = req.params;
  const target = promptVersions.find((pv) => pv.id === id);
  if (!target) {
    return res.status(404).json({ success: false, message: "Không tìm thấy phiên bản prompt." });
  }

  promptVersions = promptVersions.map((pv) => {
    if (pv.task === target.task) {
      if (pv.id === id) {
        return { ...pv, status: "published", publishedAt: new Date().toISOString().slice(0, 10) };
      } else if (pv.status === "published") {
        return { ...pv, status: "archived" };
      }
    }
    return pv;
  });

  auditLogs.unshift({
    id: `audit-${Date.now()}`,
    adminName: "admin@fitai.vn",
    action: "PUBLISH_PROMPT",
    resourceType: "PROMPT",
    resourceId: id,
    details: `Phát hành chính thức phiên bản ${target.version} cho tác vụ ${target.task}`,
    timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
  });

  res.json({ success: true, message: "Đã phát hành phiên bản prompt thành công!" });
});

// 6. Admin Feature Settings (GET & PATCH /api/admin/ai/settings)
app.get("/api/admin/ai/settings", (req, res) => {
  res.json({ success: true, data: featureFlags });
});

app.patch("/api/admin/ai/settings", (req, res) => {
  const { key, enabled } = req.body;
  const flag = featureFlags.find((f) => f.key === key);
  if (!flag) {
    return res.status(404).json({ success: false, message: "Không tìm thấy feature flag." });
  }

  if (flag.mandatory && !enabled) {
    return res.status(400).json({ success: false, message: "Không thể vô hiệu hóa biện pháp an toàn bắt buộc (FR-06)." });
  }

  flag.enabled = enabled;
  auditLogs.unshift({
    id: `audit-${Date.now()}`,
    adminName: "admin@fitai.vn",
    action: "TOGGLE_FEATURE_FLAG",
    resourceType: "FEATURE_FLAG",
    resourceId: key,
    details: `${enabled ? "Bật" : "Tắt"} tính năng ${flag.name}`,
    timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
  });

  res.json({ success: true, data: flag });
});

// 7. Admin Audit Logs (GET /api/admin/ai/audit)
app.get("/api/admin/ai/audit", (req, res) => {
  res.json({ success: true, data: auditLogs });
});

// API không tồn tại
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Không tìm thấy API.",
  });
});

// Khởi chạy máy chủ
app.listen(PORT, () => {
  console.log(`FitAI Backend: http://localhost:${PORT}`);
  console.log(`API Status: http://localhost:${PORT}/api/status`);
  console.log(`Admin AI API: http://localhost:${PORT}/api/admin/ai/metrics`);
});
