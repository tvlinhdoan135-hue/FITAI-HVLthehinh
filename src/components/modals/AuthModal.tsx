import { useState } from "react";
import {
  X,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Zap,
  BarChart3,
  Trophy,
  UserPlus,
  Phone,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import type { UserStats } from "../../types/fitness";
import { registerNewCustomer, getRealCustomers } from "../../utils/customerStorage";

interface AuthModalProps {
  onClose: () => void;
  currentUser: UserStats;
  onUpdateUser: (updated: Partial<UserStats>) => void;
  onOpenAdmin: () => void;
}

type AuthMode = "register" | "login" | "forgot";

export default function AuthModal({
  onClose,
  currentUser,
  onUpdateUser,
  onOpenAdmin,
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>("register");

  // Form Fields
  const [fullName, setFullName] = useState(currentUser.name || "");
  const [email, setEmail] = useState("nguyenvana@gmail.com");
  const [phone, setPhone] = useState("0901.234.567");
  const [password, setPassword] = useState("123456");
  const [confirmPassword, setConfirmPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Forgot password OTP simulation
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Calculate password strength (0-100)
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 30;
    if (pass.length >= 8) score += 20;
    if (/[A-Z]/.test(pass)) score += 20;
    if (/[0-9]/.test(pass)) score += 15;
    if (/[^A-Za-z0-9]/.test(pass)) score += 15;
    return Math.min(100, score);
  };

  const passStrength = getPasswordStrength(password);

  const getStrengthLabel = (score: number) => {
    if (score < 40) return { label: "Yếu", color: "#f87171" };
    if (score < 75) return { label: "Trung bình", color: "#fbbf24" };
    return { label: "Mạnh", color: "#4ade80" };
  };

  // 1. Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Basic Validation
    if (!email || !email.includes("@")) {
      setErrorMessage("Vui lòng nhập định dạng email hợp lệ (ví dụ: ten@gmail.com)");
      return;
    }

    if (mode === "register") {
      if (!fullName.trim()) {
        setErrorMessage("Vui lòng nhập họ và tên của bạn.");
        return;
      }
      if (password.length < 6) {
        setErrorMessage("Mật khẩu phải có tối thiểu 6 ký tự.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Mật khẩu xác nhận không trùng khớp!");
        return;
      }
      if (!agreeTerms) {
        setErrorMessage("Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.");
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        // Register in real customer database
        registerNewCustomer({
          name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          role: "Miễn phí",
        });

        // Update active user state
        onUpdateUser({
          name: fullName.trim(),
        });

        setSuccessMessage("Đăng ký tài khoản thành công! Đang kích hoạt giao diện...");
        setTimeout(() => {
          onClose();
        }, 1100);
      }, 700);
    } else if (mode === "login") {
      if (password.length < 6) {
        setErrorMessage("Mật khẩu phải có tối thiểu 6 ký tự.");
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        // Find user or update
        const customers = getRealCustomers();
        const found = customers.find(
          (c) => c.email.toLowerCase() === email.trim().toLowerCase()
        );

        if (found) {
          onUpdateUser({
            name: found.name,
            roleTitle: found.role,
            avatar: found.avatar,
          });
        } else {
          onUpdateUser({
            name: fullName.trim() || "Nguyễn Văn A",
          });
        }

        setSuccessMessage("Đăng nhập thành công! Chào mừng bạn quay trở lại.");
        setTimeout(() => {
          onClose();
        }, 1000);
      }, 600);
    } else if (mode === "forgot") {
      if (!otpSent) {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          setOtpSent(true);
          setSuccessMessage(`Mã xác thực OTP 6 số đã được gửi tới email ${email}!`);
        }, 600);
      } else {
        if (!otpCode || otpCode.length < 4) {
          setErrorMessage("Vui lòng nhập mã OTP xác thực hợp lệ.");
          return;
        }
        if (newPassword.length < 6) {
          setErrorMessage("Mật khẩu mới phải có ít nhất 6 ký tự.");
          return;
        }

        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          setSuccessMessage("Đặt lại mật khẩu thành công! Đang đăng nhập...");
          setTimeout(() => {
            onClose();
          }, 1100);
        }, 600);
      }
    }
  };

  // 2. Social Login Handlers
  const handleSocialLogin = (provider: "Google" | "Apple" | "Facebook") => {
    setIsLoading(true);
    setErrorMessage("");
    setTimeout(() => {
      setIsLoading(false);
      const socialName = `${currentUser.name || "Nguyễn Văn A"} (${provider})`;
      onUpdateUser({
        name: socialName,
      });
      registerNewCustomer({
        name: socialName,
        email: `${provider.toLowerCase()}.user@gmail.com`,
        phone: "0901.888.999",
        role: "Miễn phí",
      });
      setSuccessMessage(`Đã đăng nhập thành công bằng ${provider}!`);
      setTimeout(() => {
        onClose();
      }, 1000);
    }, 600);
  };

  // 3. Quick Demo Roles
  const handleQuickRole = (role: "Thành viên" | "HLV Cá nhân" | "Quản trị viên") => {
    if (role === "Quản trị viên") {
      onOpenAdmin();
      onClose();
      return;
    }

    if (role === "HLV Cá nhân") {
      onUpdateUser({
        name: "Đỗ Hải Long",
        roleTitle: "Huấn luyện viên AI",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      });
      setSuccessMessage("Đã đăng nhập với tài khoản: HLV Đỗ Hải Long");
    } else {
      onUpdateUser({
        name: "Nguyễn Văn A",
        roleTitle: "Hội viên FitAI",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      });
      setSuccessMessage("Đã đăng nhập với tài khoản: Hội viên Nguyễn Văn A");
    }

    setTimeout(() => {
      onClose();
    }, 900);
  };

  return (
    <div className="auth-backdrop" onClick={onClose}>
      <div className="auth-window" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          className="auth-close-btn"
          onClick={onClose}
          aria-label="Đóng cửa sổ"
        >
          <X size={20} />
        </button>

        {/* Left Column: Hero & Branding */}
        <div className="auth-left-col">
          {/* Brand Logo */}
          <div className="auth-brand">
            <div className="auth-logo-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.3"
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
            <div className="auth-brand-text">
              <div className="auth-brand-name">
                Fit<span className="auth-gradient-text">AI</span>
              </div>
              <div className="auth-brand-sub">Your Personal Coach</div>
            </div>
          </div>

          {/* Heading */}
          <div className="auth-heading-wrap">
            <h2 className="auth-title">
              Bắt đầu hành trình <br />
              <span className="auth-highlight-text">khỏe mạnh hơn</span>
            </h2>
            <p className="auth-subtitle">
              Theo dõi sức khỏe, tập luyện thông minh và đạt được mục tiêu của bạn.
            </p>
          </div>

          {/* Feature List & Athlete Stage */}
          <div className="auth-visual-wrap">
            <div className="auth-features-list">
              <div className="auth-feat-item">
                <div className="auth-feat-icon">
                  <Zap size={14} />
                </div>
                <span>Theo dõi thông minh</span>
              </div>

              <div className="auth-feat-item">
                <div className="auth-feat-icon">
                  <BarChart3 size={14} />
                </div>
                <span>Lộ trình cá nhân hóa</span>
              </div>

              <div className="auth-feat-item">
                <div className="auth-feat-icon">
                  <Trophy size={14} />
                </div>
                <span>Đạt mục tiêu bền vững</span>
              </div>
            </div>

            {/* Athlete with Glowing Holographic Platform */}
            <div className="auth-athlete-stage">
              <div className="auth-halo-light" />
              <img
                src="/images/auth-athlete-curling.png"
                alt="FitAI Athlete"
                className="auth-athlete-img"
              />
              <div className="auth-platform-ring ring-outer" />
              <div className="auth-platform-ring ring-inner" />
            </div>
          </div>
        </div>

        {/* Right Column: Form Container */}
        <div className="auth-right-col">
          {/* Top Segmented Tabs: Đăng ký / Đăng nhập */}
          <div className="auth-form-top-pill">
            <div className="auth-segmented-pill">
              <button
                type="button"
                className={`auth-seg-btn ${mode === "register" ? "active" : ""}`}
                onClick={() => {
                  setMode("register");
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
              >
                <UserPlus size={15} />
                <span>Đăng ký</span>
              </button>
              <button
                type="button"
                className={`auth-seg-btn ${mode === "login" ? "active" : ""}`}
                onClick={() => {
                  setMode("login");
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
              >
                <KeyRound size={15} />
                <span>Đăng nhập</span>
              </button>
            </div>
          </div>

          {/* Feedback alerts */}
          {errorMessage && (
            <div className="auth-alert-box error">
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="auth-alert-box success">
              <CheckCircle2 size={16} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ========================================================
              FORM: ĐĂNG KÝ TÀI KHOẢN MỚI
             ======================================================== */}
          {mode === "register" && (
            <form onSubmit={handleSubmit} className="auth-form">
              {/* Họ và tên */}
              <div className="auth-field-group">
                <label className="auth-field-label">
                  <div className="auth-label-icon">
                    <User size={13} />
                  </div>
                  <span>Họ và tên *</span>
                </label>
                <div className="auth-input-wrapper">
                  <User size={16} className="auth-input-icon" />
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="Nhập họ và tên của bạn..."
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email & Phone Row */}
              <div className="auth-grid-2">
                <div className="auth-field-group">
                  <label className="auth-field-label">
                    <div className="auth-label-icon">
                      <Mail size={13} />
                    </div>
                    <span>Email *</span>
                  </label>
                  <div className="auth-input-wrapper">
                    <Mail size={16} className="auth-input-icon" />
                    <input
                      type="email"
                      className="auth-input"
                      placeholder="Nhập email của bạn..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="auth-field-group">
                  <label className="auth-field-label">
                    <div className="auth-label-icon">
                      <Phone size={13} />
                    </div>
                    <span>Số điện thoại</span>
                  </label>
                  <div className="auth-input-wrapper">
                    <Phone size={16} className="auth-input-icon" />
                    <input
                      type="tel"
                      className="auth-input"
                      placeholder="0901.xxx.xxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Mật khẩu & Xác nhận mật khẩu */}
              <div className="auth-grid-2">
                <div className="auth-field-group">
                  <label className="auth-field-label">
                    <div className="auth-label-icon">
                      <Lock size={13} />
                    </div>
                    <span>Mật khẩu *</span>
                  </label>
                  <div className="auth-input-wrapper">
                    <Lock size={16} className="auth-input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="auth-input password"
                      placeholder="Tối thiểu 6 ký tự..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="auth-password-toggle-btn"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label="Hiện/ẩn mật khẩu"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="auth-field-group">
                  <label className="auth-field-label">
                    <div className="auth-label-icon">
                      <Lock size={13} />
                    </div>
                    <span>Xác nhận mật khẩu *</span>
                  </label>
                  <div className="auth-input-wrapper">
                    <Lock size={16} className="auth-input-icon" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="auth-input password"
                      placeholder="Nhập lại mật khẩu..."
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="auth-password-toggle-btn"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      aria-label="Hiện/ẩn mật khẩu"
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password strength indicator */}
              {password && (
                <div className="auth-strength-meter">
                  <div className="auth-meter-label-row">
                    <span>Độ mạnh mật khẩu:</span>
                    <span
                      style={{
                        color: getStrengthLabel(passStrength).color,
                        fontWeight: 700,
                      }}
                    >
                      {getStrengthLabel(passStrength).label}
                    </span>
                  </div>
                  <div className="auth-meter-track">
                    <div
                      className="auth-meter-fill"
                      style={{
                        width: `${passStrength}%`,
                        backgroundColor: getStrengthLabel(passStrength).color,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Checkbox Terms */}
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span>
                  Tôi đồng ý với{" "}
                  <a href="#terms" onClick={(e) => e.preventDefault()}>
                    Điều khoản dịch vụ
                  </a>{" "}
                  &{" "}
                  <a href="#privacy" onClick={(e) => e.preventDefault()}>
                    Chính sách bảo mật
                  </a>{" "}
                  của FitAI.
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                className="auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="auth-spinner" />
                    <span>Đang khởi tạo tài khoản...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    <span>Tạo tài khoản & Đăng nhập</span>
                    <span className="auth-submit-arrow">›</span>
                  </>
                )}
              </button>

              <div className="auth-switch-text">
                Đã có tài khoản?{" "}
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={() => {
                    setMode("login");
                    setErrorMessage("");
                  }}
                >
                  Đăng nhập ngay
                </button>
              </div>
            </form>
          )}

          {/* ========================================================
              FORM: ĐĂNG NHẬP
             ======================================================== */}
          {mode === "login" && (
            <form onSubmit={handleSubmit} className="auth-form">
              {/* Email */}
              <div className="auth-field-group">
                <label className="auth-field-label">
                  <div className="auth-label-icon">
                    <Mail size={13} />
                  </div>
                  <span>Email *</span>
                </label>
                <div className="auth-input-wrapper">
                  <Mail size={16} className="auth-input-icon" />
                  <input
                    type="email"
                    className="auth-input"
                    placeholder="Nhập email của bạn..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Mật khẩu */}
              <div className="auth-field-group">
                <label className="auth-field-label">
                  <div className="auth-label-icon">
                    <Lock size={13} />
                  </div>
                  <span>Mật khẩu *</span>
                </label>
                <div className="auth-input-wrapper">
                  <Lock size={16} className="auth-input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="auth-input password"
                    placeholder="Nhập mật khẩu..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="auth-password-toggle-btn"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label="Hiện/ẩn mật khẩu"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot Password */}
              <div className="auth-flex-between">
                <label className="auth-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Ghi nhớ 30 ngày</span>
                </label>
                <button
                  type="button"
                  className="auth-link-btn forgot"
                  onClick={() => {
                    setMode("forgot");
                    setOtpSent(false);
                    setErrorMessage("");
                  }}
                >
                  Quên mật khẩu?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="auth-spinner" />
                    <span>Đang đăng nhập...</span>
                  </>
                ) : (
                  <>
                    <KeyRound size={18} />
                    <span>Đăng nhập ngay</span>
                    <span className="auth-submit-arrow">›</span>
                  </>
                )}
              </button>

              <div className="auth-switch-text">
                Chưa có tài khoản?{" "}
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={() => {
                    setMode("register");
                    setErrorMessage("");
                  }}
                >
                  Đăng ký miễn phí
                </button>
              </div>
            </form>
          )}

          {/* ========================================================
              FORM: QUÊN MẬT KHẨU / KHÔI PHỤC TÀI KHOẢN
             ======================================================== */}
          {mode === "forgot" && (
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-forgot-desc">
                {!otpSent
                  ? "Nhập email tài khoản của bạn để nhận mã xác minh OTP đặt lại mật khẩu mới."
                  : `Mã OTP đã được gửi về ${email}. Vui lòng nhập mã và mật khẩu mới bên dưới.`}
              </div>

              <div className="auth-field-group">
                <label className="auth-field-label">
                  <div className="auth-label-icon">
                    <Mail size={13} />
                  </div>
                  <span>Email xác minh *</span>
                </label>
                <div className="auth-input-wrapper">
                  <Mail size={16} className="auth-input-icon" />
                  <input
                    type="email"
                    className="auth-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={otpSent}
                  />
                </div>
              </div>

              {otpSent && (
                <>
                  <div className="auth-field-group">
                    <label className="auth-field-label">
                      <div className="auth-label-icon">
                        <KeyRound size={13} />
                      </div>
                      <span>Mã xác thực OTP (6 chữ số) *</span>
                    </label>
                    <div className="auth-input-wrapper">
                      <KeyRound size={16} className="auth-input-icon" />
                      <input
                        type="text"
                        className="auth-input"
                        placeholder="Ví dụ: 864219"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        required
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <div className="auth-field-group">
                    <label className="auth-field-label">
                      <div className="auth-label-icon">
                        <Lock size={13} />
                      </div>
                      <span>Mật khẩu mới *</span>
                    </label>
                    <div className="auth-input-wrapper">
                      <Lock size={16} className="auth-input-icon" />
                      <input
                        type="password"
                        className="auth-input"
                        placeholder="Tối thiểu 6 ký tự..."
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="auth-spinner" />
                    <span>Đang xử lý...</span>
                  </>
                ) : !otpSent ? (
                  <>
                    <Mail size={18} />
                    <span>Gửi mã OTP khôi phục</span>
                    <span className="auth-submit-arrow">›</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>Lưu mật khẩu mới & Đăng nhập</span>
                    <span className="auth-submit-arrow">›</span>
                  </>
                )}
              </button>

              <button
                type="button"
                className="auth-back-btn"
                onClick={() => {
                  setMode("login");
                  setOtpSent(false);
                  setErrorMessage("");
                }}
              >
                ← Quay lại trang Đăng nhập
              </button>
            </form>
          )}

          {/* Social Logins */}
          <div className="auth-social-wrap">
            <div className="auth-footer-divider">
              <span className="auth-divider-line" />
              <span className="auth-divider-text">Hoặc tiếp tục với</span>
              <span className="auth-divider-line" />
            </div>

            <div className="auth-social-row">
              <button
                type="button"
                className="auth-social-btn google"
                onClick={() => handleSocialLogin("Google")}
                title="Đăng nhập với Google"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                className="auth-social-btn apple"
                onClick={() => handleSocialLogin("Apple")}
                title="Đăng nhập với Apple"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.36c.64-.78 1.08-1.87.96-2.96-.93.04-2.09.62-2.76 1.4-.59.68-1.11 1.79-.97 2.85 1.05.08 2.13-.51 2.77-1.29z" />
                </svg>
                <span>Apple</span>
              </button>

              <button
                type="button"
                className="auth-social-btn facebook"
                onClick={() => handleSocialLogin("Facebook")}
                title="Đăng nhập với Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </button>
            </div>
          </div>

          <div className="auth-security-note">
            <Shield size={14} className="auth-shield-icon" />
            <span>Dữ liệu tập luyện & thông tin cá nhân bảo mật tuyệt đối</span>
          </div>

          {/* Quick Demo Role Switcher */}
          <div className="auth-quick-roles">
            <span className="auth-quick-label">Tài khoản mẫu:</span>
            <button
              type="button"
              className="auth-role-pill"
              onClick={() => handleQuickRole("Thành viên")}
              title="Đăng nhập tài khoản Thành viên"
            >
              👤 Thành viên
            </button>
            <button
              type="button"
              className="auth-role-pill"
              onClick={() => handleQuickRole("HLV Cá nhân")}
              title="Đăng nhập tài khoản Huấn luyện viên"
            >
              🏋️ HLV Cá nhân
            </button>
            <button
              type="button"
              className="auth-role-pill admin"
              onClick={() => handleQuickRole("Quản trị viên")}
              title="Truy cập Bảng Quản trị Admin"
            >
              👑 Quản trị viên
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
