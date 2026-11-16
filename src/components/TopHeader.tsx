import { useState, useRef, useEffect } from "react";
import { Search, Bell, Menu, CheckCheck, Sparkles, Dumbbell, Utensils, Shield } from "lucide-react";
import type { NotificationItem, UserStats, TabType } from "../types/fitness";

interface TopHeaderProps {
  notifications: NotificationItem[];
  onMarkNotificationsRead: () => void;
  userStats: UserStats;
  onOpenMobileSidebar: () => void;
  onSelectTab: (tab: TabType) => void;
  onSelectExerciseSearch?: (exerciseName: string) => void;
}

export default function TopHeader({
  notifications,
  onMarkNotificationsRead,
  userStats,
  onOpenMobileSidebar,
  onSelectTab,
  onSelectExerciseSearch,
}: TopHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close popovers when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchSuggestions = [
    { type: "exercise", label: "Đẩy ngực với tạ đòn (Bench Press)", tab: "Chương trình tập" as TabType },
    { type: "exercise", label: "Shoulder Press (Đẩy vai)", tab: "Chương trình tập" as TabType },
    { type: "exercise", label: "Triceps Pushdown (Tay sau)", tab: "Chương trình tập" as TabType },
    { type: "food", label: "Ức gà áp chảo (165 kcal / 100g)", tab: "Dinh dưỡng" as TabType },
    { type: "food", label: "Yến mạch & Sữa chua Hy Lạp", tab: "Dinh dưỡng" as TabType },
    { type: "ai", label: "Hỏi AI: Thực đơn tăng cơ 1 tháng", tab: "Huấn luyện AI" as TabType },
  ].filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="fitai-topheader">
      <div className="topheader-left">
        <button
          className="mobile-hamburger-btn"
          onClick={onOpenMobileSidebar}
          aria-label="Mở menu điều hướng"
        >
          <Menu size={22} />
        </button>

        {/* Search Bar matching mockup */}
        <div className="search-bar-wrap" ref={searchRef}>
          <div className="search-bar-inner">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Tìm kiếm bài tập, chế độ ăn..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
            />
          </div>

          {/* Quick Search Dropdown */}
          {showSearchDropdown && searchQuery.trim().length > 0 && (
            <div className="search-dropdown-menu">
              <div className="search-dropdown-title">Gợi ý tìm kiếm nhanh</div>
              {searchSuggestions.length > 0 ? (
                searchSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    className="search-dropdown-item"
                    onClick={() => {
                      if (item.type === "exercise" && onSelectExerciseSearch) {
                        onSelectExerciseSearch(item.label);
                      }
                      onSelectTab(item.tab);
                      setSearchQuery("");
                      setShowSearchDropdown(false);
                    }}
                  >
                    {item.type === "exercise" && <Dumbbell size={15} className="item-icon-tag" />}
                    {item.type === "food" && <Utensils size={15} className="item-icon-tag" />}
                    {item.type === "ai" && <Sparkles size={15} className="item-icon-tag" />}
                    <span className="item-text">{item.label}</span>
                    <span className="item-tab-badge">{item.tab}</span>
                  </button>
                ))
              ) : (
                <div className="search-no-results">
                  Không tìm thấy kết quả. Nhấn Enter để hỏi HLV AI.
                  <button
                    className="ask-ai-quick-btn"
                    onClick={() => {
                      onSelectTab("Huấn luyện AI");
                      setSearchQuery("");
                      setShowSearchDropdown(false);
                    }}
                  >
                    <Sparkles size={14} /> Hỏi HLV AI về "{searchQuery}"
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="topheader-right">
        {/* Notifications Bell */}
        <div className="notifications-container" ref={notifRef}>
          <button
            className="notif-bell-btn"
            onClick={() => setShowNotifications((prev) => !prev)}
            aria-label="Thông báo"
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className="notifications-popover">
              <div className="notif-header">
                <div>
                  <h4 className="notif-title">Thông báo</h4>
                  <span className="notif-subtitle">{unreadCount} thông báo mới</span>
                </div>
                {unreadCount > 0 && (
                  <button
                    className="mark-all-read-btn"
                    onClick={onMarkNotificationsRead}
                  >
                    <CheckCheck size={14} /> Đã đọc hết
                  </button>
                )}
              </div>
              <div className="notif-list">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`notif-item ${n.read ? "read" : "unread"}`}
                    onClick={() => {
                      if (n.type === "workout") onSelectTab("Chương trình tập");
                      else if (n.type === "nutrition") onSelectTab("Dinh dưỡng");
                      else if (n.type === "challenge") onSelectTab("Thử thách");
                      setShowNotifications(false);
                    }}
                  >
                    <div className={`notif-icon-circle ${n.type}`}>
                      {n.type === "workout" && <Dumbbell size={15} />}
                      {n.type === "nutrition" && <Utensils size={15} />}
                      {n.type === "challenge" && <Sparkles size={15} />}
                      {n.type === "system" && <Bell size={15} />}
                    </div>
                    <div className="notif-content">
                      <div className="notif-item-title">{n.title}</div>
                      <div className="notif-item-msg">{n.message}</div>
                      <div className="notif-time">{n.timeAgo}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Admin Quick Switcher */}
        <button
          className="topheader-admin-pill-btn"
          onClick={() => onSelectTab("Admin" as unknown as TabType)}
          title="Truy cập Bảng Quản trị Admin"
        >
          <Shield size={14} />
          <span>Admin</span>
        </button>

        {/* User Profile Avatar */}
        <div
          className="topheader-avatar-btn"
          onClick={() => onSelectTab("Hồ sơ")}
          title="Xem hồ sơ"
        >
          <img
            src={userStats.avatar}
            alt={userStats.name}
            className="topheader-avatar-img"
          />
        </div>
      </div>
    </header>
  );
}
