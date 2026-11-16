export type TabType =
  | "Trang chủ"
  | "Huấn luyện AI"
  | "Chương trình tập"
  | "Bài tập"
  | "Lịch tập"
  | "Dinh dưỡng"
  | "Thể trạng"
  | "Tiến độ"
  | "Gói hội viên"
  | "Thử thách"
  | "Cộng đồng"
  | "Hồ sơ"
  | "Cài đặt";

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
  equipment: string;
  difficulty: "Người mới" | "Trung bình" | "Nâng cao";
  sets: number;
  reps: string;
  weight?: string;
  restSeconds: number;
  completed?: boolean;
  instructions: string[];
  tips: string;
}

export interface WorkoutDay {
  id: string;
  dayName: string; // T2, T3...
  dayTitle: string; // Thứ Hai, Thứ Ba...
  title: string;
  focus: string;
  durationMinutes: number;
  exercises: Exercise[];
  isRest?: boolean;
}

export interface FoodItem {
  id: string;
  name: string;
  category: "Bữa sáng" | "Bữa trưa" | "Bữa tối" | "Bữa phụ";
  calories: number;
  protein: number; // grams
  carbs: number;   // grams
  fat: number;     // grams
  portion: string;
  emoji: string;
}

export interface WeightRecord {
  id: string;
  date: string; // "T2", "15/10", etc.
  weight: number; // kg
  bodyFat?: number; // %
}

export interface BodyMeasurements {
  chest: number; // cm
  waist: number;
  hips: number;
  arms: number;
  thighs: number;
  lastUpdated: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  currentDay: number;
  totalDays: number;
  rewardXP: number;
  badgeName: string;
  badgeColor: string;
  joined: boolean;
  completed: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: "Tập luyện" | "Kỷ luật" | "Dinh dưỡng" | "Thành tích";
}

export interface CommunityPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    level: string;
  };
  timeAgo: string;
  content: string;
  workoutHighlight?: {
    name: string;
    duration: string;
    calories: number;
  };
  likes: number;
  isLiked?: boolean;
  commentsCount: number;
  comments: {
    id: string;
    author: string;
    text: string;
    timeAgo: string;
  }[];
}

export interface UserStats {
  name: string;
  roleTitle: string;
  avatar: string;
  levelTitle: string;
  xp: number;
  nextLevelXp: number;
  caloriesBurnedToday: number;
  workoutHoursToday: number;
  streakDays: number;
  avgHeartRate: number;
  currentWeight: number;
  targetWeight: number;
  height: number; // cm
  age: number;
  gender: "Nam" | "Nữ";
  goal: string;
  experienceLevel: string;
  waterDrunkMl: number;
  waterTargetMl: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  type: "workout" | "nutrition" | "challenge" | "system";
  read: boolean;
}
