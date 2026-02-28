import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import heroBg from "@/assets/hero-bg.jpg";

export const LoginScreen = () => {
  const { setScreen, setIsAdmin } = useApp();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = () => {
    if (phone.length < 10) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("otp"); }, 1200);
  };

  const handleVerify = () => {
    setLoading(true);
    // Admin shortcut
    if (phone === "0000000000") {
      setTimeout(() => { setLoading(false); setIsAdmin(true); setScreen("admin"); }, 800);
      return;
    }
    setTimeout(() => { setLoading(false); setScreen("onboarding-basic"); }, 1000);
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* Gold shimmer top bar */}
      <div className="absolute top-0 left-0 right-0 h-px luxury-divider" />

      <div className="relative z-10 w-full max-w-sm px-6 animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full glass-gold mb-6 animate-float">
            <span className="text-3xl">♦</span>
          </div>
          <h1 className="font-serif text-5xl font-light tracking-widest gold-text mb-2">
            THE CLUB
          </h1>
          <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase font-sans">
            Members Only · Est. 2025
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8">
          {step === "phone" ? (
            <div className="space-y-6">
              <div>
                <p className="font-serif text-xl text-foreground mb-1">Welcome Back</p>
                <p className="text-muted-foreground text-sm">Enter your number to continue</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3 border border-border focus-within:border-gold transition-colors">
                  <span className="text-muted-foreground text-sm">🇺🇸 +1</span>
                  <div className="w-px h-5 bg-border" />
                  <input
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="flex-1 bg-transparent text-foreground placeholder-muted-foreground text-sm outline-none"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Try 0000000000 for admin demo</p>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={phone.length < 10 || loading}
                className="w-full py-4 rounded-xl gold-gradient text-primary-foreground font-medium text-sm tracking-wider transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 shadow-gold-sm"
              >
                {loading ? "Sending…" : "Send Verification Code"}
              </button>

              <div className="text-center">
                <p className="text-muted-foreground text-xs">
                  By continuing, you agree to our{" "}
                  <span className="text-gold cursor-pointer">Terms of Service</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <p className="font-serif text-xl text-foreground mb-1">Verify Your Identity</p>
                <p className="text-muted-foreground text-sm">
                  Code sent to +1 {phone.slice(0, 3)}-{phone.slice(3, 6)}-{phone.slice(6)}
                </p>
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

              {/* Hidden input trick */}
              <input
                type="number"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                className="w-full bg-muted rounded-xl px-4 py-3 border border-border text-foreground text-center tracking-widest text-lg outline-none focus:border-gold transition-colors"
                placeholder="Enter 6-digit code"
              />

              <button
                onClick={handleVerify}
                disabled={otp.length < 4 || loading}
                className="w-full py-4 rounded-xl gold-gradient text-primary-foreground font-medium text-sm tracking-wider transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
              >
                {loading ? "Verifying…" : "Continue to The Club"}
              </button>

              <button
                onClick={() => setStep("phone")}
                className="w-full text-muted-foreground text-sm hover:text-foreground transition-colors"
              >
                ← Change number
              </button>
            </div>
          )}
        </div>

        {/* Tagline */}
        <p className="text-center mt-8 text-muted-foreground text-xs tracking-wider">
          Quality connections. Curated memberships. Zero compromises.
        </p>
      </div>
    </div>
  );
};
