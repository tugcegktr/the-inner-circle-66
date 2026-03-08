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
  const [showDetail, setShowDetail] = useState(false);
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
    <>
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
            className="w-full h-full object-cover select-none"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
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
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-serif text-2xl text-white font-medium">{card.name}, {card.age}</h3>
                  {card.isVerified && (
                    <div className="verified-badge w-5 h-5 rounded-full flex items-center justify-center text-xs text-primary-foreground font-bold">
                      ✓
                    </div>
                  )}
                </div>
                {card.profession && (
                  <p className="text-white/80 text-xs mb-1">💼 {card.profession}</p>
                )}
                <div className="flex items-center gap-2 text-white/70 text-xs mb-3">
                  <span>📍 {card.city}</span>
                  <span>·</span>
                  <span>↕ {card.height}m</span>
                  <span>·</span>
                  <span>{ZODIAC_SYMBOLS[card.zodiacSign]} {card.zodiacSign}</span>
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
              {/* Detail toggle */}
              <button
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); setShowDetail(true); }}
                className="ml-3 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/80 text-xs hover:border-gold hover:text-gold transition-all flex-shrink-0"
              >
                ↓
              </button>
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

      {/* Full Profile Detail Modal – Bumble style */}
      {showDetail && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center"
          onClick={() => setShowDetail(false)}
        >
          <div
            className="w-full max-w-sm glass rounded-t-3xl overflow-y-auto no-scrollbar max-h-[92vh] animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Photos stacked vertically Bumble-style ── */}
            <div className="relative">
              {card.photos.map((photo, i) => (
                <div key={i} className="relative w-full" style={{ aspectRatio: "4/5" }}>
                  <img
                    src={photo}
                    alt=""
                    className="w-full h-full object-cover select-none"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  {/* Only show name/age overlay on first photo */}
                  {i === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 p-5" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)" }}>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="font-serif text-3xl text-white font-medium">{card.name}, {card.age}</h2>
                        {card.isVerified && (
                          <span className="verified-badge text-xs px-2 py-0.5 rounded-full text-primary-foreground font-bold">✓</span>
                        )}
                      </div>
                      {card.profession && (
                        <p className="text-white/80 text-sm">💼 {card.profession}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* ── Location card at bottom of photos (Bumble style) ── */}
              <div className="px-5 py-4 bg-surface border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-lg flex-shrink-0">
                    📍
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Son Görülme Konumu</p>
                    <p className="text-sm text-foreground font-medium">
                      {card.district ? `${card.district}, ${card.city}` : card.city}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 pb-8 space-y-5 pt-5">
              {/* Rating */}
              {card.averageRating && (
                <div className="flex items-center gap-1">
                  <span className="text-gold text-sm">{'★'.repeat(Math.round(card.averageRating))}</span>
                  <span className="text-xs text-muted-foreground">{card.averageRating.toFixed(1)} ({card.ratingCount} değerlendirme)</span>
                </div>
              )}

              <div className="luxury-divider" />

              {/* Profile details grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "📍", label: "Şehir", value: card.city },
                  { icon: "💼", label: "Meslek", value: card.profession || "—" },
                  { icon: "↕", label: "Boy", value: `${card.height} m` },
                  { icon: ZODIAC_SYMBOLS[card.zodiacSign], label: "Burç", value: card.zodiacSign },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="bg-surface rounded-xl p-3 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">{icon} {label}</p>
                    <p className="text-sm text-foreground font-medium">{value}</p>
                  </div>
                ))}
              </div>

              {/* Interests – all */}
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

              {/* Vibe Tags */}
              {card.vibeTags.length > 0 && (
                <div>
                  <p className="text-xs text-gold uppercase tracking-wider mb-2">Vibe Etiketleri</p>
                  <div className="flex flex-wrap gap-1.5">
                    {card.vibeTags.map((tag) => (
                      <span key={tag} className="text-xs gold-gradient text-primary-foreground px-2.5 py-0.5 rounded-full font-medium">
                        ✦ {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social media (if available) */}
              {(card.instagramHandle || card.linkedinUrl) && (
                <div>
                  <p className="text-xs text-gold uppercase tracking-wider mb-2">Sosyal Medya</p>
                  <div className="space-y-2">
                    {card.instagramHandle && (
                      <div className="flex items-center gap-3 bg-surface rounded-xl px-4 py-3 border border-border">
                        <span className="text-lg">📸</span>
                        <span className="text-sm text-foreground">@{card.instagramHandle}</span>
                      </div>
                    )}
                    {card.linkedinUrl && (
                      <div className="flex items-center gap-3 bg-surface rounded-xl px-4 py-3 border border-border">
                        <span className="text-lg">💼</span>
                        <span className="text-sm text-foreground truncate">{card.linkedinUrl}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowDetail(false)}
                className="w-full py-3 rounded-xl border border-border text-muted-foreground text-sm hover:border-gold hover:text-gold transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
