FitAI -- Tài liệu giao diện AI thực thi
Phiên bản: 1.0 | Phân hệ: AI Coach UI
1. Mục đích
Mô tả màn hình và tương tác của AI Coach. Giao diện phải phân biệt nội
dung AI đề xuất với dữ liệu người dùng đã xác nhận.
2. Điểm truy cập
- Mục AI Coach trên thanh điều hướng.
- Nút Tạo kế hoạch bằng AI ở trang Kế hoạch tập.
- Nút Giải thích bài tập trong chi tiết bài tập.
- Khu vực gợi ý điều chỉnh trên Dashboard nếu người dùng bật tính
  năng.
3. Bố cục trang
  Khu vực                 Nội dung                Hành vi
  Header                  Tên FitAI Coach, trạng  Không báo online nếu
                          thái dịch vụ, hướng dẫn chưa xác minh.
                          an toàn                 
  Context panel           Mục tiêu, kinh nghiệm,  Chỉ gửi dữ liệu cần
                          lịch tập, dụng cụ       thiết.
  Conversation            Tin nhắn người dùng/AI, Hiển thị nội dung dài,
                          thời gian, nhãn         cuộn tới phản hồi mới.
                          AI-generated            
  Prompt suggestions      Câu hỏi gợi ý           Nhấn để điền/gửi câu
                                                  hỏi mẫu.
  Composer                Ô nhập, nút Gửi, bộ đếm Chặn nội dung rỗng và
                          ký tự                   gửi lặp.
  Result actions          Lưu, sao chép, thử lại, Chỉ hiện hành động phù
                          đánh giá                hợp.
  Safety notice           Giới hạn của AI         Luôn dễ tìm thấy.
4. Luồng tạo kế hoạch
1. Người dùng nhấn Tạo kế hoạch bằng AI.
2. Nhập mục tiêu, kinh nghiệm, số buổi/tuần, thời lượng, dụng cụ và
   giới hạn cần lưu ý.
3. Frontend kiểm tra dữ liệu và hiển thị thông tin sắp gửi.
4. Gọi API phía máy chủ; không gọi AI provider bằng secret key từ trình
   duyệt.
5. Hiển thị trạng thái đang xử lý, ngăn gửi lặp.
6. Nhận và kiểm tra kết quả có cấu trúc.
7. Hiển thị lịch theo ngày, bài tập, hiệp/lần lặp, thời gian nghỉ và
   lưu ý.
8. Người dùng chỉnh sửa rồi nhấn Lưu kế hoạch.
9. Chỉ lưu vào Supabase sau xác nhận.
10. Hiển thị thành công hoặc lỗi.
5. Trạng thái giao diện
  Trạng thái                          Hiển thị
  Idle                                Ô nhập và câu hỏi gợi ý.
  Validating                          Lỗi cụ thể ở trường cần sửa.
  Loading                             Spinner/skeleton; khóa nút gửi.
  Success                             Kết quả có cấu trúc và nhãn nội
                                      dung AI.
  Needs clarification                 Yêu cầu bổ sung dữ liệu hoặc nêu
                                      giả định.
  Rate limited                        Thông báo đạt giới hạn và thời điểm
                                      thử lại nếu có.
  Network error                       Mất kết nối và nút thử lại.
  Service error                       Dịch vụ tạm thời không khả dụng.
  Safety response                     Khuyên dừng tập/tìm trợ giúp phù
                                      hợp nếu có dấu hiệu nguy hiểm.
  Save success/error                  Xác nhận đã lưu hoặc lý do thất
                                  bại.
6. Cấu trúc kết quả kế hoạch
Mỗi buổi tập hiển thị tên buổi, mục tiêu nhóm cơ, bài tập, hiệp/lần lặp
hoặc thời lượng, thời gian nghỉ, dụng cụ và lưu ý kỹ thuật. Cho phép sửa
trước khi lưu. Không tự thay thế kế hoạch hiện tại khi chưa được xác
nhận.
7. Khả năng tiếp cận và an toàn
- Dùng tiếng Việt dễ hiểu; giải thích thuật ngữ khi cần.
- Nút quan trọng có nhãn, hỗ trợ bàn phím và focus state.
- Giữ nội dung người dùng đã nhập khi lỗi.
- Không thể hiện AI như chuyên gia y tế hoặc cam kết kết quả.
- Không render HTML/Markdown không tin cậy nếu chưa sanitize.
8. Component gợi ý
AIChatPanel, ChatMessage, ChatComposer, PromptSuggestion,
WorkoutPlanPreview, WorkoutPlanDay, ExercisePlanItem,
SafetyNotice, AIRequestStatus, FeedbackControls.
9. Tiêu chí nghiệm thu
- Người dùng hiểu trạng thái request.
- Không gửi lặp khi đang xử lý.
- Lỗi mạng, xác thực, giới hạn có thông báo riêng.
- Kết quả có thể chỉnh sửa trước khi lưu.
- Responsive trên điện thoại/máy tính.