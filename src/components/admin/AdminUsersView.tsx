import { useState } from "react";
import {
  Search,
  Plus,
  UserCheck,
  Ban,
  MoreVertical,
  Mail,
  Phone,
  Flame,
  Dumbbell,
  Calendar,
  X,
  Award,
  Crown,
  Edit2,
  Trash2,
  Sparkles,
} from "lucide-react";
import type { AdminUser } from "../../types/admin";
import { saveRealCustomers } from "../../utils/customerStorage";

interface AdminUsersViewProps {
  users: AdminUser[];
  onAddUser: (u: AdminUser) => void;
  onUpdateUser: (u: AdminUser) => void;
  onDeleteUser: (id: string) => void;
}

export default function AdminUsersView({
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
}: AdminUsersViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tất cả");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // New customer form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRole, setNewRole] = useState<string>("Gói Pro");
  const [newStatus, setNewStatus] = useState<AdminUser["status"]>("Hoạt động");
  const [newWeight, setNewWeight] = useState("65");

  // Dynamic real metrics (calculated directly from actual customers)
  const totalCount = users.length;
  const activeCount = users.filter((u) => u.status === "Hoạt động").length;
  const activePercent = totalCount > 0 ? ((activeCount / totalCount) * 100).toFixed(1) : "0";

  const vipCount = users.filter(
    (u) =>
      u.role.toLowerCase().includes("pro") ||
      u.role.toLowerCase().includes("starter") ||
      u.role.toLowerCase().includes("elite") ||
      u.role.toLowerCase().includes("ultimate")
  ).length;
  const vipPercent = totalCount > 0 ? ((vipCount / totalCount) * 100).toFixed(1) : "0";

  const lockedCount = users.filter((u) => u.status === "Bị khóa").length;

  // Real customer filtering
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm);
    const matchRole =
      roleFilter === "Tất cả" ||
      u.role.toLowerCase().includes(roleFilter.toLowerCase());
    const matchStatus = statusFilter === "Tất cả" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newUser: AdminUser = {
      id: `cus-${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim() || "09" + Math.floor(10000000 + Math.random() * 90000000),
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=100&auto=format&fit=crop&q=80`,
      role: newRole as any,
      status: newStatus,
      createdAt: new Date().toLocaleDateString("vi-VN"),
      lastActive: "Vừa xong",
      workoutsCompleted: 0,
      streakDays: 1,
      currentWeight: parseFloat(newWeight) || 65,
    };

    onAddUser(newUser);
    setNewName("");
    setNewEmail("");
    setNewPhone("");
    setNewRole("Gói Pro");
    setShowAddModal(false);
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    onUpdateUser(editingUser);
    setEditingUser(null);
  };

  const toggleUserBan = (user: AdminUser) => {
    const nextStatus = user.status === "Bị khóa" ? "Hoạt động" : "Bị khóa";
    onUpdateUser({ ...user, status: nextStatus });
    setActiveMenuId(null);
  };

  const changeUserRole = (user: AdminUser, newRole: string) => {
    onUpdateUser({ ...user, role: newRole as any });
    setActiveMenuId(null);
  };

  const renderRoleBadge = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes("starter")) {
      return <span className="admin-badge role starter">Gói Starter</span>;
    }
    if (r.includes("pro")) {
      return (
        <span className="admin-badge role pro">
          <Crown size={12} className="inline mr-1" />
          Gói Pro
        </span>
      );
    }
    if (r.includes("elite")) {
      return (
        <span className="admin-badge role elite">
          <Crown size={12} className="inline mr-1 text-amber-300" />
          Gói Elite
        </span>
      );
    }
    if (r.includes("ultimate")) {
      return (
        <span className="admin-badge role ultimate">
          <Sparkles size={12} className="inline mr-1" />
          Gói Ultimate
        </span>
      );
    }
    if (r.includes("huấn luyện viên") || r.includes("coach")) {
      return <span className="admin-badge role coach">Huấn luyện viên</span>;
    }
    return <span className="admin-badge role member">Miễn phí (Free)</span>;
  };

  const handleClearVirtualUsers = () => {
    if (confirm("Xác nhận xóa toàn bộ người dùng ảo? Chỉ giữ lại tài khoản người dùng thực tế.")) {
      const realUsersOnly = users.filter((u) => u.id === "cus-real-01" || u.name.includes("Bạn"));
      users.forEach((u) => {
        if (!realUsersOnly.some((r) => r.id === u.id)) {
          onDeleteUser(u.id);
        }
      });
      saveRealCustomers(realUsersOnly);
    }
  };

  return (
    <div className="admin-page-container">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Quản lý khách hàng</h2>
          <p className="admin-page-desc">
            Xem và quản lý {totalCount} tài khoản khách hàng thực tế (đã xóa toàn bộ người dùng ảo).
          </p>
        </div>
        <div className="admin-header-actions-group">
          {totalCount > 1 && (
            <button
              className="admin-danger-outline-btn"
              onClick={handleClearVirtualUsers}
              title="Xóa toàn bộ người dùng ảo"
            >
              <Trash2 size={16} />
              <span>Xóa người dùng ảo</span>
            </button>
          )}
          <button
            className="admin-primary-btn"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={18} />
            <span>Thêm khách hàng mới</span>
          </button>
        </div>
      </div>

      {/* User Stats Strip - 100% Real Calculated Metrics */}
      <div className="admin-mini-stat-strip">
        <div className="admin-mini-stat-item">
          <div className="mini-stat-label">Tổng khách hàng</div>
          <div className="mini-stat-val">{totalCount.toLocaleString("vi-VN")}</div>
        </div>
        <div className="admin-mini-stat-item">
          <div className="mini-stat-label">Đang hoạt động</div>
          <div className="mini-stat-val text-green">
            {activeCount} ({activePercent}%)
          </div>
        </div>
        <div className="admin-mini-stat-item">
          <div className="mini-stat-label">Hội viên trả phí (VIP)</div>
          <div className="mini-stat-val text-purple">
            {vipCount} ({vipPercent}%)
          </div>
        </div>
        <div className="admin-mini-stat-item">
          <div className="mini-stat-label">Tài khoản bị khóa</div>
          <div className="mini-stat-val text-red">{lockedCount}</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="admin-filter-bar">
        <div className="admin-filter-search">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm theo tên khách, email, số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="admin-filter-selects">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="admin-select"
          >
            <option value="Tất cả">Mọi gói cước</option>
            <option value="Miễn phí">Miễn phí (Free)</option>
            <option value="Starter">Gói Starter</option>
            <option value="Pro">Gói Pro</option>
            <option value="Elite">Gói Elite</option>
            <option value="Ultimate">Gói Ultimate</option>
            <option value="Huấn luyện viên">Huấn luyện viên</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-select"
          >
            <option value="Tất cả">Mọi trạng thái</option>
            <option value="Hoạt động">Hoạt động</option>
            <option value="Chờ kích hoạt">Chờ kích hoạt</option>
            <option value="Bị khóa">Bị khóa</option>
          </select>
        </div>
      </div>

      {/* Real Customers Table */}
      <div className="admin-table-card">
        <div className="admin-table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Số điện thoại</th>
                <th>Gói dịch vụ</th>
                <th>Trạng thái</th>
                <th>Buổi tập</th>
                <th>Chuỗi (Streak)</th>
                <th>Hoạt động gần nhất</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-muted">
                    Không tìm thấy khách hàng nào phù hợp với bộ lọc tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="admin-user-cell">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="admin-user-cell-avatar"
                        />
                        <div className="admin-user-cell-meta">
                          <span className="admin-user-cell-name font-semibold text-white">
                            {u.name}
                          </span>
                          <span className="admin-user-cell-email text-xs text-muted">
                            {u.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm text-gray-300 font-mono">
                        {u.phone}
                      </span>
                    </td>
                    <td>{renderRoleBadge(u.role)}</td>
                    <td>
                      <span
                        className={`admin-badge status ${
                          u.status === "Hoạt động"
                            ? "active"
                            : u.status === "Bị khóa"
                            ? "banned"
                            : "pending"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td>
                      <span className="font-semibold text-white">
                        {u.workoutsCompleted}
                      </span>{" "}
                      buổi
                    </td>
                    <td>
                      <span className="admin-streak-badge">
                        <Flame size={13} color="#f59e0b" /> {u.streakDays} ngày
                      </span>
                    </td>
                    <td className="text-muted text-sm">{u.lastActive}</td>
                    <td>
                      <div className="admin-row-actions">
                        <button
                          className="admin-action-btn view"
                          title="Xem chi tiết"
                          onClick={() => setSelectedUser(u)}
                        >
                          <UserCheck size={16} />
                        </button>

                        <button
                          className="admin-action-btn edit"
                          title="Chỉnh sửa thông tin"
                          onClick={() => setEditingUser(u)}
                        >
                          <Edit2 size={15} />
                        </button>

                        <button
                          className={`admin-action-btn ${u.status === "Bị khóa" ? "unban" : "ban"}`}
                          title={
                            u.status === "Bị khóa"
                              ? "Mở khóa tài khoản"
                              : "Khóa tài khoản"
                          }
                          onClick={() => toggleUserBan(u)}
                        >
                          <Ban size={16} />
                        </button>

                        <div className="admin-dropdown-wrap">
                          <button
                            className="admin-action-btn"
                            onClick={() =>
                              setActiveMenuId(activeMenuId === u.id ? null : u.id)
                            }
                          >
                            <MoreVertical size={16} />
                          </button>
                          {activeMenuId === u.id && (
                            <div className="admin-action-popover">
                              <button onClick={() => changeUserRole(u, "Gói Starter")}>
                                Chuyển Gói Starter
                              </button>
                              <button onClick={() => changeUserRole(u, "Gói Pro")}>
                                Nâng cấp Gói Pro
                              </button>
                              <button onClick={() => changeUserRole(u, "Gói Elite")}>
                                Nâng cấp Gói Elite
                              </button>
                              <button onClick={() => changeUserRole(u, "Gói Ultimate")}>
                                Nâng cấp Gói Ultimate
                              </button>
                              <button onClick={() => changeUserRole(u, "Miễn phí")}>
                                Chuyển Miễn phí
                              </button>
                              <button onClick={() => changeUserRole(u, "Huấn luyện viên")}>
                                Đổi thành HLV
                              </button>
                              <button
                                className="text-red"
                                onClick={() => {
                                  if (
                                    confirm(
                                      `Bạn có chắc chắn muốn xóa khách hàng '${u.name}'?`
                                    )
                                  ) {
                                    onDeleteUser(u.id);
                                    setActiveMenuId(null);
                                  }
                                }}
                              >
                                Xóa khách hàng
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Thêm khách hàng mới */}
      {showAddModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Thêm khách hàng mới</h3>
              <button
                className="admin-modal-close"
                onClick={() => setShowAddModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="admin-modal-form">
              <div className="admin-form-group">
                <label>Họ và tên khách hàng</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hoàng Tuấn Anh"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="admin-form-group">
                <label>Email liên hệ</label>
                <input
                  type="email"
                  required
                  placeholder="tuananh@gmail.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <div className="admin-form-group">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  placeholder="0912.345.678"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Gói dịch vụ kích hoạt</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                  >
                    <option value="Miễn phí">Miễn phí (Free)</option>
                    <option value="Gói Starter">Gói Starter (49K/tháng)</option>
                    <option value="Gói Pro">Gói Pro (99K/tháng)</option>
                    <option value="Gói Elite">Gói Elite (199K/tháng)</option>
                    <option value="Gói Ultimate">Gói Ultimate VIP (499K/tháng)</option>
                    <option value="Huấn luyện viên">Huấn luyện viên</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Trạng thái</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as AdminUser["status"])}
                  >
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Chờ kích hoạt">Chờ kích hoạt</option>
                    <option value="Bị khóa">Bị khóa</option>
                  </select>
                </div>
              </div>
              <div className="admin-form-group">
                <label>Cân nặng hiện tại (kg)</label>
                <input
                  type="number"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                />
              </div>
              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Hủy bỏ
                </button>
                <button type="submit" className="admin-primary-btn">
                  Lưu khách hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Chỉnh sửa thông tin khách hàng */}
      {editingUser && (
        <div className="admin-modal-backdrop" onClick={() => setEditingUser(null)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Chỉnh sửa thông tin khách hàng</h3>
              <button
                className="admin-modal-close"
                onClick={() => setEditingUser(null)}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveEditUser} className="admin-modal-form">
              <div className="admin-form-group">
                <label>Họ và tên</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                />
              </div>
              <div className="admin-form-group">
                <label>Email</label>
                <input
                  type="email"
                  required
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                />
              </div>
              <div className="admin-form-group">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  value={editingUser.phone}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, phone: e.target.value })
                  }
                />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Gói dịch vụ</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        role: e.target.value as any,
                      })
                    }
                  >
                    <option value="Miễn phí">Miễn phí (Free)</option>
                    <option value="Gói Starter">Gói Starter</option>
                    <option value="Gói Pro">Gói Pro</option>
                    <option value="Gói Elite">Gói Elite</option>
                    <option value="Gói Ultimate">Gói Ultimate VIP</option>
                    <option value="Huấn luyện viên">Huấn luyện viên</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Trạng thái</label>
                  <select
                    value={editingUser.status}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        status: e.target.value as AdminUser["status"],
                      })
                    }
                  >
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Chờ kích hoạt">Chờ kích hoạt</option>
                    <option value="Bị khóa">Bị khóa</option>
                  </select>
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Số buổi tập đã hoàn thành</label>
                  <input
                    type="number"
                    value={editingUser.workoutsCompleted}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        workoutsCompleted: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="admin-form-group">
                  <label>Cân nặng (kg)</label>
                  <input
                    type="number"
                    value={editingUser.currentWeight}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        currentWeight: parseFloat(e.target.value) || 60,
                      })
                    }
                  />
                </div>
              </div>
              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setEditingUser(null)}
                >
                  Hủy bỏ
                </button>
                <button type="submit" className="admin-primary-btn">
                  Cập nhật thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Xem chi tiết khách hàng */}
      {selectedUser && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedUser(null)}>
          <div className="admin-modal-box user-detail" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Hồ sơ khách hàng thực tế</h3>
              <button
                className="admin-modal-close"
                onClick={() => setSelectedUser(null)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="admin-user-detail-card">
              <div className="detail-avatar-col">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="detail-avatar-img"
                />
                <h4 className="detail-user-name">{selectedUser.name}</h4>
                {renderRoleBadge(selectedUser.role)}
              </div>
              <div className="detail-info-grid">
                <div className="detail-info-item">
                  <Mail size={16} className="text-purple" />
                  <div>
                    <span className="label">Email:</span>
                    <span className="val">{selectedUser.email}</span>
                  </div>
                </div>
                <div className="detail-info-item">
                  <Phone size={16} className="text-purple" />
                  <div>
                    <span className="label">Số điện thoại:</span>
                    <span className="val">{selectedUser.phone}</span>
                  </div>
                </div>
                <div className="detail-info-item">
                  <Calendar size={16} className="text-purple" />
                  <div>
                    <span className="label">Ngày tham gia:</span>
                    <span className="val">{selectedUser.createdAt}</span>
                  </div>
                </div>
                <div className="detail-info-item">
                  <Dumbbell size={16} className="text-purple" />
                  <div>
                    <span className="label">Đã hoàn thành:</span>
                    <span className="val">{selectedUser.workoutsCompleted} buổi tập</span>
                  </div>
                </div>
                <div className="detail-info-item">
                  <Flame size={16} className="text-amber" />
                  <div>
                    <span className="label">Chuỗi ngày liên tục:</span>
                    <span className="val">{selectedUser.streakDays} ngày</span>
                  </div>
                </div>
                <div className="detail-info-item">
                  <Award size={16} className="text-green" />
                  <div>
                    <span className="label">Cân nặng hiện tại:</span>
                    <span className="val">{selectedUser.currentWeight} kg</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="admin-modal-actions">
              <button
                className="admin-btn-secondary"
                onClick={() => setSelectedUser(null)}
              >
                Đóng
              </button>
              <button
                className="admin-primary-btn"
                onClick={() => {
                  setEditingUser(selectedUser);
                  setSelectedUser(null);
                }}
              >
                Chỉnh sửa hồ sơ
              </button>
              <button
                className={`admin-primary-btn ${
                  selectedUser.status === "Bị khóa" ? "bg-green" : "bg-red"
                }`}
                onClick={() => {
                  toggleUserBan(selectedUser);
                  setSelectedUser(null);
                }}
              >
                {selectedUser.status === "Bị khóa"
                  ? "Mở khóa tài khoản"
                  : "Khóa tài khoản này"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
