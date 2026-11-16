import { useState } from "react";
import {
  Edit3,
  Award,
  Flame,
  Clock,
  Target,
  Dumbbell,
  Scale,
  Check,
  X,
} from "lucide-react";
import type { UserStats } from "../../types/fitness";

interface ProfileViewProps {
  userStats: UserStats;
  onUpdateUserStats: (updated: Partial<UserStats>) => void;
}

export default function ProfileView({
  userStats,
  onUpdateUserStats,
}: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userStats.name);
  const [weight, setWeight] = useState(userStats.currentWeight.toString());
  const [targetWeight, setTargetWeight] = useState(userStats.targetWeight.toString());
  const [height, setHeight] = useState(userStats.height.toString());
  const [age, setAge] = useState(userStats.age.toString());
  const [gender, setGender] = useState<"Nam" | "Nữ">(userStats.gender);
  const [goal, setGoal] = useState(userStats.goal);
  const [experience, setExperience] = useState(userStats.experienceLevel);

  // BMI Calculation
  const heightM = userStats.height / 100;
  const bmi = (userStats.currentWeight / (heightM * heightM)).toFixed(1);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUserStats({
      name: name.trim() || userStats.name,
      currentWeight: parseFloat(weight) || userStats.currentWeight,
      targetWeight: parseFloat(targetWeight) || userStats.targetWeight,
      height: parseFloat(height) || userStats.height,
      age: parseInt(age) || userStats.age,
      gender,
      goal,
      experienceLevel: experience,
    });
    setIsEditing(false);
  };

  return (
    <div className="profile-page-container">
      {/* 1. Profile Banner Hero */}
      <div className="profile-hero-card">
        <div className="profile-hero-bg-glow" />

        <div className="profile-hero-content">
          <div className="profile-avatar-outer">
            <img src={userStats.avatar} alt={userStats.name} className="profile-avatar-large" />
            <span className="profile-level-badge">{userStats.levelTitle}</span>
          </div>

          <div className="profile-info-column">
            <div className="profile-name-row">
              <h2>{userStats.name}</h2>
              <span className="profile-role-pill">{userStats.roleTitle}</span>
            </div>
            <p className="profile-bio-text">
              "Kỷ luật là cầu nối giữa mục tiêu và thành tựu. Quyết tâm tăng 5kg cơ nạc trong 6 tháng tới! 💪"
            </p>
            <div className="profile-meta-chips">
              <span>📅 Tham gia: Tháng 09/2026</span>
              <span>🔥 Chuỗi streak: {userStats.streakDays} ngày</span>
              <span>⚡ Tổng XP: {userStats.xp.toLocaleString()}</span>
            </div>
          </div>

          <div className="profile-action-col">
            <button
              className="edit-profile-btn"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 size={16} /> Chỉnh sửa thông tin
            </button>
          </div>
        </div>
      </div>

      {/* 2. Lifetime Highlights Grid */}
      <div className="lifetime-stats-grid">
        <div className="lifetime-stat-card">
          <div className="lifetime-icon purple">
            <Flame size={22} />
          </div>
          <div className="lifetime-info">
            <span className="lifetime-label">Tổng Calo tiêu thụ</span>
            <strong>12,480 <small>kcal</small></strong>
            <span className="lifetime-sub">Kể từ khi tham gia FitAI</span>
          </div>
        </div>

        <div className="lifetime-stat-card">
          <div className="lifetime-icon blue">
            <Clock size={22} />
          </div>
          <div className="lifetime-info">
            <span className="lifetime-label">Thời gian tập luyện</span>
            <strong>24.5 <small>giờ</small></strong>
            <span className="lifetime-sub">18 buổi tập hoàn thành</span>
          </div>
        </div>

        <div className="lifetime-stat-card">
          <div className="lifetime-icon amber">
            <Award size={22} />
          </div>
          <div className="lifetime-info">
            <span className="lifetime-label">Huy hiệu đạt được</span>
            <strong>3 <small>danh hiệu</small></strong>
            <span className="lifetime-sub">Bậc I: Tân Binh Bền Bỉ</span>
          </div>
        </div>

        <div className="lifetime-stat-card">
          <div className="lifetime-icon green">
            <Target size={22} />
          </div>
          <div className="lifetime-info">
            <span className="lifetime-label">Chỉ số BMI hiện tại</span>
            <strong>{bmi} <small>kg/m²</small></strong>
            <span className="lifetime-sub">Thể trạng cân đối</span>
          </div>
        </div>
      </div>

      {/* 3. Physical Attributes & Fitness Preferences */}
      <div className="profile-details-split">
        {/* Physical Stats */}
        <div className="details-card">
          <div className="details-card-header">
            <Scale size={18} className="text-purple" />
            <h3>Chỉ số thể hình cá nhân</h3>
          </div>

          <div className="attributes-list">
            <div className="attribute-row">
              <span>Chiều cao</span>
              <strong>{userStats.height} cm</strong>
            </div>
            <div className="attribute-row">
              <span>Cân nặng hiện tại</span>
              <strong>{userStats.currentWeight} kg</strong>
            </div>
            <div className="attribute-row">
              <span>Cân nặng mục tiêu</span>
              <strong>{userStats.targetWeight} kg</strong>
            </div>
            <div className="attribute-row">
              <span>Tuổi & Giới tính</span>
              <strong>{userStats.age} tuổi · {userStats.gender}</strong>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="details-card">
          <div className="details-card-header">
            <Dumbbell size={18} className="text-purple" />
            <h3>Mục tiêu & Sở thích tập luyện</h3>
          </div>

          <div className="attributes-list">
            <div className="attribute-row">
              <span>Mục tiêu chính</span>
              <strong>{userStats.goal}</strong>
            </div>
            <div className="attribute-row">
              <span>Kinh nghiệm thể hình</span>
              <strong>{userStats.experienceLevel}</strong>
            </div>
            <div className="attribute-row">
              <span>Số buổi tập đề xuất</span>
              <strong>4 - 5 buổi / tuần</strong>
            </div>
            <div className="attribute-row">
              <span>Địa điểm & Thiết bị</span>
              <strong>Phòng Gym tiêu chuẩn đầy đủ thiết bị</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="modal-backdrop-fullscreen" onClick={() => setIsEditing(false)}>
          <div className="modal-standard-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title">
                <Edit3 size={20} className="modal-header-icon" />
                <h3>Chỉnh sửa hồ sơ cá nhân</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsEditing(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="standard-modal-form">
              <label className="input-group">
                <span>Họ và tên</span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>

              <div className="form-grid-2">
                <label className="input-group">
                  <span>Cân nặng hiện tại (kg)</span>
                  <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </label>
                <label className="input-group">
                  <span>Cân nặng mục tiêu (kg)</span>
                  <input
                    type="number"
                    step="0.1"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(e.target.value)}
                  />
                </label>
              </div>

              <div className="form-grid-3">
                <label className="input-group">
                  <span>Chiều cao (cm)</span>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </label>
                <label className="input-group">
                  <span>Tuổi</span>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </label>
                <label className="input-group">
                  <span>Giới tính</span>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as "Nam" | "Nữ")}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </label>
              </div>

              <label className="input-group">
                <span>Mục tiêu thể hình</span>
                <select value={goal} onChange={(e) => setGoal(e.target.value)}>
                  <option value="Tăng cơ nạc & Tăng sức bền">Tăng cơ nạc & Tăng sức bền (Lean Bulk)</option>
                  <option value="Giảm mỡ & Giữ cơ nạc">Giảm mỡ & Giữ cơ nạc (Cut / Fat Loss)</option>
                  <option value="Tái tạo thể chất (Body Recomposition)">Tái tạo thể chất (Body Recomposition)</option>
                  <option value="Tăng sức mạnh tối đa (Powerlifting)">Tăng sức mạnh tối đa (Powerlifting)</option>
                </select>
              </label>

              <label className="input-group">
                <span>Kinh nghiệm tập luyện</span>
                <select value={experience} onChange={(e) => setExperience(e.target.value)}>
                  <option value="Người mới (< 6 tháng)">Người mới (&lt; 6 tháng)</option>
                  <option value="Trung bình (1 - 2 năm)">Trung bình (1 - 2 năm)</option>
                  <option value="Nâng cao (> 3 năm)">Nâng cao (&gt; 3 năm)</option>
                </select>
              </label>

              <button type="submit" className="modal-submit-btn">
                <Check size={18} /> Lưu thay đổi hồ sơ
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
