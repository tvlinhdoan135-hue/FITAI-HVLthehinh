import type { AdminUser } from "../types/admin";
import type { UserStats } from "../types/fitness";
import { supabase } from "../lib/supabase";

const STORAGE_KEY = "fitai_real_customers_clean_v3";

export const defaultRealCustomers: AdminUser[] = [
  {
    id: "cus-real-01",
    name: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    phone: "0901.234.567",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    role: "Miễn phí",
    status: "Hoạt động",
    createdAt: new Date().toLocaleDateString("vi-VN"),
    lastActive: "Đang online",
    workoutsCompleted: 12,
    streakDays: 12,
    currentWeight: 56.2,
  },
];

// List of virtual IDs and names to automatically purge
const VIRTUAL_IDENTIFIERS = [
  "cus-02", "cus-03", "cus-04", "cus-05", "cus-06", "cus-07", "cus-08", "cus-09", "cus-10",
  "usr-01", "usr-02", "usr-03", "usr-04", "usr-05", "usr-06", "usr-07", "usr-08", "usr-09", "usr-10",
  "Lê Thị Mai Linh", "Trần Quốc Tuấn", "Nguyễn Hoàng Nam", "Đỗ Hải Long", "Phạm Thu Trang",
  "Vũ Bảo Ngọc", "Bùi Tiến Dũng", "Đặng Minh Châu", "Hoàng Tuấn Kiệt", "Trần Thị B",
  "Lê Minh C", "Phạm Hoàng D", "tuankiet.spammer@spam.com",
];

export function getRealCustomers(): AdminUser[] {
  if (typeof window === "undefined") return defaultRealCustomers;
  try {
    // Purge older storage keys that contained virtual users
    localStorage.removeItem("fitai_real_customers_list");

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultRealCustomers));
      return defaultRealCustomers;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return defaultRealCustomers;

    // Filter out all virtual users
    const filtered = parsed.filter(
      (u: AdminUser) =>
        !VIRTUAL_IDENTIFIERS.includes(u.id) &&
        !VIRTUAL_IDENTIFIERS.includes(u.name) &&
        !VIRTUAL_IDENTIFIERS.includes(u.email)
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch {
    return defaultRealCustomers;
  }
}

export function saveRealCustomers(customers: AdminUser[]): void {
  if (typeof window === "undefined") return;
  try {
    // Ensure no virtual users get saved
    const cleanCustomers = customers.filter(
      (u: AdminUser) =>
        !VIRTUAL_IDENTIFIERS.includes(u.id) &&
        !VIRTUAL_IDENTIFIERS.includes(u.name) &&
        !VIRTUAL_IDENTIFIERS.includes(u.email)
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanCustomers));
  } catch (err) {
    console.error("Failed to save real customers:", err);
  }
}

export function clearAllVirtualUsers(): AdminUser[] {
  if (typeof window === "undefined") return defaultRealCustomers;
  localStorage.removeItem("fitai_real_customers_list");
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultRealCustomers));
  return defaultRealCustomers;
}

export function syncActiveUserToCustomers(userStats: UserStats): AdminUser[] {
  const currentList = getRealCustomers();

  // Find existing real active user or create
  const existingIndex = currentList.findIndex((u) => u.id === "cus-real-01" || u.email === "nguyenvana@gmail.com");

  let roleDisplay = userStats.roleTitle || "Miễn phí";
  if (roleDisplay.includes("PRO VIP") || roleDisplay.includes("Gói Pro")) {
    roleDisplay = "Gói Pro";
  } else if (roleDisplay.includes("Starter")) {
    roleDisplay = "Gói Starter";
  } else if (roleDisplay.includes("Elite")) {
    roleDisplay = "Gói Elite";
  } else if (roleDisplay.includes("Ultimate")) {
    roleDisplay = "Gói Ultimate";
  }

  const updatedActiveUser: AdminUser = {
    id: "cus-real-01",
    name: userStats.name,
    email: "nguyenvana@gmail.com",
    phone: "0901.234.567",
    avatar: userStats.avatar,
    role: roleDisplay,
    workoutsCompleted: Math.max(12, userStats.streakDays),
    streakDays: userStats.streakDays,
    currentWeight: userStats.currentWeight,
    lastActive: "Đang online",
    status: "Hoạt động",
    createdAt: new Date().toLocaleDateString("vi-VN"),
  };

  let newList: AdminUser[];
  if (existingIndex >= 0) {
    newList = [...currentList];
    newList[existingIndex] = updatedActiveUser;
  } else {
    newList = [updatedActiveUser, ...currentList];
  }

  saveRealCustomers(newList);
  return newList;
}

export function registerNewCustomer(user: {
  name: string;
  email: string;
  phone?: string;
  role?: string;
}): AdminUser {
  const currentList = getRealCustomers();
  const existing = currentList.find(
    (u) => u.email.toLowerCase() === user.email.toLowerCase()
  );
  if (existing) {
    existing.name = user.name;
    if (user.phone) existing.phone = user.phone;
    existing.lastActive = "Đang online";
    saveRealCustomers(currentList);
    return existing;
  }

  const newUser: AdminUser = {
    id: `cus-real-${Date.now()}`,
    name: user.name,
    email: user.email,
    phone: user.phone || `09${Math.floor(10000000 + Math.random() * 90000000)}`,
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    role: user.role || "Miễn phí",
    workoutsCompleted: 1,
    streakDays: 1,
    currentWeight: 68,
    lastActive: "Đang online",
    status: "Hoạt động",
    createdAt: new Date().toLocaleDateString("vi-VN"),
  };

  const updated = [newUser, ...currentList];
  saveRealCustomers(updated);

  // Sync real-time with Supabase Cloud
  try {
    if (supabase) {
      supabase
        .from("customers")
        .upsert({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          avatar: newUser.avatar,
          role: newUser.role,
          status: newUser.status,
          workouts_completed: newUser.workoutsCompleted,
          streak_days: newUser.streakDays,
          current_weight: newUser.currentWeight,
        })
        .then(({ error }) => {
          if (error) console.warn("Supabase customer sync:", error.message);
        });
    }
  } catch (err) {
    console.warn("Supabase sync background:", err);
  }

  return newUser;
}
