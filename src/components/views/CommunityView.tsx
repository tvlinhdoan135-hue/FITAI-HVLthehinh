import { useState } from "react";
import {
  Users,
  Heart,
  MessageSquare,
  Trophy,
  Send,
  Flame,
  Crown,
} from "lucide-react";
import type { CommunityPost, UserStats } from "../../types/fitness";

interface CommunityViewProps {
  posts: CommunityPost[];
  userStats: UserStats;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onCreatePost: (content: string) => void;
}

export default function CommunityView({
  posts,
  userStats,
  onLikePost,
  onAddComment,
  onCreatePost,
}: CommunityViewProps) {
  const [activeTab, setActiveTab] = useState<"feed" | "leaderboard">("feed");
  const [newPostText, setNewPostText] = useState("");
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    onCreatePost(newPostText.trim());
    setNewPostText("");
  };

  const handleCommentSubmit = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    onAddComment(postId, text.trim());
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  const leaderboardUsers = [
    { rank: 1, name: "Hoàng Long", level: "Vàng III", xp: 3450, streak: 28, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
    { rank: 2, name: "Lê Thị Mai", level: "Vàng II", xp: 2980, streak: 21, avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80" },
    { rank: 3, name: "Trần Minh", level: "Vàng I", xp: 2650, streak: 18, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" },
    { rank: 4, name: "Nguyễn Văn A (Bạn)", level: userStats.levelTitle, xp: userStats.xp, streak: userStats.streakDays, avatar: userStats.avatar, isCurrentUser: true },
    { rank: 5, name: "Quốc Huy", level: "Bạc II", xp: 1180, streak: 9, avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80" },
    { rank: 6, name: "Bảo Ngọc", level: "Bạc I", xp: 1050, streak: 8, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80" },
  ];

  return (
    <div className="community-page-container">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <span className="page-eyebrow-tag">KẾT NỐI & TRUYỀN CẢM HỨNG</span>
          <h1 className="page-main-title">Cộng đồng FitAI</h1>
          <p className="page-sub-desc">
            Cùng hàng nghìn gymers chia sẻ khoảnh khắc tập luyện, kinh nghiệm ăn uống và cổ vũ nhau mỗi ngày.
          </p>
        </div>

        {/* View Switch Pills */}
        <div className="view-switch-tabs">
          <button
            className={`view-switch-btn ${activeTab === "feed" ? "active" : ""}`}
            onClick={() => setActiveTab("feed")}
          >
            <Users size={16} /> Bảng tin
          </button>
          <button
            className={`view-switch-btn ${activeTab === "leaderboard" ? "active" : ""}`}
            onClick={() => setActiveTab("leaderboard")}
          >
            <Trophy size={16} /> Bảng xếp hạng tuần
          </button>
        </div>
      </div>

      {activeTab === "feed" ? (
        <div className="community-feed-layout">
          {/* Post Creation Box */}
          <div className="create-post-card">
            <div className="create-post-header">
              <img src={userStats.avatar} alt={userStats.name} className="create-post-avatar" />
              <div className="create-post-author-meta">
                <strong>{userStats.name}</strong>
                <span>Cấp độ: {userStats.levelTitle}</span>
              </div>
            </div>

            <form onSubmit={handlePostSubmit}>
              <textarea
                className="post-textarea"
                rows={3}
                placeholder="Chia sẻ thành tích tập luyện hoặc động lực hôm nay của bạn..."
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
              />
              <div className="create-post-footer">
                <span className="post-tip-text">
                  🔥 Gợi ý: Gắn thẻ buổi tập hoặc kỷ lục tạ mới để nhận thêm tương tác!
                </span>
                <button
                  type="submit"
                  className="submit-post-btn"
                  disabled={!newPostText.trim()}
                >
                  <Send size={15} /> Đăng bài
                </button>
              </div>
            </form>
          </div>

          {/* Posts Feed List */}
          <div className="posts-feed-list">
            {posts.map((post) => (
              <div key={post.id} className="post-card-item">
                <div className="post-card-author-row">
                  <img src={post.author.avatar} alt={post.author.name} className="post-author-avatar" />
                  <div className="post-author-text">
                    <div className="author-name-line">
                      <strong>{post.author.name}</strong>
                      <span className="author-level-chip">{post.author.level}</span>
                    </div>
                    <span className="post-time-ago">{post.timeAgo}</span>
                  </div>
                </div>

                <p className="post-content-text">{post.content}</p>

                {/* Highlight Workout Badge */}
                {post.workoutHighlight && (
                  <div className="post-workout-highlight-box">
                    <div className="highlight-icon">
                      <Flame size={18} />
                    </div>
                    <div className="highlight-info">
                      <strong>{post.workoutHighlight.name}</strong>
                      <span>
                        ⏱ {post.workoutHighlight.duration} · 🔥 {post.workoutHighlight.calories} kcal đã đốt
                      </span>
                    </div>
                  </div>
                )}

                {/* Post Actions */}
                <div className="post-actions-bar">
                  <button
                    className={`post-action-btn ${post.isLiked ? "liked" : ""}`}
                    onClick={() => onLikePost(post.id)}
                  >
                    <Heart size={18} fill={post.isLiked ? "currentColor" : "none"} />
                    <span>{post.likes} Thích</span>
                  </button>

                  <button
                    className="post-action-btn"
                    onClick={() =>
                      setActiveCommentPostId((cur) => (cur === post.id ? null : post.id))
                    }
                  >
                    <MessageSquare size={18} />
                    <span>{post.comments.length} Bình luận</span>
                  </button>
                </div>

                {/* Comments Section */}
                {(activeCommentPostId === post.id || post.comments.length > 0) && (
                  <div className="post-comments-container">
                    {post.comments.map((c) => (
                      <div key={c.id} className="comment-bubble-item">
                        <strong>{c.author}</strong>
                        <p>{c.text}</p>
                        <span className="comment-time">{c.timeAgo}</span>
                      </div>
                    ))}

                    {/* Add Comment Input */}
                    <div className="add-comment-input-row">
                      <input
                        type="text"
                        placeholder="Viết lời cổ vũ hoặc bình luận..."
                        value={commentInputs[post.id] || ""}
                        onChange={(e) =>
                          setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleCommentSubmit(post.id);
                          }
                        }}
                      />
                      <button
                        className="send-comment-btn"
                        onClick={() => handleCommentSubmit(post.id)}
                      >
                        <Send size={15} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Leaderboard View */
        <div className="leaderboard-layout">
          {/* Top 3 Podium */}
          <div className="podium-top3-grid">
            {/* Rank 2 - Silver */}
            <div className="podium-item rank-2">
              <div className="podium-avatar-wrap silver">
                <img src={leaderboardUsers[1].avatar} alt={leaderboardUsers[1].name} />
                <span className="podium-badge-icon">🥈</span>
              </div>
              <h4 className="podium-name">{leaderboardUsers[1].name}</h4>
              <span className="podium-level">{leaderboardUsers[1].level}</span>
              <strong className="podium-xp">{leaderboardUsers[1].xp.toLocaleString()} XP</strong>
            </div>

            {/* Rank 1 - Gold */}
            <div className="podium-item rank-1">
              <div className="crown-rank-1">
                <Crown size={28} className="gold-crown" />
              </div>
              <div className="podium-avatar-wrap gold">
                <img src={leaderboardUsers[0].avatar} alt={leaderboardUsers[0].name} />
                <span className="podium-badge-icon">🥇</span>
              </div>
              <h4 className="podium-name">{leaderboardUsers[0].name}</h4>
              <span className="podium-level">{leaderboardUsers[0].level}</span>
              <strong className="podium-xp gold-text">{leaderboardUsers[0].xp.toLocaleString()} XP</strong>
            </div>

            {/* Rank 3 - Bronze */}
            <div className="podium-item rank-3">
              <div className="podium-avatar-wrap bronze">
                <img src={leaderboardUsers[2].avatar} alt={leaderboardUsers[2].name} />
                <span className="podium-badge-icon">🥉</span>
              </div>
              <h4 className="podium-name">{leaderboardUsers[2].name}</h4>
              <span className="podium-level">{leaderboardUsers[2].level}</span>
              <strong className="podium-xp">{leaderboardUsers[2].xp.toLocaleString()} XP</strong>
            </div>
          </div>

          {/* Leaderboard Table List */}
          <div className="leaderboard-table-card">
            <div className="lb-table-head">
              <span>HẠNG</span>
              <span>THÀNH VIÊN</span>
              <span>CHUỖI KỶ LUẬT</span>
              <span>ĐIỂM KINH NGHIỆM</span>
            </div>

            <div className="lb-table-body">
              {leaderboardUsers.map((user) => (
                <div
                  key={user.rank}
                  className={`lb-table-row ${user.isCurrentUser ? "current-user" : ""}`}
                >
                  <div className="lb-rank-num">#{user.rank}</div>
                  <div className="lb-user-info-col">
                    <img src={user.avatar} alt={user.name} className="lb-user-avatar" />
                    <div>
                      <strong>{user.name}</strong>
                      <span>{user.level}</span>
                    </div>
                  </div>
                  <div className="lb-streak-col">🔥 {user.streak} ngày</div>
                  <div className="lb-xp-col">{user.xp.toLocaleString()} XP</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
