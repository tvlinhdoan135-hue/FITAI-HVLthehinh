import { Search, Bell, Menu } from "lucide-react";

interface AdminHeaderProps {
  onOpenMobileSidebar: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function AdminHeader({
  onOpenMobileSidebar,
  searchQuery,
  onSearchChange,
}: AdminHeaderProps) {
  return (
    <header className="admin-custom-topheader">
      <div className="admin-header-left">
        <button
          className="admin-mobile-menu-btn"
          onClick={onOpenMobileSidebar}
          aria-label="Mở menu quản trị"
        >
          <Menu size={22} />
        </button>

        {/* Search input matching mockup */}
        <div className="admin-search-wrap">
          <Search size={17} className="admin-search-icon" />
          <input
            type="text"
            className="admin-search-input"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-header-right">
        {/* Notification bell with red badge (3) */}
        <div className="admin-notif-box">
          <button className="admin-notif-btn" aria-label="Thông báo hệ thống">
            <Bell size={20} />
            <span className="admin-notif-badge">3</span>
          </button>
        </div>

        {/* Admin profile circle with 'A' matching mockup */}
        <div className="admin-profile-circle-tag" title="Tài khoản Quản trị">
          <span>A</span>
        </div>
      </div>
    </header>
  );
}
