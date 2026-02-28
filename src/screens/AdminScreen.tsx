import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { ADMIN_PENDING_USERS, ADMIN_FLAGGED_PROFILES, LAUNCH_THRESHOLD, MOCK_APPROVED_COUNT } from "@/data/mockData";

export const AdminScreen = () => {
  const { setScreen } = useApp();
  const [tab, setTab] = useState<"pending" | "flagged" | "stats">("stats");
  const [pending, setPending] = useState(ADMIN_PENDING_USERS);
  const [flagged, setFlagged] = useState(ADMIN_FLAGGED_PROFILES);
  const [approvedCount, setApprovedCount] = useState(MOCK_APPROVED_COUNT);

  const launchReady = approvedCount >= LAUNCH_THRESHOLD;
  const progress = Math.min((approvedCount / LAUNCH_THRESHOLD) * 100, 100);

  const handleApprove = (id: string) => {
    setPending((p) => p.filter((u) => u.id !== id));
    setApprovedCount((c) => c + 1);
  };
  const reject = (id: string) => setPending((p) => p.filter((u) => u.id !== id));
  const ban = (id: string) => setFlagged((f) => f.filter((u) => u.id !== id));

  const stats = [
    { label: "Toplam Üye", value: "2,847", delta: "+12%" },
    { label: "Onaylanan", value: approvedCount.toString(), delta: `${LAUNCH_THRESHOLD - approvedCount} kaldı` },
    { label: "Bugün Aktif", value: "1,204", delta: "+8%" },
    { label: "İşaretlenen", value: flagged.length.toString(), delta: `${flagged.length} açık` },
  ];

  return (
    <div className="min-h-screen bg-background max-w-sm mx-auto">
      {/* Header */}
      <div className="px-6 pt-10 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-serif text-2xl gold-text">Admin Paneli</h1>
            <p className="text-muted-foreground text-xs tracking-wider">The Club · Dahili</p>
          </div>
          <button
            onClick={() => setScreen("login")}
            className="px-3 py-1.5 rounded-lg bg-surface border border-border text-muted-foreground text-xs hover:border-gold hover:text-gold transition-colors"
          >
            Çıkış
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-surface rounded-xl p-1">
          {(["stats", "pending", "flagged"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                tab === t ? "gold-gradient text-primary-foreground" : "text-muted-foreground"
              }`}>
              {t === "stats" ? "İstatistik" : t === "pending" ? `Bekleyen (${pending.length})` : `İşaretli (${flagged.length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-10 overflow-y-auto no-scrollbar">

        {/* ── STATS ── */}
        {tab === "stats" && (
          <div className="space-y-4 animate-fade-up">

            {/* Launch Threshold Banner */}
            <div className={`rounded-xl p-4 border ${launchReady ? "glass-gold border-gold" : "bg-surface border-border"}`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs tracking-widest text-gold uppercase">Açılış Eşiği</p>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${launchReady ? "gold-gradient text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {launchReady ? "🚀 Hazır!" : "Bekleniyor"}
                </span>
              </div>
              <div className="flex items-end gap-2 mb-3">
                <p className="font-serif text-3xl text-foreground">{approvedCount}</p>
                <p className="text-muted-foreground text-sm pb-1">/ {LAUNCH_THRESHOLD} üye</p>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden mb-1">
                <div className="h-full gold-gradient rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">
                {launchReady
                  ? "Eşiğe ulaşıldı. Üyeler artık birbirini görebilir."
                  : `${LAUNCH_THRESHOLD - approvedCount} üye daha onaylanınca uygulama açılacak.`}
              </p>
            </div>

            {/* Stat grid */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map(({ label, value, delta }) => (
                <div key={label} className="bg-surface rounded-xl p-4 border border-border">
                  <p className="text-muted-foreground text-xs mb-1">{label}</p>
                  <p className="font-serif text-2xl text-foreground">{value}</p>
                  <p className="text-xs text-gold mt-1">{delta}</p>
                </div>
              ))}
            </div>

            <div className="bg-surface rounded-xl p-4 border border-border">
              <p className="text-xs text-gold uppercase tracking-wider mb-3">Son 7 Gün Aktivite</p>
              <div className="flex items-end gap-1.5 h-16">
                {[42, 58, 35, 70, 65, 80, 74].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm gold-gradient" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((d) => (
                  <span key={d} className="text-xs text-muted-foreground">{d}</span>
                ))}
              </div>
            </div>

            <div className="bg-surface rounded-xl p-4 border border-border">
              <p className="text-xs text-gold uppercase tracking-wider mb-3">Üye Dağılımı</p>
              <div className="space-y-3">
                {[
                  { label: "Kadın", value: 68 },
                  { label: "Erkek", value: 32 },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="text-foreground font-medium">%{value}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full gold-gradient rounded-full" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PENDING ── */}
        {tab === "pending" && (
          <div className="space-y-3 animate-fade-up">
            {pending.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">✓</p>
                <p className="font-serif text-xl text-foreground">Hepsi Tamam</p>
                <p className="text-muted-foreground text-sm">Bekleyen başvuru yok</p>
              </div>
            ) : (
              pending.map((user) => (
                <div key={user.id} className="bg-surface rounded-xl p-4 border border-border animate-fade-up">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-foreground font-medium text-sm">{user.name}</p>
                        {user.verified && (
                          <span className="text-xs verified-badge px-1.5 py-0.5 rounded-full text-primary-foreground">ID ✓</span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-xs">{user.age} · {user.city}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">Başvurdu: {user.submittedAt}</p>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${user.socialLinked ? "bg-green-500/10 text-green-400" : "bg-destructive/10 text-destructive"}`}>
                      {user.socialLinked ? "✓ Sosyal" : "✕ Sosyal Yok"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => reject(user.id)}
                      className="flex-1 py-2.5 rounded-lg bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors">
                      Reddet
                    </button>
                    <button onClick={() => handleApprove(user.id)}
                      className="flex-[2] py-2.5 rounded-lg gold-gradient text-primary-foreground text-xs font-medium">
                      ✓ The Club'a Kabul Et
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── FLAGGED ── */}
        {tab === "flagged" && (
          <div className="space-y-3 animate-fade-up">
            {flagged.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">🛡</p>
                <p className="font-serif text-xl text-foreground">Temiz</p>
                <p className="text-muted-foreground text-sm">İşaretlenmiş profil yok</p>
              </div>
            ) : (
              flagged.map((user) => (
                <div key={user.id} className="bg-surface rounded-xl p-4 border border-destructive/30 animate-fade-up">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-foreground font-medium text-sm">{user.name}</p>
                      <p className="text-muted-foreground text-xs">{user.age} · {user.city}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                          {user.reason}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{user.reportCount} şikayet</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2.5 rounded-lg bg-surface border border-border text-muted-foreground text-xs hover:border-gold hover:text-gold transition-colors">
                      İncele
                    </button>
                    <button onClick={() => ban(user.id)}
                      className="flex-1 py-2.5 rounded-lg bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors">
                      Yasakla
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
