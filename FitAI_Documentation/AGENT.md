03_Tai_lieu_ky_thuat_AI_Frontend.md    Kiến trúc React, API, trạng thái,
                                           bảo mật và kiểm thử frontend.
  04_Tai_lieu_ky_thuat_AI_Admin.md       Quản trị prompt, cấu hình AI, log,
                                           audit và phân quyền.
  AGENT.md                               Vai trò và nguyên tắc của AI Agent
                                       đóng vai HLV thể hình cá nhân.
Công nghệ dự kiến
- React + Vite + TypeScript
- Supabase PostgreSQL, Auth, Storage và Row Level Security (RLS)
- Supabase Edge Functions hoặc backend riêng để gọi AI provider
Nguyên tắc bảo mật
- Không đặt AI secret hoặc Supabase service_role key trong frontend.
- Mọi endpoint nhạy cảm phải xác thực người dùng và kiểm tra quyền ở
  server.
- Bật RLS cho bảng có dữ liệu riêng tư.
- Chỉ gửi dữ liệu tối thiểu cần thiết tới AI provider.
- Validate output AI trước khi hiển thị/lưu.
- Chỉ lưu kế hoạch sau khi người dùng xem lại và xác nhận.
Thứ tự triển khai khuyến nghị
1. Chốt yêu cầu và phạm vi MVP.
2. Tạo Supabase project, bảng, quan hệ và RLS.
3. Tạo React app và cấu hình Supabase client.
4. Xây Auth, hồ sơ, thư viện bài tập, kế hoạch và nhật ký.
5. Xây API/Edge Function cho AI.
6. Xây AI Coach UI và luồng xác nhận lưu.
7. Xây Admin AI, audit log và hạn mức.
8. Kiểm thử phân quyền, lỗi, schema AI và responsive.
9. Triển khai staging, kiểm thử bảo mật rồi mới phát hành production.
Trạng thái: Bộ tài liệu thiết kế phiên bản 1.0. Schema/API là đề
xuất, cần điều chỉnh theo mã nguồn và kiểm thử thực tế.