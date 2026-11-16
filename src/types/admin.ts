export type PromptTask =
  | "generate_workout_plan"
  | "explain_exercise"
  | "nutrition_advisor"
  | "safety_guardrails";

export interface PromptVersion {
  id: string;
  task: PromptTask;
  taskLabel: string;
  version: string;
  promptText: string;
  status: "published" | "draft" | "archived";
  createdBy: string;
  createdAt: string;
  publishedAt?: string;
  changeLog: string;
}

export interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  category: "AI Core" | "Computer Vision" | "Safety" | "Monetization" | "System";
  mandatory?: boolean;
  updatedBy: string;
  updatedAt: string;
}

export interface RequestLog {
  id: string;
  requestId: string;
  userId: string;
  userEmail: string;
  task: PromptTask;
  model: string;
  status: "success" | "error" | "rate_limited";
  statusCode: number;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  errorCode?: string;
  errorMessage?: string;
  timestamp: string;
}

export interface UserFeedback {
  id: string;
  requestId?: string;
  rating: number; // 1 to 5
  category: "Chất lượng giáo trình" | "Kỹ thuật bài tập" | "Dinh dưỡng" | "Phản hồi chung" | "Giao diện";
  comment: string;
  userEmail: string;
  userName?: string;
  userAvatar?: string;
  createdAt: string;
  sentiment: "positive" | "neutral" | "negative";
  status?: "resolved" | "pending";
  adminReply?: string;
}

export interface AdminAuditLog {
  id: string;
  adminName: string;
  action: string;
  resourceType: "PROMPT" | "EXERCISE" | "FEATURE_FLAG" | "RATE_LIMIT" | "USER" | "NUTRITION" | "FINANCE";
  resourceId: string;
  details: string;
  timestamp: string;
}

export interface RateLimitTier {
  tier: "Free" | "Pro" | "VIP";
  dailyRequests: number;
  maxTokensPerRequest: number;
  concurrencyLimit: number;
  activeUsers: number;
}

export interface AIMetrics {
  totalRequests: number;
  successRate: number;
  errorRate: number;
  avgLatencyMs: number;
  p95LatencyMs: number;
  totalTokens: number;
  estimatedCostUsd: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role:
    | "Thành viên"
    | "Hội viên PRO"
    | "Gói Starter"
    | "Gói Pro"
    | "Gói Elite"
    | "Gói Ultimate"
    | "Miễn phí"
    | "Huấn luyện viên"
    | "Quản trị viên"
    | string;
  status: "Hoạt động" | "Bị khóa" | "Chờ kích hoạt";
  createdAt: string;
  lastActive: string;
  workoutsCompleted: number;
  streakDays: number;
  currentWeight: number;
}

export interface AdminActivity {
  id: string;
  userName: string;
  userAvatar: string;
  action: string;
  timeAgo: string;
}

export interface RevenueTransaction {
  id: string;
  orderCode: string;
  userName: string;
  userEmail: string;
  planName: string;
  amount: number;
  paymentMethod: "MoMo" | "ZaloPay" | "VNPAY" | "Thẻ tín dụng";
  status: "Thành công" | "Đang xử lý" | "Hoàn tiền";
  createdAt: string;
}

export interface NutritionPreset {
  id: string;
  name: string;
  category: "Tăng cơ" | "Giảm mỡ" | "Eat Clean" | "Keto";
  targetCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  description: string;
  mealsCount: number;
}
