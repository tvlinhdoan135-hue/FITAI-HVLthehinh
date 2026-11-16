import { useState } from "react";
import {
  Search,
  Dumbbell,
  Sparkles,
  CheckCircle2,
  Heart,
  BookOpen,
  Plus,
  Play,
  RotateCcw,
  Zap,
} from "lucide-react";
import type { Exercise } from "../../types/fitness";

export interface ExerciseLibraryItem {
  id: string;
  name: string;
  englishName: string;
  targetMuscle: string;
  secondaryMuscle: string;
  equipment: string;
  difficulty: "Người mới" | "Trung bình" | "Nâng cao";
  sets: number;
  reps: string;
  restSeconds: number;
  tempo: string; // e.g. "3-1-1-0"
  breathingTip: string;
  instructions: string[];
  tips: string;
  commonMistakes: string[];
  caloriesPer10Min: number;
  rating: number; // 4.8, 4.9, 5.0
  thumbnailColor: string;
  categoryIcon: string;
}

export const EXERCISE_VAULT: ExerciseLibraryItem[] = [
  // --- NGỰC (CHEST) ---
  {
    id: "lib-ch-1",
    name: "Đẩy ngực ngang tạ đòn",
    englishName: "Barbell Bench Press",
    targetMuscle: "Ngực",
    secondaryMuscle: "Tay sau, Vai trước",
    equipment: "Tạ đòn & Ghế phẳng",
    difficulty: "Trung bình",
    sets: 4,
    reps: "8 - 10 reps",
    restSeconds: 90,
    tempo: "3-1-1-0",
    breathingTip: "Hít sâu khi hạ tạ xuống ngực, thở mạnh dứt khoát khi đẩy tạ lên.",
    instructions: [
      "Nằm ngửa trên ghế phẳng, hai chân đặt chắc chắn trên sàn, mắt nhìn thẳng dưới đòn tạ.",
      "Cầm đòn tạ độ rộng lớn hơn vai khoảng 1.5 lần, cổ tay thẳng, ép chặt hai bả vai xuống mặt ghế.",
      "Tháo tạ ra khỏi giá, hít sâu gồng cơ lõi, từ từ hạ tạ có kiểm soát chạm nhẹ vào điểm giữa ngực.",
      "Dùng lực cơ ngực đẩy mạnh đòn tạ hướng lên trên, thở ra dứt khoát ở đỉnh chuyển động."
    ],
    tips: "Giữ khép khuỷu tay góc 45 - 60 độ so với thân người, không mở khuỷu tay 90 độ để tránh áp lực lên khớp vai.",
    commonMistakes: [
      "Cong cổ tay quá mức gây đau khớp.",
      "Nảy tạ lên khỏi xương ức.",
      "Nhấc mông hoặc bàn chân rời khỏi ghế khi tạ nặng."
    ],
    caloriesPer10Min: 85,
    rating: 5.0,
    thumbnailColor: "from-purple-900/40 to-blue-900/40",
    categoryIcon: "🛡️"
  },
  {
    id: "lib-ch-2",
    name: "Đẩy ngực trên tạ đơn",
    englishName: "Incline Dumbbell Press",
    targetMuscle: "Ngực",
    secondaryMuscle: "Vai trước, Tay sau",
    equipment: "Tạ đơn & Ghế dốc lên",
    difficulty: "Trung bình",
    sets: 4,
    reps: "10 - 12 reps",
    restSeconds: 75,
    tempo: "3-0-1-0",
    breathingTip: "Hít vào khi hạ tạ mở rộng lồng ngực, thở ra khi ép hai tạ lên trên.",
    instructions: [
      "Chỉnh ghế dốc nghiêng khoảng 30 - 45 độ (không nên chỉnh quá dốc sẽ ăn vào vai).",
      "Ngồi tựa lưng, dùng đầu gối hất tạ lên hai bên ngực trên.",
      "Hạ tạ chậm rãi để cảm nhận độ kéo căng tối đa của vùng ngực trên.",
      "Đẩy tạ lên theo hình vòng cung nhẹ, ép ngực lại mà không để hai quả tạ va vào nhau."
    ],
    tips: "Ghế nghiêng lý tưởng nhất là 30 độ để tập trung vào bó cơ ngực đòn (Upper Chest).",
    commonMistakes: [
      "Chỉnh ghế quá dốc (>60 độ) khiến lực dồn hết vào cơ vai trước.",
      "Hạ tạ quá nhanh làm mất kiểm soát khớp vai."
    ],
    caloriesPer10Min: 78,
    rating: 4.9,
    thumbnailColor: "from-indigo-900/40 to-purple-900/40",
    categoryIcon: "🛡️"
  },
  {
    id: "lib-ch-3",
    name: "Ép ngực với dây cáp",
    englishName: "Cable Chest Flyes",
    targetMuscle: "Ngực",
    secondaryMuscle: "Vai trước",
    equipment: "Máy cáp đôi (Cable Crossover)",
    difficulty: "Người mới",
    sets: 3,
    reps: "12 - 15 reps",
    restSeconds: 60,
    tempo: "2-1-1-1",
    breathingTip: "Hít vào khi mở hai tay sang ngang, thở ra khi ép chặt hai tay vào giữa.",
    instructions: [
      "Chỉnh ròng rọc ở độ cao ngang ngực hoặc trên cao, cầm hai tay nắm dây cáp.",
      "Bước một chân về phía trước tạo thế đứng vững chắc, thân người hơi ngả về trước.",
      "Mở hai tay sang ngang, khuỷu tay hơi cong nhẹ tự nhiên.",
      "Dùng cơ ngực ép hai bàn tay lại gần nhau ở phía trước ngực, siết chặt cơ trong 1 giây."
    ],
    tips: "Duy trì độ cong của khuỷu tay cố định trong suốt chuyển động để cô lập ngực tốt nhất.",
    commonMistakes: [
      "Dùng vai kéo tạ thay vì ép cơ ngực.",
      "Đung đưa thân người để mượn đà."
    ],
    caloriesPer10Min: 65,
    rating: 4.8,
    thumbnailColor: "from-blue-900/40 to-cyan-900/40",
    categoryIcon: "🛡️"
  },
  {
    id: "lib-ch-4",
    name: "Chống xà kép tập ngực dưới",
    englishName: "Chest Dips",
    targetMuscle: "Ngực",
    secondaryMuscle: "Tay sau, Vai trước",
    equipment: "Thanh xà kép (Dip Station)",
    difficulty: "Nâng cao",
    sets: 3,
    reps: "8 - 12 reps",
    restSeconds: 90,
    tempo: "3-1-1-0",
    breathingTip: "Hít sâu khi hạ thân người xuống, thở ra khi đẩy thẳng tay lên.",
    instructions: [
      "Bám hai tay vào xà kép, nhảy lên thẳng tay giữ thăng bằng.",
      "Hơi nghiêng thân trên về phía trước khoảng 20-30 độ, cằm thu nhẹ về ngực.",
      "Gập khuỷu tay hạ người xuống cho đến khi cánh tay trên song song với sàn.",
      "Dùng lực cơ ngực dưới và tay sau đẩy mạnh thân người trở lại vị trí ban đầu."
    ],
    tips: "Nghiêng người về phía trước để ăn vào cơ ngực; nếu giữ thân người thẳng đứng sẽ ăn nhiều vào tay sau.",
    commonMistakes: [
      "Hạ người quá sâu gây kéo căng nguy hiểm cho bao khớp vai.",
      "Thân người đung đưa không kiểm soát."
    ],
    caloriesPer10Min: 90,
    rating: 4.9,
    thumbnailColor: "from-violet-900/40 to-fuchsia-900/40",
    categoryIcon: "🛡️"
  },

  // --- LƯNG - XÔ (BACK & LATS) ---
  {
    id: "lib-bk-1",
    name: "Kéo xô máy cáp thẳng",
    englishName: "Wide-Grip Lat Pulldown",
    targetMuscle: "Lưng xô",
    secondaryMuscle: "Tay trước, Lưng giữa",
    equipment: "Máy kéo xô (Lat Pulldown)",
    difficulty: "Người mới",
    sets: 4,
    reps: "10 - 12 reps",
    restSeconds: 75,
    tempo: "2-0-1-1",
    breathingTip: "Thở ra khi kéo thanh đòn xuống ngực, hít sâu khi trả tạ lên cao.",
    instructions: [
      "Ngồi vào ghế, điều chỉnh đệm chèn đùi vừa khít để cố định phần thân dưới.",
      "Cầm thanh đòn rộng hơn vai, lòng bàn tay hướng về phía trước.",
      "Ưỡn ngực, hơi ngả lưng về sau khoảng 10 độ, gồng cơ lõi.",
      "Kéo thanh đòn xuống chạm phần ngực trên, hướng khuỷu tay xuống sàn và siết xô 1 giây.",
      "Nhả tạ chậm rãi để xô được kéo giãn hoàn toàn lên vị trí bắt đầu."
    ],
    tips: "Hãy tưởng tượng bạn đang kéo hai cùi chỏ chạm vào hai bên hông thay vì dùng bàn tay kéo.",
    commonMistakes: [
      "Ngả người ra sau quá nhiều (>30 độ) biến bài tập thành kéo lưng giữa.",
      "Kéo đòn tạ ra phía sau cổ gây hại đốt sống cổ."
    ],
    caloriesPer10Min: 72,
    rating: 5.0,
    thumbnailColor: "from-blue-900/40 to-teal-900/40",
    categoryIcon: "🦅"
  },
  {
    id: "lib-bk-2",
    name: "Gập người kéo tạ đòn",
    englishName: "Barbell Bent-Over Row",
    targetMuscle: "Lưng giữa",
    secondaryMuscle: "Lưng xô, Tay trước, Cơ dựng sống",
    equipment: "Tạ đòn & Bánh tạ",
    difficulty: "Trung bình",
    sets: 4,
    reps: "8 - 10 reps",
    restSeconds: 90,
    tempo: "2-1-1-0",
    breathingTip: "Hít vào chuẩn bị, thở ra khi kéo đòn tạ chạm vào rốn.",
    instructions: [
      "Đứng thẳng, chân rộng bằng vai, cầm tạ đòn độ rộng bằng vai.",
      "Đẩy hông ra sau, gập người về phía trước khoảng 45 độ, lưng giữ thẳng tự nhiên.",
      "Gồng chặt cơ bụng và cơ dựng sống, cánh tay duỗi thẳng xuống phía dưới.",
      "Kéo tạ hướng về phía bụng dưới/rốn, siết chặt hai bả vai vào nhau ở đỉnh.",
      "Hạ tạ có kiểm soát trở lại vị trí ban đầu."
    ],
    tips: "Luôn giữ lưng thẳng tắp, tuyệt đối không gù lưng để tránh chấn thương đĩa đệm cột sống.",
    commonMistakes: [
      "Gù lưng khi kéo tạ nặng.",
      "Nhấp nhổm toàn thân để giật tạ lên thay vì dùng cơ lưng."
    ],
    caloriesPer10Min: 88,
    rating: 4.9,
    thumbnailColor: "from-cyan-900/40 to-emerald-900/40",
    categoryIcon: "🦅"
  },
  {
    id: "lib-bk-3",
    name: "Kéo xà đơn ngực chạm xà",
    englishName: "Pull-up",
    targetMuscle: "Lưng xô",
    secondaryMuscle: "Tay trước, Cơ vai sau",
    equipment: "Xà đơn (Pull-up Bar)",
    difficulty: "Nâng cao",
    sets: 3,
    reps: "6 - 10 reps",
    restSeconds: 90,
    tempo: "2-1-1-0",
    breathingTip: "Thở ra khi kéo thân người lên cao, hít vào khi hạ người có kiểm soát.",
    instructions: [
      "Hai tay nắm xà đơn rộng hơn vai, mu bàn tay hướng về phía mặt bạn.",
      "Treo người hoàn toàn, hai chân đan nhẹ vào nhau hoặc co gối.",
      "Hạ hai bả vai xuống trước (Scapular Pull), sau đó dùng cơ xô kéo người lên.",
      "Kéo cho đến khi cằm vượt qua xà hoặc ngực trên chạm sát vào thanh xà.",
      "Hạ người chậm rãi duỗi thẳng hoàn toàn cơ lưng."
    ],
    tips: "Nếu chưa kéo được tự do, hãy dùng dây kháng lực (Resistance Band) trợ lực.",
    commonMistakes: [
      "Đung đưa chân để lấy đà (Kipping).",
      "Chỉ hạ người nửa chừng không duỗi hết biên độ."
    ],
    caloriesPer10Min: 95,
    rating: 5.0,
    thumbnailColor: "from-emerald-900/40 to-sky-900/40",
    categoryIcon: "🦅"
  },

  // --- VAI (SHOULDERS) ---
  {
    id: "lib-sh-1",
    name: "Đẩy tạ qua đầu với tạ đòn",
    englishName: "Overhead Barbell Press (OHP)",
    targetMuscle: "Vai",
    secondaryMuscle: "Tay sau, Cơ ngực trên, Cơ lõi",
    equipment: "Tạ đòn & Giá đỡ",
    difficulty: "Trung bình",
    sets: 4,
    reps: "8 - 10 reps",
    restSeconds: 90,
    tempo: "3-0-1-0",
    breathingTip: "Hít sâu gồng bụng trước khi đẩy, thở ra khi tạ qua khỏi đỉnh đầu.",
    instructions: [
      "Đứng thẳng, chân rộng bằng vai, đặt đòn tạ trước xương đòn ngực trên.",
      "Gồng chặt cơ mông và cơ bụng để cố định cột sống không bị võng lưng.",
      "Đẩy tạ theo phương thẳng đứng lên trên, hơi ngửa đầu nhẹ để tạ đi qua mặt.",
      "Khi tạ qua đầu, đẩy đầu nhẹ về phía trước để khóa tạ thẳng hàng với cột sống."
    ],
    tips: "Siết chặt cơ mông trong suốt quá trình đẩy để bảo vệ vùng thắt lưng dưới.",
    commonMistakes: [
      "Võng lưng dưới quá đà khi tạ nặng.",
      "Dùng lực nhún chân đẩy tạ (biến thành Push Press)."
    ],
    caloriesPer10Min: 80,
    rating: 4.9,
    thumbnailColor: "from-purple-900/40 to-amber-900/40",
    categoryIcon: "🛡️"
  },
  {
    id: "lib-sh-2",
    name: "Nâng tạ đơn sang bên vai giữa",
    englishName: "Dumbbell Lateral Raise",
    targetMuscle: "Vai",
    secondaryMuscle: "Cầu vai",
    equipment: "Tạ đơn",
    difficulty: "Người mới",
    sets: 4,
    reps: "12 - 15 reps",
    restSeconds: 60,
    tempo: "2-1-1-0",
    breathingTip: "Thở ra khi nâng hai tạ sang hai bên, hít vào khi hạ tạ xuống.",
    instructions: [
      "Đứng thẳng, hai tay cầm hai quả tạ đơn buông dọc hai bên đùi.",
      "Thân người hơi ngả về trước khoảng 5 độ, khuỷu tay hơi cong nhẹ.",
      "Dùng cơ vai giữa nhấc hai cánh tay sang ngang cho đến khi song song với sàn.",
      "Giữ lại 0.5 giây ở đỉnh, hạ tạ từ từ xuống đùi."
    ],
    tips: "Hướng ngón tay út hơi nhếch lên cao một chút giống như rót nước từ bình để cô lập cơ vai giữa.",
    commonMistakes: [
      "Vung vẩy cả người để lăng tạ lên.",
      "Nâng tay quá cao vượt qua mang tai khiến ăn vào cơ cầu vai."
    ],
    caloriesPer10Min: 60,
    rating: 4.9,
    thumbnailColor: "from-amber-900/40 to-orange-900/40",
    categoryIcon: "🛡️"
  },
  {
    id: "lib-sh-3",
    name: "Kéo cáp ngang mặt tập vai sau",
    englishName: "Face Pull with Rope",
    targetMuscle: "Vai",
    secondaryMuscle: "Vai sau, Cầu vai, Cơ xoay vai",
    equipment: "Máy cáp & Dây thừng",
    difficulty: "Người mới",
    sets: 3,
    reps: "12 - 15 reps",
    restSeconds: 60,
    tempo: "2-1-1-1",
    breathingTip: "Thở ra khi kéo dây cáp về phía trán, hít sâu khi trả cáp.",
    instructions: [
      "Chỉnh ròng rọc cáp ngang tầm mắt, gắn dây thừng đôi (Tricep Rope).",
      "Cầm dây với ngón cái hướng về phía sau, lùi lại 1 bước tạo lực căng.",
      "Kéo dây cáp thẳng về phía trán/mắt, mở rộng hai cùi chỏ sang hai bên.",
      "Xoay ngoài cánh tay sao cho nắm tay cao hơn cùi chỏ ở điểm cuối, siết vai sau 1 giây."
    ],
    tips: "Bài tập vàng giúp phục hồi và cân bằng khớp vai cho những ai ngồi bàn làm việc nhiều.",
    commonMistakes: [
      "Kéo dây xuống cằm thay vì kéo về ngang trán.",
      "Dùng tạ quá nặng khiến lưng ngửa ra sau."
    ],
    caloriesPer10Min: 58,
    rating: 5.0,
    thumbnailColor: "from-pink-900/40 to-purple-900/40",
    categoryIcon: "🛡️"
  },

  // --- TAY TRƯỚC & TAY SAU (ARMS) ---
  {
    id: "lib-ar-1",
    name: "Cuộn bắp tay trước tạ đòn",
    englishName: "Barbell Bicep Curl",
    targetMuscle: "Tay trước",
    secondaryMuscle: "Cẳng tay",
    equipment: "Tạ đòn EZ hoặc thẳng",
    difficulty: "Người mới",
    sets: 3,
    reps: "10 - 12 reps",
    restSeconds: 60,
    tempo: "3-0-1-1",
    breathingTip: "Thở ra khi cuộn tạ lên, hít vào khi hạ tạ chậm rãi.",
    instructions: [
      "Đứng thẳng, hai tay cầm đòn tạ ngửa lòng bàn tay, độ rộng bằng vai.",
      "Giữ hai cùi chỏ cố định sát vào hai bên hông.",
      "Dùng cơ bắp tay trước cuộn đòn tạ lên hướng về phía ngực.",
      "Siết chặt bắp tay ở đỉnh trong 1 giây, hạ tạ từ từ có kiểm soát trong 3 giây."
    ],
    tips: "Sử dụng đòn EZ uốn lượn sẽ giúp giảm đáng kể áp lực lên khớp cổ tay.",
    commonMistakes: [
      "Đưa cùi chỏ ra phía trước khi cuộn tạ.",
      "Lắc hông để lấy đà khi tạ nặng."
    ],
    caloriesPer10Min: 62,
    rating: 4.8,
    thumbnailColor: "from-fuchsia-900/40 to-purple-900/40",
    categoryIcon: "💪"
  },
  {
    id: "lib-ar-2",
    name: "Nhấn tay sau dây cáp",
    englishName: "Tricep Rope Pushdown",
    targetMuscle: "Tay sau",
    secondaryMuscle: "Cơ ngực phụ",
    equipment: "Máy cáp & Dây thừng",
    difficulty: "Người mới",
    sets: 3,
    reps: "12 - 15 reps",
    restSeconds: 60,
    tempo: "2-0-1-1",
    breathingTip: "Thở ra khi nhấn thẳng tay xuống, hít vào khi gập tay lên.",
    instructions: [
      "Gắn dây thừng vào ròng rọc cáp trên cao, hai tay nắm chặt hai đầu mút dây.",
      "Hơi nghiêng thân người về phía trước, giữ cố định hai cùi chỏ sát mạn sườn.",
      "Dùng cơ tay sau nhấn thẳng hai cánh tay xuống phía đùi.",
      "Ở điểm duỗi thẳng hoàn toàn, tách hai đầu ngón tay sang hai bên để siết cơ tối đa."
    ],
    tips: "Cùi chỏ phải luôn đứng yên như một chiếc bản lề, không di chuyển theo chuyển động tạ.",
    commonMistakes: [
      "Cùi chỏ đưa lên đưa xuống theo tạ.",
      "Dùng sức nặng cơ thể đè lên tạ thay vì dùng cơ tay sau."
    ],
    caloriesPer10Min: 60,
    rating: 4.9,
    thumbnailColor: "from-purple-900/40 to-indigo-900/40",
    categoryIcon: "⚡"
  },

  // --- CHÂN & MÔNG (LEGS & GLUTES) ---
  {
    id: "lib-lg-1",
    name: "Gánh tạ đòn sau lưng",
    englishName: "Barbell Back Squat",
    targetMuscle: "Đùi trước & Mông",
    secondaryMuscle: "Đùi sau, Cơ dựng sống, Cơ lõi",
    equipment: "Tạ đòn & Squat Rack",
    difficulty: "Nâng cao",
    sets: 4,
    reps: "6 - 8 reps",
    restSeconds: 120,
    tempo: "3-1-1-0",
    breathingTip: "Hít sâu gồng chặt cơ bụng trước khi ngồi xuống, nín thở đi qua điểm kẹt, thở ra khi đứng thẳng.",
    instructions: [
      "Đặt đòn tạ lên cơ cầu vai (High Bar) hoặc dưới xương gai vai (Low Bar).",
      "Bước ra khỏi giá, hai chân mở rộng bằng hoặc hơn vai một chút, mũi chân hơi chếch 15-30 độ.",
      "Hít sâu, gồng cơ lõi (ValSalva maneuver), đẩy mông ra sau và gập gối ngồi xổm xuống.",
      "Hạ sâu cho đến khi nếp gấp hông thấp hơn đỉnh đầu gối (Parallel hoặc Deep Squat).",
      "Đạp mạnh toàn bộ bàn chân xuống sàn, đứng dậy dứt khoát về vị trí ban đầu."
    ],
    tips: "Đầu gối luôn mở hướng theo chiều mũi chân, tuyệt đối không để chụm gối (Knee Valgus).",
    commonMistakes: [
      "Chụm hai đầu gối vào nhau khi đứng lên.",
      "Nhấc gót chân rời khỏi sàn nhà.",
      "Cong lưng dưới ở đáy chuyển động (Butt wink)."
    ],
    caloriesPer10Min: 110,
    rating: 5.0,
    thumbnailColor: "from-emerald-900/40 to-green-900/40",
    categoryIcon: "🦵"
  },
  {
    id: "lib-lg-2",
    name: "Kéo tạ đùi sau & mông",
    englishName: "Romanian Deadlift (RDL)",
    targetMuscle: "Đùi sau & Mông",
    secondaryMuscle: "Lưng dưới, Cẳng tay",
    equipment: "Tạ đòn hoặc Tạ đơn",
    difficulty: "Trung bình",
    sets: 4,
    reps: "8 - 10 reps",
    restSeconds: 90,
    tempo: "3-1-1-0",
    breathingTip: "Hít vào khi đẩy hông ra sau hạ tạ, thở ra khi kéo tạ lên siết mông.",
    instructions: [
      "Đứng thẳng, chân rộng bằng hông, hai tay cầm đòn tạ buông trước đùi.",
      "Đầu gối hơi mở khóa nhẹ (chùng nhẹ khoảng 15 độ và giữ nguyên góc này).",
      "Đẩy khớp hông ra sau hết mức có thể, để đòn tạ lướt sát theo dọc ống đồng.",
      "Hạ tạ xuống ngang ống đồng cho đến khi cảm nhận độ căng cực đại ở gân kheo (Hamstrings).",
      "Đẩy hông về phía trước, siết chặt cơ mông để đứng thẳng dậy."
    ],
    tips: "Đây là chuyển động gập hông (Hip Hinge), không phải chuyển động gập gối ngồi xuống như Squat.",
    commonMistakes: [
      "Gập đầu gối quá nhiều biến thành Squat.",
      "Để đòn tạ bay ra xa người làm đau lưng dưới."
    ],
    caloriesPer10Min: 98,
    rating: 5.0,
    thumbnailColor: "from-teal-900/40 to-emerald-900/40",
    categoryIcon: "🦵"
  },
  {
    id: "lib-lg-3",
    name: "Squat một chân kiểu Bulgaria",
    englishName: "Bulgarian Split Squat",
    targetMuscle: "Đùi trước & Mông",
    secondaryMuscle: "Đùi sau, Khả năng thăng bằng",
    equipment: "Ghế tập & Tạ đơn",
    difficulty: "Trung bình",
    sets: 3,
    reps: "10 - 12 reps / bên",
    restSeconds: 75,
    tempo: "3-0-1-0",
    breathingTip: "Hít vào khi hạ đùi, thở ra khi đạp gót chân đứng lên.",
    instructions: [
      "Đứng cách ghế tập khoảng 60 - 90 cm, gác mu bàn chân sau lên ghế.",
      "Hai tay cầm hai quả tạ đơn buông hai bên sườn, mắt nhìn thẳng.",
      "Hạ thấp trọng tâm thẳng đứng xuống dưới cho đến khi đùi chân trước song song với sàn.",
      "Dùng lực gót chân trước đạp mạnh đứng lên trở lại."
    ],
    tips: "Bài tập đơn phương (Unilateral) đỉnh cao giúp khắc phục hoàn toàn tình trạng lệch cơ hai bên chân.",
    commonMistakes: [
      "Khoảng cách đặt chân quá gần làm gối trước chịu tải quá mức.",
      "Để thân người nghiêng ngả mất thăng bằng."
    ],
    caloriesPer10Min: 92,
    rating: 4.9,
    thumbnailColor: "from-green-900/40 to-lime-900/40",
    categoryIcon: "🦵"
  },

  // --- BỤNG & LÕI (ABS & CORE) ---
  {
    id: "lib-ab-1",
    name: "Treo xà nâng chân gập bụng",
    englishName: "Hanging Leg Raise",
    targetMuscle: "Cơ bụng & Lõi",
    secondaryMuscle: "Cơ gập hông, Cẳng tay",
    equipment: "Thanh xà đơn",
    difficulty: "Trung bình",
    sets: 3,
    reps: "12 - 15 reps",
    restSeconds: 60,
    tempo: "2-1-1-0",
    breathingTip: "Thở ra khi cuộn chân lên cao, hít vào khi hạ chân từ từ.",
    instructions: [
      "Hai tay nắm chắc thanh xà đơn, người treo thẳng tự nhiên.",
      "Không đung đưa người, dùng cơ bụng dưới cuộn xương chậu nâng hai chân lên.",
      "Nâng chân lên cho đến khi mũi chân ngang tầm ngực hoặc chạm xà.",
      "Hạ chân xuống có kiểm soát trong 2-3 giây để cơ bụng chịu tải liên tục."
    ],
    tips: "Hãy tập trung vào việc cuộn xương chậu lên về phía ngực, không chỉ đơn thuần là nhấc đầu gối.",
    commonMistakes: [
      "Đung đưa lấy đà từ lưng.",
      "Thả chân rơi tự do không kiểm soát."
    ],
    caloriesPer10Min: 70,
    rating: 4.8,
    thumbnailColor: "from-amber-900/40 to-red-900/40",
    categoryIcon: "🧱"
  },
  {
    id: "lib-ab-2",
    name: "Giữ tư thế Plank kích hoạt lõi",
    englishName: "Plank Core Hold",
    targetMuscle: "Cơ bụng & Lõi",
    secondaryMuscle: "Cơ mông, Cơ vai, Cơ lưng dưới",
    equipment: "Thảm tập (Mat)",
    difficulty: "Người mới",
    sets: 3,
    reps: "45 - 60 giây",
    restSeconds: 45,
    tempo: "Isometric",
    breathingTip: "Duy trì nhịp thở đều đặn, thở chậm bằng bụng, không nín thở.",
    instructions: [
      "Chống hai cẳng tay xuống thảm, khuỷu tay vuông góc ngay dưới khớp vai.",
      "Duỗi thẳng hai chân về phía sau, tiếp xúc bằng mũi chân.",
      "Siết chặt cơ mông, cuộn nhẹ xương chậu, gồng chặt toàn bộ cơ bụng.",
      "Giữ thân người thẳng tắp từ đỉnh đầu đến gót chân, không để võng lưng hay chổng mông."
    ],
    tips: "Tưởng tượng kéo khuỷu tay về phía mũi chân để tạo sức ép kích hoạt cơ bụng tối đa.",
    commonMistakes: [
      "Võng lưng dưới gây đau cột sống.",
      "Nhô mông lên quá cao làm giảm tải cơ bụng."
    ],
    caloriesPer10Min: 55,
    rating: 4.9,
    thumbnailColor: "from-yellow-900/40 to-amber-900/40",
    categoryIcon: "🧱"
  }
];

