import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import TopHeader from "./components/TopHeader";
import DashboardView from "./components/views/DashboardView";
import AICoachView from "./components/views/AICoachView";
import WorkoutsView from "./components/views/WorkoutsView";
import ExerciseLibraryView from "./components/views/ExerciseLibraryView";
import NutritionView from "./components/views/NutritionView";
import ProgressView from "./components/views/ProgressView";
import BodyStatusView from "./components/views/BodyStatusView";
import ChallengesView from "./components/views/ChallengesView";
import CommunityView from "./components/views/CommunityView";
import ProfileView from "./components/views/ProfileView";
import SettingsView from "./components/views/SettingsView";
import AdminView from "./components/views/AdminView";

// Modals
import WorkoutSessionModal from "./components/modals/WorkoutSessionModal";
import AddFoodModal from "./components/modals/AddFoodModal";
import AddWeightModal from "./components/modals/AddWeightModal";
import ExerciseDetailModal from "./components/modals/ExerciseDetailModal";
import ProModal from "./components/modals/ProModal";
import AuthModal from "./components/modals/AuthModal";

// Initial Data
import {
  initialUserStats,
  initialExercises,
  weeklyWorkoutProgram,
  initialFoodLogs,
  initialWeightRecords,
  initialMeasurements,
  initialChallenges,
  initialBadges,
  initialCommunityPosts,
  initialNotifications,
} from "./data/initialData";

import type {
  TabType,
  UserStats,
  Exercise,
  WorkoutDay,
  FoodItem,
  WeightRecord,
  BodyMeasurements,
  Challenge,
  Badge,
  CommunityPost,
  NotificationItem,
} from "./types/fitness";
import "./App.css";

