import { useNavigate } from "react-router-dom";
import { ShieldCheck, LogOut } from "lucide-react";
import { useAuth } from "../components/auth/AuthProvider";

export default function AdminDashboard() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <main style={{ padding: 40 }}>
      <h1>
        <ShieldCheck size={28} /> FitAI Admin
      </h1>

      <p>Xin chào quản trị viên {profile?.full_name || profile?.email}.</p>

      <p>Đăng nhập quản trị đã được xác thực.</p>

      <button onClick={handleLogout}>
        <LogOut size={18} /> Đăng xuất
      </button>
    </main>
  );
}