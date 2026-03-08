import React, { useState } from "react";
import { useApp } from "@/context/AppContext";

type PlanTier = "standard" | "premium";

const PLANS: Record<PlanTier, {
  id: PlanTier;
  label: string;
  badge: string | null;
  monthly: { price: string; originalPrice: string; total: string };
  yearly: { price: string; originalPrice: string; total: string };
  features: { icon: string; text: string }[];
}> = {
  standard: {
    id: "standard",
    label: "Standart Üyelik",
    badge: null,
    monthly: { price: "₺249,90", originalPrice: "₺399,90", total: "Aylık ₺249,90" },
    yearly: { price: "₺199,90", originalPrice: "₺349,90", total: "Yıllık ₺2.398,80" },
    features: [
      { icon: "✦", text: "Günde 15 profil görüntüleme" },
      { icon: "💬", text: "Sınırsız eşleşme & mesajlaşma" },
      { icon: "⭐", text: "Eşleşmene yıldız ver" },
      { icon: "📍", text: "Konum bazlı keşif" },
      { icon: "🔒", text: "Profil gizleme özelliği" },
      { icon: "🔍", text: "Yaş filtresi" },
    ],
  },
  premium: {
    id: "premium",
    label: "Premium Gold",
    badge: "EN POPÜLER",
    monthly: { price: "₺449,90", originalPrice: "₺649,90", total: "Aylık ₺449,90" },
    yearly: { price: "₺349,90", originalPrice: "₺549,90", total: "Yıllık ₺4.198,80" },
    features: [
      { icon: "👁", text: "Seni beğenenleri fotoğraflı gör" },
      { icon: "✦", text: "Günde 50 profil görüntüleme" },
      { icon: "↩", text: "Sınırsız geri alma" },
      { icon: "🎙", text: "Sınırsız Vibe Check" },
      { icon: "⚡", text: "Keşifte öncelikli görünüm" },
      { icon: "🏆", text: "Profilinde Altın rozet" },
      { icon: "🔍", text: "Gelişmiş filtreler (boy, burç, konum, ilgi alanı)" },
    ],
  },
};

type BillingPeriod = "monthly" | "yearly";

