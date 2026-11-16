import { useState } from "react";
import { recordNewTransaction } from "../../utils/revenueStorage";
import {
  X,
  Crown,
  Sprout,
  Rocket,
  Gem,
  Infinity,
  Check,
  Zap,
  ShieldCheck,
  Headphones,
  Gift,
  ArrowRight,
  Sparkles,
  Calendar,
  Star,
  QrCode,
  CreditCard,
  CheckCircle2,
} from "lucide-react";

interface ProModalProps {
  onClose: () => void;
  onUpgradeSuccess: (planTitle?: string) => void;
}

type BillingCycle = "monthly" | "yearly";

interface PlanTier {
  id: "free" | "starter" | "pro" | "elite" | "ultimate";
  name: string;
  iconType: "leaf" | "rocket" | "gem" | "crown" | "infinity";
  iconColor: string;
  iconBg: string;
  monthlyPrice: string;
  yearlyMonthlyPrice: string;
  yearlyTotalFormatted: string;
  yearlySavingsFormatted: string;
  billingUnit: string;
  isPopular?: boolean;
  features: string[];
  btnText: string;
  btnType: "current" | "lime" | "purple" | "gold";
  numericMonthly: number;
  yearlyTotal: number;
}

export default function ProModal({ onClose, onUpgradeSuccess }: ProModalProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<PlanTier | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"momo" | "vnpay" | "card">("momo");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const plans: PlanTier[] = [
    {
      id: "free",
      name: "Miễn phí",
      iconType: "leaf",
      iconColor: "#22c55e",
      iconBg: "rgba(34, 197, 94, 0.15)",
      monthlyPrice: "0đ",
      yearlyMonthlyPrice: "0đ",
      yearlyTotalFormatted: "0đ",
      yearlySavingsFormatted: "0đ",
      billingUnit: "/ mãi mãi",
      features: [
        "5 câu hỏi AI/ngày",
        "1 lịch tập cơ bản",
        "Theo dõi cân nặng",
        "3 lần quét món ăn/tháng",
      ],
      btnText: "Đang sử dụng",
      btnType: "current",
      numericMonthly: 0,
      yearlyTotal: 0,
    },
    {
      id: "starter",
      name: "Starter",
      iconType: "rocket",
      iconColor: "#4ade80",
      iconBg: "rgba(74, 222, 128, 0.15)",
      monthlyPrice: "49.000đ",
      yearlyMonthlyPrice: "39.000đ",
      yearlyTotalFormatted: "468.000đ",
      yearlySavingsFormatted: "120.000đ",
      billingUnit: "/ tháng",
      features: [
        "20 câu hỏi AI/ngày",
        "2 lịch tập/tháng",
        "30 lần quét món ăn/tháng",
        "Theo dõi tiến độ",
      ],
      btnText: "Nâng cấp ngay",
      btnType: "lime",
      numericMonthly: 49000,
      yearlyTotal: 468000,
    },
    {
      id: "pro",
      name: "Pro",
      iconType: "gem",
      iconColor: "#c084fc",
      iconBg: "rgba(168, 85, 247, 0.2)",
      isPopular: true,
      monthlyPrice: "99.000đ",
      yearlyMonthlyPrice: "79.000đ",
      yearlyTotalFormatted: "948.000đ",
      yearlySavingsFormatted: "240.000đ",
      billingUnit: "/ tháng",
      features: [
        "60 câu hỏi AI/ngày",
        "8 lịch tập/tháng",
        "100 lần quét món ăn/tháng",
        "10 lần phân tích video",
        "Thực đơn cá nhân hóa",
      ],
      btnText: "Nâng cấp ngay",
      btnType: "purple",
      numericMonthly: 99000,
      yearlyTotal: 948000,
    },
    {
      id: "elite",
      name: "Elite",
      iconType: "crown",
      iconColor: "#fbbf24",
      iconBg: "rgba(251, 191, 36, 0.15)",
      monthlyPrice: "199.000đ",
      yearlyMonthlyPrice: "159.000đ",
      yearlyTotalFormatted: "1.908.000đ",
      yearlySavingsFormatted: "480.000đ",
      billingUnit: "/ tháng",
      features: [
        "150 câu hỏi AI/ngày",
        "20 lịch tập/tháng",
        "300 lần quét món ăn/tháng",
        "30 lần phân tích video",
        "Giáo trình chuyên sâu",
        "Ưu tiên hỗ trợ",
      ],
      btnText: "Nâng cấp ngay",
      btnType: "gold",
      numericMonthly: 199000,
      yearlyTotal: 1908000,
    },
    {
      id: "ultimate",
      name: "Ultimate",
      iconType: "infinity",
      iconColor: "#4ade80",
      iconBg: "rgba(74, 222, 128, 0.15)",
      monthlyPrice: "499.000đ",
      yearlyMonthlyPrice: "399.000đ",
      yearlyTotalFormatted: "4.788.000đ",
      yearlySavingsFormatted: "1.200.000đ",
      billingUnit: "/ tháng",
      features: [
        "300 câu hỏi AI/ngày",
        "40 lịch tập/tháng",
        "1.000 lần quét món ăn/tháng",
        "100 lần phân tích video",
        "Giáo trình cá nhân hóa",
        "Hỗ trợ VIP 24/7",
      ],
      btnText: "Nâng cấp ngay",
      btnType: "lime",
      numericMonthly: 499000,
      yearlyTotal: 4788000,
    },
  ];

  const handlePlanClick = (plan: PlanTier) => {
    if (plan.id === "free") return;
    setSelectedPlanForCheckout(plan);
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === "FITAI50" || couponCode.trim().toUpperCase() === "PRO2026") {
      setCouponApplied(true);
    } else {
      alert("Mã giảm giá không hợp lệ. Hãy thử mã 'FITAI50'!");
    }
  };

  const handleConfirmPayment = () => {
    if (!selectedPlanForCheckout) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);

      const amountToPay =
        billingCycle === "yearly"
          ? selectedPlanForCheckout.yearlyTotal
          : selectedPlanForCheckout.numericMonthly;
      const payMethodLabel =
        paymentMethod === "momo"
          ? "MoMo"
          : paymentMethod === "vnpay"
          ? "VNPAY"
          : "Thẻ tín dụng";

      recordNewTransaction({
        userName: "Nguyễn Văn A",
        userEmail: "nguyenvana@gmail.com",
        planName: `Gói ${selectedPlanForCheckout.name} (${
          billingCycle === "yearly" ? "Năm" : "Tháng"
        })`,
        amount: amountToPay,
        paymentMethod: payMethodLabel,
      });

      alert(
        `🎉 Chúc mừng bạn đã nâng cấp thành công gói ${selectedPlanForCheckout.name} (${
          billingCycle === "yearly" ? "Theo năm - Tiết kiệm 20%" : "Theo tháng"
        })!\nToàn bộ quyền lợi VIP đã được kích hoạt ngay lập tức.`
      );
      onUpgradeSuccess(
        `${selectedPlanForCheckout.name} ${billingCycle === "yearly" ? "(Năm)" : "(Tháng)"}`
      );
      onClose();
    }, 800);
  };

  const renderIcon = (type: PlanTier["iconType"], color: string) => {
    switch (type) {
      case "leaf":
        return <Sprout size={24} color={color} />;
      case "rocket":
        return <Rocket size={24} color={color} />;
      case "gem":
        return <Gem size={24} color={color} />;
      case "crown":
        return <Crown size={24} color={color} />;
      case "infinity":
        return <Infinity size={24} color={color} />;
    }
  };

  return (
    <div className="modal-backdrop-fullscreen" onClick={onClose}>
      <div
        className="upgrade-plans-fullscreen-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          className="upgrade-modal-close-circle"
          onClick={onClose}
          aria-label="Đóng cửa sổ"
        >
          <X size={18} />
        </button>

        {/* Modal Header & Hero Background */}
        <div className="upgrade-header-container">
          <div className="upgrade-header-left">
            <div className="upgrade-title-row">
              <div className="upgrade-crown-halo">
                <Crown size={32} className="upgrade-crown-svg" />
              </div>
              <h2 className="upgrade-main-title">
                Nâng cấp <span className="upgrade-title-highlight">gói tập</span>
              </h2>
            </div>
            <p className="upgrade-sub-title">
              Chọn gói phù hợp để mở khóa thêm nhiều tính năng và đạt được mục tiêu nhanh hơn!
            </p>

            {/* Billing Cycle Toggle */}
            <div className="upgrade-billing-toggle-row">
              <button
                className={`billing-toggle-pill ${billingCycle === "monthly" ? "active" : ""}`}
                onClick={() => setBillingCycle("monthly")}
              >
                <Calendar size={14} />
                <span>Theo tháng</span>
                <ArrowRight size={13} />
              </button>

              <button
                className={`billing-toggle-pill ${billingCycle === "yearly" ? "active" : ""}`}
                onClick={() => setBillingCycle("yearly")}
              >
                <Star size={14} color="#fbbf24" fill="#fbbf24" />
                <span>Theo năm</span>
                <span className="billing-save-badge">Tiết kiệm 20%</span>
              </button>
            </div>
          </div>

          {/* Athlete Hero Silhouette Artwork with Glowing "Stronger With FitAI" */}
          <div className="upgrade-header-athlete-hero">
            <img
              src="/images/stronger-athlete.jpg"
              alt="Stronger With FitAI"
              className="athlete-hero-bg-img"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <div className="athlete-hero-overlay-callout">
              <span className="stronger-neon-script">Stronger</span>
              <span className="with-fitai-script">With FitAI</span>
            </div>
          </div>
        </div>

        {/* 5 Pricing Cards Row */}
        <div className="upgrade-plans-five-grid">
          {plans.map((plan) => {
            const price =
              billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyMonthlyPrice;
            const isPopular = plan.isPopular;

            return (
              <div
                key={plan.id}
                className={`upgrade-tier-card ${plan.id} ${isPopular ? "featured-popular" : ""}`}
              >
                {/* Popular Overhang Ribbon */}
                {isPopular && (
                  <div className="tier-popular-overhang-badge">
                    <span>Phổ biến</span>
                    <Star size={12} color="#fbbf24" fill="#fbbf24" />
                  </div>
                )}

                {/* Card Icon */}
                <div
                  className="tier-icon-box"
                  style={{ backgroundColor: plan.iconBg }}
                >
                  {renderIcon(plan.iconType, plan.iconColor)}
                </div>

                {/* Card Name */}
                <h3 className="tier-card-name">{plan.name}</h3>

                {/* Card Price */}
                <div className="tier-price-wrap">
                  {billingCycle === "yearly" && plan.id !== "free" && (
                    <div className="tier-old-price-row">
                      <span className="tier-old-striked">{plan.monthlyPrice}</span>
                      <span className="tier-save-badge-mini">-20%</span>
                    </div>
                  )}

                  <div className="tier-main-price-row">
                    <span className="tier-price-main">{price}</span>
                    <span className="tier-price-unit">{plan.billingUnit}</span>
                  </div>

                  {billingCycle === "yearly" && plan.id !== "free" && (
                    <div className="tier-annual-total-sub">
                      <span>Thanh toán {plan.yearlyTotalFormatted}/năm</span>
                      <span className="tier-annual-save-hint">(Tiết kiệm {plan.yearlySavingsFormatted})</span>
                    </div>
                  )}
                </div>

                {/* Feature List */}
                <ul className="tier-features-list">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="tier-feature-item">
                      <span
                        className="feature-check-icon"
                        style={{ color: plan.iconColor }}
                      >
                        <Check size={14} strokeWidth={3} />
                      </span>
                      <span className="feature-text">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                <div className="tier-card-btn-wrap">
                  {plan.btnType === "current" ? (
                    <button className="tier-btn current-in-use" disabled>
                      {plan.btnText}
                    </button>
                  ) : (
                    <button
                      className={`tier-btn action-upgrade ${plan.btnType}`}
                      onClick={() => handlePlanClick(plan)}
                    >
                      <span>{plan.btnText}</span>
                      <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust & Limited Offer Bar */}
        <div className="upgrade-bottom-bar">
          <div className="bottom-trust-items-group">
            <div className="trust-item">
              <span className="trust-icon-box yellow">
                <Zap size={16} />
              </span>
              <div className="trust-text">
                <strong>Kích hoạt ngay</strong>
                <span>Sau khi thanh toán</span>
              </div>
            </div>

            <div className="trust-item">
              <span className="trust-icon-box green">
                <ShieldCheck size={16} />
              </span>
              <div className="trust-text">
                <strong>Thanh toán an toàn</strong>
                <span>Bảo mật tuyệt đối</span>
              </div>
            </div>

            <div className="trust-item">
              <span className="trust-icon-box orange">
                <Headphones size={16} />
              </span>
              <div className="trust-text">
                <strong>Hỗ trợ 24/7</strong>
                <span>Luôn đồng hành</span>
              </div>
            </div>

            <div className="trust-item">
              <span className="trust-icon-box purple">
                <Gift size={16} />
              </span>
              <div className="trust-text">
                <strong>Ưu đãi đặc biệt</strong>
                <span>Dành riêng cho hội viên</span>
              </div>
            </div>
          </div>

          {/* Right Purple Gift Box Banner */}
          <div
            className="bottom-gift-offer-box"
            onClick={() => handlePlanClick(plans[2])}
          >
            <div className="gift-box-icon-wrap">
              <Gift size={24} className="glowing-gift-svg" />
            </div>
            <div className="gift-offer-content">
              <span className="gift-offer-title">Ưu đãi giới hạn!</span>
              <span className="gift-offer-sub">
                Nâng cấp ngay hôm nay để nhận thêm 1 tháng miễn phí!
              </span>
            </div>
            <span className="gift-offer-arrow">
              <ArrowRight size={16} />
            </span>
          </div>
        </div>

        {/* CHECKOUT MODAL DRAWER OVERLAY */}
        {selectedPlanForCheckout && (
          <div
            className="checkout-drawer-backdrop"
            onClick={() => setSelectedPlanForCheckout(null)}
          >
            <div
              className="checkout-drawer-box"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="checkout-drawer-header">
                <div className="checkout-plan-info">
                  <Crown size={20} color="#fbbf24" fill="#fbbf24" />
                  <h4>Thanh toán gói {selectedPlanForCheckout.name}</h4>
                </div>
                <button
                  className="checkout-close-btn"
                  onClick={() => setSelectedPlanForCheckout(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="checkout-body">
                <div className="checkout-amount-row">
                  <div className="checkout-period-info">
                    <span className="checkout-period-tag">
                      {billingCycle === "monthly" ? "📅 Gói theo tháng" : "⭐ Gói theo năm (-20% tiết kiệm)"}
                    </span>
                    {billingCycle === "yearly" && (
                      <span className="checkout-monthly-equiv">
                        Chỉ {selectedPlanForCheckout.yearlyMonthlyPrice}/tháng
                      </span>
                    )}
                  </div>
                  <div className="checkout-price-display">
                    {couponApplied ? (
                      <>
                        <span className="old-striked">
                          {billingCycle === "monthly"
                            ? selectedPlanForCheckout.monthlyPrice
                            : selectedPlanForCheckout.yearlyTotalFormatted}
                        </span>
                        <span className="discounted-new">
                          {(
                            (billingCycle === "monthly"
                              ? selectedPlanForCheckout.numericMonthly
                              : selectedPlanForCheckout.yearlyTotal) * 0.5
                          ).toLocaleString("vi-VN")}
                          đ
                        </span>
                      </>
                    ) : (
                      <span className="regular-price">
                        {billingCycle === "monthly"
                          ? selectedPlanForCheckout.monthlyPrice
                          : selectedPlanForCheckout.yearlyTotalFormatted}
                      </span>
                    )}
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="checkout-methods-section">
                  <label className="checkout-section-label">Phương thức thanh toán:</label>
                  <div className="payment-options-grid">
                    <button
                      className={`payment-option-card ${paymentMethod === "momo" ? "active" : ""}`}
                      onClick={() => setPaymentMethod("momo")}
                    >
                      <span className="momo-badge">MoMo</span>
                      <span>Ví MoMo</span>
                    </button>
                    <button
                      className={`payment-option-card ${paymentMethod === "vnpay" ? "active" : ""}`}
                      onClick={() => setPaymentMethod("vnpay")}
                    >
                      <span className="vnpay-badge">VNPAY</span>
                      <span>VNPAY QR</span>
                    </button>
                    <button
                      className={`payment-option-card ${paymentMethod === "card" ? "active" : ""}`}
                      onClick={() => setPaymentMethod("card")}
                    >
                      <CreditCard size={16} />
                      <span>Thẻ Visa/Master</span>
                    </button>
                  </div>
                </div>

                {/* QR Code Demo Box */}
                <div className="checkout-qr-box">
                  <div className="qr-visual">
                    <QrCode size={110} color="#a855f7" />
                    <span className="qr-scan-hint">Quét mã bằng App Ngân hàng hoặc Ví</span>
                  </div>
                  <div className="qr-meta-info">
                    <div className="qr-meta-line">
                      <span>Nội dung:</span>
                      <strong>FITAI {selectedPlanForCheckout.id.toUpperCase()} {billingCycle === "yearly" ? "YEAR" : "MONTH"}</strong>
                    </div>
                    <div className="qr-meta-line">
                      <span>Trạng thái:</span>
                      <strong className="status-live">Sẵn sàng thanh toán</strong>
                    </div>
                  </div>
                </div>

                {/* Coupon Code Input */}
                <div className="checkout-coupon-row">
                  <input
                    type="text"
                    placeholder="Nhập mã giảm giá (VD: FITAI50)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="coupon-input"
                  />
                  <button className="apply-coupon-btn" onClick={handleApplyCoupon}>
                    Áp dụng
                  </button>
                </div>
                {couponApplied && (
                  <div className="coupon-success-msg">
                    <CheckCircle2 size={14} />
                    <span>Mã FITAI50 áp dụng thành công! Giảm thêm 50%</span>
                  </div>
                )}

                {/* Final Action Button */}
                <button
                  className="confirm-checkout-btn"
                  onClick={handleConfirmPayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span>Đang kích hoạt gói...</span>
                  ) : (
                    <>
                      <span>Xác nhận & Kích hoạt ngay</span>
                      <Sparkles size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
