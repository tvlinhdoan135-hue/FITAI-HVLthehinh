import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Download,
  CheckCircle2,
} from "lucide-react";

export default function AdminAnalyticsView() {
  const [downloadNotice, setDownloadNotice] = useState(false);

  const muscleBreakdown = [
    { muscle: "Ngực (Chest)", pct: 36, color: "#a855f7" },
    { muscle: "Chân (Legs & Glutes)", pct: 26, color: "#38bdf8" },
    { muscle: "Lưng & Xô (Back)", pct: 20, color: "#34d399" },
    { muscle: "Vai (Shoulders)", pct: 10, color: "#fbbf24" },
    { muscle: "Tay & Bụng (Arms & Abs)", pct: 8, color: "#f43f5e" },
  ];

  const peakHours = [
    { hour: "05:00", val: 15 },
    { hour: "06:00", val: 55 },
    { hour: "07:00", val: 78 },
    { hour: "08:00", val: 40 },
    { hour: "12:00", val: 30 },
    { hour: "16:00", val: 45 },
    { hour: "17:30", val: 95 }, // Peak
    { hour: "18:30", val: 100 }, // Peak
    { hour: "19:30", val: 88 },
    { hour: "21:00", val: 42 },
  ];

  const handleExportCSV = () => {
    setDownloadNotice(true);
    setTimeout(() => setDownloadNotice(false), 3000);
  };

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Thống kê Chuyên sâu & Hiệu suất Tập luyện</h2>
          <p className="admin-page-desc">
            Phân tích hành vi hội viên, tỷ lệ duy trì tập luyện (Retention), thời gian cao điểm và phân bổ nhóm cơ.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="admin-primary-btn" onClick={handleExportCSV}>
            <Download size={16} />
            <span>Xuất dữ liệu BI (CSV)</span>
          </button>
        </div>
      </div>

      {downloadNotice && (
        <div className="admin-notice-toast">
          <CheckCircle2 size={16} color="#34d399" />
          <span>Báo cáo phân tích đã được tổng hợp và sẵn sàng tải về.</span>
        </div>
      )}

      {/* Engagement KPIs */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <div className="admin-kpi-icon-wrap purple">
            <Users size={20} color="#c084fc" />
          </div>
          <div className="admin-kpi-val">8,420</div>
          <div className="admin-kpi-label">DAU (Người dùng hoạt động/ngày)</div>
          <div className="admin-kpi-trend">↑ +14.2% so với tuần trước</div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-icon-wrap blue">
            <TrendingUp size={20} color="#60a5fa" />
          </div>
          <div className="admin-kpi-val">84.6%</div>
          <div className="admin-kpi-label">Tỷ lệ hoàn thành buổi tập</div>
          <div className="admin-kpi-trend">↑ +3.5% kỷ lục mới</div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-icon-wrap green">
            <Clock size={20} color="#34d399" />
          </div>
          <div className="admin-kpi-val">52.4 phút</div>
          <div className="admin-kpi-label">Thời gian tập trung bình</div>
          <div className="admin-kpi-trend">↑ +4 phút / buổi</div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-icon-wrap amber">
            <BarChart3 size={20} color="#fbbf24" />
          </div>
          <div className="admin-kpi-val">76.2%</div>
          <div className="admin-kpi-label">Retention sau 30 ngày (D30)</div>
          <div className="admin-kpi-trend">↑ +8.1% top thị trường</div>
        </div>
      </div>

      {/* Two Column Visual Charts */}
      <div className="admin-ai-two-col-grid">
        {/* Peak Workout Hours Bar Chart */}
        <div className="admin-subcard">
          <div className="admin-card-inner-header">
            <Clock size={18} className="text-purple" />
            <h3 className="admin-subcard-title">Khung giờ tập cao điểm trong ngày</h3>
          </div>
          <p className="text-muted text-sm mb-4">
            Đỉnh điểm tập luyện ghi nhận từ 17:30 đến 20:00 tối mỗi ngày.
          </p>

          <div className="admin-peak-hours-bars">
            {peakHours.map((item) => (
              <div key={item.hour} className="hour-bar-col">
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      height: `${item.val}%`,
                      backgroundColor: item.val >= 88 ? "#a855f7" : "#3b82f6",
                    }}
                  />
                </div>
                <span className="hour-label">{item.hour}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Muscle Popularity Breakdown */}
        <div className="admin-subcard">
          <div className="admin-card-inner-header">
            <TrendingUp size={18} className="text-blue" />
            <h3 className="admin-subcard-title">Nhóm cơ được tập nhiều nhất</h3>
          </div>
          <p className="text-muted text-sm mb-4">
            Cơ ngực và chân chiếm hơn 60% tổng khối lượng hiệp tập (Volume).
          </p>

          <div className="muscle-bars-list">
            {muscleBreakdown.map((m) => (
              <div key={m.muscle} className="muscle-progress-row">
                <div className="muscle-row-info">
                  <span className="name">{m.muscle}</span>
                  <span className="pct" style={{ color: m.color }}>
                    {m.pct}%
                  </span>
                </div>
                <div className="muscle-row-track">
                  <div
                    className="muscle-row-fill"
                    style={{
                      width: `${m.pct}%`,
                      backgroundColor: m.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="device-pills-row">
            <div className="device-pill">
              <span className="device-name">📱 iOS:</span>
              <span className="device-val font-bold">58%</span>
            </div>
            <div className="device-pill">
              <span className="device-name">🤖 Android:</span>
              <span className="device-val font-bold">36%</span>
            </div>
            <div className="device-pill">
              <span className="device-name">💻 Web App:</span>
              <span className="device-val font-bold">6%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