export const PremiumScreen = () => {
  const { currentUser, setCurrentUser, setScreen } = useApp();
  const [selectedTier, setSelectedTier] = useState<PlanTier>("premium");
  const [billing, setBilling] = useState<BillingPeriod>("monthly");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [payMethod, setPayMethod] = useState<"google" | "apple" | null>(null);

  const plan = PLANS[selectedTier];
  const pricing = plan[billing];

  const handlePay = (method: "google" | "apple") => {
    setPayMethod(method);
    setLoading(true);
    setTimeout(() => {
      setCurrentUser({
        ...currentUser,
        isPremium: selectedTier === "premium",
        subscriptionStatus: billing as "monthly" | "yearly",
        dailySwipesLeft: selectedTier === "premium" ? 50 : 20,
      });
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 max-w-sm mx-auto">
        <div className="text-center animate-scale-in">
          <div className="w-24 h-24 rounded-full gold-gradient mx-auto mb-6 flex items-center justify-center text-5xl shadow-gold animate-float">
            ✦
          </div>
          <h1 className="font-serif text-4xl mb-2">
            {selectedTier === "premium" ? "Premium Gold'a" : "Standart Üyeliğe"} Hoş Geldin
          </h1>
          <p className="text-muted-foreground text-sm mb-2">
            {payMethod === "google" ? "Google Pay" : "Apple Pay"} ile ödeme alındı.
          </p>
          <p className="text-muted-foreground text-sm mb-8">
            {selectedTier === "premium"
              ? "Tüm premium özellikler açıldı. The Club'ı en iyi haliyle yaşa."
              : "Günde 20 profil görüntüleyebilirsin. İyi eşleşmeler!"}
          </p>
          <button
            onClick={() => setScreen("discovery")}
            className="w-full py-4 rounded-xl gold-gradient text-primary-foreground font-medium text-sm tracking-wider"
          >
            Keşfetmeye Başla →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-sm mx-auto">
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="relative h-44 overflow-hidden">
          <div className="absolute inset-0 gold-gradient opacity-20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full gold-gradient flex items-center justify-center text-2xl text-primary-foreground shadow-gold mb-2 animate-float">
              ✦
            </div>
            <h1 className="font-serif text-2xl text-foreground">Üyelik Planı Seç</h1>
            <p className="text-muted-foreground text-xs tracking-widest uppercase mt-1">The Club Exclusive</p>
          </div>
          <button onClick={() => setScreen("discovery")}
            className="absolute top-10 left-6 text-muted-foreground hover:text-foreground transition-colors text-sm">
            ← Geri
          </button>
        </div>

        <div className="px-6 space-y-5 pb-40">

          {/* Billing toggle */}
          <div className="flex gap-1 bg-surface rounded-xl p-1 border border-border">
            {(["monthly", "yearly"] as BillingPeriod[]).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  billing === b ? "gold-gradient text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {b === "monthly" ? "Aylık" : "Yıllık"}
                {b === "yearly" && <span className="ml-1 text-xs opacity-80">%20 indirim</span>}
              </button>
            ))}
          </div>

          {/* Plan cards */}
          <div className="space-y-3">
            {(["standard", "premium"] as PlanTier[]).map((tier) => {
              const p = PLANS[tier];
              const pr = p[billing];
              const isSelected = selectedTier === tier;
              return (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`w-full rounded-2xl p-4 border-2 text-left transition-all ${
                    isSelected ? "border-gold glass-gold" : "border-border bg-surface"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected ? "border-gold" : "border-border"
                      }`}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full gold-gradient" />}
                      </div>
                      <div>
                        <p className="text-foreground font-semibold text-sm">{p.label}</p>
                        {p.badge && (
                          <span className="text-xs gold-gradient text-primary-foreground px-2 py-0.5 rounded-full font-bold">
                            {p.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-foreground font-bold text-base">{pr.price}</p>
                      <p className="text-muted-foreground text-xs line-through">{pr.originalPrice}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5 ml-8">
                    {p.features.map(({ icon, text }) => (
                      <div key={text} className="flex items-center gap-2">
                        <span className="text-xs">{icon}</span>
                        <p className="text-muted-foreground text-xs">{text}</p>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Comparison note */}
          <div className="bg-surface rounded-xl p-4 border border-border">
            <p className="text-xs text-gold font-medium mb-2">Normal vs Premium karşılaştırma</p>
            <div className="space-y-2">
              {[
                { label: "Günlük profil", standard: "20 kişi", premium: "50 kişi" },
                { label: "Beğenenleri görme", standard: "Sadece isim", premium: "Fotoğraflı tam görüntü" },
                { label: "Filtreler", standard: "Sadece yaş", premium: "Yaş, konum, boy, burç, ilgi" },
              ].map(({ label, standard, premium }) => (
                <div key={label} className="flex justify-between text-xs">
                  <span className="text-muted-foreground w-28">{label}</span>
                  <span className="text-muted-foreground text-center w-20">{standard}</span>
                  <span className="text-gold font-medium text-right w-28">{premium}</span>
                </div>
              ))}
              <div className="flex justify-between text-xs text-muted-foreground border-t border-border pt-2 mt-1">
                <span className="w-28"></span>
                <span className="text-center w-20">Standart</span>
                <span className="text-right w-28">Premium ✦</span>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            İstediğin zaman iptal et. Gizli ücret yok.
          </p>
        </div>
      </div>

      {/* Bottom pay buttons */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm px-6 pb-8 pt-4 glass border-t border-border">
        <p className="text-center text-xs text-muted-foreground mb-3">
          {pricing.total} · Güvenli ödeme
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handlePay("apple")}
            disabled={loading}
            className="py-3.5 rounded-xl bg-foreground text-background font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading && payMethod === "apple" ? (
              <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
            ) : (
              <>
                <span className="text-base"></span> Apple Pay
              </>
            )}
          </button>
          <button
            onClick={() => handlePay("google")}
            disabled={loading}
            className="py-3.5 rounded-xl border-2 border-border bg-surface text-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:border-gold transition-all active:scale-95 disabled:opacity-50"
          >
            {loading && payMethod === "google" ? (
              <span className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
            ) : (
              <>
                <span className="text-base">G</span> Google Pay
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
