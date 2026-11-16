import { useState, useEffect } from "react";
import AdminSidebar, { type AdminTab } from "../admin/AdminSidebar";
import AdminHeader from "../admin/AdminHeader";
import AdminOverviewView from "../admin/AdminOverviewView";
import AdminUsersView from "../admin/AdminUsersView";
import AdminAIView from "../admin/AdminAIView";
import AdminExercisesView from "../admin/AdminExercisesView";
import AdminNutritionView from "../admin/AdminNutritionView";
import AdminAnalyticsView from "../admin/AdminAnalyticsView";
import AdminRevenueView from "../admin/AdminRevenueView";
import AdminSettingsView from "../admin/AdminSettingsView";
import AdminFeedbackView from "../admin/AdminFeedbackView";

import type { Exercise, FoodItem, UserStats } from "../../types/fitness";
import type {
  PromptVersion,
  FeatureFlag,
  AdminAuditLog,
  RateLimitTier,
  AIMetrics,
  AdminUser,
  AdminActivity,
  RevenueTransaction,
  NutritionPreset,
  UserFeedback,
} from "../../types/admin";

import {
  initialAIMetrics,
  initialPromptVersions,
  initialFeatureFlags,
  initialUserFeedbacks,
  initialAdminAuditLogs,
  initialRateLimitTiers,
  initialAdminActivities,
  initialNutritionPresets,
} from "../../data/adminInitialData";
import { initialFoodLogs } from "../../data/initialData";
import {
  getRealCustomers,
  saveRealCustomers,
  syncActiveUserToCustomers,
} from "../../utils/customerStorage";
import {
  getRealTransactions,
  saveRealTransactions,
} from "../../utils/revenueStorage";

interface AdminViewProps {
  onBackToApp: () => void;
  exercises: Exercise[];
  onAddExercise: (ex: Exercise) => void;
  onDeleteExercise: (id: string) => void;
  onUpdateExercise?: (ex: Exercise) => void;
  userStats?: UserStats;
}

