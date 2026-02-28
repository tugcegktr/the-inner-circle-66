import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { MOCK_SWIPE_CARDS } from "@/data/mockData";
import { SwipeCardComponent } from "@/components/SwipeCard";
import { SwipeCard } from "@/types/app";

const VibeCheckModal = ({ onClose }: { onClose: () => void }) => {
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [seconds, setSeconds] = useState(15);

  const startRecording = () => {
    setRecording(true);
    let s = 15;
    const interval = setInterval(() => {
      s -= 1;
      setSeconds(s);
      if (s <= 0) { clearInterval(interval); setRecording(false); setRecorded(true); }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center">
      <div className="w-full max-w-sm glass rounded-t-3xl p-8 animate-fade-up">
        <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-6" />
        <h3 className="font-serif text-2xl text-center mb-1">Vibe Check</h3>
        <p className="text-muted-foreground text-sm text-center mb-8">Send a 15-second voice note. It disappears after listening.</p>

        {/* Waveform visualization */}
        <div className="flex items-center justify-center gap-1 h-16 mb-8">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="w-1.5 rounded-full"
              style={{
                background: recording ? "hsl(var(--gold))" : "hsl(var(--border))",
                height: recording ? `${20 + Math.random() * 36}px` : "8px",
                animation: recording ? `voice-wave ${0.4 + (i % 3) * 0.2}s ease-in-out infinite` : "none",
                animationDelay: `${i * 0.05}s`,
                transition: "height 0.3s ease",
              }}
            />
          ))}
        </div>

        {recording && (
          <p className="text-center text-gold text-2xl font-serif mb-6">{seconds}s</p>
        )}

        {!recorded ? (
          <button
            onClick={startRecording}
            disabled={recording}
            className={`w-full py-4 rounded-xl font-medium text-sm tracking-wider transition-all ${
              recording ? "bg-destructive text-destructive-foreground" : "gold-gradient text-primary-foreground"
            }`}
          >
            {recording ? "🔴 Recording..." : "🎙 Start Recording"}
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-surface rounded-xl p-3 border border-gold/30">
              <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-primary-foreground">▶</div>
              <div>
                <p className="text-sm text-foreground font-medium">Voice Note</p>
                <p className="text-xs text-muted-foreground">15 seconds · Disappears after play</p>
              </div>
            </div>
            <button onClick={onClose} className="w-full py-4 rounded-xl gold-gradient text-primary-foreground font-medium text-sm tracking-wider">
              Send Vibe Check ✦
            </button>
          </div>
        )}

        <button onClick={onClose} className="w-full mt-3 py-3 text-muted-foreground text-sm hover:text-foreground transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
};

