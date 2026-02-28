import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { MOCK_MATCHES, MOCK_LIKED_BY, VIBE_TAGS } from "@/data/mockData";
import { VibeTag } from "@/types/app";

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

const VibeTagModal = ({ name, onClose }: { name: string; onClose: () => void }) => {
  const [selected, setSelected] = useState<VibeTag[]>([]);
  const [sent, setSent] = useState(false);

  const toggle = (tag: VibeTag) => {
    setSelected((s) => s.includes(tag) ? s.filter((t) => t !== tag) : [...s, tag]);
  };

  if (sent) return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="glass rounded-2xl p-8 w-full max-w-sm text-center animate-scale-in">
        <div className="text-5xl mb-4">✦</div>
        <h3 className="font-serif text-2xl mb-2">Vibe Tags Sent</h3>
        <p className="text-muted-foreground text-sm mb-6">Your private tags for {name} have been recorded anonymously.</p>
        <button onClick={onClose} className="w-full py-3 rounded-xl gold-gradient text-primary-foreground text-sm font-medium">Done</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center">
      <div className="w-full max-w-sm glass rounded-t-3xl p-8 animate-fade-up">
        <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-6" />
        <h3 className="font-serif text-2xl mb-1">Leave a Vibe Tag</h3>
        <p className="text-muted-foreground text-sm mb-6">
          For {name}. These are private and help other women in The Club.
        </p>
        <div className="flex flex-wrap gap-2 mb-8">
          {VIBE_TAGS.map((tag) => (
            <button key={tag} onClick={() => toggle(tag as VibeTag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selected.includes(tag as VibeTag) ? "gold-gradient text-primary-foreground" : "bg-surface border border-border text-muted-foreground hover:border-gold"
              }`}>
              {tag}
            </button>
          ))}
        </div>
        <button disabled={selected.length === 0} onClick={() => setSent(true)}
          className="w-full py-4 rounded-xl gold-gradient text-primary-foreground text-sm font-medium disabled:opacity-40 mb-3">
          Send Tags Anonymously
        </button>
        <button onClick={onClose} className="w-full py-3 text-muted-foreground text-sm">Cancel</button>
      </div>
    </div>
  );
};

export const MatchesScreen = () => {
  const { currentUser, setScreen } = useApp();
  const [activeTab, setActiveTab] = useState<"matches" | "likes">("matches");
  const [vibeTagTarget, setVibeTagTarget] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-sm mx-auto">
      {/* Header */}
      <div className="px-6 pt-10 pb-4">
        <h1 className="font-serif text-3xl text-foreground mb-4">Connections</h1>
        <div className="flex gap-1 bg-surface rounded-xl p-1">
          {(["matches", "likes"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? "gold-gradient text-primary-foreground" : "text-muted-foreground"}`}>
              {tab === "matches" ? "✦ Matches" : "❤ Liked You"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-24">
        {activeTab === "matches" ? (
          <div className="space-y-3">
            {MOCK_MATCHES.map((match) => (
              <div key={match.id} className="bg-surface rounded-xl p-4 border border-border flex items-center gap-4 card-hover">
                <div className="relative">
                  <img src={match.photo} alt={match.name} className="w-14 h-14 rounded-full object-cover" />
                  {match.isVerified && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 verified-badge rounded-full flex items-center justify-center text-xs text-primary-foreground font-bold">
                      ✓
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-foreground font-medium text-sm">{match.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {match.hasVibeCheck ? "🎙 Sent you a Vibe Check" : "Matched recently"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {match.hasVibeCheck && (
                    <div className="w-2 h-2 rounded-full gold-gradient animate-pulse-gold" />
                  )}
                  <button onClick={() => setVibeTagTarget(match.name)}
                    className="text-xs text-gold hover:underline">
                    + Tag
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {!currentUser.isPremium && (
              <div className="glass-gold rounded-xl p-4 mb-4">
                <p className="text-sm font-medium text-foreground mb-1">🔒 Blurred for Privacy</p>
                <p className="text-xs text-muted-foreground mb-3">{MOCK_LIKED_BY.length} members liked your profile. Upgrade to see who.</p>
                <button onClick={() => setScreen("premium")}
                  className="w-full py-2.5 rounded-lg gold-gradient text-primary-foreground text-xs font-medium tracking-wider">
                  Unlock with Premium Gold ✦
                </button>
              </div>
            )}

            <div className="space-y-3">
              {MOCK_LIKED_BY.map((user) => (
                <div key={user.id} className={`bg-surface rounded-xl p-4 border border-border flex items-center gap-4 ${!currentUser.isPremium ? "opacity-70" : ""}`}>
                  <div className="relative">
                    <img
                      src={user.photo}
                      alt=""
                      className={`w-14 h-14 rounded-full object-cover ${!currentUser.isPremium ? "blur-premium" : ""}`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${!currentUser.isPremium ? "blur-premium" : "text-foreground"}`}>
                      {currentUser.isPremium ? user.name : "Hidden"}
                    </p>
                    <p className="text-muted-foreground text-xs">Liked your profile</p>
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

      {vibeTagTarget && (
        <VibeTagModal name={vibeTagTarget} onClose={() => setVibeTagTarget(null)} />
      )}
    </div>
  );
};
