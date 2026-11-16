import { useState } from "react";
import {
  Search,
  Plus,
  Dumbbell,
  Edit3,
  Trash2,
  X,
  Eye,
} from "lucide-react";
import type { Exercise } from "../../types/fitness";

interface AdminExercisesViewProps {
  exercises: Exercise[];
  onAddExercise: (ex: Exercise) => void;
  onUpdateExercise?: (ex: Exercise) => void;
  onDeleteExercise: (id: string) => void;
}

export default function AdminExercisesView({
  exercises,
  onAddExercise,
  onUpdateExercise,
  onDeleteExercise,
}: AdminExercisesViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [muscleFilter, setMuscleFilter] = useState("Tất cả");
  const [equipmentFilter, setEquipmentFilter] = useState("Tất cả");
  const [difficultyFilter, setDifficultyFilter] = useState("Tất cả");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEx, setEditingEx] = useState<Exercise | null>(null);
  const [previewEx, setPreviewEx] = useState<Exercise | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formMuscle, setFormMuscle] = useState("Ngực");
  const [formEquipment, setFormEquipment] = useState("Tạ đòn");
  const [formDifficulty, setFormDifficulty] = useState<"Người mới" | "Trung bình" | "Nâng cao">("Trung bình");
  const [formSets, setFormSets] = useState("3");
  const [formReps, setFormReps] = useState("3 x 12 reps");
  const [formRest, setFormRest] = useState("60");
  const [formTips, setFormTips] = useState("");
  const [formInstructions, setFormInstructions] = useState("Khởi động kỹ\nGiữ thẳng lưng và gồng cơ bụng");

  // Filter logic
  const filteredExercises = exercises.filter((ex) => {
    const matchSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchMuscle = muscleFilter === "Tất cả" || ex.targetMuscle === muscleFilter;
    const matchEquip = equipmentFilter === "Tất cả" || ex.equipment === equipmentFilter;
    const matchDiff = difficultyFilter === "Tất cả" || ex.difficulty === difficultyFilter;
    return matchSearch && matchMuscle && matchEquip && matchDiff;
  });

  const handleCreateExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newEx: Exercise = {
      id: `ex-admin-${Date.now()}`,
      name: formName.trim(),
      targetMuscle: formMuscle,
      equipment: formEquipment,
      difficulty: formDifficulty,
      sets: parseInt(formSets) || 3,
      reps: formReps.trim() || "3 x 12 reps",
      restSeconds: parseInt(formRest) || 60,
      instructions: formInstructions.split("\n").filter((s) => s.trim().length > 0),
      tips: formTips.trim() || "Kiểm soát nhịp thở và biên độ chuyển động.",
    };

    onAddExercise(newEx);
    resetForm();
    setShowAddModal(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEx || !onUpdateExercise) return;

    onUpdateExercise(editingEx);
    setEditingEx(null);
  };

  const resetForm = () => {
    setFormName("");
    setFormMuscle("Ngực");
    setFormEquipment("Tạ đòn");
    setFormDifficulty("Trung bình");
    setFormSets("3");
    setFormReps("3 x 12 reps");
    setFormRest("60");
    setFormTips("");
    setFormInstructions("Khởi động kỹ\nGiữ thẳng lưng và gồng cơ bụng");
  };

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Quản lý Chương trình tập & Thư viện bài tập</h2>
          <p className="admin-page-desc">
            Quản trị kho dữ liệu {exercises.length} bài tập thể hình, chỉnh sửa thông số kỹ thuật và bộ giáo trình mẫu.
          </p>
        </div>
        <button
          className="admin-primary-btn"
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
        >
          <Plus size={18} />
          <span>Thêm bài tập mới</span>
        </button>
      </div>

      {/* Program Templates Highlights */}
      <div className="admin-program-templates-grid">
        <div className="admin-template-card">
          <div className="template-badge">Mẫu phổ biến</div>
          <h4 className="template-title">Push - Pull - Legs (6 ngày)</h4>
          <p className="template-desc">Giáo trình Hypertrophy kinh điển chia theo nhóm cơ đẩy, kéo và chân.</p>
          <div className="template-meta">
            <span>24 bài tập</span> · <span>Trung bình & Nâng cao</span>
          </div>
        </div>

        <div className="admin-template-card">
          <div className="template-badge blue">Hiệu quả cao</div>
          <h4 className="template-title">Upper - Lower Split (4 ngày)</h4>
          <p className="template-desc">Cân bằng tối ưu giữa kích thích phát triển cơ bắp và ngày nghỉ phục hồi.</p>
          <div className="template-meta">
            <span>18 bài tập</span> · <span>Mọi cấp độ</span>
          </div>
        </div>

        <div className="admin-template-card">
          <div className="template-badge green">Người mới bắt đầu</div>
          <h4 className="template-title">Full Body Cơ bản (3 ngày)</h4>
          <p className="template-desc">Tập trung các chuyển động phức hợp đa khớp giúp xây dựng nền tảng vững chắc.</p>
          <div className="template-meta">
            <span>12 bài tập</span> · <span>Người mới</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="admin-filter-bar">
        <div className="admin-filter-search">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm theo tên bài tập..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="admin-filter-selects">
          <select
            value={muscleFilter}
            onChange={(e) => setMuscleFilter(e.target.value)}
            className="admin-select"
          >
            <option value="Tất cả">Tất cả nhóm cơ</option>
            <option value="Ngực">Ngực</option>
            <option value="Lưng">Lưng</option>
            <option value="Chân">Chân</option>
            <option value="Vai">Vai</option>
            <option value="Tay trước">Tay trước</option>
            <option value="Tay sau">Tay sau</option>
            <option value="Bụng">Bụng</option>
            <option value="Toàn thân">Toàn thân</option>
          </select>

          <select
            value={equipmentFilter}
            onChange={(e) => setEquipmentFilter(e.target.value)}
            className="admin-select"
          >
            <option value="Tất cả">Mọi thiết bị</option>
            <option value="Tạ đòn">Tạ đòn</option>
            <option value="Tạ đơn">Tạ đơn</option>
            <option value="Máy tập">Máy tập</option>
            <option value="Bodyweight">Bodyweight</option>
            <option value="Dây cáp">Dây cáp</option>
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="admin-select"
          >
            <option value="Tất cả">Mọi độ khó</option>
            <option value="Người mới">Người mới</option>
            <option value="Trung bình">Trung bình</option>
            <option value="Nâng cao">Nâng cao</option>
          </select>
        </div>
      </div>

      {/* Exercise Table */}
      <div className="admin-table-card">
        <div className="admin-table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Bài tập</th>
                <th>Nhóm cơ</th>
                <th>Thiết bị</th>
                <th>Độ khó</th>
                <th>Hiệp x Số lần</th>
                <th>Nghỉ</th>
                <th>Mẹo kỹ thuật</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredExercises.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-muted">
                    Không tìm thấy bài tập nào khớp với từ khóa tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredExercises.map((ex) => (
                  <tr key={ex.id}>
                    <td>
                      <div className="admin-ex-cell">
                        <div className="admin-ex-icon">
                          <Dumbbell size={16} color="#a855f7" />
                        </div>
                        <span className="admin-ex-name">{ex.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="admin-muscle-pill">{ex.targetMuscle}</span>
                    </td>
                    <td>{ex.equipment}</td>
                    <td>
                      <span
                        className={`admin-badge difficulty ${
                          ex.difficulty === "Nâng cao"
                            ? "hard"
                            : ex.difficulty === "Trung bình"
                            ? "medium"
                            : "easy"
                        }`}
                      >
                        {ex.difficulty}
                      </span>
                    </td>
                    <td>{ex.reps}</td>
                    <td>{ex.restSeconds}s</td>
                    <td className="text-muted text-sm max-w-xs truncate">{ex.tips}</td>
                    <td>
                      <div className="admin-row-actions">
                        <button
                          className="admin-action-btn view"
                          title="Xem trước"
                          onClick={() => setPreviewEx(ex)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="admin-action-btn edit"
                          title="Chỉnh sửa"
                          onClick={() => setEditingEx(ex)}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          className="admin-action-btn delete"
                          title="Xóa bài tập"
                          onClick={() => {
                            if (confirm(`Bạn có chắc chắn muốn xóa bài '${ex.name}'?`)) {
                              onDeleteExercise(ex.id);
                            }
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Thêm bài tập mới */}
      {showAddModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Thêm bài tập mới vào hệ thống</h3>
              <button className="admin-modal-close" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateExercise} className="admin-modal-form">
              <div className="admin-form-group">
                <label>Tên bài tập</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Barbell Incline Bench Press"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Nhóm cơ chính</label>
                  <select
                    value={formMuscle}
                    onChange={(e) => setFormMuscle(e.target.value)}
                  >
                    <option value="Ngực">Ngực</option>
                    <option value="Lưng">Lưng</option>
                    <option value="Chân">Chân</option>
                    <option value="Vai">Vai</option>
                    <option value="Tay trước">Tay trước</option>
                    <option value="Tay sau">Tay sau</option>
                    <option value="Bụng">Bụng</option>
                    <option value="Toàn thân">Toàn thân</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Thiết bị</label>
                  <select
                    value={formEquipment}
                    onChange={(e) => setFormEquipment(e.target.value)}
                  >
                    <option value="Tạ đòn">Tạ đòn</option>
                    <option value="Tạ đơn">Tạ đơn</option>
                    <option value="Máy tập">Máy tập</option>
                    <option value="Bodyweight">Bodyweight</option>
                    <option value="Dây cáp">Dây cáp</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Độ khó</label>
                  <select
                    value={formDifficulty}
                    onChange={(e) =>
                      setFormDifficulty(
                        e.target.value as "Người mới" | "Trung bình" | "Nâng cao"
                      )
                    }
                  >
                    <option value="Người mới">Người mới</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Nâng cao">Nâng cao</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Khuyến nghị Reps</label>
                  <input
                    type="text"
                    value={formReps}
                    onChange={(e) => setFormReps(e.target.value)}
                    placeholder="3 x 12 reps"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Thời gian nghỉ (s)</label>
                  <input
                    type="number"
                    value={formRest}
                    onChange={(e) => setFormRest(e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Mẹo kỹ thuật phòng tránh chấn thương</label>
                <input
                  type="text"
                  placeholder="Gồng cơ bụng, hạ tạ kiểm soát 3 giây..."
                  value={formTips}
                  onChange={(e) => setFormTips(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label>Các bước thực hiện (Mỗi dòng một bước)</label>
                <textarea
                  rows={3}
                  value={formInstructions}
                  onChange={(e) => setFormInstructions(e.target.value)}
                />
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="admin-primary-btn">
                  Lưu bài tập
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Chỉnh sửa bài tập */}
      {editingEx && (
        <div className="admin-modal-backdrop" onClick={() => setEditingEx(null)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Chỉnh sửa bài tập: {editingEx.name}</h3>
              <button className="admin-modal-close" onClick={() => setEditingEx(null)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="admin-modal-form">
              <div className="admin-form-group">
                <label>Tên bài tập</label>
                <input
                  type="text"
                  value={editingEx.name}
                  onChange={(e) => setEditingEx({ ...editingEx, name: e.target.value })}
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Nhóm cơ</label>
                  <input
                    type="text"
                    value={editingEx.targetMuscle}
                    onChange={(e) =>
                      setEditingEx({ ...editingEx, targetMuscle: e.target.value })
                    }
                  />
                </div>
                <div className="admin-form-group">
                  <label>Thiết bị</label>
                  <input
                    type="text"
                    value={editingEx.equipment}
                    onChange={(e) =>
                      setEditingEx({ ...editingEx, equipment: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Reps</label>
                  <input
                    type="text"
                    value={editingEx.reps}
                    onChange={(e) => setEditingEx({ ...editingEx, reps: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Nghỉ (giây)</label>
                  <input
                    type="number"
                    value={editingEx.restSeconds}
                    onChange={(e) =>
                      setEditingEx({
                        ...editingEx,
                        restSeconds: parseInt(e.target.value) || 60,
                      })
                    }
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Lưu ý kỹ thuật</label>
                <input
                  type="text"
                  value={editingEx.tips}
                  onChange={(e) => setEditingEx({ ...editingEx, tips: e.target.value })}
                />
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setEditingEx(null)}
                >
                  Đóng
                </button>
                <button type="submit" className="admin-primary-btn">
                  Cập nhật thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Xem trước bài tập */}
      {previewEx && (
        <div className="admin-modal-backdrop" onClick={() => setPreviewEx(null)}>
          <div className="admin-modal-box user-detail" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Chi tiết kỹ thuật bài tập</h3>
              <button className="admin-modal-close" onClick={() => setPreviewEx(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="admin-preview-content">
              <h4>{previewEx.name}</h4>
              <div className="preview-tags">
                <span className="admin-muscle-pill">{previewEx.targetMuscle}</span>
                <span className="admin-badge role pro">{previewEx.equipment}</span>
                <span className="admin-badge difficulty medium">{previewEx.difficulty}</span>
              </div>
              <p className="preview-tips">💡 <strong>Mẹo:</strong> {previewEx.tips}</p>
              <div className="preview-steps">
                <strong>Các bước thực hiện:</strong>
                <ol>
                  {previewEx.instructions.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
            <div className="admin-modal-actions">
              <button className="admin-primary-btn" onClick={() => setPreviewEx(null)}>
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
