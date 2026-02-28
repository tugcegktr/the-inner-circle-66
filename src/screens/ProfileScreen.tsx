import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { ZODIAC_SYMBOLS } from "@/data/mockData";

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

export const ProfileScreen = () => {
  const { currentUser, setScreen } = useApp();

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-sm mx-auto">
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
                <p className="text-muted-foreground text-sm">{currentUser.age} · {currentUser.city} · {currentUser.height}</p>
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
          {/* Bio */}
          <div>
            <p className="text-foreground text-sm leading-relaxed italic font-serif text-lg">"{currentUser.bio}"</p>
          </div>

          <div className="luxury-divider" />

          {/* Zodiac */}
          <div className="flex items-center gap-4">
            <div className="glass-gold rounded-xl px-4 py-3 flex items-center gap-2">
              <span className="text-2xl">{ZODIAC_SYMBOLS[currentUser.zodiacSign]}</span>
              <div>
                <p className="text-xs text-muted-foreground">Sun Sign</p>
                <p className="text-sm text-foreground font-medium">{currentUser.zodiacSign}</p>
              </div>
            </div>
            {currentUser.risingSign && (
              <div className="glass rounded-xl px-4 py-3 flex items-center gap-2">
                <span className="text-2xl">{ZODIAC_SYMBOLS[currentUser.risingSign]}</span>
                <div>
                  <p className="text-xs text-muted-foreground">Rising</p>
                  <p className="text-sm text-foreground font-medium">{currentUser.risingSign}</p>
                </div>
              </div>
            )}
          </div>

          {/* Interests */}
          <div>
            <p className="text-xs tracking-widest text-gold uppercase mb-3">Interests</p>
            <div className="flex flex-wrap gap-2">
              {currentUser.interests.map((i) => (
                <span key={i} className="bg-surface border border-border text-foreground text-xs px-3 py-1.5 rounded-full">{i}</span>
              ))}
            </div>
          </div>

          {/* Music */}
          <div>
            <p className="text-xs tracking-widest text-gold uppercase mb-3">Music</p>
            <div className="flex flex-wrap gap-2">
              {currentUser.musicTaste.map((m) => (
                <span key={m} className="bg-surface border border-border text-foreground text-xs px-3 py-1.5 rounded-full">🎵 {m}</span>
              ))}
            </div>
          </div>

          {/* Photos grid */}
          {currentUser.photos.length > 1 && (
            <div>
              <p className="text-xs tracking-widest text-gold uppercase mb-3">Photos</p>
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
              <p className="text-xs tracking-widest text-gold uppercase mb-3">Social</p>
              <div className="space-y-2">
                {currentUser.instagramHandle && (
                  <div className="flex items-center gap-3 bg-surface rounded-xl px-4 py-3 border border-border">
                    <span>📸</span>
                    <span className="text-sm text-foreground">{currentUser.instagramHandle}</span>
                    <div className="ml-auto text-xs text-gold">Verified</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-3 pt-2">
            <button onClick={() => setScreen("edit-profile")}
              className="w-full py-4 rounded-xl bg-surface border border-border text-foreground text-sm font-medium hover:border-gold transition-colors">
              ✏️ Edit Profile
            </button>
            <button onClick={() => setScreen("premium")}
              className={`w-full py-4 rounded-xl text-sm font-medium tracking-wider transition-all ${
                currentUser.isPremium ? "bg-surface border border-gold/50 text-gold" : "gold-gradient text-primary-foreground"
              }`}>
              {currentUser.isPremium ? "✦ Premium Gold Active" : "✦ Upgrade to Premium"}
            </button>
            <button onClick={() => setScreen("login")}
              className="w-full py-3 text-muted-foreground text-sm hover:text-foreground transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <BottomNav active="profile" onNavigate={setScreen} />
    </div>
  );
};
