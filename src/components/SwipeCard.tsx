import React, { useState, useRef } from "react";
import { SwipeCard } from "@/types/app";
import { ZODIAC_SYMBOLS } from "@/data/mockData";

interface SwipeCardProps {
  card: SwipeCard;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isTop: boolean;
  stackIndex?: number;
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
            <div className="absolute inset-0 flex items-start justify-start p-6 pointer-events-none" style={{ background: "rgba(34,197,94,0.2)" }}>
              <div className="rounded-lg px-4 py-2 rotate-[-20deg] font-bold text-2xl font-serif" style={{ border: "2px solid rgb(74,222,128)", color: "rgb(74,222,128)" }}>
                LIKE
              </div>
            </div>
          )}
          {dragX < -30 && (
            <div className="absolute inset-0 flex items-start justify-end p-6 pointer-events-none" style={{ background: "rgba(239,68,68,0.2)" }}>
              <div className="rounded-lg px-4 py-2 rotate-[20deg] font-bold text-2xl font-serif" style={{ border: "2px solid rgb(248,113,113)", color: "rgb(248,113,113)" }}>
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

          {/* Vibe tags – max 3 */}
          {card.vibeTags.length > 0 && (
            <div>
              <p className="text-xs text-gold uppercase tracking-wider mb-2">✦ Vibe Etiketleri</p>
              <div className="flex flex-wrap gap-1.5">
                {card.vibeTags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs gold-gradient text-primary-foreground px-2.5 py-1 rounded-full font-medium">
                    ✦ {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Star rating */}
          {card.averageRating && card.ratingCount && (
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = star <= Math.round(card.averageRating!);
                  return (
                    <span key={star} className={`text-xl leading-none ${filled ? "text-gold" : "text-muted-foreground"}`}>
                      ★
                    </span>
                  );
                })}
              </div>
              <span className="text-sm font-medium text-foreground">{card.averageRating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({card.ratingCount} oy)</span>
            </div>
          )}

          {/* Looking For */}
          {card.lookingFor && card.lookingFor.length > 0 && (
            <div>
              <p className="text-xs text-gold uppercase tracking-wider mb-2">Ne Arıyor?</p>
              <div className="flex flex-wrap gap-1.5">
                {card.lookingFor.map((lf) => {
                  const map: Record<string, { label: string; emoji: string }> = {
                    dating: { label: "Dating", emoji: "💛" },
                    networking: { label: "Networking", emoji: "🤝" },
                    friendship: { label: "Friendship", emoji: "✨" },
                  };
                  const item = map[lf];
                  return item ? (
                    <span key={lf} className="text-xs bg-surface border border-border text-foreground px-2.5 py-1 rounded-full flex items-center gap-1">
                      <span>{item.emoji}</span>
                      <span>{item.label}</span>
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Bio */}
          {card.bio && (
            <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 pl-3" style={{ borderColor: "hsl(var(--gold)/0.4)" }}>
              "{card.bio}"
            </p>
          )}

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

        {/* ── Location after photos ── */}
        <div className="bg-background px-5 py-5 border-t border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-lg flex-shrink-0">
            📍
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Son Görülme Konumu</p>
            <p className="text-sm text-foreground font-medium">
              {card.district ? `${card.district}, ${card.city}` : card.city}
            </p>
          </div>
        </div>

        {/* Bottom padding */}
        <div className="h-6 bg-background" />
      </div>
    </>
  );
};
