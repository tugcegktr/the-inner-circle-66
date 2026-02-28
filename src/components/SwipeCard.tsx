import React, { useState, useRef } from "react";
import { SwipeCard } from "@/types/app";
import { ZODIAC_SYMBOLS } from "@/data/mockData";

interface SwipeCardProps {
  card: SwipeCard;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isTop: boolean;
}

export const SwipeCardComponent = ({ card, onSwipeLeft, onSwipeRight, isTop }: SwipeCardProps) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | null>(null);
  const startXRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isTop) return;
    startXRef.current = e.clientX;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setDragX(e.clientX - startXRef.current);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragX > 80) { setSwipeDir("right"); setTimeout(onSwipeRight, 350); }
    else if (dragX < -80) { setSwipeDir("left"); setTimeout(onSwipeLeft, 350); }
    else setDragX(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isTop) return;
    startXRef.current = e.touches[0].clientX;
    setIsDragging(true);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setDragX(e.touches[0].clientX - startXRef.current);
  };
  const handleTouchEnd = handleMouseUp;

  const rotation = dragX * 0.08;
  const opacity = 1 - Math.abs(dragX) / 400;

  return (
    <div
      className="absolute inset-0 swipe-card cursor-grab active:cursor-grabbing"
      style={{
        transform: swipeDir === "left"
          ? "rotate(-20deg) translateX(-150%)"
          : swipeDir === "right"
          ? "rotate(20deg) translateX(150%)"
          : `rotate(${rotation}deg) translateX(${dragX}px)`,
        transition: isDragging ? "none" : "transform 0.35s ease",
        opacity: swipeDir ? 0 : opacity,
        zIndex: isTop ? 10 : 5,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-full h-full rounded-3xl overflow-hidden relative shadow-card">
        {/* Photo */}
        <img
          src={card.photos[photoIndex]}
          alt={card.name}
          className="w-full h-full object-cover"
          draggable={false}
        />

        {/* Photo tap areas */}
        <div className="absolute inset-0 flex">
          <div className="flex-1" onClick={() => setPhotoIndex(Math.max(0, photoIndex - 1))} />
          <div className="flex-1" onClick={() => setPhotoIndex(Math.min(card.photos.length - 1, photoIndex + 1))} />
        </div>

        {/* Photo dots */}
        {card.photos.length > 1 && (
          <div className="absolute top-3 left-3 right-3 flex gap-1">
            {card.photos.map((_, i) => (
              <div key={i} className="flex-1 h-0.5 rounded-full" style={{ background: i === photoIndex ? "hsl(var(--gold))" : "rgba(255,255,255,0.4)" }} />
            ))}
          </div>
        )}

        {/* Swipe indicator overlays */}
        {dragX > 30 && (
          <div className="absolute inset-0 bg-green-500/20 flex items-start justify-start p-6">
            <div className="border-2 border-green-400 text-green-400 rounded-lg px-4 py-2 rotate-[-20deg] font-bold text-2xl font-serif">
              LIKE
            </div>
          </div>
        )}
        {dragX < -30 && (
          <div className="absolute inset-0 bg-red-500/20 flex items-start justify-end p-6">
            <div className="border-2 border-red-400 text-red-400 rounded-lg px-4 py-2 rotate-[20deg] font-bold text-2xl font-serif">
              PASS
            </div>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: "var(--gradient-card)" }} />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          {/* Compatibility */}
          {card.compatibilityScore && (
            <div className="flex items-center gap-2 mb-3">
              <div className="glass-gold rounded-full px-3 py-1 text-xs flex items-center gap-1.5">
                <span>{ZODIAC_SYMBOLS[card.zodiacSign]}</span>
                <span className="text-gold font-medium">{card.compatibilityScore}% Match</span>
              </div>
            </div>
          )}

          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-serif text-2xl text-white font-medium">{card.name}, {card.age}</h3>
                {card.isVerified && (
                  <div className="verified-badge w-5 h-5 rounded-full flex items-center justify-center text-xs text-primary-foreground font-bold">
                    ✓
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-white/70 text-xs mb-3">
                <span>📍 {card.city}</span>
                <span>·</span>
                <span>↕ {card.height}</span>
              </div>
              {/* Interests */}
              <div className="flex flex-wrap gap-1.5">
                {card.interests.slice(0, 3).map((interest) => (
                  <span key={interest} className="text-xs bg-black/40 backdrop-blur-sm text-white/80 px-2.5 py-1 rounded-full border border-white/10">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Vibe Tags */}
          {card.vibeTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {card.vibeTags.map((tag) => (
                <span key={tag} className="text-xs gold-gradient text-primary-foreground px-2.5 py-0.5 rounded-full font-medium">
                  ✦ {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
