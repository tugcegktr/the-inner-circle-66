import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useSubscription } from "@/lib/purchases";
import { apiUrl } from "@/lib/api";

type PlanTier = "standard" | "premium";
type BillingPeriod = "monthly" | "yearly";

const PLAN_FEATURES: Record<PlanTier, { icon: string; text: string }[]> = {
  standard: [
    { icon: "✦", text: "Günde 15 profil görüntüleme" },
    { icon: "💬", text: "Sınırsız eşleşme & mesajlaşma" },
    { icon: "⭐", text: "Eşleşmene yıldız ver" },
    { icon: "📍", text: "Konum bazlı keşif" },
    { icon: "🔒", text: "Profil gizleme özelliği" },
    { icon: "🔍", text: "Yaş filtresi" },
  ],
  premium: [
    { icon: "👁", text: "Seni beğenenleri fotoğraflı gör" },
    { icon: "✦", text: "Günde 50 profil görüntüleme" },
    { icon: "↩", text: "Sınırsız geri alma" },
    { icon: "🎙", text: "Sınırsız Vibe Check" },
    { icon: "⚡", text: "Keşifte öncelikli görünüm" },
    { icon: "🏆", text: "Profilinde Altın rozet" },
    { icon: "🔍", text: "Gelişmiş filtreler (boy, burç, konum, ilgi alanı)" },
  ],
};

const FALLBACK_PRICES: Record<PlanTier, Record<BillingPeriod, { price: string; originalPrice: string; total: string }>> = {
  standard: {
    monthly: { price: "₺249,90", originalPrice: "₺399,90", total: "Aylık ₺249,90" },
    yearly: { price: "₺199,90", originalPrice: "₺349,90", total: "Yıllık ₺2.398,80" },
  },
  premium: {
    monthly: { price: "₺449,90", originalPrice: "₺649,90", total: "Aylık ₺449,90" },
    yearly: { price: "₺349,90", originalPrice: "₺549,90", total: "Yıllık ₺4.198,80" },
  },
};