export default function AdminView({
  onBackToApp,
  exercises,
  onAddExercise,
  onDeleteExercise,
  onUpdateExercise,
  userStats,
}: AdminViewProps) {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<AdminTab>("Tổng quan");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [adminSearchQuery, setAdminSearchQuery] = useState("");

  // System & Operations Data State
  const [metrics] = useState<AIMetrics>(initialAIMetrics);
  const [activities] = useState<AdminActivity[]>(initialAdminActivities);
  const [users, setUsers] = useState<AdminUser[]>(() => {
    return userStats ? syncActiveUserToCustomers(userStats) : getRealCustomers();
  });

  // Re-sync whenever userStats updates
  useEffect(() => {
    if (userStats) {
      setUsers(syncActiveUserToCustomers(userStats));
    }
  }, [userStats]);
  const [promptVersions, setPromptVersions] = useState<PromptVersion[]>(initialPromptVersions);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>(initialFeatureFlags);
  const [rateLimitTiers, setRateLimitTiers] = useState<RateLimitTier[]>(initialRateLimitTiers);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(initialAdminAuditLogs);
  const [transactions, setTransactions] = useState<RevenueTransaction[]>(getRealTransactions);
  const [nutritionPresets] = useState<NutritionPreset[]>(initialNutritionPresets);
  const [foods, setFoods] = useState<FoodItem[]>(initialFoodLogs);
  const [feedbacks, setFeedbacks] = useState<UserFeedback[]>(initialUserFeedbacks);

  // Helper to append audit logs
  const logAudit = (
    action: string,
    resourceType: AdminAuditLog["resourceType"],
    resourceId: string,
    details: string
  ) => {
    const newEntry: AdminAuditLog = {
      id: `audit-${Date.now()}`,
      adminName: "Admin (admin@fitai.vn)",
      action,
      resourceType,
      resourceId,
      details,
      timestamp: new Date().toLocaleString("vi-VN"),
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // User Actions (Real Customers Persistence)
  const handleAddUser = (newUser: AdminUser) => {
    setUsers((prev) => {
      const updated = [newUser, ...prev];
      saveRealCustomers(updated);
      return updated;
    });
    logAudit("CREATE_USER", "USER", newUser.id, `Tạo tài khoản khách hàng '${newUser.name}' (${newUser.email})`);
  };

  const handleUpdateUser = (updatedUser: AdminUser) => {
    setUsers((prev) => {
      const updated = prev.map((u) => (u.id === updatedUser.id ? updatedUser : u));
      saveRealCustomers(updated);
      return updated;
    });
    logAudit("UPDATE_USER", "USER", updatedUser.id, `Cập nhật thông tin/trạng thái khách hàng '${updatedUser.name}'`);
  };

  const handleDeleteUser = (id: string) => {
    setUsers((prev) => {
      const updated = prev.filter((u) => u.id !== id);
      saveRealCustomers(updated);
      return updated;
    });
    logAudit("DELETE_USER", "USER", id, `Xóa tài khoản khách hàng mã ${id}`);
  };

  // AI Prompt Actions
  const handlePublishPrompt = (versionId: string) => {
    setPromptVersions((prev) =>
      prev.map((pv) => {
        if (pv.id === versionId) {
          logAudit("PUBLISH_PROMPT", "PROMPT", pv.id, `Phát hành phiên bản ${pv.version} cho tác vụ '${pv.taskLabel}'`);
          return { ...pv, status: "published", publishedAt: "Hôm nay, vừa xong" };
        } else if (pv.status === "published" && pv.task === prev.find((p) => p.id === versionId)?.task) {
          return { ...pv, status: "archived" };
        }
        return pv;
      })
    );
  };

  const handleCreatePromptVersion = (newVersion: PromptVersion) => {
    setPromptVersions((prev) => [newVersion, ...prev]);
    logAudit("CREATE_PROMPT_VERSION", "PROMPT", newVersion.id, `Tạo bản nháp prompt mới ${newVersion.version}`);
  };

  // Feature Flag Toggle
  const handleToggleFeature = (key: string) => {
    setFeatureFlags((prev) =>
      prev.map((f) => {
        if (f.key === key) {
          if (f.mandatory) {
            alert("⚠️ Đây là bộ lọc an toàn bắt buộc theo tiêu chuẩn FR-06, không thể vô hiệu hóa!");
            return f;
          }
          const nextState = !f.enabled;
          logAudit("TOGGLE_FEATURE_FLAG", "FEATURE_FLAG", key, `${nextState ? "Bật" : "Tắt"} tính năng '${f.name}'`);
          return { ...f, enabled: nextState, updatedAt: "Vừa xong" };
        }
        return f;
      })
    );
  };

  // Rate Limit Tier Update
  const handleUpdateRateLimit = (updatedTier: RateLimitTier) => {
    setRateLimitTiers((prev) =>
      prev.map((t) => (t.tier === updatedTier.tier ? updatedTier : t))
    );
    logAudit("UPDATE_RATE_LIMIT", "RATE_LIMIT", updatedTier.tier, `Cập nhật hạn mức gói ${updatedTier.tier}`);
  };

  // Revenue Actions
  const handleRefundTransaction = (id: string) => {
    setTransactions((prev) => {
      const updated = prev.map((tx) =>
        tx.id === id ? { ...tx, status: "Hoàn tiền" as const } : tx
      );
      saveRealTransactions(updated);
      return updated;
    });
    logAudit("REFUND_TRANSACTION", "FINANCE", id, `Hoàn tiền cho giao dịch mã ${id}`);
  };

  // Food / Nutrition Actions
  const handleAddFood = (newFood: FoodItem) => {
    setFoods((prev) => [newFood, ...prev]);
    logAudit("CREATE_FOOD", "NUTRITION", newFood.id, `Thêm món ăn '${newFood.name}' vào thư viện dinh dưỡng`);
  };

  const handleDeleteFood = (id: string) => {
    setFoods((prev) => prev.filter((f) => f.id !== id));
    logAudit("DELETE_FOOD", "NUTRITION", id, `Xóa món ăn mã ${id}`);
  };

  // Feedback Reply Action
  const handleReplyFeedback = (id: string, reply: string) => {
    setFeedbacks((prev) =>
      prev.map((fb) =>
        fb.id === id ? { ...fb, adminReply: reply, status: "resolved" } : fb
      )
    );
    logAudit("REPLY_FEEDBACK", "USER", id, `Phản hồi khiếu nại/góp ý của học viên`);
  };

  return (
    <div className="admin-app-layout">
      {/* Admin Sidebar matching mockup */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setMobileSidebarOpen(false);
        }}
        onBackToApp={onBackToApp}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Admin Main Body */}
      <div className="admin-main-wrapper">
        {/* Top Header */}
        <AdminHeader
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          searchQuery={adminSearchQuery}
          onSearchChange={setAdminSearchQuery}
        />

        {/* Content Area */}
        <main className="admin-content-scroll">
          {currentTab === "Tổng quan" && (
            <AdminOverviewView
              onNavigateTab={setCurrentTab}
              activities={activities}
              transactions={transactions}
            />
          )}

          {currentTab === "Quản lý người dùng" && (
            <AdminUsersView
              users={users}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {currentTab === "Quản lý HLV AI" && (
            <AdminAIView
              promptVersions={promptVersions}
              metrics={metrics}
              onPublishVersion={handlePublishPrompt}
              onCreateVersion={handleCreatePromptVersion}
            />
          )}

          {currentTab === "Chương trình tập" && (
            <AdminExercisesView
              exercises={exercises}
              onAddExercise={(ex) => {
                onAddExercise(ex);
                logAudit("CREATE_EXERCISE", "EXERCISE", ex.id, `Thêm bài tập '${ex.name}'`);
              }}
              onUpdateExercise={(ex) => {
                if (onUpdateExercise) onUpdateExercise(ex);
                logAudit("UPDATE_EXERCISE", "EXERCISE", ex.id, `Cập nhật bài tập '${ex.name}'`);
              }}
              onDeleteExercise={(id) => {
                onDeleteExercise(id);
                logAudit("DELETE_EXERCISE", "EXERCISE", id, `Xóa bài tập mã ${id}`);
              }}
            />
          )}

          {currentTab === "Dinh dưỡng" && (
            <AdminNutritionView
              presets={nutritionPresets}
              foods={foods}
              onAddFood={handleAddFood}
              onDeleteFood={handleDeleteFood}
            />
          )}

          {currentTab === "Thống kê" && <AdminAnalyticsView />}

          {currentTab === "Doanh thu" && (
            <AdminRevenueView
              transactions={transactions}
              onRefundTransaction={handleRefundTransaction}
            />
          )}

          {currentTab === "Cài đặt hệ thống" && (
            <AdminSettingsView
              featureFlags={featureFlags}
              rateLimits={rateLimitTiers}
              auditLogs={auditLogs}
              onToggleFeature={handleToggleFeature}
              onUpdateRateLimit={handleUpdateRateLimit}
            />
          )}

          {currentTab === "Phản hồi" && (
            <AdminFeedbackView
              feedbacks={feedbacks}
              onReplyFeedback={handleReplyFeedback}
            />
          )}
        </main>
      </div>
    </div>
  );
}
