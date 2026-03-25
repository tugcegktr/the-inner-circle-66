import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { ZODIAC_SYMBOLS, GENDER_OPTIONS } from "@/data/mockData";
import { StarRating } from "@/components/StarRating";
import { apiUrl } from "@/lib/api";

const BottomNav = ({ active, onNavigate }: { active: string; onNavigate: (s: any) => void }) => {
  const tabs = [
    { id: "discovery", icon: "✦", label: "Keşfet" },
    { id: "matches", icon: "💬", label: "Eşleşmeler" },
    { id: "profile", icon: "👤", label: "Profil" },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 glass border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      <div className="flex">
        {tabs.map(({ id, icon, label }) => (
          <button key={id} onClick={() => onNavigate(id === "discovery" ? "discovery" : id === "matches" ? "matches" : "profile")}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-colors ${active === id ? "text-gold" : "text-foreground/35"}`}>
            <span className="text-lg">{icon}</span>
            <span className="text-xs tracking-wider">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export const ProfileScreen = () => {
  const { currentUser, setCurrentUser, setScreen, registeredUserId } = useApp();
  const [locationVisible, setLocationVisible] = useState(true);
  const [profileHidden, setProfileHidden] = useState(false);
  const [showFreezeConfirm, setShowFreezeConfirm] = useState(false);
  const [freezeLoading, setFreezeLoading] = useState(false);

  const handleFreeze = async () => {
    setFreezeLoading(true);
    try {
      if (registeredUserId) {
        await fetch(apiUrl("/api/users/freeze"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: registeredUserId }),
        });
      }
    } catch { }
    setShowFreezeConfirm(false);
    setFreezeLoading(false);
    setScreen("login");
  };

  const publicRating = currentUser.averageRating ?? 4.3;
  const ratingCount = currentUser.ratingCount ?? 7;

  const genderLabel = GENDER_OPTIONS.find((g) => g.value === currentUser.gender)?.label ?? currentUser.gender;
  const interestedInLabels = currentUser.interestedIn
    .map((g) => GENDER_OPTIONS.find((o) => o.value === g)?.label ?? g)
    .join(", ");

  // Simulated neighbourhood (like Bumble)
  const neighbourhood = "Beşiktaş, İstanbul";

  return (
    <div className="min-h-screen bg-background flex flex-col w-full">
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* Hero photo */}
        <div className="relative h-96">
          <img src={currentUser.photos[0]} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "var(--gradient-card)" }} />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="font-serif text-3xl text-foreground">{currentUser.name}</h1>
                  {currentUser.isVerified && (
                    <div className="verified-badge w-6 h-6 rounded-full flex items-center justify-center text-xs text-primary-foreground font-bold">✓</div>
                  )}
                </div>
                <p className="text-muted-foreground text-sm">{currentUser.age} · {currentUser.height} cm</p>
                {currentUser.profession && (
                  <p className="text-muted-foreground text-sm">💼 {currentUser.profession}</p>
                )}
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-base">📍</span>
                  <span className="text-foreground text-sm font-medium">{currentUser.city}</span>
                </div>
              </div>
              {currentUser.isPremium && (
                <div className="glass-gold px-3 py-1.5 rounded-full">
                  <span className="text-xs text-gold font-medium tracking-wider">GOLD</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 space-y-6 pt-6">
          {/* Premium Gold upgrade banner — shown only for standard members */}
          {currentUser.subscriptionStatus !== "none" && !currentUser.isPremium && (
            <button
              data-testid="button-upgrade-premium"
              onClick={() => setScreen("premium")}
              className="w-full rounded-2xl overflow-hidden border border-[#C9A84C]/40 hover:border-[#C9A84C]/70 transition-all active:scale-95"
            >
              <div className="relative">
                <div className="absolute inset-0 gold-gradient opacity-10" />
                <div className="relative flex items-center justify-between px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center text-primary-foreground text-sm shadow-gold">
                      ✦
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-[#C9A84C]">Premium Gold'a Yükselt</p>
                      <p className="text-xs text-muted-foreground">Seni beğenenleri gör · Sınırsız filtre</p>
                    </div>
                  </div>
                  <span className="text-gold text-lg">›</span>
                </div>
              </div>
            </button>
          )}

          {/* Premium Gold active badge */}
          {currentUser.isPremium && (
            <div className="glass-gold rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center text-primary-foreground text-sm shadow-gold">
                ✦
              </div>
              <div>
                <p className="text-sm font-semibold text-gold">Premium Gold Aktif</p>
                <p className="text-xs text-muted-foreground">Tüm özellikler açık</p>
              </div>
            </div>
          )}

          {/* Public Star Rating */}
          <div className="glass-gold rounded-xl p-4 flex items-center gap-5">
            <StarRating value={publicRating} size="md" />
            <div>
              <p className="text-sm text-foreground font-medium">{publicRating.toFixed(1)} / 5.0</p>
              <p className="text-xs text-muted-foreground">{ratingCount} değerlendirme · Herkese açık</p>
            </div>
          </div>

          {/* Bio */}
          {currentUser.bio && (
            <div>
              <p className="text-foreground text-sm leading-relaxed italic font-serif text-lg">"{currentUser.bio}"</p>
            </div>
          )}

          <div className="luxury-divider" />

          {/* Gender info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface rounded-xl px-4 py-3 border border-border">
              <p className="text-xs text-muted-foreground mb-1">Cinsiyet</p>
              <p className="text-sm text-foreground font-medium">{genderLabel}</p>
            </div>
            <div className="bg-surface rounded-xl px-4 py-3 border border-border">
              <p className="text-xs text-muted-foreground mb-1">İlgilendiği</p>
              <p className="text-sm text-foreground font-medium">{interestedInLabels}</p>
            </div>
          </div>

          {/* Zodiac */}
          <div className="flex items-center gap-4">
            <div className="glass-gold rounded-xl px-4 py-3 flex items-center gap-2">
              <span className="text-2xl">{ZODIAC_SYMBOLS[currentUser.zodiacSign]}</span>
              <div>
                <p className="text-xs text-muted-foreground">Güneş Burcu</p>
                <p className="text-sm text-foreground font-medium">{currentUser.zodiacSign}</p>
              </div>
            </div>
            {currentUser.risingSign && (
              <div className="glass rounded-xl px-4 py-3 flex items-center gap-2">
                <span className="text-2xl">{ZODIAC_SYMBOLS[currentUser.risingSign]}</span>
                <div>
                  <p className="text-xs text-muted-foreground">Yükselen</p>
                  <p className="text-sm text-foreground font-medium">{currentUser.risingSign}</p>
                </div>
              </div>
            )}
          </div>

          {/* Interests */}
          {currentUser.interests.length > 0 && (
            <div>
              <p className="text-xs tracking-widest text-gold uppercase mb-3">İlgi Alanları</p>
              <div className="flex flex-wrap gap-2">
                {currentUser.interests.map((i) => (
                  <span key={i} className="bg-surface border border-border text-foreground text-xs px-3 py-1.5 rounded-full">{i}</span>
                ))}
              </div>
            </div>
          )}

          {/* Photos grid */}
          {currentUser.photos.length > 1 && (
            <div>
              <p className="text-xs tracking-widest text-gold uppercase mb-3">Fotoğraflar</p>
              <div className="grid grid-cols-3 gap-2">
                {currentUser.photos.slice(1).map((photo, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden">
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social links */}
          {(currentUser.instagramHandle || currentUser.linkedinUrl) && (
            <div>
              <p className="text-xs tracking-widest text-gold uppercase mb-3">Sosyal Medya</p>
              <div className="space-y-2">
                {currentUser.instagramHandle && (
                  <div className="flex items-center gap-3 bg-surface rounded-xl px-4 py-3 border border-border">
                    <span>📸</span>
                    <span className="text-sm text-foreground">{currentUser.instagramHandle}</span>
                    <div className="ml-auto text-xs text-gold">Doğrulandı</div>
                  </div>
                )}
                {currentUser.linkedinUrl && (
                  <div className="flex items-center gap-3 bg-surface rounded-xl px-4 py-3 border border-border">
                    <span>💼</span>
                    <span className="text-sm text-foreground truncate">{currentUser.linkedinUrl}</span>
                    <div className="ml-auto text-xs text-gold">Doğrulandı</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          <div>
            <p className="text-xs tracking-widest text-gold uppercase mb-3">Gizlilik Ayarları</p>
            <div className="space-y-3">
              {/* Location toggle */}
              <div className="flex items-center justify-between bg-surface rounded-xl px-4 py-3 border border-border">
                <div>
                  <p className="text-sm text-foreground font-medium">📍 Konum Göster</p>
                  <p className="text-xs text-muted-foreground">Profilinde semtin görünsün</p>
                </div>
                <button
                  onClick={() => setLocationVisible(!locationVisible)}
                  className={`w-12 h-6 rounded-full transition-all relative ${locationVisible ? "gold-gradient" : "bg-muted"}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${locationVisible ? "right-0.5" : "left-0.5"}`} />
                </button>
              </div>

              {/* Profile hidden toggle */}
              <div className="flex items-center justify-between bg-surface rounded-xl px-4 py-3 border border-border">
                <div>
                  <p className="text-sm text-foreground font-medium">🙈 Profili Gizle</p>
                  <p className="text-xs text-muted-foreground">Sadece eşleşmelerin görebilir</p>
                </div>
                <button
                  onClick={() => setProfileHidden(!profileHidden)}
                  className={`w-12 h-6 rounded-full transition-all relative ${profileHidden ? "bg-destructive" : "bg-muted"}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${profileHidden ? "right-0.5" : "left-0.5"}`} />
                </button>
              </div>

              {profileHidden && (
                <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3">
                  <span className="text-destructive text-sm">🙈</span>
                  <p className="text-xs text-destructive">Profilin gizli. Yalnızca eşleşmelerin seni görebilir ve seninle konuşabilir.</p>
                </div>
              )}
            </div>
          </div>

          {/* Neighbourhood (like Bumble) */}
          {locationVisible && (
            <div className="bg-surface rounded-xl px-4 py-3 border border-border flex items-center gap-3">
              <span className="text-base">📍</span>
              <div>
                <p className="text-xs text-muted-foreground">Şu an bulunduğun yer</p>
                <p className="text-sm text-foreground font-medium">{neighbourhood}</p>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-3 pt-2">
            <button onClick={() => setScreen("edit-profile")}
              className="w-full py-4 rounded-xl bg-surface border border-border text-foreground text-sm font-medium hover:border-gold transition-colors">
              ✏️ Profili Düzenle
            </button>
            {!currentUser.isPremium && currentUser.subscriptionStatus === "none" && (
              <button
                data-testid="button-activate-membership"
                onClick={() => setScreen("premium")}
                className="w-full py-4 rounded-xl gold-gradient text-primary-foreground text-sm font-medium tracking-wider transition-all hover:opacity-90 active:scale-95 shadow-gold-sm"
              >
                ✦ Üyeliği Aktifleştir
              </button>
            )}
            {currentUser.subscriptionStatus !== "none" && !currentUser.isPremium && (
              <div className="w-full py-4 rounded-xl bg-surface border border-border text-center text-sm text-muted-foreground">
                ✓ Standart Üyelik Aktif
              </div>
            )}
            {currentUser.isPremium && (
              <div className="w-full py-4 rounded-xl bg-surface border border-gold/30 text-center text-sm text-gold">
                ✦ Premium Gold Aktif
              </div>
            )}
            <button onClick={() => setScreen("login")}
              className="w-full py-3 text-muted-foreground text-sm hover:text-foreground transition-colors">
              Çıkış Yap
            </button>
            <button
              data-testid="button-freeze-account"
              onClick={() => setShowFreezeConfirm(true)}
              className="w-full py-3 text-destructive/70 text-xs hover:text-destructive transition-colors"
            >
              Hesabı Dondur
            </button>
          </div>
        </div>
      </div>

      <BottomNav active="profile" onNavigate={setScreen} />

      {/* Freeze Confirmation Modal */}
      {showFreezeConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="w-full max-w-sm glass rounded-t-3xl p-8 animate-fade-up">
            <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-6" />
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center text-2xl mx-auto mb-4">
                🧊
              </div>
              <h3 className="font-serif text-xl text-foreground mb-2">Hesabı Dondur</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Hesabın dondurulacak. Profilin gizlenecek, üyeliğin pasife alınacak ve otomatik olarak çıkış yapılacak.
                Tekrar giriş yaptığında yeni üyelik ödemesi yapman gerekecek.
              </p>
            </div>
            <button
              data-testid="button-confirm-freeze"
              onClick={handleFreeze}
              disabled={freezeLoading}
              className="w-full py-4 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium mb-3 disabled:opacity-50 transition-all active:scale-95"
            >
              {freezeLoading ? "İşleniyor…" : "Evet, Hesabı Dondur"}
            </button>
            <button
              onClick={() => setShowFreezeConfirm(false)}
              className="w-full py-3 text-muted-foreground text-sm"
            >
              Vazgeç
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
