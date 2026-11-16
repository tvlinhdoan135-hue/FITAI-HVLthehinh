import {
  Home,
  Bot,
  Dumbbell,
  Calendar,
  Apple,
  Scale,
  BarChart3,
  Crown,
  Settings,
  LogOut,
  ArrowRight,
  X,
} from "lucide-react";
import type { TabType, UserStats } from "../types/fitness";

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  userStats: UserStats;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenProModal: () => void;
  onOpenAuthModal: () => void;
}

export default function Sidebar({
  currentTab,
  onSelectTab,
  userStats,
  mobileOpen,
  onCloseMobile,
  onOpenProModal,
  onOpenAuthModal,
}: SidebarProps) {
  const menuItems: { id: TabType; label: string; icon: typeof Home }[] = [
    { id: "Trang chủ", label: "Trang chủ", icon: Home },
    { id: "Huấn luyện AI", label: "Huấn luyện AI", icon: Bot },
    { id: "Bài tập", label: "Bài tập", icon: Dumbbell },
    { id: "Lịch tập", label: "Lịch tập", icon: Calendar },
    { id: "Dinh dưỡng", label: "Dinh dưỡng", icon: Apple },
    { id: "Thể trạng", label: "Thể trạng", icon: Scale },
    { id: "Tiến độ", label: "Tiến độ", icon: BarChart3 },
    { id: "Gói hội viên", label: "Gói hội viên", icon: Crown },
    { id: "Cài đặt", label: "Cài đặt", icon: Settings },
  ];

  return (
    <>
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onCloseMobile}
          aria-label="Đóng bảng điều hướng"
        />
      )}
      <aside className={`fitai-sidebar ${mobileOpen ? "open" : ""}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-logo-icon">
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
          <div className="brand-text">
            <div className="brand-name">FitAI</div>
            <div className="brand-sub">Your Personal Coach</div>
          </div>
          <button
            className="mobile-close-btn"
            onClick={onCloseMobile}
            aria-label="Đóng menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Nav List */}
        <nav className="sidebar-nav">
          {menuItems.map(({ id, label, icon: Icon }) => {
            const isActive = currentTab === id;
            return (
              <button
                key={id}
                className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                onClick={() => {
                  if (id === "Gói hội viên") {
                    onOpenProModal();
                  } else {
                    onSelectTab(id);
                  }
                  onCloseMobile();
                }}
              >
                <span className="nav-item-icon">
                  <Icon size={19} />
                </span>
                <span className="nav-item-label">{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Upgrade Pro Card matching media_1794751776373_b077a672.jpg */}
        <div
          className="sidebar-pro-upgrade-card"
          onClick={onOpenProModal}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onOpenProModal();
            }
          }}
          title="FitAI Pro - Nâng tầm sức khỏe cùng trí tuệ nhân tạo"
        >
          <div className="sidebar-pro-top-row">
            <div className="sidebar-pro-crown-badge">
              <Crown size={15} color="#fbbf24" fill="#fbbf24" />
              <span>FitAI Pro</span>
            </div>
          </div>

          <div className="sidebar-pro-body-row">
            <div className="sidebar-pro-text-col">
              <p className="sidebar-pro-slogan">
                Nâng tầm sức khỏe <br />
                cùng trí tuệ nhân tạo
              </p>
              <button
                className="sidebar-pro-upgrade-pill-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenProModal();
                }}
              >
                <span>Nâng cấp ngay</span>
                <ArrowRight size={12} />
              </button>
            </div>

            <div className="sidebar-pro-trend-art">
              {/* Glowing neon green trend chart with arrow */}
              <svg width="46" height="46" viewBox="0 0 50 50" fill="none">
                <defs>
                  <filter id="neonGreenGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Purple subtle grid bars behind */}
                <rect x="8" y="32" width="5" height="12" rx="2" fill="rgba(168, 85, 247, 0.25)" />
                <rect x="18" y="24" width="5" height="20" rx="2" fill="rgba(168, 85, 247, 0.35)" />
                <rect x="28" y="16" width="5" height="28" rx="2" fill="rgba(168, 85, 247, 0.45)" />
                <rect x="38" y="8" width="5" height="36" rx="2" fill="rgba(168, 85, 247, 0.55)" />

                {/* Neon green rising curve & arrow */}
                <path
                  d="M 6 40 L 16 30 L 26 34 L 42 10"
                  stroke="#4ade80"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#neonGreenGlow)"
                />
                <path
                  d="M 30 10 L 42 10 L 42 22"
                  stroke="#4ade80"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#neonGreenGlow)"
                />
                <circle cx="42" cy="10" r="4" fill="#86efac" />
              </svg>
            </div>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="sidebar-user-footer">
          <div
            className="user-info-clickable"
            onClick={() => onSelectTab("Hồ sơ")}
            title="Xem hồ sơ"
          >
            <div className="user-avatar-wrap">
              <img
                src={userStats.avatar}
                alt={userStats.name}
                className="user-avatar-img"
              />
            </div>
            <div className="user-meta">
              <div className="user-name">{userStats.name}</div>
              <div className="user-status-row">
                <span className="online-indicator-dot" />
                <span className="user-role-label">Free Member</span>
              </div>
            </div>
          </div>
          <button
            className="user-logout-btn"
            onClick={onOpenAuthModal}
            title="Tài khoản / Đăng xuất"
            aria-label="Tùy chọn tài khoản"
          >
            <LogOut size={17} />
          </button>
        </div>
      </aside>
    </>
  );
}
