import { X, Dumbbell, ShieldAlert, Flame } from "lucide-react";
import type { Exercise } from "../../types/fitness";

interface ExerciseDetailModalProps {
  exercise: Exercise;
  onClose: () => void;
  onStartExercise?: (exercise: Exercise) => void;
}

export default function ExerciseDetailModal({
  exercise,
  onClose,
  onStartExercise,
}: ExerciseDetailModalProps) {
  return (
    <div className="modal-backdrop-fullscreen" onClick={onClose}>
      <div className="modal-standard-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <Dumbbell size={20} className="modal-header-icon" />
            <div>
              <h3>{exercise.name}</h3>
              <span className="modal-header-sub">
                {exercise.targetMuscle} · {exercise.equipment}
              </span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="exercise-modal-body">
          {/* Key specs pills */}
          <div className="specs-pills-row">
            <div className="spec-pill">
              <span className="spec-label">Độ khó:</span>
              <strong className="spec-val">{exercise.difficulty}</strong>
            </div>
            <div className="spec-pill">
              <span className="spec-label">Khuyến nghị:</span>
              <strong className="spec-val">{exercise.reps}</strong>
            </div>
            <div className="spec-pill">
              <span className="spec-label">Thời gian nghỉ:</span>
              <strong className="spec-val">{exercise.restSeconds}s / hiệp</strong>
            </div>
          </div>

          {/* Instructions */}
          <div className="instructions-section">
            <h4>Các bước thực hiện chuẩn kỹ thuật:</h4>
            <ol className="instructions-numbered-list">
              {exercise.instructions.map((step, idx) => (
                <li key={idx}>
                  <span className="step-num">{idx + 1}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Pro Tips */}
          <div className="tips-box-callout">
            <div className="tips-icon">💡</div>
            <div className="tips-content">
              <strong>Mẹo từ HLV FitAI:</strong>
              <p>{exercise.tips}</p>
            </div>
          </div>

          {/* Common errors to avoid */}
          <div className="warning-box-callout">
            <ShieldAlert size={18} className="warn-icon" />
            <div>
              <strong>Lưu ý an toàn:</strong> Không đẩy tạ quá nặng dẫn đến sai form khớp. Hãy khởi động kỹ khớp vai và khuỷu tay trước khi vào hiệp chính.
            </div>
          </div>

          <div className="modal-actions-footer">
            <button
              className="primary-action-btn"
              onClick={() => {
                if (onStartExercise) onStartExercise(exercise);
                onClose();
              }}
            >
              <Flame size={16} /> Bắt đầu bài tập này ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
