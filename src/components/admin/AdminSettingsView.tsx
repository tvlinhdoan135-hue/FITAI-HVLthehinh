import { useState } from "react";
import {
  Zap,
  Server,
  Database,
  RotateCcw,
  CheckCircle2,
  Lock,
} from "lucide-react";
import type { FeatureFlag, RateLimitTier, AdminAuditLog } from "../../types/admin";

interface AdminSettingsViewProps {
  featureFlags: FeatureFlag[];
  rateLimits: RateLimitTier[];
  auditLogs: AdminAuditLog[];
  onToggleFeature: (key: string) => void;
  onUpdateRateLimit: (tier: RateLimitTier) => void;
}

export default function AdminSettingsView({
  featureFlags,
  rateLimits,
  auditLogs,
  onToggleFeature,
  onUpdateRateLimit,
}: AdminSettingsViewProps) {
  const [activeTab, setActiveTab] = useState<"features" | "ratelimits" | "infra" | "audit">("features");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Cài đặt Hệ thống & Hạ tầng Kỹ thuật</h2>
          <p className="admin-page-desc">
            Bật/tắt tính năng (Feature Flags), cấu hình hạn mức Rate Limits, kiểm tra kết nối API và giám sát nhật ký Audit.
          </p>
        </div>
      </div>

      {toastMessage && (
        <div className="admin-notice-toast">
          <CheckCircle2 size={16} color="#34d399" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Nav Tabs */}
      <div className="admin-task-tabs mb-4">
        <button
          className={`admin-task-tab-btn ${activeTab === "features" ? "active" : ""}`}
          onClick={() => setActiveTab("features")}
        >
          Tính năng hệ thống (Feature Flags)
        </button>
        <button
          className={`admin-task-tab-btn ${activeTab === "ratelimits" ? "active" : ""}`}
          onClick={() => setActiveTab("ratelimits")}
        >
          Hạn mức AI (Rate Limits)
        </button>
        <button
          className={`admin-task-tab-btn ${activeTab === "infra" ? "active" : ""}`}
          onClick={() => setActiveTab("infra")}
        >
          Tình trạng hạ tầng & Server
        </button>
        <button
          className={`admin-task-tab-btn ${activeTab === "audit" ? "active" : ""}`}
          onClick={() => setActiveTab("audit")}
        >
          Nhật ký Audit Log
        </button>
      </div>

      {/* Tab 1: Feature Flags */}
      {activeTab === "features" && (
        <div className="admin-feature-flags-grid">
          {featureFlags.map((flag) => (
            <div key={flag.key} className="admin-flag-card">
              <div className="flag-top">
                <span className="flag-category">{flag.category}</span>
                {flag.mandatory ? (
                  <span className="flag-mandatory-pill">
                    <Lock size={12} /> Bắt buộc (FR-06)
                  </span>
                ) : (
                  <label className="admin-switch">
                    <input
                      type="checkbox"
                      checked={flag.enabled}
                      onChange={() => onToggleFeature(flag.key)}
                    />
                    <span className="admin-slider round" />
                  </label>
                )}
              </div>
              <h4 className="flag-name">{flag.name}</h4>
              <p className="flag-desc">{flag.description}</p>
              <div className="flag-meta">
                <span>Cập nhật bởi: {flag.updatedBy}</span>
                <span>{flag.updatedAt}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Rate Limits */}
      {activeTab === "ratelimits" && (
        <div className="admin-ratelimits-grid">
          {rateLimits.map((tier) => (
            <div key={tier.tier} className="admin-tier-limit-card">
              <div className="tier-badge-row">
                <span className={`admin-badge role ${tier.tier.toLowerCase()}`}>
                  Gói {tier.tier}
                </span>
                <span className="tier-users-label">{tier.activeUsers} người dùng</span>
              </div>

              <div className="tier-limit-fields">
                <div className="limit-field">
                  <label>Số yêu cầu AI / ngày:</label>
                  <input
                    type="number"
                    value={tier.dailyRequests}
                    onChange={(e) =>
                      onUpdateRateLimit({
                        ...tier,
                        dailyRequests: parseInt(e.target.value) || 10,
                      })
                    }
                  />
                </div>

                <div className="limit-field">
                  <label>Tokens tối đa / yêu cầu:</label>
                  <input
                    type="number"
                    value={tier.maxTokensPerRequest}
                    onChange={(e) =>
                      onUpdateRateLimit({
                        ...tier,
                        maxTokensPerRequest: parseInt(e.target.value) || 1000,
                      })
                    }
                  />
                </div>

                <div className="limit-field">
                  <label>Số kết nối đồng thời (Concurrency):</label>
                  <input
                    type="number"
                    value={tier.concurrencyLimit}
                    onChange={(e) =>
                      onUpdateRateLimit({
                        ...tier,
                        concurrencyLimit: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
              </div>

              <button
                className="admin-primary-btn mt-4 w-full"
                onClick={() => showToast(`Đã lưu cấu hình hạn mức cho gói ${tier.tier}`)}
              >
                Cập nhật hạn mức
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Infrastructure */}
      {activeTab === "infra" && (
        <div className="admin-subcard">
          <div className="admin-card-inner-header">
            <Server size={18} className="text-purple" />
            <h3 className="admin-subcard-title">Trạng thái Hạ tầng Máy chủ & API Gateway</h3>
          </div>

          <div className="admin-infra-status-grid">
            <div className="infra-node-card">
              <div className="node-icon-row">
                <Zap size={20} color="#eab308" />
                <span className="node-status-online">Sẵn sàng (Healthy)</span>
              </div>
              <h4 className="node-title">Google Gemini 2.5 Flash API</h4>
              <p className="node-desc">Độ trễ trung bình: 142ms · Tỷ lệ thành công: 99.8%</p>
            </div>

            <div className="infra-node-card">
              <div className="node-icon-row">
                <Database size={20} color="#3b82f6" />
                <span className="node-status-online">99.98% Uptime</span>
              </div>
              <h4 className="node-title">PostgreSQL Primary DB</h4>
              <p className="node-desc">Connections: 24/100 · Storage: 14.8 GB / 100 GB</p>
            </div>

            <div className="infra-node-card">
              <div className="node-icon-row">
                <RotateCcw size={20} color="#34d399" />
                <span className="node-status-online">Hit rate 94.2%</span>
              </div>
              <h4 className="node-title">Redis In-Memory Cache</h4>
              <p className="node-desc">Keys: 42,500 · RAM: 320 MB / 2 GB</p>
            </div>
          </div>

          <div className="admin-danger-actions-box mt-6">
            <h4 className="danger-box-title">Thao tác nhanh cho Quản trị viên</h4>
            <div className="danger-btns-row">
              <button
                className="admin-btn-secondary"
                onClick={() => showToast("Đã dọn dẹp sạch toàn bộ cache tạm thời trên Redis!")}
              >
                Xóa sạch bộ nhớ đệm (Flush Cache)
              </button>
              <button
                className="admin-primary-btn"
                onClick={() => showToast("Đã khởi tạo bản sao lưu Database Snapshot thành công!")}
              >
                Sao lưu cơ sở dữ liệu (Backup Now)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Log */}
      {activeTab === "audit" && (
        <div className="admin-table-card">
          <div className="admin-table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Thời gian</th>
                  <th>Quản trị viên</th>
                  <th>Hành động</th>
                  <th>Đối tượng</th>
                  <th>Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="text-muted text-sm">{log.timestamp}</td>
                    <td>
                      <span className="font-semibold text-white">{log.adminName}</span>
                    </td>
                    <td>
                      <span className="admin-badge role pro">{log.action}</span>
                    </td>
                    <td>
                      <span className="admin-muscle-pill">{log.resourceType}</span>
                    </td>
                    <td className="text-white text-sm">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
