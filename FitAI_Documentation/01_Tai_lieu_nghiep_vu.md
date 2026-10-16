FitAI -- Tài liệu nghiệp vụ
Phiên bản: 1.0 | Trạng thái: Đặc tả đề xuất
1. Tổng quan
FitAI là website hỗ trợ người dùng lập kế hoạch tập luyện, ghi nhật ký
buổi tập, theo dõi tiến độ và nhận gợi ý từ AI Coach. Công nghệ dự kiến:
React + Vite + TypeScript, Supabase PostgreSQL/Auth/Storage/RLS và AI
provider được gọi qua backend hoặc Supabase Edge Functions. FitAI không
thay thế bác sĩ hoặc chuyên gia sức khỏe.
2. Mục tiêu nghiệp vụ
- Quản lý tài khoản, hồ sơ và mục tiêu tập luyện.
- Cung cấp thư viện bài tập có tìm kiếm và bộ lọc.
- Tạo kế hoạch tập theo ngày/tuần và ghi nhận kết quả.
- Theo dõi cân nặng, số đo, lịch sử tập và nhật ký dinh dưỡng cơ bản.
- Dùng AI Coach để đề xuất kế hoạch và giải thích bài tập.
- Cung cấp trang quản trị nội dung, cấu hình AI và theo dõi vận hành.
3. Vai trò
- Khách: xem trang giới thiệu và nội dung công khai; đăng ký/đăng
  nhập.
- Người dùng: quản lý dữ liệu của mình, kế hoạch, nhật ký, tiến độ
  và lịch sử AI.
- Quản trị viên: quản lý thư viện bài tập, nội dung, phiên bản
  prompt, cài đặt AI và log vận hành theo quyền được cấp.
- Dịch vụ hệ thống: xác thực yêu cầu, kiểm tra quyền/hạn mức và
  gọi AI an toàn.
4. Phạm vi
Trong phạm vi: Auth, hồ sơ, thư viện bài tập, kế hoạch, nhật ký tập,
tiến độ, nhật ký dinh dưỡng cơ bản, AI Coach, quản trị và RLS.
Ngoài phạm vi bản đầu: chẩn đoán/điều trị bệnh, cam kết kết quả thể
hình, điều khiển thiết bị tập, thanh toán hoặc tích hợp thiết bị đeo nếu
chưa được yêu cầu.
5. Yêu cầu chức năng
  Mã                      Phân hệ                 Yêu cầu
  FR-01                   Tài khoản               Đăng ký, đăng nhập,
                                                  đăng xuất, khôi phục
                                                  mật khẩu.
  FR-02                   Hồ sơ                   Lưu mục tiêu, kinh
                                                  nghiệm, lịch rảnh và
                                                  dụng cụ.
  FR-03                   Bài tập                 Tìm kiếm/lọc theo nhóm
                                                  cơ, dụng cụ, độ khó.
  FR-04                   Kế hoạch                Tạo thủ công hoặc nhận
                                                  gợi ý AI; chỉnh sửa
                                                  trước khi lưu.
  FR-05                   Nhật ký tập             Ghi hiệp, lần lặp, mức
                                                  tạ, thời lượng và trạng
                                                  thái.
  FR-06                   Tiến độ                 Lưu số đo và hiển thị
                                                  biểu đồ theo thời gian.
  FR-07                   Dinh dưỡng              Ghi bữa ăn và thông tin
                                                  dinh dưỡng cơ bản.
  FR-08                   AI Coach                Hỏi đáp, tạo gợi ý có
                                                  cấu trúc, xem lịch sử
                                                  và đánh giá.
  FR-09                   Quản trị                CRUD bài tập, quản lý
                                                  prompt/cấu hình/log AI.
  FR-10                   Bảo mật                 Xác thực ở server và
                                                  RLS cho dữ liệu riêng
                                              tư.
6. Quy tắc nghiệp vụ
1. Người dùng chỉ được truy cập dữ liệu thuộc tài khoản của mình.
2. Kế hoạch AI là bản đề xuất; người dùng xem lại và xác nhận trước khi
   lưu.
3. Khi thiếu dữ liệu, AI phải hỏi thêm hoặc nêu rõ giả định.
4. AI không chẩn đoán bệnh hoặc cam kết kết quả giảm cân/tăng cơ.
5. Nếu có dấu hiệu nguy hiểm như đau ngực, khó thở bất thường hoặc
   choáng, khuyên dừng tập và tìm trợ giúp y tế phù hợp.
6. Tính toán thống kê phải do logic ứng dụng đã kiểm thử thực hiện.
7. Chỉ gửi dữ liệu tối thiểu cần thiết đến AI provider.
8. Secret AI và Supabase service role key chỉ nằm phía máy chủ.
9. Quyền admin phải được kiểm tra ở server/database, không chỉ ẩn nút
   UI.
7. Yêu cầu phi chức năng
- Responsive trên máy tính và điện thoại.
- Có trạng thái loading, empty, success và error.
- Thông báo lỗi dễ hiểu, không lộ stack trace hoặc secret.
- Dùng HTTPS khi triển khai; bật và kiểm thử RLS.
- Có chính sách lưu giữ/xóa dữ liệu phù hợp.
- Có thể ghi nhận request ID, model/prompt version, latency và mã lỗi.
8. Tiêu chí nghiệm thu
- Auth hoạt động; hai tài khoản không thể xem dữ liệu của nhau.
- CRUD bài tập/kế hoạch hoạt động và dữ liệu vẫn còn sau refresh.
- Nhật ký tập và tiến độ được lưu/hiển thị đúng.
- AI trả đúng schema; lỗi mạng/hạn mức có thông báo rõ.
- Kế hoạch chỉ lưu sau xác nhận.
- User thường không gọi được API admin.
- Không có secret trong bundle frontend; RLS đã được kiểm thử.
9. Dữ liệu dự kiến
profiles, exercises, workout_plans, workout_days,
workout_logs, food_logs, progress_logs, ai_conversations,
ai_messages, ai_prompt_versions, ai_request_logs,
admin_audit_logs. Tên bảng/trường là đề xuất; cần chốt schema, khóa
ngoại, index và RLS khi triển khai.
10. Giả định
Cần Supabase project và nhà cung cấp AI nếu bật AI thật. Tài liệu này là
đặc tả ban đầu, không xác nhận hệ thống đã được triển khai hoặc kiểm
thử.