export const PremiumScreen = () => {
  const { currentUser, setCurrentUser, setScreen, registeredUserId } = useApp();
  const { packages, purchase, isPurchasing, isSubscribed } = useSubscription();
  const isUpgradeMode = currentUser.subscriptionStatus !== "none" && !currentUser.isPremium;
  const [selectedTier, setSelectedTier] = useState<PlanTier>(isUpgradeMode ? "premium" : "standard");
  const [billing, setBilling] = useState<BillingPeriod>("monthly");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fallbackPricing = FALLBACK_PRICES[selectedTier][billing];
  const rcPackage = packages[0];
  const displayPrice = rcPackage ? rcPackage.product.priceString : fallbackPricing.price;

  const handlePurchase = async () => {
    setError(null);
    try {
      if (rcPackage) {
        await purchase(rcPackage);
      }
      if (registeredUserId) {
        try {
          await fetch(apiUrl("/api/users/activate"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: registeredUserId }),
          });
        } catch { }
      }
      setCurrentUser({
        ...currentUser,
        isPremium: selectedTier === "premium",
        isApproved: true,
        subscriptionStatus: billing,
        dailySwipesLeft: selectedTier === "premium" ? 50 : 15,
      });
      setSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ödeme başarısız";
      setError(msg);
    }
  };

  if (isSubscribed || success) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 w-full">
        <div className="text-center animate-scale-in">
          <div className="w-24 h-24 rounded-full gold-gradient mx-auto mb-6 flex items-center justify-center text-5xl shadow-gold animate-float">
            ✦
          </div>
          <h1 className="font-serif text-4xl mb-2">
            {selectedTier === "premium" ? "Premium Gold'a" : "Standart Üyeliğe"} Hoş Geldin
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            {selectedTier === "premium"
              ? "Tüm premium özellikler açıldı. The Club'ı en iyi haliyle yaşa."
              : "Günde 15 profil görüntüleyebilirsin. İyi eşleşmeler!"}
          </p>
          <button
            data-testid="button-start-discovery"
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
    <div className="min-h-screen bg-background flex flex-col w-full">
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="relative h-44 overflow-hidden">
          <div className="absolute inset-0 gold-gradient opacity-20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full gold-gradient flex items-center justify-center text-2xl text-primary-foreground shadow-gold mb-2 animate-float">
              ✦
            </div>
            <h1 className="font-serif text-2xl text-foreground">
              {isUpgradeMode ? "Premium Gold'a Yükselt" : "Üyelik Planı Seç"}
            </h1>
            <p className="text-muted-foreground text-xs tracking-widest uppercase mt-1">The Club Exclusive</p>
          </div>
          <button
            onClick={() => setScreen(isUpgradeMode ? "profile" : "discovery")}
            className="absolute top-10 left-6 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            ← Geri
          </button>
        </div>

        <div className="px-6 space-y-5 pb-40">
          <div className="flex gap-1 bg-surface rounded-xl p-1 border border-border">
            {(["monthly", "yearly"] as BillingPeriod[]).map((b) => (
              <button
                key={b}
                data-testid={`button-billing-${b}`}
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

          {isUpgradeMode && (
            <div className="bg-[#C9A84C]/5 border border-[#C9A84C]/20 rounded-xl px-4 py-3 flex items-center gap-3">
              <span className="text-gold text-sm">✓</span>
              <p className="text-sm text-gray-400">
                Standart üyeliğiniz aktif. Premium Gold ile tüm özelliklere erişin.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {(["standard", "premium"] as PlanTier[]).filter((tier) => !isUpgradeMode || tier === "premium").map((tier) => {
              const pr = FALLBACK_PRICES[tier][billing];
              const isSelected = selectedTier === tier;
              const badge = tier === "premium" ? (isUpgradeMode ? "YÜKSELT" : "EN POPÜLER") : null;
              return (
                <button
                  key={tier}
                  data-testid={`button-plan-${tier}`}
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
                        <p className="text-foreground font-semibold text-sm">
                          {tier === "standard" ? "Standart Üyelik" : "Premium Gold"}
                        </p>
                        {badge && (
                          <span className="text-xs gold-gradient text-primary-foreground px-2 py-0.5 rounded-full font-bold">
                            {badge}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-foreground font-bold text-base">
                        {isSelected && rcPackage ? displayPrice : pr.price}
                      </p>
                      <p className="text-muted-foreground text-xs line-through">{pr.originalPrice}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5 ml-8">
                    {PLAN_FEATURES[tier].map(({ icon, text }) => (
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

          <div className="bg-surface rounded-xl p-4 border border-border">
            <p className="text-xs text-gold font-medium mb-2">Normal vs Premium karşılaştırma</p>
            <div className="space-y-2">
              {[
                { label: "Günlük profil", standard: "15 kişi", premium: "50 kişi" },
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

          <p className="text-center text-xs text-muted-foreground">İstediğin zaman iptal et. Gizli ücret yok.</p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full px-6 pb-8 pt-4 glass border-t border-border">
        <p className="text-center text-xs text-muted-foreground mb-3">
          {rcPackage ? rcPackage.product.priceString : fallbackPricing.total} · Güvenli ödeme
        </p>
        {error && (
          <p data-testid="text-purchase-error" className="text-red-400 text-xs text-center mb-2">{error}</p>
        )}
        <button
          data-testid="button-purchase"
          onClick={handlePurchase}
          disabled={isPurchasing}
          className="w-full py-3.5 rounded-xl gold-gradient text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 shadow-gold-sm"
        >
          {isPurchasing ? (
            <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <>✦ {selectedTier === "premium" ? "Premium Gold'u Aktifleştir" : "Standart'ı Aktifleştir"}</>
          )}
        </button>
      </div>
    </div>
  );
};
