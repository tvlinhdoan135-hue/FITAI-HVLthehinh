import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Activity, LockKeyhole, Mail, UserRound } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (fullName.trim().length < 2) {
      setError("Họ tên phải có ít nhất 2 ký tự.");
      return;
    }

    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: registerError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (registerError) throw registerError;

      if (data.session) {
        setSuccess("Đăng ký thành công! Bạn đã có thể sử dụng FitAI.");
      } else {
        setSuccess(
          "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản trước khi đăng nhập."
        );
      }

      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Không thể đăng ký tài khoản."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <Activity size={26} />
          </div>
          <div>
            <h1>FitAI</h1>
            <p>YOUR PERSONAL COACH</p>
          </div>
        </div>

        <div className="auth-heading">
          <span>BẮT ĐẦU HÀNH TRÌNH</span>
          <h2>Tạo tài khoản</h2>
          <p>Tham gia FitAI để xây dựng kế hoạch tập luyện cá nhân.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Họ và tên
            <div className="auth-input-wrap">
              <UserRound size={18} />
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                autoComplete="name"
                required
              />
            </div>
          </label>

          <label>
            Email
            <div className="auth-input-wrap">
              <Mail size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
                required
              />
            </div>
          </label>

          <label>
            Mật khẩu
            <div className="auth-input-wrap">
              <LockKeyhole size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ít nhất 8 ký tự"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>
          </label>

          <label>
            Xác nhận mật khẩu
            <div className="auth-input-wrap">
              <LockKeyhole size={18} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu"
                autoComplete="new-password"
                required
              />
            </div>
          </label>

          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <button className="auth-submit" disabled={loading}>
            {loading ? "Đang tạo tài khoản..." : "Đăng ký tài khoản"}
          </button>
        </form>

        <p className="auth-switch">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </section>
    </main>
  );
}