import React from "react";
import { useApp } from "@/context/AppContext";

export const WaitlistScreen = () => {
  const { setScreen, currentUser } = useApp();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 max-w-sm mx-auto">
      <div className="text-center animate-fade-up">
        {/* Icon */}
        <div className="w-24 h-24 rounded-full glass-gold mx-auto mb-8 flex items-center justify-center animate-float">
          <span className="text-4xl">⏳</span>
        </div>

        <h1 className="font-serif text-4xl text-foreground mb-3">
          Under <span className="gold-text">Review</span>
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          Your application is being reviewed by our curation team. We personally review every new member to ensure the quality of connections at The Club.
        </p>

        <div className="luxury-divider my-6" />

        <div className="space-y-4 mb-10">
          {[
            { icon: "👤", title: "Profile Review", desc: "Team checks your profile and photos", done: true },
            { icon: "📱", title: "Social Verification", desc: "Instagram or LinkedIn confirmed", done: true },
            { icon: "✅", title: "Final Approval", desc: "Welcome to The Club", done: false },
          ].map(({ icon, title, desc, done }) => (
            <div key={title} className="flex items-center gap-4 text-left">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${done ? "gold-gradient" : "bg-surface border border-border"}`}>
                <span className="text-base">{done ? "✓" : icon}</span>
              </div>
              <div>
                <p className={`text-sm font-medium ${done ? "text-foreground" : "text-muted-foreground"}`}>{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="glass rounded-xl p-4 mb-8">
          <p className="text-xs text-muted-foreground">
            ⏱ Average review time: <span className="text-gold">24–48 hours</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            You'll receive a text message once approved.
          </p>
        </div>

        {/* Demo shortcut */}
        <button
          onClick={() => setScreen("discovery")}
          className="w-full py-4 rounded-xl gold-gradient text-primary-foreground font-medium text-sm tracking-wider hover:opacity-90 active:scale-95 transition-all"
        >
          Preview The App (Demo)
        </button>
      </div>
    </div>
  );
};
