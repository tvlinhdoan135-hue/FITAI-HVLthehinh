FitAI -- Tài liệu kỹ thuật AI phía Admin
Phiên bản: 1.0 | Phạm vi: Quản trị AI và vận hành
1. Mục tiêu
Trang Admin AI quản lý tính năng AI, phiên bản prompt, hạn mức và tình
trạng vận hành. Không cung cấp quyền xem tự do toàn bộ hồ sơ thể chất
hoặc hội thoại riêng tư.
2. Phân hệ quản trị
  Phân hệ                 Chức năng               Quy tắc
  AI Overview             Request, tỷ lệ thành    Ưu tiên số liệu tổng
                          công, lỗi, độ trễ, mức  hợp.
                          sử dụng                 
  Prompt Management       Tạo nháp, so sánh, kiểm Lưu phiên bản và người
                          thử, phát hành          thay đổi.
  Feature Settings        Bật/tắt tác vụ, cấu     Validate và xác nhận
                          hình cho phép           thay đổi quan trọng.
  Usage & Limits          Theo dõi request, chỉnh Client không tự nâng
                          giới hạn                hạn mức.
  Error Logs              Request ID, mã lỗi,     Không lưu
                          model, latency          secret/token/PII không
                                                  cần thiết.
  Feedback Review         Tổng hợp phản hồi       Ẩn danh hoặc giảm thiểu
                                                  dữ liệu nhận dạng.
  Safety & Policy         Nội dung cảnh báo và bộ Không cho tắt biện pháp
                          test an toàn            bảo vệ bắt buộc.
  Audit Logs              Theo dõi thao tác admin Lưu ai thay đổi gì, khi
                                              nào.
3. Kiến trúc và quyền
- Admin UI gọi API quản trị hoặc Edge Functions.
- Mọi thao tác nhạy cảm phải xác minh danh tính và role ở server.
- Ẩn nút trên UI không phải cơ chế phân quyền.
- Bật RLS cho bảng prompt, cấu hình và log.
- Tách secrets giữa development, staging và production.
- Ghi audit log cho prompt, hạn mức, feature flag và xuất dữ liệu.
- Cấp quyền tối thiểu cần thiết cho từng vai trò.
4. Mô hình dữ liệu đề xuất
  Bảng                    Trường tham khảo        Ghi chú
  ai_prompt_versions    id, task,           Bản phát hành nên bất
                          version,              biến.
                          prompt_text,
                          status, created_by,
                          created_at,
                          published_at          
  ai_feature_settings   feature_key,          Chỉ server/admin cập
                          enabled,              nhật.
                          config_json,
                          updated_by,
                          updated_at            
  ai_request_logs       id, user_id,        Lưu tối thiểu, có thời
                          request_id, task,   hạn.
                          model, status,
                          latency_ms,
                          input_tokens,
                          output_tokens,
                          error_code,
                          created_at            
  ai_feedback           id, request_id,     Giới hạn dữ liệu tự do.
                          rating, category,
                          comment_redacted,
                          created_at            
  admin_audit_logs      id, admin_id,       Không ghi secret/token.
                          action,
                          resource_type,
                          resource_id,
                          before_summary,
                          after_summary,
                      created_at            
Đây là schema đề xuất, chưa phải SQL đã chạy. Cần xác định kiểu dữ liệu,
khóa ngoại, index, retention và RLS.
5. Luồng phát hành prompt
1. Admin tạo bản nháp, không ghi đè bản đã phát hành.
2. Chạy test với dữ liệu giả hoặc đã ẩn danh.
3. Kiểm tra schema, độ dài, lỗi và nội dung an toàn.
4. Admin có quyền xác nhận phát hành.
5. Server ghi audit log và đánh dấu phiên bản published.
6. Request mới dùng phiên bản phát hành; log lưu version đã dùng.
7. Khi lỗi, phát hành lại phiên bản trước để rollback; không xóa lịch
   sử.
6. API quản trị minh họa
  Endpoint                               Mục đích                Kiểm soát
  GET /admin/ai/metrics                Số liệu tổng hợp        JWT + admin
  GET /admin/ai/prompts                Danh sách prompt        JWT + admin
  POST /admin/ai/prompts               Tạo bản nháp            JWT + admin + validate
  POST /admin/ai/prompts/:id/publish   Phát hành               JWT + admin + audit
  GET /admin/ai/logs                   Tìm log                 JWT + admin + giới hạn
                                                                 trường
  PATCH /admin/ai/settings             Cập nhật cấu hình       JWT + admin +
                                                             validate + audit
Endpoint chỉ là ví dụ; có thể triển khai bằng Edge Functions hoặc
backend riêng.
7. Giám sát vận hành
- Theo dõi tỷ lệ thành công, p50/p95 latency, lỗi provider, 429 và chi
  phí.
- Thiết lập cảnh báo khi lỗi hoặc chi phí vượt ngưỡng.
- Rate limit theo user/IP ở lớp phù hợp.
- Timeout và retry có kiểm soát để tránh tăng chi phí.
- Lưu task, model/version, latency, mã lỗi và request ID.
- Chỉ lưu prompt/response khi có lý do rõ ràng và chính sách phù hợp.
- Khi có sự cố, tắt tạm tác vụ AI, hiển thị thông báo dự phòng và khôi
  phục sau kiểm thử.
8. Kiểm thử bảo mật
- User thường không gọi được endpoint admin dù tự sửa request.
- Không có secret provider trong bundle hoặc response API.
- Prompt nháp không được dùng trong production.
- Thay đổi quan trọng có audit log.
- Log không chứa token, mật khẩu hoặc API key.
- RLS từ chối truy cập trái phép.
- Kiểm thử prompt injection và yêu cầu tập luyện nguy hiểm.
9. Tiêu chí nghiệm thu
- Dashboard hiển thị request, lỗi, latency và mức sử dụng.
- Admin tạo nháp, kiểm thử, phát hành và rollback prompt.
- Endpoint kiểm tra quyền ở server.
- Feature flags/rate limits có hiệu lực phía backend.
- Audit log ghi thao tác quan trọng.
- RLS và chính sách lưu log được kiểm thử.