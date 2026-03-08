import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { MOCK_MATCHES, MOCK_LIKED_BY, VIBE_TAGS } from "@/data/mockData";
import { Match, VibeTag, FlaggedReport } from "@/types/app";
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
          <button key={id} onClick={() => onNavigate(id)}
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
          {match.name} için {rating} yıldız verdin.
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

// ── Chat Screen ──
const REPORT_REASONS = ["Sahte hesap", "Taciz içerikli mesaj", "Uygunsuz fotoğraf"];

const ChatModal = ({
  match,
  onClose,
  onMessageSent,
  onReport,
}: {
  match: Match;
  onClose: () => void;
  onMessageSent: (matchId: string) => void;
  onReport: (report: FlaggedReport) => void;
}) => {
  const [messages, setMessages] = useState<{ from: "me" | "them"; text: string; time: string }[]>([
    { from: "them", text: "Merhaba! Nasılsın? 😊", time: "10:32" },
  ]);
  const [input, setInput] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [unmatched, setUnmatched] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const nowStr = () => {
    const d = new Date();
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  const sentCount = messages.filter((m) => m.from === "me").length;

  const send = () => {
    const txt = input.trim();
    if (!txt) return;
    const t = nowStr();
    setMessages((prev) => [...prev, { from: "me", text: txt, time: t }]);
    setInput("");
    onMessageSent(match.id);
    setTimeout(() => {
      const replies = [
        "Çok güzel, seninle tanışmak harika! ✨",
        "Haha, gerçekten mi? 😄",
        "Kesinlikle katılıyorum!",
        "Bu akşam müsait misin? ☕",
        "Sana katılıyorum, harika bir seçim!",
      ];
      setMessages((prev) => [
        ...prev,
        { from: "them", text: replies[Math.floor(Math.random() * replies.length)], time: nowStr() },
      ]);
    }, 1200);
  };

  if (unmatched || deleted) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center max-w-sm mx-auto p-8 text-center">
        <div className="text-5xl mb-4">{unmatched ? "💔" : "🗑"}</div>
        <h3 className="font-serif text-2xl mb-2">{unmatched ? "Eşleşme Kaldırıldı" : "Konuşma Silindi"}</h3>
        <p className="text-muted-foreground text-sm mb-6">
          {unmatched ? `${match.name} ile eşleşmen kaldırıldı.` : "Konuşma geçmişi silindi."}
        </p>
        <button onClick={onClose} className="w-full py-3 rounded-xl gold-gradient text-primary-foreground text-sm font-medium">
          Geri Dön
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col max-w-sm mx-auto">
      {/* Header */}
      <div className="glass border-b border-border px-5 pt-10 pb-4 flex items-center gap-3 flex-shrink-0">
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors text-xl leading-none flex-shrink-0">←</button>
        <img src={match.photo} alt={match.name} className="w-10 h-10 rounded-full object-cover border-2 border-gold/30 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-foreground font-medium text-sm">{match.name}</p>
            {match.isVerified && (
              <span className="verified-badge text-xs px-1.5 py-0.5 rounded-full text-primary-foreground font-bold">✓</span>
            )}
          </div>
          <p className="text-muted-foreground text-xs">📍 {match.city}</p>
        </div>
        {sentCount < 5 && (
          <span className="text-xs text-muted-foreground bg-surface border border-border px-2 py-1 rounded-full flex-shrink-0">
            {sentCount}/5
          </span>
        )}
        {/* 3-dot menu */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowMenu((v) => !v)}
            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-surface"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
            </svg>
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-10 z-50 glass rounded-xl border border-border shadow-luxury w-48 overflow-hidden animate-scale-in">
                <button
                  onClick={() => { setShowMenu(false); setUnmatched(true); }}
                  className="w-full px-4 py-3 text-left text-sm text-foreground hover:bg-surface transition-colors flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  Eşleşmeyi Kaldır
                </button>
                <div className="h-px bg-border" />
                <button
                  onClick={() => { setShowMenu(false); setShowReport(true); }}
                  className="w-full px-4 py-3 text-left text-sm text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/></svg>
                  Şikayet Et
                </button>
                <div className="h-px bg-border" />
                <button
                  onClick={() => { setShowMenu(false); setDeleted(true); }}
                  className="w-full px-4 py-3 text-left text-sm text-muted-foreground hover:bg-surface transition-colors flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                  Konuşmayı Sil
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4 space-y-3">
        <div className="text-center mb-2">
          <span className="text-xs text-muted-foreground bg-surface px-3 py-1 rounded-full border border-border">
            ✦ {match.name} ile eşleştin
          </span>
        </div>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
              msg.from === "me"
                ? "gold-gradient text-primary-foreground rounded-br-sm"
                : "bg-surface border border-border text-foreground rounded-bl-sm"
            }`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.from === "me" ? "text-primary-foreground/70 text-right" : "text-muted-foreground"}`}>{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="glass border-t border-border px-4 py-4 flex items-center gap-3 flex-shrink-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Mesaj yaz…"
          className="flex-1 bg-surface rounded-xl px-4 py-3 border border-border text-foreground placeholder-muted-foreground text-sm outline-none focus:border-gold transition-colors"
        />
        <button
          onClick={send}
          disabled={!input.trim()}
          className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-primary-foreground disabled:opacity-40 active:scale-95 transition-all flex-shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
          </svg>
        </button>
      </div>

      {/* Report Sheet */}
      {showReport && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center" onClick={() => setShowReport(false)}>
          <div className="w-full max-w-sm glass rounded-t-3xl p-6 animate-fade-up" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-5" />
            {reportSent ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">✓</div>
                <h3 className="font-serif text-xl mb-2">Şikayet Gönderildi</h3>
                <p className="text-muted-foreground text-sm mb-6">Ekibimiz en kısa sürede inceleyecek.</p>
                <button onClick={() => { setShowReport(false); setReportSent(false); }} className="w-full py-3 rounded-xl gold-gradient text-primary-foreground text-sm font-medium">Tamam</button>
              </div>
            ) : (
              <>
                <h3 className="font-serif text-xl mb-1">Şikayet Et</h3>
                <p className="text-muted-foreground text-sm mb-5">{match.name} hakkında şikayet sebebini seç</p>
                <div className="space-y-2 mb-5">
                  {REPORT_REASONS.map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setSelectedReason(reason)}
                      className={`w-full px-4 py-3 rounded-xl text-sm text-left transition-all border ${
                        selectedReason === reason
                          ? "border-destructive bg-destructive/10 text-destructive"
                          : "border-border bg-surface text-foreground hover:border-destructive/50"
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
                <button
                  disabled={!selectedReason}
                  onClick={() => {
                    onReport({
                      id: `r-${Date.now()}`,
                      reportedName: match.name,
                      reportedBy: "Ben",
                      reason: selectedReason,
                      timestamp: new Date().toLocaleString("tr-TR"),
                    });
                    setReportSent(true);
                  }}
                  className="w-full py-3 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium disabled:opacity-40 mb-2"
                >
                  Şikayeti Gönder
                </button>
                <button onClick={() => setShowReport(false)} className="w-full py-3 text-muted-foreground text-sm">İptal</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const MatchesScreen = () => {
  const { currentUser, setScreen, addFlaggedReport } = useApp();
  const [activeTab, setActiveTab] = useState<"matches" | "likes">("matches");
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);
  const [vibeTagTarget, setVibeTagTarget] = useState<string | null>(null);
  const [rateTarget, setRateTarget] = useState<Match | null>(null);
  const [chatTarget, setChatTarget] = useState<Match | null>(null);
  const [sentCounts, setSentCounts] = useState<Record<string, number>>({});

  const MIN_MESSAGES_TO_RATE = 5;

  const handleRate = (matchId: string, rating: number) => {
    setMatches((prev) =>
      prev.map((m) => m.id === matchId ? { ...m, myRating: rating } : m)
    );
  };

  const handleMessageSent = (matchId: string) => {
    setSentCounts((prev) => ({ ...prev, [matchId]: (prev[matchId] || 0) + 1 }));
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
            {matches.map((match) => {
              const msgCount = sentCounts[match.id] || 0;
              const canRate = msgCount >= MIN_MESSAGES_TO_RATE;

              return (
                <div key={match.id} className="bg-surface rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-4 mb-3">
                    <button onClick={() => setChatTarget(match)} className="relative flex-shrink-0">
                      <img src={match.photo} alt={match.name} className="w-14 h-14 rounded-full object-cover" />
                      {match.isVerified && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 verified-badge rounded-full flex items-center justify-center text-xs text-primary-foreground font-bold">✓</div>
                      )}
                    </button>
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
                    {match.averageRating && (
                      <div className="text-right">
                        <div className="text-gold text-sm">{'★'.repeat(Math.round(match.averageRating))}</div>
                        <p className="text-xs text-muted-foreground">{match.averageRating.toFixed(1)}</p>
                      </div>
                    )}
                  </div>

                  {/* Action row */}
                  <div className="flex items-center gap-2 pt-3 border-t border-border">
                    {/* Chat button */}
                    <button
                      onClick={() => setChatTarget(match)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg gold-gradient text-primary-foreground text-xs font-medium active:scale-95 transition-all"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                      </svg>
                      Mesaj Gönder
                    </button>

                    <div className="flex-1" />

                    {/* Rate button – active only after 5 sent messages */}
                    {match.myRating ? (
                      <StarRating value={match.myRating} size="sm" />
                    ) : (
                      <button
                        onClick={() => canRate && setRateTarget(match)}
                        disabled={!canRate}
                        title={canRate ? undefined : "Değerlendirmek için en az 5 mesaj gönder"}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          canRate
                            ? "bg-gold/20 border border-gold text-gold hover:bg-gold/30 active:scale-95"
                            : "bg-muted border border-border text-muted-foreground opacity-50 cursor-not-allowed"
                        }`}
                      >
                        ★ Değerlendir
                        {!canRate && (
                          <span className="ml-1 text-xs opacity-70">{msgCount}/5</span>
                        )}
                      </button>
                    )}

                    {/* Vibe button – active only after 5 sent messages */}
                    <button
                      onClick={() => canRate && setVibeTagTarget(match.name)}
                      disabled={!canRate}
                      title={canRate ? undefined : "Vibe göndermek için en az 5 mesaj gönder"}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        canRate
                          ? "bg-gold/20 border border-gold/50 text-gold hover:bg-gold/30 active:scale-95"
                          : "bg-muted border border-border text-muted-foreground opacity-50 cursor-not-allowed"
                      }`}
                    >
                      ✦ Vibe
                    </button>
                  </div>
                </div>
              );
            })}
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
                  <img src={user.photo} alt="" className={`w-14 h-14 rounded-full object-cover ${!currentUser.isPremium ? "blur-premium" : ""}`} />
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
        <RateMatchModal match={rateTarget} onClose={() => setRateTarget(null)} onRate={handleRate} />
      )}
      {chatTarget && (
        <ChatModal
          match={chatTarget}
          onClose={() => setChatTarget(null)}
          onMessageSent={handleMessageSent}
          onReport={addFlaggedReport}
        />
      )}
    </div>
  );
};
