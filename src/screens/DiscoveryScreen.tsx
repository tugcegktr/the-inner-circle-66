import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { MOCK_SWIPE_CARDS, ZODIAC_SIGNS } from "@/data/mockData";
import { SwipeCardComponent } from "@/components/SwipeCard";
import { SwipeCard } from "@/types/app";

interface Filters {
  ageMin: number;
  ageMax: number;
  // premium only
  distanceKm: number;
  heightMin: number;
  heightMax: number;
  zodiac: string;
  interests: string[];
}

const DEFAULT_FILTERS: Filters = {
  ageMin: 0,
  ageMax: 99,
  distanceKm: 100,
  heightMin: 140,
  heightMax: 220,
  zodiac: "",
  interests: [],
};

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
        <p className="text-muted-foreground text-sm text-center mb-8">15 saniyelik sesli mesaj gönder. Dinlendikten sonra kaybolur.</p>
        <div className="flex items-center justify-center gap-1 h-16 mb-8">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-1.5 rounded-full"
              style={{
                background: recording ? "hsl(var(--gold))" : "hsl(var(--border))",
                height: recording ? `${20 + Math.random() * 36}px` : "8px",
                transition: "height 0.3s ease",
              }}
            />
          ))}
        </div>
        {recording && <p className="text-center text-gold text-2xl font-serif mb-6">{seconds}s</p>}
        {!recorded ? (
          <button onClick={startRecording} disabled={recording}
            className={`w-full py-4 rounded-xl font-medium text-sm tracking-wider transition-all ${
              recording ? "bg-destructive text-destructive-foreground" : "gold-gradient text-primary-foreground"
            }`}>
            {recording ? "🔴 Kaydediliyor..." : "🎙 Kayda Başla"}
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-surface rounded-xl p-3 border border-gold/30">
              <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-primary-foreground">▶</div>
              <div>
                <p className="text-sm text-foreground font-medium">Sesli Not</p>
                <p className="text-xs text-muted-foreground">15 saniye · Dinlendikten sonra kaybolur</p>
              </div>
            </div>
            <button onClick={onClose} className="w-full py-4 rounded-xl gold-gradient text-primary-foreground font-medium text-sm tracking-wider">
              Vibe Check Gönder ✦
            </button>
          </div>
        )}
        <button onClick={onClose} className="w-full mt-3 py-3 text-muted-foreground text-sm hover:text-foreground transition-colors">İptal</button>
      </div>
    </div>
  );
};

