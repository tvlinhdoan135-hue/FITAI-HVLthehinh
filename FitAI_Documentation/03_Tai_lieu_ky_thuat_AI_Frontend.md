FitAI -- Tài liệu kỹ thuật AI phía Frontend
Phiên bản: 1.0 | Stack: React, Vite, TypeScript, Supabase JS
1. Kiến trúc
Luồng đề xuất:
Browser (React) → Supabase Auth session → Edge Function/API server → AI provider → validate response → Browser.
Frontend quản lý form, trạng thái, gọi API ứng dụng và hiển thị kết quả.
Không gọi AI provider bằng secret key từ trình duyệt.
2. Cấu trúc thư mục
src/
  features/ai-coach/
    components/
      AIChatPanel.tsx
      ChatMessage.tsx
      ChatComposer.tsx
      WorkoutPlanPreview.tsx
      SafetyNotice.tsx
    hooks/useAIChat.ts
    services/aiClient.ts
    schemas/aiSchemas.ts
    types.ts
  lib/supabaseClient.ts
  pages/AICoachPage.tsx
supabase/functions/fitai-coach/index.ts
3. Trách nhiệm
  Lớp                     Trách nhiệm               Không làm
  Components              Render                    Không chứa secret hoặc
                          chat/form/loading/error   quyết định quyền bảo
                                                    mật.
  useAIChat             Quản lý messages, request Không tin response chưa
                          state, submit/retry       validate.
  aiClient              Gọi API và chuẩn hóa lỗi  Không gọi provider bằng
                                                    secret.
  Schema/types            Kiểu dữ liệu và kiểm tra  Không coi TypeScript
                          runtime                   type là runtime
                                                    validation.
  Supabase client         Session và truy cập bảng  Không dùng service role
                          theo RLS                  key ở browser.
  Edge Function/API       Xác thực, validate, rate  Không tin user ID/role
                      limit, gọi AI             do client tự khai.
4. Hợp đồng API minh họa
POST /functions/v1/fitai-coach
Request:
{
  "task": "generate_workout_plan",
  "input": {
    "goal": "general_fitness",
    "experience": "beginner",
    "sessionsPerWeek": 3,
    "sessionMinutes": 45,
    "equipment": ["bodyweight", "dumbbells"]
  }
}
Response thành công:
{
  "success": true,
  "requestId": "server-generated-id",
  "data": {
    "title": "Kế hoạch tập mẫu",
    "days": [],
    "assumptions": [],
    "safetyNotes": []
  }
}
Response lỗi:
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Bạn đã đạt giới hạn yêu cầu. Vui lòng thử lại sau."
  }
}
Đây là hợp đồng mẫu; cần thống nhất schema thật giữa frontend và
backend. Mã lỗi đề xuất: INVALID_INPUT, UNAUTHORIZED, FORBIDDEN,
RATE_LIMITED, AI_PROVIDER_ERROR.
5. TypeScript mẫu
export type AIRequestTask =
  | "generate_workout_plan"
  | "explain_exercise"
  | "adjust_plan";

export type AIRequest = {
  task: AIRequestTask;
  input: Record<string, unknown>;
};

export type AIError = {
  code: string;
  message: string;
};

export type AIResponse<T> =
  | { success: true; requestId: string; data: T }
  | { success: false; requestId?: string; error: AIError };

export type RequestState = "idle" | "loading" | "success" | "error";
Dữ liệu mạng phải được kiểm tra runtime bằng schema validator trước khi
sử dụng.
6. Quy trình request
1. Validate input ở client để phản hồi nhanh; backend vẫn phải validate
   lại.
2. Lấy session Supabase Auth.
3. Gọi Edge Function/API với thông tin xác thực.
4. Đặt trạng thái loading và ngăn submit lặp.
5. Kiểm tra HTTP status, content type, JSON và schema.
6. Chuẩn hóa lỗi 401, 403, 429, timeout, mạng và 5xx.
7. Chỉ lưu kế hoạch sau xác nhận người dùng.
8. Ghi dữ liệu qua Supabase với RLS.
9. Không log token hoặc nội dung nhạy cảm vào console.
7. Trạng thái và lịch sử
- Tách trạng thái request khỏi trạng thái hội thoại.
- Dùng requestId để truy vết lỗi.
- Tránh response cũ ghi đè response mới; cân nhắc AbortController.
- Phân biệt tin nhắn tạm thời với lịch sử đã lưu.
- Chỉ tải lịch sử của user hiện tại; phân trang lịch sử dài.
8. Bảo mật
- Biến VITE_* được đưa vào bundle: không chứa AI secret hoặc
  Supabase service_role key.
- Chỉ dùng publishable/anon key trên browser cùng RLS đúng.
- Xác minh quyền ở backend; không tin role từ client.
- Giới hạn kích thước request và ký tự.
- Chỉ gửi dữ liệu tối thiểu cho AI provider.
- Sanitize Markdown/HTML không tin cậy.
- CORS không thay thế xác thực.
- Có chính sách quyền riêng tư và xóa lịch sử nếu lưu hội thoại.
9. Kiểm thử
  Nhóm                                Ca kiểm thử
  Form                                Rỗng, thiếu trường, quá giới hạn,
                                      ký tự đặc biệt.
  API                                 200 hợp lệ, JSON sai schema, 401,
                                      403, 429, 500, timeout.
  UX                                  Loading, submit liên tiếp, retry,
                                      giữ input, responsive.
  Security                            Không lộ secret, không xem dữ liệu
                                      người khác, không render script.
  Persistence                         Chỉ lưu sau xác nhận; refresh tải
                                  đúng dữ liệu.
10. Checklist phát hành
- [ ] Không có secret trong frontend bundle.
- [ ] API xác thực người dùng và kiểm tra input.
- [ ] Response được validate runtime.
- [ ] Có xử lý lỗi và timeout.
- [ ] RLS được kiểm thử bằng nhiều tài khoản.
- [ ] Người dùng xác nhận trước khi lưu kế hoạch.