export default function App() {
  // Main Navigation state - support direct URL routing to /admin
  const getInitialTab = (): TabType | "Admin" => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes("admin") || hash.includes("admin")) {
        return "Admin";
      }
    }
    return "Trang chủ";
  };

  const [currentTab, setCurrentTab] = useState<TabType | "Admin">(getInitialTab);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Sync browser URL with tab
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes("admin") || hash.includes("admin")) {
        setCurrentTab("Admin");
      } else {
        setCurrentTab("Trang chủ");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleSelectTab = (tab: TabType | "Admin") => {
    if (tab === "Gói hội viên") {
      setShowProModal(true);
      return;
    }
    setCurrentTab(tab);
    if (typeof window !== "undefined") {
      if (tab === "Admin") {
        if (!window.location.pathname.includes("admin")) {
          window.history.pushState({}, "", "/admin");
        }
      } else {
        if (window.location.pathname.includes("admin")) {
          window.history.pushState({}, "", "/");
        }
      }
    }
  };

  // App Data State
  const [userStats, setUserStats] = useState<UserStats>(initialUserStats);
  const [todayExercises, setTodayExercises] = useState<Exercise[]>(initialExercises);
  const [weeklyProgram, setWeeklyProgram] = useState<WorkoutDay[]>(weeklyWorkoutProgram);
  const [foodLogs, setFoodLogs] = useState<FoodItem[]>(initialFoodLogs);
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>(initialWeightRecords);
  const [measurements, setMeasurements] = useState<BodyMeasurements>(initialMeasurements);
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const [badges, setBadges] = useState<Badge[]>(initialBadges);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(initialCommunityPosts);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  // Modal States
  const [activeWorkoutSession, setActiveWorkoutSession] = useState<WorkoutDay | null>(null);
  const [selectedExerciseDetail, setSelectedExerciseDetail] = useState<Exercise | null>(null);
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [showAddWeightModal, setShowAddWeightModal] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // 1. Toggle Exercise on Home or Day
  const handleToggleExercise = (exerciseId: string) => {
    setTodayExercises((prev) =>
      prev.map((ex) => (ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex))
    );
  };

  // 2. Start Live Workout
  const handleStartWorkout = (day?: WorkoutDay) => {
    const routine = day || weeklyProgram[0];
    setActiveWorkoutSession(routine);
  };

  // 3. Finish Live Workout Session
  const handleFinishWorkout = (summary: {
    durationMinutes: number;
    caloriesBurned: number;
    xpEarned: number;
  }) => {
    setUserStats((prev) => {
      const newXp = prev.xp + summary.xpEarned;
      const newCalories = prev.caloriesBurnedToday + summary.caloriesBurned;
      const newHours = parseFloat((prev.workoutHoursToday + summary.durationMinutes / 60).toFixed(1));
      return {
        ...prev,
        xp: newXp,
        caloriesBurnedToday: newCalories,
        workoutHoursToday: newHours,
      };
    });

    // Mark today's exercises as completed
    setTodayExercises((prev) => prev.map((ex) => ({ ...ex, completed: true })));

    // Add to community feed
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      author: {
        name: userStats.name,
        avatar: userStats.avatar,
        level: userStats.levelTitle,
      },
      timeAgo: "Vừa xong",
      content: `Vừa hoàn thành xuất sắc buổi tập ${activeWorkoutSession?.title || "Push Day"}! Đốt cháy ${summary.caloriesBurned} calo và nhận +${summary.xpEarned} XP! 🔥`,
      workoutHighlight: {
        name: activeWorkoutSession?.title || "Push Day",
        duration: `${summary.durationMinutes} phút`,
        calories: summary.caloriesBurned,
      },
      likes: 1,
      isLiked: true,
      commentsCount: 0,
      comments: [],
    };
    setCommunityPosts((prev) => [newPost, ...prev]);

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: "Hoàn thành buổi tập!",
      message: `Bạn đã đốt ${summary.caloriesBurned} calo và nhận +${summary.xpEarned} XP.`,
      timeAgo: "Vừa xong",
      type: "workout",
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // 4. Add Food
  const handleAddFood = (food: FoodItem) => {
    setFoodLogs((prev) => [food, ...prev]);
  };

  // 5. Delete Food
  const handleDeleteFood = (foodId: string) => {
    setFoodLogs((prev) => prev.filter((f) => f.id !== foodId));
  };

  // 6. Update Water
  const handleUpdateWater = (amountMl: number) => {
    setUserStats((prev) => ({ ...prev, waterDrunkMl: amountMl }));
  };

  // 7. Add Weight Record
  const handleAddWeight = (record: WeightRecord) => {
    setWeightRecords((prev) => [...prev, record]);
    setUserStats((prev) => ({ ...prev, currentWeight: record.weight }));
  };

  // 8. Challenge Check-in
  const handleCheckInChallenge = (challengeId: string) => {
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === challengeId) {
          const nextDay = Math.min(ch.totalDays, ch.currentDay + 1);
          return { ...ch, currentDay: nextDay };
        }
        return ch;
      })
    );

    setUserStats((prev) => ({
      ...prev,
      xp: prev.xp + 50,
      streakDays: prev.streakDays + 1,
    }));

    alert("🎉 Điểm danh thành công! Bạn nhận được +50 XP và kéo dài chuỗi kỷ luật thêm 1 ngày!");
  };

  // 9. Community Actions
  const handleLikePost = (postId: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newComment = {
            id: `c-${Date.now()}`,
            author: userStats.name,
            text,
            timeAgo: "Vừa xong",
          };
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = (content: string) => {
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      author: {
        name: userStats.name,
        avatar: userStats.avatar,
        level: userStats.levelTitle,
      },
      timeAgo: "Vừa xong",
      content,
      likes: 0,
      isLiked: false,
      commentsCount: 0,
      comments: [],
    };
    setCommunityPosts((prev) => [newPost, ...prev]);
  };

  // 10. Notifications
  const handleMarkNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // 11. Reset demo data
  const handleResetData = () => {
    setUserStats(initialUserStats);
    setTodayExercises(initialExercises);
    setWeeklyProgram(weeklyWorkoutProgram);
    setFoodLogs(initialFoodLogs);
    setWeightRecords(initialWeightRecords);
    setMeasurements(initialMeasurements);
    setChallenges(initialChallenges);
    setBadges(initialBadges);
    setCommunityPosts(initialCommunityPosts);
    setNotifications(initialNotifications);
    alert("Dữ liệu đã được đặt lại về trạng thái mặc định!");
  };

  // If in Admin mode, render AdminView directly at full-page viewport
  if (currentTab === "Admin") {
    return (
      <AdminView
        onBackToApp={() => handleSelectTab("Trang chủ")}
        exercises={todayExercises}
        onAddExercise={(newEx) => setTodayExercises((prev) => [newEx, ...prev])}
        onDeleteExercise={(id) =>
          setTodayExercises((prev) => prev.filter((ex) => ex.id !== id))
        }
        onUpdateExercise={(updatedEx) =>
          setTodayExercises((prev) =>
            prev.map((ex) => (ex.id === updatedEx.id ? updatedEx : ex))
          )
        }
        userStats={userStats}
      />
    );
  }

  return (
    <div className="fitai-app-shell">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab as TabType}
        onSelectTab={(tab) => handleSelectTab(tab)}
        userStats={userStats}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onOpenProModal={() => setShowProModal(true)}
        onOpenAuthModal={() => setShowAuthModal(true)}
      />

      {/* Main App Content Viewport */}
      <main className="fitai-main-content">
        <TopHeader
          notifications={notifications}
          onMarkNotificationsRead={handleMarkNotificationsRead}
          userStats={userStats}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onSelectTab={(tab) => handleSelectTab(tab)}
          onSelectExerciseSearch={(name) => {
            const matched = weeklyProgram
              .flatMap((d) => d.exercises)
              .find((e) => name.toLowerCase().includes(e.name.toLowerCase()));
            if (matched) setSelectedExerciseDetail(matched);
          }}
        />

        <div className="view-content-wrapper">
          {currentTab === "Trang chủ" && (
            <DashboardView
              userStats={userStats}
              todayExercises={todayExercises}
              onToggleExercise={handleToggleExercise}
              weightRecords={weightRecords}
              onSelectTab={(tab) => setCurrentTab(tab)}
              onStartWorkout={() => handleStartWorkout()}
              onJoinChallenge={() => handleCheckInChallenge("ch-1")}
              onOpenProModal={() => setShowProModal(true)}
            />
          )}

          {currentTab === "Huấn luyện AI" && (
            <AICoachView
              userStats={userStats}
              onApplyAIWorkoutPlan={(plan) => {
                setWeeklyProgram((prev) => [plan, ...prev.slice(1)]);
                setCurrentTab("Chương trình tập");
              }}
            />
          )}

          {currentTab === "Bài tập" && (
            <ExerciseLibraryView
              onOpenDetailModal={(ex) => setSelectedExerciseDetail(ex)}
              onAddExerciseToToday={(newEx) => setTodayExercises((prev) => [newEx, ...prev])}
            />
          )}

          {(currentTab === "Chương trình tập" || currentTab === "Lịch tập") && (
            <WorkoutsView
              weeklyProgram={weeklyProgram}
              onStartWorkout={(day) => handleStartWorkout(day)}
              onOpenExerciseDetail={(ex) => setSelectedExerciseDetail(ex)}
              onOpenAICoach={() => setCurrentTab("Huấn luyện AI")}
            />
          )}

          {currentTab === "Dinh dưỡng" && (
            <NutritionView
              foodLogs={foodLogs}
              onAddFoodClick={() => setShowAddFoodModal(true)}
              onDeleteFood={handleDeleteFood}
              userStats={userStats}
              onUpdateWater={handleUpdateWater}
            />
          )}

          {currentTab === "Thể trạng" && (
            <BodyStatusView
              userStats={userStats}
              onSelectTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === "Tiến độ" && (
            <ProgressView
              weightRecords={weightRecords}
              measurements={measurements}
              userStats={userStats}
              onOpenAddWeight={() => setShowAddWeightModal(true)}
              onUpdateMeasurements={(m) => setMeasurements(m)}
            />
          )}

          {currentTab === "Gói hội viên" && (
            <DashboardView
              userStats={userStats}
              todayExercises={todayExercises}
              onToggleExercise={handleToggleExercise}
              weightRecords={weightRecords}
              onSelectTab={(tab) => setCurrentTab(tab)}
              onStartWorkout={() => handleStartWorkout()}
              onJoinChallenge={() => handleCheckInChallenge("ch-1")}
              onOpenProModal={() => setShowProModal(true)}
            />
          )}

          {currentTab === "Thử thách" && (
            <ChallengesView
              challenges={challenges}
              badges={badges}
              userStats={userStats}
              onCheckInChallenge={handleCheckInChallenge}
              onToggleJoinChallenge={(id) => {
                setChallenges((prev) =>
                  prev.map((c) => (c.id === id ? { ...c, joined: !c.joined } : c))
                );
              }}
            />
          )}

          {currentTab === "Cộng đồng" && (
            <CommunityView
              posts={communityPosts}
              userStats={userStats}
              onLikePost={handleLikePost}
              onAddComment={handleAddComment}
              onCreatePost={handleCreatePost}
            />
          )}

          {currentTab === "Hồ sơ" && (
            <ProfileView
              userStats={userStats}
              onUpdateUserStats={(updated) =>
                setUserStats((prev) => ({ ...prev, ...updated }))
              }
            />
          )}

          {currentTab === "Cài đặt" && (
            <SettingsView
              onOpenAdmin={() => handleSelectTab("Admin")}
              onResetData={handleResetData}
            />
          )}
        </div>
      </main>

      {/* Global Modals */}
      {activeWorkoutSession && (
        <WorkoutSessionModal
          routineTitle={activeWorkoutSession.title}
          exercises={activeWorkoutSession.exercises}
          onClose={() => setActiveWorkoutSession(null)}
          onFinishWorkout={handleFinishWorkout}
        />
      )}

      {selectedExerciseDetail && (
        <ExerciseDetailModal
          exercise={selectedExerciseDetail}
          onClose={() => setSelectedExerciseDetail(null)}
          onStartExercise={() => {
            setActiveWorkoutSession({
              id: "single-ex-session",
              dayName: "Ngay",
              dayTitle: "Tập ngay",
              title: selectedExerciseDetail.name,
              focus: selectedExerciseDetail.targetMuscle,
              durationMinutes: 15,
              exercises: [selectedExerciseDetail],
            });
          }}
        />
      )}

      {showAddFoodModal && (
        <AddFoodModal
          onClose={() => setShowAddFoodModal(false)}
          onAddFood={handleAddFood}
        />
      )}

      {showAddWeightModal && (
        <AddWeightModal
          onClose={() => setShowAddWeightModal(false)}
          onAddWeight={handleAddWeight}
          currentWeight={userStats.currentWeight}
        />
      )}

      {showProModal && (
        <ProModal
          onClose={() => setShowProModal(false)}
          onUpgradeSuccess={(planTitle) =>
            setUserStats((prev) => ({
              ...prev,
              roleTitle: planTitle ? `Hội viên PRO VIP (${planTitle})` : "Hội viên PRO VIP",
            }))
          }
        />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          currentUser={userStats}
          onUpdateUser={(updated) => setUserStats((prev) => ({ ...prev, ...updated }))}
          onOpenAdmin={() => handleSelectTab("Admin")}
        />
      )}
    </div>
  );
}