const FilterSheet = ({
  filters,
  onChange,
  isPremium,
  onClose,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  isPremium: boolean;
  onClose: () => void;
}) => {
  const [local, setLocal] = useState<Filters>(filters);

  const apply = () => { onChange(local); onClose(); };
  const reset = () => { setLocal(DEFAULT_FILTERS); onChange(DEFAULT_FILTERS); onClose(); };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end justify-center">
      <div className="w-full max-w-sm glass rounded-t-3xl p-6 animate-fade-up max-h-[85vh] overflow-y-auto no-scrollbar">
        <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-5" />
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-serif text-xl text-foreground">Filtreler</h3>
          <button onClick={reset} className="text-xs text-muted-foreground hover:text-gold transition-colors">Sıfırla</button>
        </div>

        {/* Age range – all users */}
        <div className="mb-5">
          <label className="text-xs text-gold uppercase tracking-wider mb-3 block">
            Yaş Aralığı: {local.ageMin === 0 ? 18 : local.ageMin}–{local.ageMax === 99 ? "60+" : local.ageMax}
          </label>
          <div className="flex gap-3">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Min</p>
              <input type="range" min={18} max={60} value={local.ageMin === 0 ? 18 : local.ageMin}
                onChange={(e) => setLocal({ ...local, ageMin: +e.target.value })}
                className="w-full accent-[hsl(var(--gold))]" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Max</p>
              <input type="range" min={18} max={60} value={local.ageMax === 99 ? 60 : local.ageMax}
                onChange={(e) => setLocal({ ...local, ageMax: +e.target.value })}
                className="w-full accent-[hsl(var(--gold))]" />
            </div>
          </div>
        </div>

        {/* Premium filters */}
        {!isPremium && (
          <div className="bg-surface rounded-xl p-4 border border-gold/30 mb-4">
            <p className="text-xs text-gold font-medium mb-1">✦ Premium Filtreler</p>
            <p className="text-xs text-muted-foreground">Konum, boy, burç ve ilgi alanı filtresi için Premium Gold üyeliği gerekli.</p>
            <button className="mt-2 text-xs text-gold underline">Premium'a Geç</button>
          </div>
        )}

        {isPremium && (
          <>
            {/* Distance */}
            <div className="mb-5">
              <label className="text-xs text-gold uppercase tracking-wider mb-3 block">
                Maksimum Mesafe: {local.distanceKm} km
              </label>
              <input type="range" min={5} max={200} value={local.distanceKm}
                onChange={(e) => setLocal({ ...local, distanceKm: +e.target.value })}
                className="w-full accent-[hsl(var(--gold))]" />
            </div>

            {/* Height */}
            <div className="mb-5">
              <label className="text-xs text-gold uppercase tracking-wider mb-3 block">
                Boy: {local.heightMin}–{local.heightMax} cm
              </label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Min</p>
                  <input type="range" min={140} max={220} value={local.heightMin}
                    onChange={(e) => setLocal({ ...local, heightMin: +e.target.value })}
                    className="w-full accent-[hsl(var(--gold))]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Max</p>
                  <input type="range" min={140} max={220} value={local.heightMax}
                    onChange={(e) => setLocal({ ...local, heightMax: +e.target.value })}
                    className="w-full accent-[hsl(var(--gold))]" />
                </div>
              </div>
            </div>

            {/* Zodiac */}
            <div className="mb-5">
              <label className="text-xs text-gold uppercase tracking-wider mb-3 block">Burç</label>
              <div className="flex flex-wrap gap-2">
                {["Hepsi", ...ZODIAC_SIGNS].map((z) => (
                  <button key={z}
                    onClick={() => setLocal({ ...local, zodiac: z === "Hepsi" ? "" : z })}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      (z === "Hepsi" && !local.zodiac) || local.zodiac === z
                        ? "gold-gradient text-primary-foreground"
                        : "bg-muted text-muted-foreground border border-border hover:border-gold"
                    }`}>
                    {z}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <button onClick={apply}
          className="w-full py-4 rounded-xl gold-gradient text-primary-foreground font-medium text-sm tracking-wider">
          Filtreleri Uygula
        </button>
      </div>
    </div>
  );
};

export const DiscoveryScreen = () => {
  const { currentUser, setCurrentUser, setScreen } = useApp();
  const isPremium = currentUser.isPremium;
  const maxSwipes = isPremium ? 50 : 15;

  const [cards, setCards] = useState<SwipeCard[]>(MOCK_SWIPE_CARDS);
  const [showVibeCheck, setShowVibeCheck] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [lastSwiped, setLastSwiped] = useState<SwipeCard | null>(null);
  const [showRewindPaywall, setShowRewindPaywall] = useState(false);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const swipesLeft = currentUser.dailySwipesLeft;

  // Apply filters to cards
  const filteredCards = cards.filter((card) => {
    const userAge = currentUser.age;
    const ageMin = filters.ageMin === 0 ? userAge - 5 : filters.ageMin;
    const ageMax = filters.ageMax === 99 ? userAge + 5 : filters.ageMax;
    if (card.age < ageMin || card.age > ageMax) return false;
    if (isPremium && filters.zodiac && card.zodiacSign !== filters.zodiac) return false;
    if (isPremium && filters.interests.length > 0) {
      const hasInterest = filters.interests.some((i) => card.interests.includes(i));
      if (!hasInterest) return false;
    }
    return true;
  });

  const hasActiveFilters = filters.ageMin !== 0 || filters.ageMax !== 99 || filters.zodiac || filters.interests.length > 0;

  const handleSwipeLeft = () => {
    if (filteredCards.length === 0 || swipesLeft <= 0) return;
    setLastSwiped(filteredCards[0]);
    setCards((c) => c.filter((_, i) => i !== 0));
    setCurrentUser({ ...currentUser, dailySwipesLeft: Math.max(0, swipesLeft - 1) });
  };

  const handleSwipeRight = () => {
    if (filteredCards.length === 0 || swipesLeft <= 0) return;
    setLastSwiped(filteredCards[0]);
    setCards((c) => c.filter((_, i) => i !== 0));
    setCurrentUser({ ...currentUser, dailySwipesLeft: Math.max(0, swipesLeft - 1) });
  };

  const handleRewind = () => {
    if (!currentUser.isPremium) { setShowRewindPaywall(true); return; }
    if (lastSwiped) { setCards((c) => [lastSwiped, ...c]); setLastSwiped(null); }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-sm mx-auto">
      {/* Header */}
      <div className="px-6 pt-10 pb-2 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl gold-text">The Club</h1>
          <p className="text-muted-foreground text-xs tracking-wider">
            Bugün {swipesLeft} profil kaldı
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(true)}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors ${
              hasActiveFilters
                ? "bg-gold/20 border-gold text-gold"
                : "bg-surface border-border text-muted-foreground hover:border-gold hover:text-gold"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
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
            style={{ width: `${(swipesLeft / maxSwipes) * 100}%` }}
          />
        </div>
      </div>

      {/* Card stack */}
      <div className="flex-1 px-4 relative">
        {swipesLeft === 0 || filteredCards.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-20 h-20 rounded-full glass-gold mx-auto mb-6 flex items-center justify-center animate-float">
              <span className="text-4xl">✦</span>
            </div>
            <h3 className="font-serif text-2xl text-foreground mb-2">
              {swipesLeft === 0 ? "Yarın Görüşürüz" : "Filtre Sonucu Yok"}
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              {swipesLeft === 0
                ? `The Club, günde ${maxSwipes} profil sunar. Kalite, niceliğin önünde.`
                : "Filtrelerini genişleterek daha fazla profil bulabilirsin."}
            </p>
            {filteredCards.length === 0 && swipesLeft > 0 && (
              <button onClick={() => setFilters(DEFAULT_FILTERS)}
                className="py-3 px-6 rounded-xl gold-gradient text-primary-foreground text-sm font-medium mb-3">
                Filtreleri Temizle
              </button>
            )}
            <button
              onClick={() => setScreen("matches")}
              className="py-3 px-6 rounded-xl border border-border text-muted-foreground text-sm font-medium"
            >
              Eşleşmelerini Gör →
            </button>
          </div>
        ) : (
          <div className="relative h-[520px]">
            {filteredCards.slice(1, 3).map((card, i) => (
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
            <SwipeCardComponent
              card={filteredCards[0]}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              isTop={true}
            />
          </div>
        )}
      </div>

      {/* Action buttons */}
      {filteredCards.length > 0 && swipesLeft > 0 && (
        <div className="px-6 py-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <button onClick={handleSwipeLeft}
              className="w-14 h-14 rounded-full bg-surface border border-border flex items-center justify-center text-xl hover:border-destructive hover:text-destructive transition-all active:scale-95 shadow-luxury">
              ✕
            </button>
            <button onClick={() => setShowVibeCheck(true)}
              className="w-12 h-12 rounded-full glass-gold flex items-center justify-center text-lg hover:shadow-gold transition-all active:scale-95">
              🎙
            </button>
            <button onClick={handleSwipeRight}
              className="w-14 h-14 rounded-full gold-gradient flex items-center justify-center text-xl text-primary-foreground shadow-gold-sm hover:shadow-gold transition-all active:scale-95">
              ✦
            </button>
          </div>
          <div className="flex justify-center">
            <button onClick={handleRewind} disabled={!lastSwiped}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-gold transition-colors disabled:opacity-30">
              ↩ Geri Al {!currentUser.isPremium && <span className="gold-gradient text-primary-foreground px-1.5 py-0.5 rounded text-xs">PRO</span>}
            </button>
          </div>
        </div>
      )}

      <BottomNav active="discovery" onNavigate={setScreen} />

      {showVibeCheck && <VibeCheckModal onClose={() => setShowVibeCheck(false)} />}
      {showFilters && (
        <FilterSheet
          filters={filters}
          onChange={setFilters}
          isPremium={isPremium}
          onClose={() => setShowFilters(false)}
        />
      )}
      {showRewindPaywall && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="glass rounded-2xl p-6 w-full max-w-sm animate-scale-in">
            <p className="font-serif text-xl text-center mb-2">Premium Özellik</p>
            <p className="text-muted-foreground text-sm text-center mb-6">Geri alma özelliği Premium Gold üyeliği gerektirir.</p>
            <button onClick={() => { setShowRewindPaywall(false); setScreen("premium"); }}
              className="w-full py-3 rounded-xl gold-gradient text-primary-foreground text-sm font-medium mb-2">
              Premium'a Geç ✦
            </button>
            <button onClick={() => setShowRewindPaywall(false)} className="w-full py-3 text-muted-foreground text-sm">
              Şimdi Değil
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const BottomNav = ({ active, onNavigate }: { active: string; onNavigate: (s: any) => void }) => {
  const tabs = [
    { id: "discovery", icon: "✦", label: "Keşfet" },
    { id: "matches", icon: "💬", label: "Eşleşmeler" },
    { id: "profile", icon: "👤", label: "Profil" },
  ];
  return (
    <div className="glass border-t border-border">
      <div className="flex">
        {tabs.map(({ id, icon, label }) => (
          <button key={id}
            onClick={() => onNavigate(id === "discovery" ? "discovery" : id === "matches" ? "matches" : "profile")}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-colors ${
              active === id ? "text-gold" : "text-muted-foreground hover:text-foreground"
            }`}>
            <span className="text-lg">{icon}</span>
            <span className="text-xs tracking-wider">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
