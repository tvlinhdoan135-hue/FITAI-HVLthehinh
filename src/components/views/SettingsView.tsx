import { useState } from "react";
import {
  Bell,
  Sliders,
  Download,
  RotateCcw,
  Shield,
  Check,
} from "lucide-react";

interface SettingsViewProps {
  onOpenAdmin: () => void;
  onResetData: () => void;
}

export default function SettingsView({
  onOpenAdmin,
  onResetData,
}: SettingsViewProps) {
  const [restDuration, setRestDuration] = useState("60");
  const [unitSystem, setUnitSystem] = useState("metric");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [remindWorkout, setRemindWorkout] = useState(true);
  const [remindWater, setRemindWater] = useState(true);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSavePreferences = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  const handleExportData = () => {
    const backupData = {
      app: "FitAI - Your Personal Coach",
      exportedAt: new Date().toISOString(),
      user: "Nguyễn Văn A",
      stats: { currentWeight: 56.2, targetWeight: 62.0, xp: 1250, streak: 12 },
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fitai-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="settings-page-container">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <span className="page-eyebrow-tag">TÙY BIẾN HỆ THỐNG</span>
          <h1 className="page-main-title">Cài đặt ứng dụng</h1>
          <p className="page-sub-desc">
            Điều chỉnh trải nghiệm tập luyện, thông báo và quản lý dữ liệu cá nhân của bạn.
          </p>
        </div>
        {savedFeedback && (
          <div className="settings-saved-pill">
            <Check size={16} /> Đã lưu cài đặt!
          </div>
        )}
      </div>

      <div className="settings-sections-list">
        {/* 1. Workout Session Preferences */}
        <div className="settings-card">
          <div className="settings-card-head">
            <Sliders size={20} className="text-purple" />
            <div>
              <h3>Tùy chọn buổi tập</h3>
              <p>Cấu hình thời gian nghỉ ngơi và đơn vị đo lường</p>
            </div>
          </div>

          <div className="settings-card-body">
            <div className="setting-control-row">
              <div className="setting-meta">
                <strong>Thời gian nghỉ mặc định giữa các hiệp</strong>
                <span>Bộ đếm giờ tự động kích hoạt sau mỗi hiệp hoàn thành</span>
              </div>
              <select
                className="setting-select"
                value={restDuration}
                onChange={(e) => {
                  setRestDuration(e.target.value);
                  handleSavePreferences();
                }}
              >
                <option value="45">45 giây (Tập cường độ cao)</option>
                <option value="60">60 giây (Tiêu chuẩn Hypertrophy)</option>
                <option value="90">90 giây (Tập nặng đa khớp)</option>
                <option value="120">120 giây (Sức mạnh Powerlifting)</option>
              </select>
            </div>

            <div className="setting-control-row">
              <div className="setting-meta">
                <strong>Hệ thống đơn vị tính</strong>
                <span>Áp dụng cho cân nặng tạ và chỉ số cơ thể</span>
              </div>
              <div className="setting-toggle-group">
                <button
                  className={`unit-toggle-btn ${unitSystem === "metric" ? "active" : ""}`}
                  onClick={() => {
                    setUnitSystem("metric");
                    handleSavePreferences();
                  }}
                >
                  Metric (kg, cm)
                </button>
                <button
                  className={`unit-toggle-btn ${unitSystem === "imperial" ? "active" : ""}`}
                  onClick={() => {
                    setUnitSystem("imperial");
                    handleSavePreferences();
                  }}
                >
                  Imperial (lbs, ft)
                </button>
              </div>
            </div>

            <div className="setting-control-row">
              <div className="setting-meta">
                <strong>Âm thanh thông báo khi hết giờ nghỉ</strong>
                <span>Phát tiếng bíp nhẹ khi kết thúc thời gian phục hồi</span>
              </div>
              <label className="switch-toggle">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => {
                    setSoundEnabled(e.target.checked);
                    handleSavePreferences();
                  }}
                />
                <span className="slider-round" />
              </label>
            </div>
          </div>
        </div>

        {/* 2. Notification Preferences */}
        <div className="settings-card">
          <div className="settings-card-head">
            <Bell size={20} className="text-purple" />
            <div>
              <h3>Thông báo & Nhắc nhở</h3>
              <p>Giữ vững thói quen và không bỏ lỡ buổi tập</p>
            </div>
          </div>

          <div className="settings-card-body">
            <div className="setting-control-row">
              <div className="setting-meta">
                <strong>Nhắc nhở lịch tập mỗi ngày</strong>
                <span>Nhận thông báo nhắc trước giờ tập 30 phút</span>
              </div>
              <label className="switch-toggle">
                <input
                  type="checkbox"
                  checked={remindWorkout}
                  onChange={(e) => {
                    setRemindWorkout(e.target.checked);
                    handleSavePreferences();
                  }}
                />
                <span className="slider-round" />
              </label>
            </div>

            <div className="setting-control-row">
              <div className="setting-meta">
                <strong>Nhắc nhở uống nước đều đặn</strong>
                <span>Nhắc nạp 250ml nước mỗi 2 tiếng</span>
              </div>
              <label className="switch-toggle">
                <input
                  type="checkbox"
                  checked={remindWater}
                  onChange={(e) => {
                    setRemindWater(e.target.checked);
                    handleSavePreferences();
                  }}
                />
                <span className="slider-round" />
              </label>
            </div>
          </div>
        </div>

        {/* 3. Data & Privacy */}
        <div className="settings-card">
          <div className="settings-card-head">
            <Shield size={20} className="text-purple" />
            <div>
              <h3>Dữ liệu & Quyền riêng tư</h3>
              <p>Sao lưu dữ liệu lịch sử hoặc đặt lại hệ thống</p>
            </div>
          </div>

          <div className="settings-card-body">
            <div className="setting-control-row">
              <div className="setting-meta">
                <strong>Xuất dữ liệu sao lưu (JSON)</strong>
                <span>Tải về file chứa toàn bộ lịch sử tập và bữa ăn</span>
              </div>
              <button className="export-data-btn" onClick={handleExportData}>
                <Download size={15} /> Tải file JSON
              </button>
            </div>

            <div className="setting-control-row">
              <div className="setting-meta">
                <strong>Khôi phục dữ liệu ban đầu</strong>
                <span>Đặt lại các chỉ số mẫu cho bản demo</span>
              </div>
              <button
                className="reset-data-btn"
                onClick={() => {
                  if (confirm("Bạn có chắc chắn muốn đặt lại dữ liệu demo về mặc định?")) {
                    onResetData();
                  }
                }}
              >
                <RotateCcw size={15} /> Đặt lại dữ liệu
              </button>
            </div>

            <div className="setting-control-row">
              <div className="setting-meta">
                <strong>Khu vực quản trị hệ thống (Admin)</strong>
                <span>Dành riêng cho quản trị viên và HLV FitAI</span>
              </div>
              <button className="open-admin-btn" onClick={onOpenAdmin}>
                <Shield size={15} /> Mở Trang Quản Trị
              </button>
            </div>
          </div>
        </div>

        {/* About App */}
        <div className="app-info-footer">
          <p>
            FitAI – Your Personal Coach v2.4.0 (AI Agent Engine)
          </p>
          <small>© 2026 FitAI Corporation. Bảo lưu mọi quyền.</small>
        </div>
      </div>
    </div>
  );
}
