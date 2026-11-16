import {
  LayoutDashboard,
  Users,
  Bot,
  CalendarCheck,
  Apple,
  BarChart3,
  Coins,
  Settings,
  MessageSquare,
  ArrowRight,
  LogOut,
  X,
} from "lucide-react";

export type AdminTab =
  | "Tổng quan"
  | "Quản lý người dùng"
  | "Quản lý HLV AI"
  | "Chương trình tập"
  | "Dinh dưỡng"
  | "Thống kê"
  | "Doanh thu"
  | "Cài đặt hệ thống"
  | "Phản hồi";

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onBackToApp: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onUpgradeProClick?: () => void;
}

export default function AdminSidebar({
  currentTab,
  onSelectTab,
  onBackToApp,
  mobileOpen,
  onCloseMobile,
  onUpgradeProClick,
}: AdminSidebarProps) {
  const adminMenuItems: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "Tổng quan", label: "Tổng quan", icon: LayoutDashboard },
    { id: "Quản lý người dùng", label: "Quản lý người dùng", icon: Users },
    { id: "Quản lý HLV AI", label: "Quản lý HLV AI", icon: Bot },
    { id: "Chương trình tập", label: "Chương trình tập", icon: CalendarCheck },
    { id: "Dinh dưỡng", label: "Dinh dưỡng", icon: Apple },
    { id: "Thống kê", label: "Thống kê", icon: BarChart3 },
    { id: "Doanh thu", label: "Doanh thu", icon: Coins },
    { id: "Cài đặt hệ thống", label: "Cài đặt hệ thống", icon: Settings },
    { id: "Phản hồi", label: "Phản hồi", icon: MessageSquare },
  ];

  return (
    <>
      {mobileOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={onCloseMobile}
          aria-label="Đóng menu admin"
        />
      )}
      <aside className={`admin-custom-sidebar ${mobileOpen ? "open" : ""}`}>
        {/* Brand Header matching mockup */}
        <div className="admin-brand-header">
          <div className="admin-brand-logo-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6.5 6.5 11 11" />
              <path d="m21 21-1-1" />
              <path d="m3 3 1 1" />
              <path d="m18 22 4-4" />
              <path d="m2 6 4-4" />
              <path d="m3 10 7-7" />
              <path d="m14 21 7-7" />
            </svg>
          </div>
          <div className="admin-brand-text">
            <span className="brand-logo-main">FitAI</span>
          </div>
          <button
            className="admin-mobile-close-btn"
            onClick={onCloseMobile}
            aria-label="Đóng menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="admin-nav-list">
          {adminMenuItems.map(({ id, label, icon: Icon }) => {
            const isActive = currentTab === id;
            return (
              <button
                key={id}
                className={`admin-nav-item ${isActive ? "active" : ""}`}
                onClick={() => {
                  onSelectTab(id);
                  onCloseMobile();
                }}
              >
                <Icon size={18} className="nav-icon" />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* FitAI Pro Banner matching mockup */}
        <div className="admin-pro-card">
          <div className="admin-pro-bg-glow" />
          <div className="admin-pro-content">
            <strong className="admin-pro-title">FitAI Pro</strong>
            <p className="admin-pro-desc">
              Quản lý toàn diện,<br />phát triển mạnh mẽ
            </p>
            <button
              className="admin-pro-upgrade-btn"
              onClick={onUpgradeProClick}
            >
              <span>Nâng cấp gói</span>
              <ArrowRight size={13} />
            </button>
          </div>
          <div className="admin-pro-art-silhouette" />
        </div>

        {/* Admin User Footer matching mockup */}
        <div className="admin-user-footer">
          <div className="admin-user-profile-wrap">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
              alt="Admin"
              className="admin-avatar-photo"
            />
            <div className="admin-user-details">
              <strong className="admin-name">Admin</strong>
              <span className="admin-role-title">Quản trị viên</span>
            </div>
          </div>
          <button
            className="admin-switch-app-btn"
            onClick={onBackToApp}
            title="Quay lại giao diện Người dùng"
            aria-label="Quay lại giao diện Người dùng"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}
