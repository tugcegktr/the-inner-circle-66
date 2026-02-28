import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { MOCK_MATCHES, MOCK_LIKED_BY, VIBE_TAGS } from "@/data/mockData";
import { Match, VibeTag } from "@/types/app";
import { StarRating } from "@/components/StarRating";

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
          <button key={id} onClick={() => onNavigate(id === "discovery" ? "discovery" : id === "matches" ? "matches" : "profile")}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-colors ${active === id ? "text-gold" : "text-muted-foreground hover:text-foreground"}`}>
            <span className="text-lg">{icon}</span>
            <span className="text-xs tracking-wider">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const VibeTagModal = ({ name, onClose }: { name: string; onClose: () => void }) => {
  const [selected, setSelected] = useState<VibeTag[]>([]);
  const [sent, setSent] = useState(false);

  if (sent) return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="glass rounded-2xl p-8 w-full max-w-sm text-center animate-scale-in">
        <div className="text-5xl mb-4">✦</div>
        <h3 className="font-serif text-2xl mb-2">Etiketler Gönderildi</h3>
        <p className="text-muted-foreground text-sm mb-6">{name} için özel etiketlerin anonim olarak kaydedildi.</p>
        <button onClick={onClose} className="w-full py-3 rounded-xl gold-gradient text-primary-foreground text-sm font-medium">Tamam</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center">
      <div className="w-full max-w-sm glass rounded-t-3xl p-8 animate-fade-up">
        <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-6" />
        <h3 className="font-serif text-2xl mb-1">Vibe Etiketi Bırak</h3>
        <p className="text-muted-foreground text-sm mb-6">{name} için — anonim ve sadece kadın üyelere özel.</p>
        <div className="flex flex-wrap gap-2 mb-8">
          {VIBE_TAGS.map((tag) => (
            <button key={tag} onClick={() => {
              const t = tag as VibeTag;
              setSelected(selected.includes(t) ? selected.filter(x => x !== t) : [...selected, t]);
            }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selected.includes(tag as VibeTag) ? "gold-gradient text-primary-foreground" : "bg-surface border border-border text-muted-foreground hover:border-gold"
              }`}>
              {tag}
            </button>
          ))}
        </div>
        <button disabled={selected.length === 0} onClick={() => setSent(true)}
          className="w-full py-4 rounded-xl gold-gradient text-primary-foreground text-sm font-medium disabled:opacity-40 mb-3">
          Anonim Gönder
        </button>
        <button onClick={onClose} className="w-full py-3 text-muted-foreground text-sm">İptal</button>
      </div>
    </div>
  );
};

const RateMatchModal = ({ match, onClose, onRate }: {
  match: Match;
  onClose: () => void;
  onRate: (matchId: string, rating: number) => void;
}) => {
  const [rating, setRating] = useState(match.myRating || 0);
  const [sent, setSent] = useState(false);

  if (sent) return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="glass rounded-2xl p-8 w-full max-w-sm text-center animate-scale-in">
        <div className="flex justify-center mb-4">
          <StarRating value={rating} size="lg" />
        </div>
        <h3 className="font-serif text-2xl mb-2">Değerlendirme Gönderildi</h3>
        <p className="text-muted-foreground text-sm mb-6">
          {match.name} için {rating} yıldız verdin. Bu değerlendirme herkese açık olarak profilinde görünecek.
        </p>
        <button onClick={onClose} className="w-full py-3 rounded-xl gold-gradient text-primary-foreground text-sm font-medium">Tamam</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center">
      <div className="w-full max-w-sm glass rounded-t-3xl p-8 animate-fade-up">
        <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-6" />

        <div className="flex items-center gap-4 mb-6">
          <img src={match.photo} alt={match.name} className="w-14 h-14 rounded-full object-cover" />
          <div>
            <h3 className="font-serif text-xl">{match.name}</h3>
            <p className="text-muted-foreground text-xs">{match.city}</p>
          </div>
        </div>

        <h3 className="font-serif text-xl text-center mb-2">Bu Eşleşmeyi Değerlendir</h3>
        <p className="text-muted-foreground text-sm text-center mb-8">
          Değerlendirmen {match.name}'in profilinde <span className="text-gold">herkese açık</span> olarak görünecek.
        </p>

        <div className="flex justify-center mb-8">
          <StarRating value={rating} onChange={setRating} size="lg" />
        </div>

        {rating > 0 && (
          <p className="text-center text-sm text-foreground mb-6 animate-fade-in">
            {["", "😕 Hayal Kırıklığı", "😐 Ortalama", "🙂 İyiydi", "😊 Çok İyi", "🌟 Mükemmel"][rating]}
          </p>
        )}

        <button
          disabled={rating === 0}
          onClick={() => { onRate(match.id, rating); setSent(true); }}
          className="w-full py-4 rounded-xl gold-gradient text-primary-foreground text-sm font-medium disabled:opacity-40 mb-3"
        >
          Değerlendirmeyi Gönder ✦
        </button>
        <button onClick={onClose} className="w-full py-3 text-muted-foreground text-sm">İptal</button>
      </div>
    </div>
  );
};

