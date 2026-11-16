import { useState } from "react";
import { X, Plus, Utensils, Search, Check } from "lucide-react";
import type { FoodItem } from "../../types/fitness";

interface AddFoodModalProps {
  onClose: () => void;
  onAddFood: (food: FoodItem) => void;
}

const foodPresets: Omit<FoodItem, "id">[] = [
  { name: "Ức gà áp chảo (200g)", category: "Bữa trưa", calories: 330, protein: 62, carbs: 0, fat: 7, portion: "200g", emoji: "🍗" },
  { name: "Cơm gạo lứt (1 chén)", category: "Bữa trưa", calories: 215, protein: 5, carbs: 45, fat: 2, portion: "150g", emoji: "🍚" },
  { name: "Trứng gà luộc (2 quả)", category: "Bữa sáng", calories: 140, protein: 13, carbs: 1, fat: 10, portion: "2 quả", emoji: "🥚" },
  { name: "Khoai lang hấp (1 củ)", category: "Bữa phụ", calories: 160, protein: 3, carbs: 37, fat: 0, portion: "180g", emoji: "🍠" },
  { name: "Whey Protein Isolate (1 muỗng)", category: "Bữa phụ", calories: 120, protein: 27, carbs: 2, fat: 1, portion: "32g", emoji: "🥤" },
  { name: "Cá hồi áp chảo (150g)", category: "Bữa tối", calories: 310, protein: 34, carbs: 0, fat: 18, portion: "150g", emoji: "🐟" },
  { name: "Yến mạch nấu sữa đậu nành", category: "Bữa sáng", calories: 280, protein: 12, carbs: 48, fat: 6, portion: "1 tô", emoji: "🥣" },
  { name: "Chuối tiêu chín (1 quả)", category: "Bữa phụ", calories: 105, protein: 1, carbs: 27, fat: 0, portion: "1 quả", emoji: "🍌" },
  { name: "Bò bít tết thăn nội (150g)", category: "Bữa tối", calories: 350, protein: 42, carbs: 0, fat: 20, portion: "150g", emoji: "🥩" },
];

export default function AddFoodModal({ onClose, onAddFood }: AddFoodModalProps) {
  const [activeCategory, setActiveCategory] = useState<FoodItem["category"]>("Bữa trưa");
  const [searchTerm, setSearchTerm] = useState("");
  const [customName, setCustomName] = useState("");
  const [customCalories, setCustomCalories] = useState("");
  const [customProtein, setCustomProtein] = useState("");
  const [customCarbs, setCustomCarbs] = useState("");
  const [customFat, setCustomFat] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);

  const filteredPresets = foodPresets.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectPreset = (preset: Omit<FoodItem, "id">) => {
    onAddFood({
      id: `food-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      ...preset,
      category: activeCategory,
    });
    onClose();
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    onAddFood({
      id: `food-${Date.now()}`,
      name: customName.trim(),
      category: activeCategory,
      calories: Number(customCalories) || 200,
      protein: Number(customProtein) || 15,
      carbs: Number(customCarbs) || 25,
      fat: Number(customFat) || 5,
      portion: "1 phần",
      emoji: "🥗",
    });
    onClose();
  };

  return (
    <div className="modal-backdrop-fullscreen" onClick={onClose}>
      <div className="modal-standard-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <Utensils size={20} className="modal-header-icon" />
            <h3>Ghi nhận món ăn</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Meal Category Selector */}
        <div className="meal-category-tabs">
          {(["Bữa sáng", "Bữa trưa", "Bữa tối", "Bữa phụ"] as const).map((cat) => (
            <button
              key={cat}
              className={`category-tab-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Toggle Mode */}
        <div className="mode-switch-tabs">
          <button
            className={`mode-btn ${!isCustomMode ? "active" : ""}`}
            onClick={() => setIsCustomMode(false)}
          >
            Từ thư viện món ăn
          </button>
          <button
            className={`mode-btn ${isCustomMode ? "active" : ""}`}
            onClick={() => setIsCustomMode(true)}
          >
            + Tự nhập món ăn
          </button>
        </div>

        {!isCustomMode ? (
          <div className="preset-food-section">
            <div className="food-search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Tìm món ăn nhanh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="preset-foods-list">
              {filteredPresets.map((food, idx) => (
                <div
                  key={idx}
                  className="preset-food-item"
                  onClick={() => handleSelectPreset(food)}
                >
                  <span className="food-emoji">{food.emoji}</span>
                  <div className="food-info-col">
                    <strong>{food.name}</strong>
                    <span>
                      P: {food.protein}g · C: {food.carbs}g · F: {food.fat}g
                    </span>
                  </div>
                  <div className="food-kcal-badge">
                    <strong>{food.calories}</strong> <small>kcal</small>
                  </div>
                  <button className="add-food-quick-btn" title="Thêm vào nhật ký">
                    <Plus size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form className="custom-food-form" onSubmit={handleAddCustom}>
            <label className="input-group">
              <span>Tên món ăn</span>
              <input
                type="text"
                required
                placeholder="Ví dụ: Phở bò tái lăn"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
            </label>

            <div className="form-grid-4">
              <label className="input-group">
                <span>Calo (kcal)</span>
                <input
                  type="number"
                  placeholder="350"
                  value={customCalories}
                  onChange={(e) => setCustomCalories(e.target.value)}
                />
              </label>
              <label className="input-group">
                <span>Protein (g)</span>
                <input
                  type="number"
                  placeholder="25"
                  value={customProtein}
                  onChange={(e) => setCustomProtein(e.target.value)}
                />
              </label>
              <label className="input-group">
                <span>Carbs (g)</span>
                <input
                  type="number"
                  placeholder="40"
                  value={customCarbs}
                  onChange={(e) => setCustomCarbs(e.target.value)}
                />
              </label>
              <label className="input-group">
                <span>Chất béo (g)</span>
                <input
                  type="number"
                  placeholder="10"
                  value={customFat}
                  onChange={(e) => setCustomFat(e.target.value)}
                />
              </label>
            </div>

            <button type="submit" className="modal-submit-btn">
              <Check size={18} /> Thêm vào {activeCategory}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
