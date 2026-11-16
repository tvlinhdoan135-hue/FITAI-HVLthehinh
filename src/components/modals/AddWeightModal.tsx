import { useState } from "react";
import { X, Scale, Check } from "lucide-react";
import type { WeightRecord } from "../../types/fitness";

interface AddWeightModalProps {
  onClose: () => void;
  onAddWeight: (record: WeightRecord) => void;
  currentWeight: number;
}

export default function AddWeightModal({
  onClose,
  onAddWeight,
  currentWeight,
}: AddWeightModalProps) {
  const [weight, setWeight] = useState(currentWeight.toString());
  const [bodyFat, setBodyFat] = useState("14.8");
  const [dateLabel, setDateLabel] = useState("Hôm nay");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numWeight = parseFloat(weight);
    if (isNaN(numWeight) || numWeight <= 20 || numWeight >= 300) {
      alert("Vui lòng nhập cân nặng hợp lệ (20kg - 300kg)");
      return;
    }

    onAddWeight({
      id: `w-${Date.now()}`,
      date: dateLabel,
      weight: numWeight,
      bodyFat: parseFloat(bodyFat) || undefined,
    });
    onClose();
  };

  return (
    <div className="modal-backdrop-fullscreen" onClick={onClose}>
      <div className="modal-standard-card small" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <Scale size={20} className="modal-header-icon" />
            <h3>Ghi nhận cân nặng</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="standard-modal-form">
          <label className="input-group">
            <span>Cân nặng (kg) *</span>
            <input
              type="number"
              step="0.1"
              required
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="56.2"
              autoFocus
            />
          </label>

          <label className="input-group">
            <span>Tỷ lệ mỡ cơ thể (%) - Không bắt buộc</span>
            <input
              type="number"
              step="0.1"
              value={bodyFat}
              onChange={(e) => setBodyFat(e.target.value)}
              placeholder="15.0"
            />
          </label>

          <label className="input-group">
            <span>Nhãn ngày ghi nhận</span>
            <input
              type="text"
              value={dateLabel}
              onChange={(e) => setDateLabel(e.target.value)}
              placeholder="CN hoặc 10/11"
            />
          </label>

          <button type="submit" className="modal-submit-btn">
            <Check size={18} /> Lưu chỉ số cân nặng
          </button>
        </form>
      </div>
    </div>
  );
}
