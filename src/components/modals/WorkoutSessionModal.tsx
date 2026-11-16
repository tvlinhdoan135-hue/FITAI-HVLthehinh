import { useState, useEffect } from "react";
import {
  X,
  Play,
  Pause,
  CheckCircle2,
  Trophy,
  Timer,
  Flame,
} from "lucide-react";
import type { Exercise } from "../../types/fitness";

interface WorkoutSessionModalProps {
  routineTitle: string;
  exercises: Exercise[];
  onClose: () => void;
  onFinishWorkout: (summary: { durationMinutes: number; caloriesBurned: number; xpEarned: number }) => void;
}

export default function WorkoutSessionModal({
  routineTitle,
  exercises,
  onClose,
  onFinishWorkout,
}: WorkoutSessionModalProps) {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState<{ [exerciseId: string]: boolean[] }>(() => {
    const initial: { [key: string]: boolean[] } = {};
    exercises.forEach((ex) => {
      initial[ex.id] = new Array(ex.sets).fill(false);
    });
    return initial;
  });

  // Rest Timer state
  const [restSecondsRemaining, setRestSecondsRemaining] = useState<number | null>(null);

  // Completed celebratory state
  const [isFinished, setIsFinished] = useState(false);

  // Main workout stopwatch
  useEffect(() => {
    let interval: any = null;
    if (isRunning && !isFinished) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isFinished]);

  // Rest timer countdown
  useEffect(() => {
    let restInterval: any = null;
    if (restSecondsRemaining !== null && restSecondsRemaining > 0) {
      restInterval = setInterval(() => {
        setRestSecondsRemaining((prev) => {
          if (prev === null || prev <= 1) return null;
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(restInterval);
  }, [restSecondsRemaining]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const currentExercise = exercises[currentExerciseIndex] || exercises[0];

  const handleToggleSet = (exId: string, setIdx: number) => {
    setCompletedSets((prev) => {
      const exSets = [...(prev[exId] || [])];
      const newState = !exSets[setIdx];
      exSets[setIdx] = newState;

      // If completing a set, trigger rest timer
      if (newState) {
        setRestSecondsRemaining(currentExercise.restSeconds || 60);
      }

      return { ...prev, [exId]: exSets };
    });
  };

  const handleCompleteAll = () => {
    setIsFinished(true);
    const durationMin = Math.max(1, Math.round(secondsElapsed / 60));
    const calBurned = Math.round(durationMin * 7.5);
    const xp = 150;

    setTimeout(() => {
      onFinishWorkout({
        durationMinutes: durationMin,
        caloriesBurned: calBurned,
        xpEarned: xp,
      });
      onClose();
    }, 2000);
  };

  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets, 0);
  const completedSetsCount = Object.values(completedSets).flat().filter(Boolean).length;
  const progressPercent = Math.round((completedSetsCount / (totalSets || 1)) * 100);

  return (
    <div className="modal-backdrop-fullscreen" onClick={onClose}>
      <div className="workout-session-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="session-header">
          <div className="session-header-left">
            <div className="live-pill-tag">
              <span className="live-dot" /> ĐANG TẬP
            </div>
            <h2 className="session-title">{routineTitle}</h2>
          </div>
          <button className="session-close-btn" onClick={onClose} aria-label="Đóng">
            <X size={22} />
          </button>
        </div>

        {/* Stopwatch & Calories Top Bar */}
        <div className="session-timer-bar">
          <div className="timer-stat-box">
            <Timer size={20} className="timer-icon" />
            <div className="timer-text-wrap">
              <span className="stat-label-tiny">THỜI GIAN</span>
              <strong className="timer-display">{formatTime(secondsElapsed)}</strong>
            </div>
          </div>

          <div className="timer-controls">
            <button
              className="timer-control-btn play-pause"
              onClick={() => setIsRunning((prev) => !prev)}
            >
              {isRunning ? <Pause size={18} /> : <Play size={18} />}
              <span>{isRunning ? "Tạm dừng" : "Tiếp tục"}</span>
            </button>
          </div>

          <div className="timer-stat-box right">
            <Flame size={20} className="flame-icon" />
            <div className="timer-text-wrap">
              <span className="stat-label-tiny">CALO ĐỐT</span>
              <strong className="timer-display">
                {Math.round((secondsElapsed / 60) * 7.5)} <small>kcal</small>
              </strong>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="session-overall-progress">
          <div className="progress-labels">
            <span>Tiến độ hoàn thành</span>
            <strong>{completedSetsCount} / {totalSets} hiệp ({progressPercent}%)</strong>
          </div>
          <div className="progress-track-bg">
            <div className="progress-track-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Rest Timer Banner (Floating when active) */}
        {restSecondsRemaining !== null && restSecondsRemaining > 0 && (
          <div className="rest-timer-banner">
            <div className="rest-info">
              <span className="rest-label">NGHỈ NGƠI PHỤC HỒI:</span>
              <strong className="rest-time-num">{formatTime(restSecondsRemaining)}</strong>
            </div>
            <div className="rest-actions">
              <button
                className="rest-add-btn"
                onClick={() => setRestSecondsRemaining((s) => (s ? s + 30 : 30))}
              >
                +30s
              </button>
              <button
                className="rest-skip-btn"
                onClick={() => setRestSecondsRemaining(null)}
              >
                Bỏ qua nghỉ
              </button>
            </div>
          </div>
        )}

        {/* Active Exercise Detail Card */}
        {currentExercise && (
          <div className="session-exercise-card">
            <div className="exercise-card-header">
              <div className="exercise-header-title">
                <span className="exercise-idx-badge">Bài {currentExerciseIndex + 1}/{exercises.length}</span>
                <h3>{currentExercise.name}</h3>
                <span className="exercise-muscle-tag">{currentExercise.targetMuscle}</span>
              </div>
              <div className="exercise-nav-btns">
                <button
                  className="nav-arrow-btn"
                  disabled={currentExerciseIndex === 0}
                  onClick={() => setCurrentExerciseIndex((i) => Math.max(0, i - 1))}
                >
                  ← Trước
                </button>
                <button
                  className="nav-arrow-btn"
                  disabled={currentExerciseIndex === exercises.length - 1}
                  onClick={() => setCurrentExerciseIndex((i) => Math.min(exercises.length - 1, i + 1))}
                >
                  Tiếp →
                </button>
              </div>
            </div>

            {/* Sets Tracker Table */}
            <div className="sets-tracker-table">
              <div className="sets-table-head">
                <span>HIỆP</span>
                <span>MỨC TẠ</span>
                <span>SỐ LẦN (REPS)</span>
                <span>TRẠNG THÁI</span>
              </div>

              {Array.from({ length: currentExercise.sets }).map((_, setIdx) => {
                const isDone = completedSets[currentExercise.id]?.[setIdx] ?? false;
                return (
                  <div key={setIdx} className={`sets-table-row ${isDone ? "completed" : ""}`}>
                    <div className="set-num-badge">Hiệp {setIdx + 1}</div>
                    <div className="set-weight-input">{currentExercise.weight || "Bodyweight"}</div>
                    <div className="set-reps-input">{currentExercise.reps.split("x")[1]?.trim() || "12 reps"}</div>
                    <button
                      className={`set-check-action-btn ${isDone ? "checked" : ""}`}
                      onClick={() => handleToggleSet(currentExercise.id, setIdx)}
                    >
                      {isDone ? (
                        <>
                          <CheckCircle2 size={16} /> Đã xong
                        </>
                      ) : (
                        "Hoàn thành"
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Exercise Instruction Tips */}
            <div className="exercise-tips-box">
              <strong>💡 Lưu ý kỹ thuật:</strong> {currentExercise.tips}
            </div>
          </div>
        )}

        {/* Exercises List Selector pills */}
        <div className="session-exercises-tabs">
          {exercises.map((ex, idx) => {
            const exSetsDone = (completedSets[ex.id] || []).filter(Boolean).length;
            const isAllDone = exSetsDone === ex.sets;
            const isActive = currentExerciseIndex === idx;

            return (
              <button
                key={ex.id}
                className={`exercise-tab-chip ${isActive ? "active" : ""} ${isAllDone ? "all-done" : ""}`}
                onClick={() => setCurrentExerciseIndex(idx)}
              >
                <span>{ex.name}</span>
                <span className="chip-sets-count">{exSetsDone}/{ex.sets}</span>
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="session-footer-actions">
          <button className="finish-workout-btn" onClick={handleCompleteAll}>
            {isFinished ? (
              <>
                <Trophy size={18} /> Đang lưu kết quả...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} /> Hoàn thành buổi tập
              </>
            )}
          </button>
        </div>

        {/* Celebratory Overlay */}
        {isFinished && (
          <div className="celebration-overlay">
            <div className="celebration-card">
              <div className="trophy-bounce">
                <Trophy size={60} className="gold-trophy" />
              </div>
              <h3>Xuất sắc! Buổi tập hoàn thành!</h3>
              <p>Bạn vừa đốt cháy khoảng {Math.round((secondsElapsed / 60) * 7.5)} calo và nhận +150 XP.</p>
              <div className="celebration-badge">+1 Ngày duy trì chuỗi kỷ luật!</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