export const MatchesScreen = () => {
  const { currentUser, setScreen } = useApp();
  const [activeTab, setActiveTab] = useState<"matches" | "likes">("matches");
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);
  const [vibeTagTarget, setVibeTagTarget] = useState<string | null>(null);
  const [rateTarget, setRateTarget] = useState<Match | null>(null);

  const handleRate = (matchId: string, rating: number) => {
    setMatches((prev) =>
      prev.map((m) => m.id === matchId ? { ...m, myRating: rating } : m)
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-sm mx-auto">
      <div className="px-6 pt-10 pb-4">
        <h1 className="font-serif text-3xl text-foreground mb-4">Bağlantılar</h1>
        <div className="flex gap-1 bg-surface rounded-xl p-1">
          {(["matches", "likes"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? "gold-gradient text-primary-foreground" : "text-muted-foreground"}`}>
              {tab === "matches" ? "✦ Eşleşmeler" : "❤ Seni Beğenenler"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-24">
        {activeTab === "matches" ? (
          <div className="space-y-3">
            {matches.map((match) => (
              <div key={match.id} className="bg-surface rounded-xl p-4 border border-border">
                <div className="flex items-center gap-4 mb-3">
                  <div className="relative">
                    <img src={match.photo} alt={match.name} className="w-14 h-14 rounded-full object-cover" />
                    {match.isVerified && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 verified-badge rounded-full flex items-center justify-center text-xs text-primary-foreground font-bold">✓</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-foreground font-medium text-sm">{match.name}</p>
                      {match.hasVibeCheck && (
                        <div className="w-2 h-2 rounded-full gold-gradient animate-pulse-gold" />
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs">📍 {match.city}</p>
                    <p className="text-muted-foreground text-xs">
                      {match.hasVibeCheck ? "🎙 Vibe Check gönderdi" : "Yakın zamanda eşleşti"}
                    </p>
                  </div>
                  {/* Their public rating */}
                  {match.averageRating && (
                    <div className="text-right">
                      <div className="text-gold text-sm">{'★'.repeat(Math.round(match.averageRating))}</div>
                      <p className="text-xs text-muted-foreground">{match.averageRating.toFixed(1)}</p>
                    </div>
                  )}
                </div>

                {/* Rating row */}
                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  {match.myRating ? (
                    <div className="flex-1 flex items-center gap-2">
                      <StarRating value={match.myRating} size="sm" />
                      <span className="text-xs text-muted-foreground">Değerlendirdin</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setRateTarget(match)}
                      className="flex-1 text-xs text-gold hover:underline text-left"
                    >
                      ★ Değerlendir
                    </button>
                  )}
                  <button
                    onClick={() => setVibeTagTarget(match.name)}
                    className="text-xs text-muted-foreground hover:text-gold transition-colors"
                  >
                    + Vibe Tag
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {!currentUser.isPremium && (
              <div className="glass-gold rounded-xl p-4 mb-4">
                <p className="text-sm font-medium text-foreground mb-1">🔒 Gizlendi</p>
                <p className="text-xs text-muted-foreground mb-3">{MOCK_LIKED_BY.length} üye profilini beğendi. Görmek için Premium'a geç.</p>
                <button onClick={() => setScreen("premium")}
                  className="w-full py-2.5 rounded-lg gold-gradient text-primary-foreground text-xs font-medium tracking-wider">
                  Premium Gold ile Aç ✦
                </button>
              </div>
            )}
            <div className="space-y-3">
              {MOCK_LIKED_BY.map((user) => (
                <div key={user.id} className={`bg-surface rounded-xl p-4 border border-border flex items-center gap-4 ${!currentUser.isPremium ? "opacity-70" : ""}`}>
                  <div className="relative">
                    <img src={user.photo} alt="" className={`w-14 h-14 rounded-full object-cover ${!currentUser.isPremium ? "blur-premium" : ""}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${!currentUser.isPremium ? "blur-premium select-none" : "text-foreground"}`}>
                      {currentUser.isPremium ? user.name : "Gizli"}
                    </p>
                    <p className="text-muted-foreground text-xs">Profilini beğendi</p>
                  </div>
                  {user.isVerified && currentUser.isPremium && (
                    <div className="verified-badge w-5 h-5 rounded-full flex items-center justify-center text-xs text-primary-foreground font-bold">✓</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav active="matches" onNavigate={setScreen} />

      {vibeTagTarget && <VibeTagModal name={vibeTagTarget} onClose={() => setVibeTagTarget(null)} />}
      {rateTarget && (
        <RateMatchModal
          match={rateTarget}
          onClose={() => setRateTarget(null)}
          onRate={handleRate}
        />
      )}
    </div>
  );
};
