import { useState } from "react";
import {
  Calendar,
  Clock,
  Dumbbell,
  Play,
  Info,
  Sparkles,
  Flame,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import type { WorkoutDay, Exercise } from "../../types/fitness";

interface WorkoutsViewProps {
  weeklyProgram: WorkoutDay[];
  onStartWorkout: (day: WorkoutDay) => void;
  onOpenExerciseDetail: (exercise: Exercise) => void;
  onOpenAICoach: () => void;
}

export default function WorkoutsView({
  weeklyProgram,
  onStartWorkout,
  onOpenExerciseDetail,
  onOpenAICoach,
}: WorkoutsViewProps) {
  const [selectedDayId, setSelectedDayId] = useState<string>(weeklyProgram[0]?.id || "day-push");

  const currentDay = weeklyProgram.find((d) => d.id === selectedDayId) || weeklyProgram[0];

  // Calculate weekly stats
  const totalTrainingDays = weeklyProgram.filter((d) => !d.isRest).length;
  const totalRestDays = weeklyProgram.filter((d) => d.isRest).length;
  const totalDurationMinutes = weeklyProgram.reduce((acc, d) => acc + (d.durationMinutes || 0), 0);
  const totalExercisesCount = weeklyProgram.reduce((acc, d) => acc + (d.exercises ? d.exercises.length : 0), 0);

  return (
    <div className="workouts-page-container">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <span className="page-eyebrow-tag">KẾ HOẠCH & LỊCH TẬP LUYỆN THEO TUẦN</span>
          <h1 className="page-main-title">Lịch Tập Luyện FitAI</h1>
          <p className="page-sub-desc">
            Giáo trình phân bổ thông minh từ Thứ Hai đến Chủ Nhật. Đảm bảo kích thích cơ bắp tối đa và phục hồi 48 - 72h khoa học.
          </p>
        </div>
        <div className="page-header-actions">
          <button className="ask-ai-plan-btn" onClick={onOpenAICoach}>
            <Sparkles size={16} /> Nhờ HLV AI tối ưu lịch tuần
          </button>
        </div>
      </div>

      {/* Weekly Stats Summary Bar */}
      <div className="schedule-summary-bar">
        <div className="sched-stat-item">
          <div className="sched-stat-icon purple">
            <Calendar size={18} />
          </div>
          <div className="sched-stat-text">
            <span className="sched-stat-label">Số buổi tập</span>
            <strong className="sched-stat-val">{totalTrainingDays} buổi / tuần</strong>
          </div>
        </div>

        <div className="sched-stat-item">
          <div className="sched-stat-icon blue">
            <Clock size={18} />
          </div>
          <div className="sched-stat-text">
            <span className="sched-stat-label">Thời lượng tập</span>
            <strong className="sched-stat-val">{(totalDurationMinutes / 60).toFixed(1)} giờ</strong>
          </div>
        </div>

        <div className="sched-stat-item">
          <div className="sched-stat-icon amber">
            <Dumbbell size={18} />
          </div>
          <div className="sched-stat-text">
            <span className="sched-stat-label">Tổng bài tập</span>
            <strong className="sched-stat-val">{totalExercisesCount} bài</strong>
          </div>
        </div>

        <div className="sched-stat-item">
          <div className="sched-stat-icon emerald">
            <Flame size={18} />
          </div>
          <div className="sched-stat-text">
            <span className="sched-stat-label">Calo tiêu hao tuần</span>
            <strong className="sched-stat-val">~2,250 kcal</strong>
          </div>
        </div>

        <div className="sched-stat-item">
          <div className="sched-stat-icon teal">
            <ShieldCheck size={18} />
          </div>
          <div className="sched-stat-text">
            <span className="sched-stat-label">Ngày phục hồi</span>
            <strong className="sched-stat-val">{totalRestDays} ngày nghỉ</strong>
          </div>
        </div>
      </div>

      {/* 1. Weekday Selector Carousel / Row */}
      <div className="weekday-selector-bar">
        {weeklyProgram.map((day) => {
          const isSelected = day.id === selectedDayId;
          return (
            <button
              key={day.id}
              className={`weekday-tab-card ${isSelected ? "selected" : ""} ${day.isRest ? "rest-day" : ""}`}
              onClick={() => setSelectedDayId(day.id)}
            >
              <span className="weekday-tag">{day.dayName}</span>
              <strong className="weekday-name">{day.dayTitle}</strong>
              <span className="weekday-plan-short">
                {day.isRest ? "Nghỉ ngơi" : day.title.split("–")[0]?.trim()}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Active Day Workout Plan Card */}
      {currentDay && (
        <div className="active-day-plan-card">
          <div className="day-plan-topline">
            <div className="day-plan-title-col">
              <div className="day-badge">
                <Calendar size={15} /> {currentDay.dayTitle} ({currentDay.dayName})
              </div>
              <h2>{currentDay.title}</h2>
              <p className="day-focus-text">
                <strong>Trọng tâm phát triển:</strong> {currentDay.focus}
              </p>
            </div>

            <div className="day-plan-meta-stats">
              <div className="day-meta-pill">
                <Clock size={16} />
                <span>{currentDay.durationMinutes} phút</span>
              </div>
              <div className="day-meta-pill">
                <Dumbbell size={16} />
                <span>{currentDay.exercises.length} bài tập</span>
              </div>
              {!currentDay.isRest && (
                <button
                  className="start-day-workout-btn"
                  onClick={() => onStartWorkout(currentDay)}
                >
                  <Play size={16} fill="currentColor" /> Bắt đầu buổi tập này
                </button>
              )}
            </div>
          </div>

          {currentDay.isRest ? (
            <div className="rest-day-notice">
              <div className="rest-icon">🧘‍♂️</div>
              <h3>Hôm nay là ngày nghỉ ngơi phục hồi cơ bắp</h3>
              <p>
                Cơ bắp chỉ thực sự phát triển và thích nghi trong lúc nghỉ ngơi và ngủ đủ giấc. Hãy duy trì đủ lượng nước (2 - 2.5 lít), nạp đủ protein và ngủ sớm để cơ thể sẵn sàng cho buổi tập bùng nổ tiếp theo!
              </p>
            </div>
          ) : (
            <div className="day-exercises-list">
              {currentDay.exercises.map((ex, idx) => (
                <div
                  key={ex.id}
                  className="day-exercise-row"
                  onClick={() => onOpenExerciseDetail(ex)}
                >
                  <div className="exercise-idx-circle">{idx + 1}</div>
                  <div className="exercise-info-col">
                    <div className="exercise-name-row">
                      <strong>{ex.name}</strong>
                      <span className="muscle-pill">{ex.targetMuscle}</span>
                      <span className="diff-pill">{ex.difficulty}</span>
                    </div>
                    <div className="exercise-meta-sub">
                      <span>{ex.equipment}</span>
                      <span className="dot-sep">·</span>
                      <span>Mức tạ: {ex.weight || "Bodyweight"}</span>
                      <span className="dot-sep">·</span>
                      <span>Nghỉ giữa hiệp: {ex.restSeconds}s</span>
                    </div>
                  </div>
                  <div className="exercise-sets-reps-badge">
                    <strong>{ex.sets} hiệp</strong>
                    <span>{ex.reps.split("x")[1] || ex.reps}</span>
                  </div>
                  <button
                    className="view-exercise-guide-btn"
                    title="Xem chi tiết kỹ thuật"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenExerciseDetail(ex);
                    }}
                  >
                    <Info size={17} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Scientific Workout Principles & Split Tips */}
      <div className="schedule-tips-container">
        <div className="sched-tip-card">
          <div className="tip-header">
            <CheckCircle2 size={18} className="text-purple-400" />
            <h4>Nguyên lý lũy tiến tải trọng (Progressive Overload)</h4>
          </div>
          <p>
            Để cơ bắp không ngừng phát triển, hãy cố gắng tăng thêm 1 - 2.5kg tạ hoặc thêm 1 rep sau mỗi 1-2 tuần khi bạn đã làm chủ được kỹ thuật của hiệp tập trước đó.
          </p>
        </div>

        <div className="sched-tip-card">
          <div className="tip-header">
            <TrendingUp size={18} className="text-emerald-400" />
            <h4>Quy tắc phục hồi siêu bù (Supercompensation)</h4>
          </div>
          <p>
            Mỗi nhóm cơ sau khi tập nặng cần tối thiểu 48 - 72 giờ để sửa chữa các vi tổn thương sợi cơ và tổng hợp protein mới. Lịch tập trên đã được AI tính toán tránh tập trùng nhóm cơ 2 ngày liên tiếp.
          </p>
        </div>
      </div>
    </div>
  );
}
