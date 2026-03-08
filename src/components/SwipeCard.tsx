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
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const isScrollingRef = useRef(false);

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
    startYRef.current = e.touches[0].clientY;
    isScrollingRef.current = false;
    setIsDragging(true);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - startXRef.current;
    const dy = e.touches[0].clientY - startYRef.current;
    if (!isScrollingRef.current && Math.abs(dy) > Math.abs(dx)) {
      isScrollingRef.current = true;
    }
    if (!isScrollingRef.current) setDragX(dx);
  };
  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (!isScrollingRef.current) {
      if (dragX > 80) { setSwipeDir("right"); setTimeout(onSwipeRight, 350); }
      else if (dragX < -80) { setSwipeDir("left"); setTimeout(onSwipeLeft, 350); }
      else setDragX(0);
    } else {
      setDragX(0);
    }
  };

  const rotation = dragX * 0.08;
  const opacity = 1 - Math.abs(dragX) / 400;

  return (
    <>
      {/* ── Swipe Card ── */}
      <div
        className="absolute inset-0 swipe-card cursor-grab active:cursor-grabbing overflow-y-auto no-scrollbar"
        style={{
          transform: swipeDir === "left"
            ? "rotate(-20deg) translateX(-150%)"
            : swipeDir === "right"
            ? "rotate(20deg) translateX(150%)"
            : `rotate(${rotation}deg) translateX(${dragX}px)`,
          transition: isDragging ? "none" : "transform 0.35s ease",
          opacity: swipeDir ? 0 : opacity,
          zIndex: isTop ? 10 : 5,
          borderRadius: "1.5rem",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* ── Cover Photo ── */}
        <div className="relative w-full flex-shrink-0" style={{ aspectRatio: "3/4" }}>
          <img
            src={card.photos[0]}
            alt={card.name}
            className="w-full h-full object-cover select-none"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          />

          {/* Swipe indicator overlays */}
          {dragX > 30 && (
            <div className="absolute inset-0 bg-green-500/20 flex items-start justify-start p-6 pointer-events-none">
              <div className="border-2 border-green-400 text-green-400 rounded-lg px-4 py-2 rotate-[-20deg] font-bold text-2xl font-serif">
                LIKE
              </div>
            </div>
          )}
          {dragX < -30 && (
            <div className="absolute inset-0 bg-red-500/20 flex items-start justify-end p-6 pointer-events-none">
              <div className="border-2 border-red-400 text-red-400 rounded-lg px-4 py-2 rotate-[20deg] font-bold text-2xl font-serif">
                PASS
              </div>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)" }} />

          {/* Info overlay on cover */}
          <div className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none">
            {card.compatibilityScore && (
              <div className="flex items-center gap-2 mb-3">
                <div className="glass-gold rounded-full px-3 py-1 text-xs flex items-center gap-1.5">
                  <span>{ZODIAC_SYMBOLS[card.zodiacSign]}</span>
                  <span className="text-gold font-medium">{card.compatibilityScore}% Match</span>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-serif text-2xl text-white font-medium">{card.name}, {card.age}</h3>
              {card.isVerified && (
                <div className="verified-badge w-5 h-5 rounded-full flex items-center justify-center text-xs text-primary-foreground font-bold flex-shrink-0">✓</div>
              )}
            </div>
            {card.profession && (
              <p className="text-white/80 text-xs mb-1">💼 {card.profession}</p>
            )}
            <div className="flex items-center gap-2 text-white/70 text-xs">
              <span>📍 {card.district ? `${card.district}, ${card.city}` : card.city}</span>
              <span>·</span>
              <span>↕ {card.height}m</span>
              <span>·</span>
              <span>{ZODIAC_SYMBOLS[card.zodiacSign]} {card.zodiacSign}</span>
            </div>
          </div>
        </div>

        {/* ── Scrollable content below cover ── */}
        <div className="bg-background px-5 py-5 space-y-5">
          {/* Interests */}
          {card.interests.length > 0 && (
            <div>
              <p className="text-xs text-gold uppercase tracking-wider mb-2">İlgi Alanları</p>
              <div className="flex flex-wrap gap-1.5">
                {card.interests.map((interest) => (
                  <span key={interest} className="text-xs bg-surface border border-border text-muted-foreground px-2.5 py-1 rounded-full">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Music taste */}
          {card.musicTaste && card.musicTaste.length > 0 && (
            <div>
              <p className="text-xs text-gold uppercase tracking-wider mb-2">🎵 Müzik Zevki</p>
              <div className="flex flex-wrap gap-1.5">
                {card.musicTaste.map((genre) => (
                  <span key={genre} className="text-xs bg-surface border border-border text-muted-foreground px-2.5 py-1 rounded-full">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Rest of photos stacked ── */}
        {card.photos.slice(1).map((photo, i) => (
          <div key={i} className="relative w-full flex-shrink-0" style={{ aspectRatio: "3/4" }}>
            <img
              src={photo}
              alt=""
              className="w-full h-full object-cover select-none"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        ))}

        {/* Bottom padding */}
        <div className="h-6 bg-background" />
      </div>
    </>
  );
};
