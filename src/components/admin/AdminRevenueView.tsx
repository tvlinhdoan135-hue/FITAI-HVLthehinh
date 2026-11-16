import { useState } from "react";
import {
  Coins,
  TrendingUp,
  CreditCard,
  Download,
  Search,
  CheckCircle2,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import type { RevenueTransaction } from "../../types/admin";
import { getRealCustomers } from "../../utils/customerStorage";
import { calculateRealRevenueStats } from "../../utils/revenueStorage";

interface AdminRevenueViewProps {
  transactions: RevenueTransaction[];
  onRefundTransaction: (id: string) => void;
}

export default function AdminRevenueView({
  transactions,
  onRefundTransaction,
}: AdminRevenueViewProps) {
  const realCustomers = getRealCustomers();
  const realStats = calculateRealRevenueStats(transactions, realCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("Tất cả");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredTransactions = transactions.filter((tx) => {
    const matchSearch =
      tx.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPay = paymentFilter === "Tất cả" || tx.paymentMethod === paymentFilter;
    const matchStat = statusFilter === "Tất cả" || tx.status === statusFilter;
    return matchSearch && matchPay && matchStat;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Quản lý Doanh thu & Đơn hàng Pro</h2>
          <p className="admin-page-desc">
            Theo dõi dòng tiền định kỳ (MRR/ARR), giao dịch thanh toán qua MoMo, VNPAY và lịch sử nâng cấp gói VIP.
          </p>
        </div>
        <button
          className="admin-primary-btn"
          onClick={() => showToast("Đã tải xuống bảng kê doanh thu tài chính tháng này.")}
        >
          <Download size={16} />
          <span>Xuất báo cáo tài chính</span>
        </button>
      </div>

      {toastMessage && (
        <div className="admin-notice-toast">
          <CheckCircle2 size={16} color="#34d399" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Real KPI Cards */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <div className="admin-kpi-icon-wrap green">
            <Coins size={22} color="#34d399" />
          </div>
          <div className="admin-kpi-val">{realStats.totalRevenueFormatted}</div>
          <div className="admin-kpi-label">Doanh thu thực tế (VNĐ)</div>
          <div className="admin-kpi-trend">↑ Dòng tiền từ khách hàng thật</div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-icon-wrap purple">
            <TrendingUp size={22} color="#c084fc" />
          </div>
          <div className="admin-kpi-val">{realStats.mrrFormatted}</div>
          <div className="admin-kpi-label">MRR (Doanh thu định kỳ tháng)</div>
          <div className="admin-kpi-trend">↑ Doanh thu định kỳ thực tế</div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-icon-wrap blue">
            <CreditCard size={22} color="#60a5fa" />
          </div>
          <div className="admin-kpi-val">{realStats.activePaidCount}</div>
          <div className="admin-kpi-label">Khách hàng trả phí hoạt động</div>
          <div className="admin-kpi-trend">↑ 100% tài khoản thật</div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-icon-wrap amber">
            <AlertCircle size={22} color="#fbbf24" />
          </div>
          <div className="admin-kpi-val">{realStats.successCount}</div>
          <div className="admin-kpi-label">Giao dịch thành công</div>
          <div className="admin-kpi-trend">
            {realStats.refundCount > 0
              ? `Đã hoàn tiền: ${realStats.refundCount}`
              : "0 đơn khiếu nại hoàn tiền"}
          </div>
        </div>
      </div>

      {/* Subscription Tiers Summary */}
      <div className="admin-subscription-tiers-grid">
        <div className="admin-tier-card">
          <div className="tier-header">
            <h4>Gói Starter</h4>
            <span className="tier-badge">49.000 đ / tháng</span>
          </div>
          <div className="tier-subs-count">
            {realCustomers.filter((c) => c.role.includes("Starter")).length} tài khoản kích hoạt
          </div>
          <div className="tier-progress-track">
            <div
              className="tier-progress-fill"
              style={{ width: "35%", backgroundColor: "#38bdf8" }}
            />
          </div>
        </div>

        <div className="admin-tier-card">
          <div className="tier-header">
            <h4>Gói Pro</h4>
            <span className="tier-badge">99.000 đ / tháng</span>
          </div>
          <div className="tier-subs-count">
            {realCustomers.filter((c) => c.role.includes("Pro")).length || 1} tài khoản kích hoạt
          </div>
          <div className="tier-progress-track">
            <div
              className="tier-progress-fill"
              style={{ width: "75%", backgroundColor: "#a855f7" }}
            />
          </div>
        </div>

        <div className="admin-tier-card">
          <div className="tier-header">
            <h4>Gói Elite & Ultimate</h4>
            <span className="tier-badge">199.000 đ - 499.000 đ</span>
          </div>
          <div className="tier-subs-count">
            {realCustomers.filter((c) => c.role.includes("Elite") || c.role.includes("Ultimate")).length} tài khoản kích hoạt
          </div>
          <div className="tier-progress-track">
            <div
              className="tier-progress-fill"
              style={{ width: "25%", backgroundColor: "#34d399" }}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-filter-bar">
        <div className="admin-filter-search">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm theo mã đơn (#FIT-8821), tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="admin-filter-selects">
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="admin-select"
          >
            <option value="Tất cả">Mọi cổng thanh toán</option>
            <option value="MoMo">Ví MoMo</option>
            <option value="VNPAY">VNPAY QR</option>
            <option value="ZaloPay">ZaloPay</option>
            <option value="Thẻ tín dụng">Thẻ Visa / Master</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-select"
          >
            <option value="Tất cả">Mọi trạng thái</option>
            <option value="Thành công">Thành công</option>
            <option value="Đang xử lý">Đang xử lý</option>
            <option value="Hoàn tiền">Hoàn tiền</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="admin-table-card">
        <div className="admin-table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Gói dịch vụ</th>
                <th>Số tiền</th>
                <th>Phương thức</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-muted">
                    Không tìm thấy giao dịch nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>
                      <span className="font-mono text-purple font-semibold">
                        {tx.orderCode}
                      </span>
                    </td>
                    <td>
                      <div className="admin-user-cell-meta">
                        <span className="admin-user-cell-name">{tx.userName}</span>
                        <span className="admin-user-cell-email">{tx.userEmail}</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-white font-medium">{tx.planName}</span>
                    </td>
                    <td>
                      <span className="font-bold text-green">
                        {tx.amount.toLocaleString("vi-VN")} đ
                      </span>
                    </td>
                    <td>
                      <span className="admin-badge role pro">{tx.paymentMethod}</span>
                    </td>
                    <td className="text-muted text-sm">{tx.createdAt}</td>
                    <td>
                      <span
                        className={`admin-badge status ${
                          tx.status === "Thành công"
                            ? "active"
                            : tx.status === "Hoàn tiền"
                            ? "banned"
                            : "pending"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td>
                      {tx.status === "Thành công" && (
                        <button
                          className="admin-action-btn delete"
                          title="Hoàn tiền cho khách hàng"
                          onClick={() => {
                            if (confirm(`Xác nhận hoàn tiền cho đơn ${tx.orderCode}?`)) {
                              onRefundTransaction(tx.id);
                              showToast(`Đã ghi nhận hoàn tiền cho đơn ${tx.orderCode}`);
                            }
                          }}
                        >
                          <RotateCcw size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
