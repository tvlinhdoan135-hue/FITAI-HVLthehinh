import { ArrowRight } from "lucide-react";

interface FitAIProBannerProps {
  onExploreClick?: () => void;
  className?: string;
  showExploreButton?: boolean;
}

export default function FitAIProBanner({
  onExploreClick,
  className = "",
  showExploreButton = true,
}: FitAIProBannerProps) {
  return (
    <div
      className={`fitai-pro-banner-hd-wrapper ${className}`}
      onClick={onExploreClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onExploreClick?.();
        }
      }}
      title="FitAI Pro - Nâng tầm sức khỏe cùng FitAI (Bấm để xem các gói)"
    >
      <img
        src="/images/fitai-pro-banner.jpg"
        alt="FitAI Pro - Nâng tầm sức khỏe cùng FitAI"
        className="fitai-pro-banner-hd-image"
      />
      {showExploreButton && (
        <button
          className="fitai-pro-banner-interactive-btn"
          onClick={(e) => {
            e.stopPropagation();
            onExploreClick?.();
          }}
          aria-label="Khám phá ngay"
        >
          <span>Khám phá ngay</span>
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}
