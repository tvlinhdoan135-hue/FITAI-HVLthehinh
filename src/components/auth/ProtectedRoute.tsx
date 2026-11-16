import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import type { UserRole } from "../../types/auth";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-spinner" />
        <p>Đang kiểm tra tài khoản...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    return (
      <div className="auth-loading">
        <p>Không tải được hồ sơ tài khoản.</p>
        <p>Vui lòng thử tải lại trang hoặc đăng nhập lại.</p>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return <Navigate to={profile.role === "admin" ? "/admin" : "/app"} replace />;
  }

  return <Outlet />;
}