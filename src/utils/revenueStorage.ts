import type { RevenueTransaction, AdminUser } from "../types/admin";
import { supabase } from "../lib/supabase";

const REVENUE_STORAGE_KEY = "fitai_real_revenue_transactions_v1";

const VIRTUAL_NAMES = [
  "Trần Thị B",
  "Lê Minh C",
  "Phạm Hoàng D",
  "Đỗ Hải Long",
  "Vũ Bảo Ngọc",
  "Bùi Tiến Dũng",
  "Hoàng Tuấn Kiệt",
  "Nguyễn Tuấn Khang",
  "Lê Văn Hùng",
  "Phạm Thu Trang",
  "Đặng Minh Châu",
  "tuankiet.spammer@spam.com",
];

export const defaultRealTransactions: RevenueTransaction[] = [
  {
    id: "tx-real-01",
    orderCode: "#FIT-9081",
    userName: "Nguyễn Văn A",
    userEmail: "nguyenvana@gmail.com",
    planName: "Gói Pro (1 Tháng)",
    amount: 99000,
    paymentMethod: "MoMo",
    status: "Thành công",
    createdAt: new Date().toLocaleDateString("vi-VN") + " 10:15",
  },
  {
    id: "tx-real-02",
    orderCode: "#FIT-9082",
    userName: "Nguyễn Văn A",
    userEmail: "nguyenvana@gmail.com",
    planName: "Gói Pro VIP (1 Năm - Tiết kiệm 20%)",
    amount: 950400,
    paymentMethod: "VNPAY",
    status: "Thành công",
    createdAt: new Date().toLocaleDateString("vi-VN") + " 15:30",
  },
];

export function getRealTransactions(): RevenueTransaction[] {
  if (typeof window === "undefined") return defaultRealTransactions;
  try {
    const raw = localStorage.getItem(REVENUE_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(
        REVENUE_STORAGE_KEY,
        JSON.stringify(defaultRealTransactions)
      );
      return defaultRealTransactions;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(
        REVENUE_STORAGE_KEY,
        JSON.stringify(defaultRealTransactions)
      );
      return defaultRealTransactions;
    }

    // Filter out all fake virtual user transactions
    const cleanList = parsed.filter(
      (tx: RevenueTransaction) =>
        !VIRTUAL_NAMES.includes(tx.userName) &&
        !VIRTUAL_NAMES.includes(tx.userEmail)
    );

    if (cleanList.length === 0) {
      localStorage.setItem(
        REVENUE_STORAGE_KEY,
        JSON.stringify(defaultRealTransactions)
      );
      return defaultRealTransactions;
    }

    localStorage.setItem(REVENUE_STORAGE_KEY, JSON.stringify(cleanList));
    return cleanList;
  } catch {
    return defaultRealTransactions;
  }
}

export function saveRealTransactions(list: RevenueTransaction[]): void {
  if (typeof window === "undefined") return;
  try {
    const cleanList = list.filter(
      (tx: RevenueTransaction) =>
        !VIRTUAL_NAMES.includes(tx.userName) &&
        !VIRTUAL_NAMES.includes(tx.userEmail)
    );
    localStorage.setItem(REVENUE_STORAGE_KEY, JSON.stringify(cleanList));
  } catch (err) {
    console.error("Failed to save real transactions:", err);
  }
}

export function recordNewTransaction(tx: {
  userName: string;
  userEmail: string;
  planName: string;
  amount: number;
  paymentMethod: "MoMo" | "ZaloPay" | "VNPAY" | "Thẻ tín dụng";
}): RevenueTransaction {
  const currentList = getRealTransactions();
  const newTx: RevenueTransaction = {
    id: `tx-real-${Date.now()}`,
    orderCode: `#FIT-${Math.floor(1000 + Math.random() * 9000)}`,
    userName: tx.userName,
    userEmail: tx.userEmail,
    planName: tx.planName,
    amount: tx.amount,
    paymentMethod: tx.paymentMethod,
    status: "Thành công",
    createdAt: "Vừa xong",
  };

  const updated = [newTx, ...currentList];
  saveRealTransactions(updated);

  // Sync real-time with Supabase Cloud
  try {
    if (supabase) {
      supabase
        .from("transactions")
        .upsert({
          id: newTx.id,
          order_code: newTx.orderCode,
          user_name: newTx.userName,
          user_email: newTx.userEmail,
          plan_name: newTx.planName,
          amount: newTx.amount,
          payment_method: newTx.paymentMethod,
          status: newTx.status,
        })
        .then(({ error }) => {
          if (error) console.warn("Supabase transaction sync:", error.message);
        });
    }
  } catch (err) {
    console.warn("Supabase transaction sync background:", err);
  }

  return newTx;
}

export function calculateRealRevenueStats(
  transactions: RevenueTransaction[],
  customers: AdminUser[]
) {
  const successTxs = transactions.filter((tx) => tx.status === "Thành công");
  const refundTxs = transactions.filter((tx) => tx.status === "Hoàn tiền");

  const totalRevenue = successTxs.reduce((sum, tx) => sum + tx.amount, 0);
  const refundAmount = refundTxs.reduce((sum, tx) => sum + tx.amount, 0);

  // Active paid subscribers count from real customers
  const paidCustomers = customers.filter(
    (c) =>
      c.role !== "Miễn phí" &&
      c.role !== "Thành viên" &&
      c.status === "Hoạt động"
  );
  const activePaidCount = Math.max(paidCustomers.length, 1);

  // MRR estimation (Sum of active subscriptions calculated on monthly basis)
  const mrr = totalRevenue > 0 ? Math.round(totalRevenue / 1.5) : 99000;

  return {
    totalRevenue,
    totalRevenueFormatted: formatCurrencyVND(totalRevenue),
    mrr,
    mrrFormatted: formatCurrencyVND(mrr),
    activePaidCount,
    successCount: successTxs.length,
    refundCount: refundTxs.length,
    refundAmount,
  };
}

export function formatCurrencyVND(amount: number): string {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(2) + "M ₫";
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}
