import { useState } from "react";
import {
  Star,
  MessageSquare,
  Send,
} from "lucide-react";
import type { UserFeedback } from "../../types/admin";

interface AdminFeedbackViewProps {
  feedbacks: UserFeedback[];
  onReplyFeedback: (id: string, reply: string) => void;
}

export default function AdminFeedbackView({
  feedbacks,
  onReplyFeedback,
}: AdminFeedbackViewProps) {
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const filteredFeedbacks = feedbacks.filter((fb) => {
    if (ratingFilter === "all") return true;
    return fb.rating === ratingFilter;
  });

  const handleSendReply = (id: string) => {
    if (!replyText.trim()) return;
    onReplyFeedback(id, replyText.trim());
    setReplyText("");
    setReplyingId(null);
  };

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Quản lý Đánh giá & Phản hồi từ Người dùng</h2>
          <p className="admin-page-desc">
            Lắng nghe ý kiến của 24.8K học viên, giải quyết khiếu nại và phản hồi trực tiếp vào hòm thư tài khoản.
          </p>
        </div>
      </div>

      {/* Rating Summary Card matching mockup 4.8 rating */}
      <div className="admin-feedback-summary-card">
        <div className="rating-overall-col">
          <div className="rating-big-num">4.8</div>
          <div className="stars-row">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={20} color="#fbbf24" fill="#fbbf24" />
            ))}
          </div>
          <div className="total-reviews-count">3,420 lượt đánh giá</div>
        </div>

        <div className="rating-bars-col">
          {[
            { stars: 5, pct: 82 },
            { stars: 4, pct: 12 },
            { stars: 3, pct: 4 },
            { stars: 2, pct: 1 },
            { stars: 1, pct: 1 },
          ].map((item) => (
            <div
              key={item.stars}
              className={`rating-bar-row ${ratingFilter === item.stars ? "active" : ""}`}
              onClick={() =>
                setRatingFilter(ratingFilter === item.stars ? "all" : item.stars)
              }
              style={{ cursor: "pointer" }}
            >
              <span className="stars-lbl">{item.stars} sao</span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${item.pct}%`, backgroundColor: "#fbbf24" }}
                />
              </div>
              <span className="pct-lbl">{item.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="admin-filter-bar">
        <div className="admin-rating-filter-pills">
          <button
            className={`admin-chart-pill ${ratingFilter === "all" ? "active" : ""}`}
            onClick={() => setRatingFilter("all")}
          >
            Tất cả phản hồi ({feedbacks.length})
          </button>
          {[5, 4, 3, 2, 1].map((s) => (
            <button
              key={s}
              className={`admin-chart-pill ${ratingFilter === s ? "active" : ""}`}
              onClick={() => setRatingFilter(s)}
            >
              {s} sao
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Feed */}
      <div className="admin-feedback-feed">
        {filteredFeedbacks.length === 0 ? (
          <div className="text-center py-10 text-muted">
            Không có phản hồi nào ở mức đánh giá này.
          </div>
        ) : (
          filteredFeedbacks.map((fb) => (
            <div key={fb.id} className="admin-feedback-card">
              <div className="fb-top">
                <div className="fb-user-info">
                  <img
                    src={
                      fb.userAvatar ||
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                    }
                    alt={fb.userName || fb.userEmail}
                    className="fb-avatar"
                  />
                  <div>
                    <h4 className="fb-name">{fb.userName || fb.userEmail}</h4>
                    <span className="fb-date">{fb.createdAt}</span>
                  </div>
                </div>

                <div className="fb-stars-category">
                  <div className="stars-mini">
                    {Array.from({ length: fb.rating }).map((_, i) => (
                      <Star key={i} size={14} color="#fbbf24" fill="#fbbf24" />
                    ))}
                  </div>
                  <span className="admin-muscle-pill">{fb.category}</span>
                </div>
              </div>

              <p className="fb-comment-text">{fb.comment}</p>

              {/* Admin reply section */}
              {fb.adminReply ? (
                <div className="fb-admin-reply-box">
                  <div className="reply-header">
                    <span className="badge-admin font-bold">FitAI Team phản hồi:</span>
                  </div>
                  <p className="reply-content">{fb.adminReply}</p>
                </div>
              ) : replyingId === fb.id ? (
                <div className="fb-reply-input-box">
                  <textarea
                    rows={2}
                    placeholder="Nhập nội dung phản hồi gửi đến học viên..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div className="reply-actions">
                    <button
                      className="admin-btn-secondary sm"
                      onClick={() => setReplyingId(null)}
                    >
                      Hủy
                    </button>
                    <button
                      className="admin-primary-btn sm"
                      onClick={() => handleSendReply(fb.id)}
                    >
                      <Send size={13} /> Gửi phản hồi
                    </button>
                  </div>
                </div>
              ) : (
                <div className="fb-actions-row">
                  <button
                    className="admin-btn-reply"
                    onClick={() => {
                      setReplyingId(fb.id);
                      setReplyText("");
                    }}
                  >
                    <MessageSquare size={14} />
                    <span>Trả lời phản hồi</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
