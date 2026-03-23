import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import heroBg from "@/assets/hero-bg.jpg";
import { apiUrl } from "@/lib/api";

const DiamondLogo = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8" aria-hidden="true">
    <polygon points="50,28 68,50 50,72 32,50" fill="#C9A84C" />
  </svg>
);

export const LoginScreen = () => {
  const { setScreen, setRegisteredPhone, setRegisteredUserId, currentUser, setCurrentUser } = useApp();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = () => {
    if (phone.length < 10) return;
    setError(null);
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("otp"); }, 1200);
  };

  const handleVerify = async () => {
    setError(null);
    setLoading(true);
    try {
      const rawPhone = phone.replace(/\s/g, "");
      const res = await fetch(apiUrl("/api/users/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: rawPhone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kayıt başarısız");

      const user = data.user;
      setRegisteredPhone(rawPhone);
      setRegisteredUserId(user.id);

      if (user.status === "frozen") {
        setLoading(false);
        setCurrentUser({ ...currentUser, isApproved: false, isPremium: false });
        setError("Hesabınız dondurulmuş. Yeniden aktifleştirmek için üyelik seçin.");
        setTimeout(() => { setError(null); setScreen("premium"); }, 2200);
      } else if (user.status === "approved") {
        const isPremium = user.subscription_status === "active";
        setCurrentUser({ ...currentUser, isApproved: true, isPremium });
        setScreen("discovery");
      } else if (data.created) {
        // Brand new user — mark as not approved and go through onboarding
        setCurrentUser({ ...currentUser, isApproved: false });
        setScreen("onboarding-basic");
      } else {
        // Existing pending user — already submitted, waiting for approval
        setCurrentUser({ ...currentUser, isApproved: false });
        setScreen("waiting-approval");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Bir hata oluştu";
      setError(msg);
      setLoading(false);
    }
  };

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    if (digits.length <= 8) return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`;
  };

  const rawDigits = phone.replace(/\s/g, "");

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }} />
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute top-0 left-0 right-0 h-px luxury-divider" />

      <div className="relative z-10 w-full max-w-sm px-6 animate-fade-up">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full glass-gold mb-6 animate-float">
            <DiamondLogo />
          </div>
          <h1 className="font-serif text-5xl font-light tracking-widest gold-text mb-2">THE CLUB</h1>
          <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase font-sans">Members Only</p>
        </div>

        <div className="glass rounded-2xl p-8">
          {step === "phone" ? (
            <div className="space-y-6">
              <div>
                <p className="font-serif text-xl text-foreground mb-1">Hoş Geldin</p>
                <p className="text-muted-foreground text-sm">Devam etmek için numaranı gir</p>
              </div>
              <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3 border border-border focus-within:border-gold transition-colors">
                <span className="text-muted-foreground text-sm whitespace-nowrap">🇹🇷 +90</span>
                <div className="w-px h-5 bg-border" />
                <input
                  data-testid="input-phone"
                  type="tel"
                  placeholder="5XX XXX XX XX"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  className="flex-1 bg-transparent text-foreground placeholder-muted-foreground text-sm outline-none"
                />
              </div>
              <button
                data-testid="button-send-otp"
                onClick={handleSendOtp}
                disabled={rawDigits.length < 10 || loading}
                className="w-full py-4 rounded-xl gold-gradient text-primary-foreground font-medium text-sm tracking-wider transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 shadow-gold-sm"
              >
                {loading ? "Gönderiliyor…" : "Doğrulama Kodu Gönder"}
              </button>
              <p className="text-muted-foreground text-xs text-center">
                Devam ederek{" "}
                <span className="text-gold cursor-pointer">Kullanım Koşulları</span>'nı kabul etmiş olursun
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <p className="font-serif text-xl text-foreground mb-1">Kimliğini Doğrula</p>
                <p className="text-muted-foreground text-sm">+90 {phone} numarasına kod gönderildi</p>
              </div>
              <div className="flex gap-3 justify-center">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-12 rounded-lg bg-muted border border-border flex items-center justify-center text-foreground font-medium text-lg"
                    style={{ borderColor: otp[i] ? "hsl(var(--gold))" : undefined }}
                  >
                    {otp[i] || ""}
                  </div>
                ))}
              </div>
              <input
                data-testid="input-otp"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full bg-muted rounded-xl px-4 py-3 border border-border text-foreground text-center tracking-widest text-lg outline-none focus:border-gold transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="6 haneli kodu gir"
                style={{ MozAppearance: "textfield" } as React.CSSProperties}
              />
              {error && (
                <p data-testid="text-error" className="text-red-400 text-xs text-center">{error}</p>
              )}
              <button
                data-testid="button-verify"
                onClick={handleVerify}
                disabled={otp.length < 4 || loading}
                className="w-full py-4 rounded-xl gold-gradient text-primary-foreground font-medium text-sm tracking-wider transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
              >
                {loading ? "Doğrulanıyor…" : "The Club'a Gir"}
              </button>
              <button
                onClick={() => setStep("phone")}
                className="w-full text-muted-foreground text-sm hover:text-foreground transition-colors"
              >
                ← Numarayı Değiştir
              </button>
            </div>
          )}
        </div>

        <p className="text-center mt-8 text-muted-foreground text-xs tracking-wider">
          Kaliteli bağlantılar. Seçilmiş üyelikler. Sıfır tolerans.
        </p>
      </div>
    </div>
  );
};
