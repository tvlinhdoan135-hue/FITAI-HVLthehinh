import { useState } from "react";
import {
  Trophy,
  Sparkles,
  Lock,
  ArrowRight,
  Check,
} from "lucide-react";
import type { Challenge, Badge, UserStats } from "../../types/fitness";

interface ChallengesViewProps {
  challenges: Challenge[];
  badges: Badge[];
  userStats: UserStats;
  onCheckInChallenge: (challengeId: string) => void;
  onToggleJoinChallenge: (challengeId: string) => void;
}

export default function ChallengesView({
  challenges,
  badges,
  userStats,
  onCheckInChallenge,
  onToggleJoinChallenge,
}: ChallengesViewProps) {
  const [badgeFilter, setBadgeFilter] = useState<"all" | "unlocked" | "locked">("all");

  const filteredBadges = badges.filter((b) => {
    if (badgeFilter === "unlocked") return b.unlocked;
    if (badgeFilter === "locked") return !b.unlocked;
    return true;
  });

  return (
    <div className="challenges-page-container">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <span className="page-eyebrow-tag">KỶ LUẬT TẠO NÊN KẾT QUẢ</span>
          <h1 className="page-main-title">Thử thách & Bảng thành tựu</h1>
          <p className="page-sub-desc">
            Tham gia các thử thách rèn luyện thể chất, tích lũy điểm kinh nghiệm (XP) để thăng hạng và mở khóa huy hiệu danh giá.
          </p>
        </div>
      </div>

      {/* 1. User Level & XP Banner */}
      <div className="level-progression-banner">
        <div className="level-banner-left">
          <div className="level-trophy-circle">
            <Trophy size={36} className="gold-trophy-icon" />
          </div>
          <div className="level-text-info">
            <span className="level-tier-tag">HẠNG HIỆN TẠI</span>
            <h2>Cấp độ: {userStats.levelTitle}</h2>
            <p>Còn {(userStats.nextLevelXp - userStats.xp).toLocaleString()} XP để thăng hạng lên <strong>Bạc II</strong></p>
          </div>
        </div>

        <div className="level-progress-col">
          <div className="level-xp-numbers">
            <span>Tiến độ kinh nghiệm</span>
            <strong>{userStats.xp.toLocaleString()} / {userStats.nextLevelXp.toLocaleString()} XP</strong>
          </div>
          <div className="level-progress-track">
            <div
              className="level-progress-fill"
              style={{ width: `${(userStats.xp / userStats.nextLevelXp) * 100}%` }}
            />
          </div>
          <span className="level-streak-text">🔥 Chuỗi thành tích liên tục: {userStats.streakDays} ngày</span>
        </div>
      </div>

      {/* 2. Active Challenges Grid */}
      <div className="challenges-section">
        <h3 className="section-title">Thử thách đang diễn ra</h3>

        <div className="challenges-grid">
          {challenges.map((ch) => {
            const percent = Math.round((ch.currentDay / ch.totalDays) * 100);
            return (
              <div key={ch.id} className="challenge-card-item">
                <div className="challenge-item-head">
                  <div className="ch-icon-pill" style={{ background: `${ch.badgeColor}25`, color: ch.badgeColor }}>
                    <Sparkles size={18} />
                  </div>
                  <span className="ch-reward-pill">+{ch.rewardXP} XP</span>
                </div>

                <h4 className="ch-title">{ch.title}</h4>
                <p className="ch-desc">{ch.description}</p>

                {/* Progress bar */}
                <div className="ch-progress-wrap">
                  <div className="ch-progress-info">
                    <span>Ngày {ch.currentDay} / {ch.totalDays}</span>
                    <strong>{percent}%</strong>
                  </div>
                  <div className="ch-track">
                    <div className="ch-fill" style={{ width: `${percent}%` }} />
                  </div>
                </div>

                <div className="ch-card-footer">
                  <div className="ch-badge-reward">
                    <span>Phần thưởng:</span>
                    <strong>🏅 {ch.badgeName}</strong>
                  </div>

                  {ch.joined ? (
                    <button
                      className="ch-checkin-btn"
                      onClick={() => onCheckInChallenge(ch.id)}
                    >
                      <Check size={16} /> Điểm danh hôm nay
                    </button>
                  ) : (
                    <button
                      className="ch-join-btn"
                      onClick={() => onToggleJoinChallenge(ch.id)}
                    >
                      Tham gia thử thách <ArrowRight size={15} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Badges Showcase */}
      <div className="badges-section">
        <div className="badges-header-row">
          <div>
            <h3 className="section-title">Bộ sưu tập huy hiệu FitAI</h3>
            <p>Huy hiệu vinh danh các cột mốc bạn đã đạt được trong quá trình tập luyện</p>
          </div>
          <div className="badge-filter-pills">
            <button
              className={`badge-pill-btn ${badgeFilter === "all" ? "active" : ""}`}
              onClick={() => setBadgeFilter("all")}
            >
              Tất cả ({badges.length})
            </button>
            <button
              className={`badge-pill-btn ${badgeFilter === "unlocked" ? "active" : ""}`}
              onClick={() => setBadgeFilter("unlocked")}
            >
              Đã mở khóa ({badges.filter((b) => b.unlocked).length})
            </button>
            <button
              className={`badge-pill-btn ${badgeFilter === "locked" ? "active" : ""}`}
              onClick={() => setBadgeFilter("locked")}
            >
              Chưa mở khóa ({badges.filter((b) => !b.unlocked).length})
            </button>
          </div>
        </div>

        <div className="badges-grid">
          {filteredBadges.map((badge) => (
            <div
              key={badge.id}
              className={`badge-card-item ${badge.unlocked ? "unlocked" : "locked"}`}
            >
              <div className="badge-card-icon-wrap">
                <span className="badge-emoji-icon">{badge.icon}</span>
                {!badge.unlocked && (
                  <div className="badge-lock-overlay">
                    <Lock size={18} />
                  </div>
                )}
              </div>
              <h4 className="badge-name">{badge.name}</h4>
              <p className="badge-desc">{badge.description}</p>
              <div className="badge-status-tag">
                {badge.unlocked ? (
                  <span className="badge-unlocked-time">✓ Mở khóa {badge.unlockedAt}</span>
                ) : (
                  <span className="badge-locked-text">🔒 Chưa đạt điều kiện</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
