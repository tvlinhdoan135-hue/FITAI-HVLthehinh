import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/login`,
        });

      if (resetError) throw resetError;

      setMessage(
        "Nếu email hợp lệ, Supabase sẽ gửi hướng dẫn khôi phục mật khẩu đến hộp thư của bạn."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Không thể gửi yêu cầu khôi phục mật khẩu."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-heading">
          <span>KHÔI PHỤC TÀI KHOẢN</span>
          <h2>Quên mật khẩu?</h2>
          <p>Nhập email đã đăng ký để nhận hướng dẫn khôi phục.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <div className="auth-input-wrap">
              <Mail size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>
          </label>

          {error && <div className="auth-error">{error}</div>}
          {message && <div className="auth-success">{message}</div>}

          <button className="auth-submit" disabled={loading}>
            {loading ? "Đang gửi..." : "Gửi hướng dẫn"}
          </button>
        </form>

        <p className="auth-switch">
          <Link to="/login">Quay lại đăng nhập</Link>
        </p>
      </section>
    </main>
  );
}