interface ExerciseLibraryViewProps {
  onOpenDetailModal?: (ex: Exercise) => void;
  onAddExerciseToToday?: (ex: Exercise) => void;
}

export default function ExerciseLibraryView({
  onOpenDetailModal,
  onAddExerciseToToday,
}: ExerciseLibraryViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("Tất cả");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Tất cả");
  const [selectedEquipment, setSelectedEquipment] = useState("Tất cả");
  const [favorites, setFavorites] = useState<string[]>(["lib-ch-1", "lib-lg-1"]);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const [activeModalItem, setActiveModalItem] = useState<ExerciseLibraryItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddToWorkout = (item: ExerciseLibraryItem, e: React.MouseEvent) => {
    e.stopPropagation();

    if (onAddExerciseToToday) {
      const converted: Exercise = {
        id: "custom-" + Date.now(),
        name: item.name,
        targetMuscle: item.targetMuscle,
        equipment: item.equipment,
        difficulty: item.difficulty,
        sets: item.sets,
        reps: item.reps,
        restSeconds: item.restSeconds,
        completed: false,
        instructions: item.instructions,
        tips: item.tips,
      };
      onAddExerciseToToday(converted);
    }
    triggerToast(`✨ Đã thêm "${item.name}" vào lịch tập của bạn!`);
  };

  const muscleFilterTabs = [
    { label: "Tất cả", icon: "🔥" },
    { label: "Ngực", icon: "🛡️" },
    { label: "Lưng xô", icon: "🦅" },
    { label: "Vai", icon: "🛡️" },
    { label: "Tay trước", icon: "💪" },
    { label: "Tay sau", icon: "⚡" },
    { label: "Đùi trước & Mông", icon: "🦵" },
    { label: "Cơ bụng & Lõi", icon: "🧱" },
  ];

  // Filtering
  const filteredList = EXERCISE_VAULT.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.equipment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.targetMuscle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMuscle =
      selectedMuscle === "Tất cả" || item.targetMuscle === selectedMuscle;

    const matchesDiff =
      selectedDifficulty === "Tất cả" || item.difficulty === selectedDifficulty;

    const matchesEquip =
      selectedEquipment === "Tất cả" ||
      item.equipment.toLowerCase().includes(selectedEquipment.toLowerCase());

    const matchesFav = !onlyFavorites || favorites.includes(item.id);

    return (
      matchesSearch && matchesMuscle && matchesDiff && matchesEquip && matchesFav
    );
  });

  return (
    <div className="exercise-vault-root">
      {/* Toast popup */}
      {toastMessage && (
        <div className="vault-toast-banner">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HERO BANNER - COMPACT SLEEK */}
      <div className="vault-hero-card compact">
        <div className="vault-hero-content-row">
          <div className="vault-hero-left">
            <div className="vault-hero-badge">
              <Sparkles size={12} />
              <span>KHO ĐỘNG TÁC CHUẨN Y KHOA</span>
            </div>
            <h1 className="vault-hero-title">Kho Bài Tập & Kỹ Thuật Động Tác</h1>
            <p className="vault-hero-sub">
              50+ bài tập chuyên sâu với video tư thế, nhịp Tempo 3-1-1-0 và cơ chế hô hấp chuẩn.
            </p>
          </div>

          <div className="vault-kpi-chips-row compact">
            <div className="vault-kpi-chip">
              <span className="chip-num">48+</span>
              <span className="chip-lbl">Bài tập</span>
            </div>
            <div className="vault-kpi-chip">
              <span className="chip-num">8</span>
              <span className="chip-lbl">Nhóm cơ</span>
            </div>
            <div className="vault-kpi-chip">
              <span className="chip-num">100%</span>
              <span className="chip-lbl">Kỹ thuật</span>
            </div>
            <div className="vault-kpi-chip highlight">
              <span className="chip-num">3-1-1-0</span>
              <span className="chip-lbl">Tempo</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTROLS BAR: Search & Dropdowns */}
      <div className="vault-controls-card">
        <div className="vault-search-row">
          <div className="vault-search-box">
            <Search size={18} className="vault-search-icon" />
            <input
              type="text"
              placeholder="Tìm theo tên bài tập (VD: Bench Press, Squat, Xô, Tạ đơn...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchQuery("")}
              >
                ✕
              </button>
            )}
          </div>

          <div className="vault-filters-group">
            {/* Difficulty */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="vault-select-filter"
            >
              <option value="Tất cả">Mọi cấp độ</option>
              <option value="Người mới">Người mới</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Nâng cao">Nâng cao</option>
            </select>

            {/* Equipment */}
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="vault-select-filter"
            >
              <option value="Tất cả">Mọi thiết bị</option>
              <option value="Tạ đòn">Tạ đòn (Barbell)</option>
              <option value="Tạ đơn">Tạ đơn (Dumbbell)</option>
              <option value="Máy cáp">Máy cáp (Cable)</option>
              <option value="Xà">Xà đơn / Xà kép</option>
              <option value="Thảm">Bodyweight / Thảm</option>
            </select>

            {/* Favorites toggle */}
            <button
              className={`vault-fav-toggle-btn ${onlyFavorites ? "active" : ""}`}
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              title="Chỉ hiện bài tập đã thích"
            >
              <Heart
                size={16}
                fill={onlyFavorites ? "#ec4899" : "none"}
                color={onlyFavorites ? "#ec4899" : "currentColor"}
              />
              <span>Yêu thích ({favorites.length})</span>
            </button>
          </div>
        </div>

        {/* Muscle group tabs */}
        <div className="vault-muscle-tabs-row">
          {muscleFilterTabs.map((tab) => {
            const isSelected = selectedMuscle === tab.label;
            return (
              <button
                key={tab.label}
                className={`vault-muscle-pill ${isSelected ? "active" : ""}`}
                onClick={() => setSelectedMuscle(tab.label)}
              >
                <span className="pill-icon">{tab.icon}</span>
                <span className="pill-name">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RESULTS COUNT & STATUS */}
      <div className="vault-results-status-row">
        <span>
          Hiển thị <strong>{filteredList.length}</strong> bài tập phù hợp
          {selectedMuscle !== "Tất cả" && ` thuộc nhóm cơ ${selectedMuscle}`}
        </span>
        {(searchQuery ||
          selectedMuscle !== "Tất cả" ||
          selectedDifficulty !== "Tất cả" ||
          selectedEquipment !== "Tất cả" ||
          onlyFavorites) && (
          <button
            className="vault-reset-filters-btn"
            onClick={() => {
              setSearchQuery("");
              setSelectedMuscle("Tất cả");
              setSelectedDifficulty("Tất cả");
              setSelectedEquipment("Tất cả");
              setOnlyFavorites(false);
            }}
          >
            <RotateCcw size={13} /> Đặt lại bộ lọc
          </button>
        )}
      </div>

      {/* EXERCISES GRID */}
      {filteredList.length === 0 ? (
        <div className="vault-empty-state">
          <Dumbbell size={48} className="empty-icon" />
          <h3>Không tìm thấy bài tập phù hợp</h3>
          <p>Hãy thử tìm với từ khóa khác hoặc xóa bớt các bộ lọc đang chọn.</p>
          <button
            className="empty-reset-btn"
            onClick={() => {
              setSearchQuery("");
              setSelectedMuscle("Tất cả");
              setSelectedDifficulty("Tất cả");
              setSelectedEquipment("Tất cả");
              setOnlyFavorites(false);
            }}
          >
            Xem toàn bộ bài tập
          </button>
        </div>
      ) : (
        <div className="vault-cards-grid">
          {filteredList.map((item) => {
            const isFav = favorites.includes(item.id);

            const diffBadgeClass =
              item.difficulty === "Người mới"
                ? "diff-beginner"
                : item.difficulty === "Trung bình"
                ? "diff-intermediate"
                : "diff-advanced";

            return (
              <div
                key={item.id}
                className="vault-exercise-card"
                onClick={() => {
                  if (onOpenDetailModal) {
                    const converted: Exercise = {
                      id: item.id,
                      name: item.name,
                      targetMuscle: item.targetMuscle,
                      equipment: item.equipment,
                      difficulty: item.difficulty,
                      sets: item.sets,
                      reps: item.reps,
                      restSeconds: item.restSeconds,
                      instructions: item.instructions,
                      tips: item.tips,
                    };
                    onOpenDetailModal(converted);
                  } else {
                    setActiveModalItem(item);
                  }
                }}
              >
                {/* Card Top: Badges & Favorite */}
                <div className="card-topline">
                  <div className="card-badge-group">
                    <span className="card-muscle-badge">
                      {item.categoryIcon} {item.targetMuscle}
                    </span>
                    <span className={`card-difficulty-badge ${diffBadgeClass}`}>
                      {item.difficulty}
                    </span>
                  </div>
                  <button
                    className={`card-heart-btn ${isFav ? "favorited" : ""}`}
                    onClick={(e) => toggleFavorite(item.id, e)}
                    title={isFav ? "Bỏ yêu thích" : "Lưu vào yêu thích"}
                  >
                    <Heart
                      size={17}
                      fill={isFav ? "#ec4899" : "none"}
                      color={isFav ? "#ec4899" : "#94a3b8"}
                    />
                  </button>
                </div>

                {/* Card Title */}
                <div className="card-title-box">
                  <h3 className="card-main-name">{item.name}</h3>
                  <span className="card-english-name">{item.englishName}</span>
                </div>

                {/* Equipment & Secondary Muscle */}
                <div className="card-sub-pills">
                  <span className="equip-pill">
                    <Dumbbell size={13} /> {item.equipment}
                  </span>
                  <span className="secondary-pill">
                    Cơ phụ: {item.secondaryMuscle}
                  </span>
                </div>

                {/* Key Specs Bar (Sets, Reps, Rest, Tempo) */}
                <div className="card-specs-matrix">
                  <div className="spec-col">
                    <span className="spec-label">Số hiệp</span>
                    <strong className="spec-val">{item.sets} hiệp</strong>
                  </div>
                  <div className="spec-col">
                    <span className="spec-label">Số lần lặp</span>
                    <strong className="spec-val">{item.reps}</strong>
                  </div>
                  <div className="spec-col">
                    <span className="spec-label">Nghỉ</span>
                    <strong className="spec-val">{item.restSeconds}s</strong>
                  </div>
                  <div className="spec-col highlight">
                    <span className="spec-label">Tempo</span>
                    <strong className="spec-val">{item.tempo}</strong>
                  </div>
                </div>

                {/* Breathing Tip Preview */}
                <div className="card-breathing-callout">
                  <span className="callout-icon">💨</span>
                  <span className="callout-text">{item.breathingTip}</span>
                </div>

                {/* Card Actions Footer */}
                <div className="card-actions-row">
                  <button
                    className="card-guide-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveModalItem(item);
                    }}
                  >
                    <BookOpen size={15} /> Xem kỹ thuật
                  </button>
                  <button
                    className="card-add-btn"
                    onClick={(e) => handleAddToWorkout(item, e)}
                    title="Thêm bài tập này vào lịch tập hôm nay"
                  >
                    <Plus size={16} /> Thêm vào lịch
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAILED EXERCISE MODAL */}
      {activeModalItem && (
        <div
          className="modal-backdrop-fullscreen"
          onClick={() => setActiveModalItem(null)}
        >
          <div
            className="vault-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="vault-modal-header">
              <div className="header-left">
                <span className="modal-category-tag">
                  {activeModalItem.categoryIcon} {activeModalItem.targetMuscle}
                </span>
                <h2>{activeModalItem.name}</h2>
                <span className="modal-sub-eng">
                  {activeModalItem.englishName} · Thiết bị: {activeModalItem.equipment}
                </span>
              </div>
              <button
                className="vault-modal-close"
                onClick={() => setActiveModalItem(null)}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="vault-modal-body">
              {/* Quick specs banner */}
              <div className="modal-specs-strip">
                <div className="strip-item">
                  <span>Mục tiêu hiệp/lần</span>
                  <strong>
                    {activeModalItem.sets} hiệp × {activeModalItem.reps}
                  </strong>
                </div>
                <div className="strip-item">
                  <span>Nghỉ giữa hiệp</span>
                  <strong>{activeModalItem.restSeconds} giây</strong>
                </div>
                <div className="strip-item">
                  <span>Nhịp Tempo chuẩn</span>
                  <strong>{activeModalItem.tempo}</strong>
                </div>
                <div className="strip-item">
                  <span>Độ khó</span>
                  <strong>{activeModalItem.difficulty}</strong>
                </div>
              </div>

              {/* Breathing Guide */}
              <div className="modal-breathing-box">
                <div className="box-title">
                  <Zap size={16} className="text-amber-400" />
                  <strong>Kỹ thuật hô hấp chuẩn:</strong>
                </div>
                <p>{activeModalItem.breathingTip}</p>
              </div>

              {/* Step by step execution */}
              <div className="modal-section">
                <h4 className="section-title">
                  <Play size={16} className="text-purple-400" /> Hướng dẫn chuyển động từng bước:
                </h4>
                <div className="modal-steps-list">
                  {activeModalItem.instructions.map((step, idx) => (
                    <div key={idx} className="step-item">
                      <div className="step-num">{idx + 1}</div>
                      <p className="step-text">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coach Tips & Mistakes */}
              <div className="modal-grid-2col">
                <div className="coach-tip-panel">
                  <h5>💡 Bí quyết từ Huấn luyện viên:</h5>
                  <p>{activeModalItem.tips}</p>
                </div>
                <div className="common-mistakes-panel">
                  <h5>⚠️ Các lỗi sai thường gặp cần tránh:</h5>
                  <ul>
                    {activeModalItem.commonMistakes.map((mis, i) => (
                      <li key={i}>• {mis}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="vault-modal-footer">
              <button
                className="vault-modal-secondary-btn"
                onClick={() => setActiveModalItem(null)}
              >
                Đóng
              </button>
              <button
                className="vault-modal-primary-btn"
                onClick={(e) => {
                  handleAddToWorkout(activeModalItem, e);
                  setActiveModalItem(null);
                }}
              >
                <Plus size={16} /> Thêm bài tập này vào lịch tập hôm nay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
