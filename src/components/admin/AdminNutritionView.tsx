import { useState } from "react";
import {
  Search,
  Plus,
  Trash2,
  X,
  Utensils,
} from "lucide-react";
import type { NutritionPreset } from "../../types/admin";
import type { FoodItem } from "../../types/fitness";

interface AdminNutritionViewProps {
  presets: NutritionPreset[];
  foods: FoodItem[];
  onAddFood: (food: FoodItem) => void;
  onDeleteFood: (id: string) => void;
}

export default function AdminNutritionView({
  presets,
  foods,
  onAddFood,
  onDeleteFood,
}: AdminNutritionViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);

  // New Food Form State
  const [foodName, setFoodName] = useState("");
  const [foodCalories, setFoodCalories] = useState("165");
  const [foodProtein, setFoodProtein] = useState("31");
  const [foodCarbs, setFoodCarbs] = useState("0");
  const [foodFat, setFoodFat] = useState("3.6");
  const [foodServing, setFoodServing] = useState("100g");

  const filteredFoods = foods.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) return;

    const newFood: FoodItem = {
      id: `food-admin-${Date.now()}`,
      name: foodName.trim(),
      category: "Bữa trưa",
      calories: parseInt(foodCalories) || 150,
      protein: parseFloat(foodProtein) || 20,
      carbs: parseFloat(foodCarbs) || 10,
      fat: parseFloat(foodFat) || 5,
      portion: foodServing.trim() || "100g",
      emoji: "🥗",
    };

    onAddFood(newFood);
    setFoodName("");
    setFoodCalories("165");
    setFoodProtein("31");
    setFoodCarbs("0");
    setFoodFat("3.6");
    setShowAddFoodModal(false);
  };

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Quản lý Dinh dưỡng & Thực đơn chuẩn</h2>
          <p className="admin-page-desc">
            Cấu hình bộ thực đơn mẫu theo trường phái khoa học và danh mục thực phẩm giàu dưỡng chất.
          </p>
        </div>
        <button
          className="admin-primary-btn"
          onClick={() => setShowAddFoodModal(true)}
        >
          <Plus size={18} />
          <span>Thêm món ăn vào thư viện</span>
        </button>
      </div>

      {/* Preset Diet Cards */}
      <div className="admin-nutrition-presets-grid">
        {presets.map((preset) => (
          <div key={preset.id} className="admin-preset-card">
            <div className="preset-top-row">
              <span className={`preset-category-pill ${preset.category.toLowerCase().replace(/\s+/g, "-")}`}>
                {preset.category}
              </span>
              <span className="preset-meals-count">{preset.mealsCount} bữa/ngày</span>
            </div>
            <h4 className="preset-name">{preset.name}</h4>
            <p className="preset-desc">{preset.description}</p>

            <div className="preset-macros-breakdown">
              <div className="macro-col calories">
                <span className="val">{preset.targetCalories}</span>
                <span className="lbl">Kcal</span>
              </div>
              <div className="macro-col protein">
                <span className="val">{preset.proteinGrams}g</span>
                <span className="lbl">Đạm</span>
              </div>
              <div className="macro-col carbs">
                <span className="val">{preset.carbsGrams}g</span>
                <span className="lbl">Carbs</span>
              </div>
              <div className="macro-col fat">
                <span className="val">{preset.fatGrams}g</span>
                <span className="lbl">Fat</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search Bar for Foods */}
      <div className="admin-filter-bar">
        <div className="admin-filter-search">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm món ăn trong kho dữ liệu dinh dưỡng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Foods Table */}
      <div className="admin-table-card">
        <div className="admin-table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Món ăn / Thực phẩm</th>
                <th>Khẩu phần chuẩn</th>
                <th>Năng lượng (Calo)</th>
                <th>Protein (Đạm)</th>
                <th>Carbs (Tinh bột)</th>
                <th>Chất béo (Fat)</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredFoods.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-muted">
                    Chưa có món ăn nào trong danh mục.
                  </td>
                </tr>
              ) : (
                filteredFoods.map((f) => (
                  <tr key={f.id}>
                    <td>
                      <div className="admin-food-cell">
                        <Utensils size={16} color="#34d399" />
                        <span className="font-semibold text-white">{f.name}</span>
                      </div>
                    </td>
                    <td>{f.portion}</td>
                    <td>
                      <span className="font-bold text-amber">{f.calories} kcal</span>
                    </td>
                    <td>
                      <span className="text-purple font-semibold">{f.protein}g</span>
                    </td>
                    <td>
                      <span className="text-blue font-semibold">{f.carbs}g</span>
                    </td>
                    <td>
                      <span className="text-yellow-400 font-semibold">{f.fat}g</span>
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <button
                          className="admin-action-btn delete"
                          title="Xóa món ăn"
                          onClick={() => onDeleteFood(f.id)}
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

      {/* Modal: Thêm món ăn */}
      {showAddFoodModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowAddFoodModal(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Thêm thực phẩm vào cơ sở dữ liệu</h3>
              <button
                className="admin-modal-close"
                onClick={() => setShowAddFoodModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateFood} className="admin-modal-form">
              <div className="admin-form-group">
                <label>Tên món ăn / Thực phẩm</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Cá hồi áp chảo dầu ô liu"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Khẩu phần (Serving size)</label>
                  <input
                    type="text"
                    placeholder="100g, 1 bát, 1 đĩa..."
                    value={foodServing}
                    onChange={(e) => setFoodServing(e.target.value)}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Calo (Kcal)</label>
                  <input
                    type="number"
                    required
                    value={foodCalories}
                    onChange={(e) => setFoodCalories(e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Protein (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={foodProtein}
                    onChange={(e) => setFoodProtein(e.target.value)}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Carbs (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={foodCarbs}
                    onChange={(e) => setFoodCarbs(e.target.value)}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Chất béo (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={foodFat}
                    onChange={(e) => setFoodFat(e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setShowAddFoodModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="admin-primary-btn">
                  Lưu món ăn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