export const DiscoveryScreen = () => {
  const { currentUser, setCurrentUser, setScreen } = useApp();
  const [cards, setCards] = useState<SwipeCard[]>(MOCK_SWIPE_CARDS);
  const [showVibeCheck, setShowVibeCheck] = useState(false);
  const [rewindUsed, setRewindUsed] = useState(false);
  const [lastSwiped, setLastSwiped] = useState<SwipeCard | null>(null);
  const [showRewindPaywall, setShowRewindPaywall] = useState(false);
  const swipesLeft = currentUser.dailySwipesLeft;

  const handleSwipeLeft = () => {
    if (cards.length === 0 || swipesLeft <= 0) return;
    setLastSwiped(cards[0]);
    setCards((c) => c.slice(1));
    setCurrentUser({ ...currentUser, dailySwipesLeft: Math.max(0, swipesLeft - 1) });
  };

  const handleSwipeRight = () => {
    if (cards.length === 0 || swipesLeft <= 0) return;
    setLastSwiped(cards[0]);
    setCards((c) => c.slice(1));
    setCurrentUser({ ...currentUser, dailySwipesLeft: Math.max(0, swipesLeft - 1) });
  };

  const handleRewind = () => {
    if (!currentUser.isPremium) { setShowRewindPaywall(true); return; }
    if (lastSwiped) { setCards((c) => [lastSwiped, ...c]); setLastSwiped(null); }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-sm mx-auto">
      {/* Header */}
      <div className="px-6 pt-10 pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl gold-text">The Club</h1>
          <p className="text-muted-foreground text-xs tracking-wider">
            {swipesLeft} curated {swipesLeft === 1 ? "profile" : "profiles"} today
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center text-muted-foreground hover:border-gold hover:text-gold transition-colors text-sm">
            🔍
          </button>
          <button
            onClick={() => setScreen("profile")}
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-gold"
          >
            <img src={currentUser.photos[0]} alt="" className="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      {/* Daily limit bar */}
      <div className="px-6 mb-4">
        <div className="h-1 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full gold-gradient rounded-full transition-all duration-500"
            style={{ width: `${(swipesLeft / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Card stack */}
      <div className="flex-1 px-4 relative">
        {swipesLeft === 0 || cards.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-20 h-20 rounded-full glass-gold mx-auto mb-6 flex items-center justify-center animate-float">
              <span className="text-4xl">✦</span>
            </div>
            <h3 className="font-serif text-2xl text-foreground mb-2">Come Back Tomorrow</h3>
            <p className="text-muted-foreground text-sm mb-6">
              The Club curates 5 exclusive profiles daily. Quality over quantity.
            </p>
            <button
              onClick={() => setScreen("matches")}
              className="py-3 px-6 rounded-xl gold-gradient text-primary-foreground text-sm font-medium"
            >
              See Your Matches →
            </button>
          </div>
        ) : (
          <div className="relative h-[520px]">
            {/* Stack background cards */}
            {cards.slice(1, 3).map((card, i) => (
              <div
                key={card.id}
                className="absolute inset-0 rounded-3xl overflow-hidden"
                style={{
                  transform: `scale(${1 - (i + 1) * 0.04}) translateY(${(i + 1) * 8}px)`,
                  zIndex: 5 - i,
                }}
              >
                <img src={card.photos[0]} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "var(--gradient-card)" }} />
              </div>
            ))}

            {/* Top card */}
            <SwipeCardComponent
              card={cards[0]}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              isTop={true}
            />
          </div>
        )}
      </div>

      {/* Action buttons */}
      {cards.length > 0 && swipesLeft > 0 && (
        <div className="px-6 py-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            {/* Pass */}
            <button
              onClick={handleSwipeLeft}
              className="w-14 h-14 rounded-full bg-surface border border-border flex items-center justify-center text-xl hover:border-destructive hover:text-destructive transition-all active:scale-95 shadow-luxury"
            >
              ✕
            </button>

            {/* Vibe Check */}
            <button
              onClick={() => setShowVibeCheck(true)}
              className="w-12 h-12 rounded-full glass-gold flex items-center justify-center text-lg hover:shadow-gold transition-all active:scale-95"
            >
              🎙
            </button>

            {/* Like */}
            <button
              onClick={handleSwipeRight}
              className="w-14 h-14 rounded-full gold-gradient flex items-center justify-center text-xl text-primary-foreground shadow-gold-sm hover:shadow-gold transition-all active:scale-95"
            >
              ✦
            </button>
          </div>

          {/* Rewind */}
          <div className="flex justify-center">
            <button
              onClick={handleRewind}
              disabled={!lastSwiped}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-gold transition-colors disabled:opacity-30"
            >
              ↩ Rewind {!currentUser.isPremium && <span className="gold-gradient text-primary-foreground px-1.5 py-0.5 rounded text-xs">PRO</span>}
            </button>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <BottomNav active="discover" onNavigate={setScreen} />

      {/* Modals */}
      {showVibeCheck && <VibeCheckModal onClose={() => setShowVibeCheck(false)} />}
      {showRewindPaywall && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="glass rounded-2xl p-6 w-full max-w-sm animate-scale-in">
            <p className="font-serif text-xl text-center mb-2">Premium Feature</p>
            <p className="text-muted-foreground text-sm text-center mb-6">Rewind requires a Premium Gold subscription.</p>
            <button onClick={() => { setShowRewindPaywall(false); setScreen("premium"); }} className="w-full py-3 rounded-xl gold-gradient text-primary-foreground text-sm font-medium mb-2">
              Upgrade to Premium ✦
            </button>
            <button onClick={() => setShowRewindPaywall(false)} className="w-full py-3 text-muted-foreground text-sm">
              Not now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Bottom Navigation
const BottomNav = ({ active, onNavigate }: { active: string; onNavigate: (s: any) => void }) => {
  const tabs = [
    { id: "discovery", icon: "✦", label: "Discover" },
    { id: "matches", icon: "💬", label: "Matches" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];

  return (
    <div className="glass border-t border-border">
      <div className="flex">
        {tabs.map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() => onNavigate(id === "discovery" ? "discovery" : id === "matches" ? "matches" : "profile")}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-colors ${
              active === id ? "text-gold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="text-lg">{icon}</span>
            <span className="text-xs tracking-wider">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
