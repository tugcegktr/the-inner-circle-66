import React, { useState } from "react";
import { useApp } from "@/context/AppContext";

const plans = [
  {
    id: "monthly",
    label: "Monthly",
    price: "$39.99",
    period: "/month",
    badge: null,
    total: "$39.99/mo",
  },
  {
    id: "yearly",
    label: "Annual",
    price: "$19.99",
    period: "/month",
    badge: "BEST VALUE",
    total: "Billed $239.88/year",
  },
];

const features = [
  { icon: "👁", text: "See who liked your profile" },
  { icon: "↩", text: "Unlimited rewinds" },
  { icon: "✦", text: "5 Super Likes per day" },
  { icon: "🎙", text: "Unlimited Vibe Checks" },
  { icon: "⚡", text: "Priority placement in discovery" },
  { icon: "🏆", text: "Gold badge on your profile" },
];

export const PremiumScreen = () => {
  const { currentUser, setCurrentUser, setScreen } = useApp();
  const [selected, setSelected] = useState("yearly");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubscribe = () => {
    setLoading(true);
    setTimeout(() => {
      setCurrentUser({
        ...currentUser,
        isPremium: true,
        subscriptionStatus: selected as "monthly" | "yearly",
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
          <h1 className="font-serif text-4xl mb-2">Welcome to Gold</h1>
          <p className="text-muted-foreground text-sm mb-8">All premium features are now unlocked. Enjoy The Club at its finest.</p>
          <button
            onClick={() => setScreen("matches")}
            className="w-full py-4 rounded-xl gold-gradient text-primary-foreground font-medium text-sm tracking-wider"
          >
            See Who Liked You →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-sm mx-auto">
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 gold-gradient opacity-20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center text-3xl text-primary-foreground shadow-gold mb-3 animate-float">
              ✦
            </div>
            <h1 className="font-serif text-3xl text-foreground">Premium Gold</h1>
            <p className="text-muted-foreground text-xs tracking-widest uppercase mt-1">The Club Exclusive</p>
          </div>
          <button onClick={() => setScreen("discovery")}
            className="absolute top-10 left-6 text-muted-foreground hover:text-foreground transition-colors text-sm">
            ← Back
          </button>
        </div>

        <div className="px-6 space-y-6 pb-32">
          {/* Features */}
          <div className="space-y-3">
            {features.map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full glass-gold flex items-center justify-center text-sm flex-shrink-0">
                  {icon}
                </div>
                <p className="text-foreground text-sm">{text}</p>
              </div>
            ))}
          </div>

          <div className="luxury-divider" />

          {/* Plan cards */}
          <div className="space-y-3">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                className={`w-full rounded-xl p-4 border-2 text-left transition-all ${
                  selected === plan.id
                    ? "border-gold glass-gold"
                    : "border-border bg-surface"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selected === plan.id ? "border-gold" : "border-border"
                    }`}>
                      {selected === plan.id && <div className="w-2.5 h-2.5 rounded-full gold-gradient" />}
                    </div>
                    <div>
                      <p className="text-foreground font-medium text-sm">{plan.label}</p>
                      <p className="text-muted-foreground text-xs">{plan.total}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground font-medium">{plan.price}</p>
                    <p className="text-muted-foreground text-xs">{plan.period}</p>
                  </div>
                </div>
                {plan.badge && (
                  <div className="mt-2 inline-block px-2.5 py-0.5 rounded-full gold-gradient text-primary-foreground text-xs font-bold tracking-wider">
                    {plan.badge}
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Stripe mock payment notice */}
          <div className="bg-surface rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gold">🔒</span>
              <span className="text-xs text-foreground font-medium">Secure Payment via Stripe</span>
            </div>
            <p className="text-xs text-muted-foreground">
              This is a demo. In production, Stripe checkout handles payment securely. Your premium status updates instantly after successful payment.
            </p>
          </div>

          {/* Cancel anytime */}
          <p className="text-center text-xs text-muted-foreground">
            Cancel anytime. No hidden fees. Subscriptions are managed through Stripe.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 pb-10 pt-4 glass border-t border-border">
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full py-4 rounded-xl gold-gradient text-primary-foreground font-medium tracking-wider transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 text-sm shadow-gold"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Processing…
            </span>
          ) : (
            `✦ Start ${plans.find((p) => p.id === selected)?.label} — ${plans.find((p) => p.id === selected)?.price}`
          )}
        </button>
      </div>
    </div>
  );
};
