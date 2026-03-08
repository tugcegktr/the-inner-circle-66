import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { ADMIN_PENDING_USERS, ADMIN_FLAGGED_PROFILES, LAUNCH_THRESHOLD, MOCK_APPROVED_COUNT, ADMIN_ALL_MEMBERS, GENDER_OPTIONS } from "@/data/mockData";

export const AdminScreen = () => {
  const { setScreen } = useApp();
  const [tab, setTab] = useState<"pending" | "flagged" | "stats" | "members">("stats");
  const [pending, setPending] = useState(ADMIN_PENDING_USERS);
  const [flagged, setFlagged] = useState(ADMIN_FLAGGED_PROFILES);
  const [members] = useState(ADMIN_ALL_MEMBERS);
  const [approvedCount, setApprovedCount] = useState(MOCK_APPROVED_COUNT);
  const [selectedMember, setSelectedMember] = useState<typeof ADMIN_ALL_MEMBERS[0] | null>(null);
  const [notif, setNotif] = useState<string | null>(null);

  const launchReady = approvedCount >= LAUNCH_THRESHOLD;
  const progress = Math.min((approvedCount / LAUNCH_THRESHOLD) * 100, 100);

  const showNotif = (msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 3000);
  };

  const handleApprove = (id: string) => {
    const user = pending.find((u) => u.id === id);
    setPending((p) => p.filter((u) => u.id !== id));
    setApprovedCount((c) => c + 1);
    if (user) {
      showNotif(`📱 ${user.name}'e bildirim gönderildi: "Tebrikler! The Club üyeliğiniz onaylandı."`);
    }
  };
  const reject = (id: string) => setPending((p) => p.filter((u) => u.id !== id));
  const ban = (id: string) => setFlagged((f) => f.filter((u) => u.id !== id));

  // Gender distribution
  const genderCounts = members.reduce((acc, m) => {
    const label = GENDER_OPTIONS.find((g) => g.value === m.gender)?.label ?? m.gender;
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // City distribution
  const cityCounts = members.reduce((acc, m) => {
    acc[m.city] = (acc[m.city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const sortedCities = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]);

  const stats = [
    { label: "Toplam Üye", value: members.length.toString(), delta: "+12%" },
    { label: "Onaylanan", value: approvedCount.toString(), delta: `${LAUNCH_THRESHOLD - approvedCount} kaldı` },
    { label: "Bugün Aktif", value: "204", delta: "+8%" },
    { label: "İşaretlenen", value: flagged.length.toString(), delta: `${flagged.length} açık` },
  ];

  return (
    <div className="min-h-screen bg-background max-w-sm mx-auto">

      {/* Notification toast */}
      {notif && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full px-4 animate-fade-up">
          <div className="bg-surface border border-gold/40 rounded-xl px-4 py-3 shadow-gold-sm">
            <p className="text-xs text-foreground">{notif}</p>
          </div>
        </div>
      )}

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
        <div className="flex gap-1 bg-surface rounded-xl p-1 overflow-x-auto no-scrollbar">
          {(["stats", "members", "pending", "flagged"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-shrink-0 px-2 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                tab === t ? "gold-gradient text-primary-foreground" : "text-muted-foreground"
              }`}>
              {t === "stats" ? "İstatistik" : t === "members" ? `Üyeler (${members.length})` : t === "pending" ? `Bekleyen (${pending.length})` : `İşaretli (${flagged.length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-10 overflow-y-auto no-scrollbar">

        {/* ── STATS ── */}
        {tab === "stats" && (
          <div className="space-y-4 animate-fade-up">
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

            <div className="grid grid-cols-2 gap-3">
              {stats.map(({ label, value, delta }) => (
                <div key={label} className="bg-surface rounded-xl p-4 border border-border">
                  <p className="text-muted-foreground text-xs mb-1">{label}</p>
                  <p className="font-serif text-2xl text-foreground">{value}</p>
                  <p className="text-xs text-gold mt-1">{delta}</p>
                </div>
              ))}
            </div>

            {/* Gender Distribution */}
            <div className="bg-surface rounded-xl p-4 border border-border">
              <p className="text-xs text-gold uppercase tracking-wider mb-3">Cinsiyet Dağılımı</p>
              <div className="space-y-3">
                {Object.entries(genderCounts).map(([label, count]) => {
                  const pct = Math.round((count / members.length) * 100);
                  return (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="text-foreground font-medium">%{pct} ({count} kişi)</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full gold-gradient rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* City Distribution */}
            <div className="bg-surface rounded-xl p-4 border border-border">
              <p className="text-xs text-gold uppercase tracking-wider mb-3">Şehir Dağılımı</p>
              <div className="space-y-3">
                {sortedCities.map(([city, count]) => {
                  const pct = Math.round((count / members.length) * 100);
                  return (
                    <div key={city}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-muted-foreground">📍 {city}</span>
                        <span className="text-foreground font-medium">%{pct} ({count} kişi)</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full gold-gradient rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
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
          </div>
        )}

        {/* ── MEMBERS ── */}
        {tab === "members" && (
          <div className="space-y-3 animate-fade-up">
            {selectedMember ? (
              <div className="animate-fade-up">
                <button onClick={() => setSelectedMember(null)} className="flex items-center gap-2 text-muted-foreground text-sm hover:text-gold transition-colors mb-4">
                  ← Geri
                </button>
                <div className="glass rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif text-xl text-foreground">{selectedMember.name}</h2>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedMember.status === "approved"
                        ? "gold-gradient text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {selectedMember.status === "approved" ? "✓ Onaylı" : "İncelemede"}
                    </span>
                  </div>
                  <div className="luxury-divider" />
                  {[
                    { label: "Yaş", value: selectedMember.age.toString() },
                    { label: "Şehir", value: selectedMember.city },
                    { label: "Cinsiyet", value: GENDER_OPTIONS.find((g) => g.value === selectedMember.gender)?.label ?? selectedMember.gender },
                    { label: "Meslek", value: selectedMember.profession },
                    { label: "Burç", value: selectedMember.zodiac },
                    { label: "Instagram", value: selectedMember.instagram },
                    { label: "LinkedIn", value: selectedMember.linkedin || "—" },
                    { label: "Katılım", value: selectedMember.joinedAt },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="text-xs text-muted-foreground">{label}</span>
                      <span className="text-sm text-foreground font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs text-muted-foreground mb-2">Detayları görmek için üyeye dokun</p>
                {members.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => setSelectedMember(member)}
                    className="w-full bg-surface rounded-xl p-4 border border-border text-left hover:border-gold transition-colors animate-fade-up"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-foreground font-medium text-sm">{member.name}</p>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                            member.status === "approved"
                              ? "bg-green-500/10 text-green-400"
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {member.status === "approved" ? "✓" : "⏳"}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-xs mt-0.5">
                          {member.age} · {member.city} · {member.profession}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          📸 {member.instagram}
                          {member.linkedin && <span className="ml-2">💼 {member.linkedin}</span>}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {GENDER_OPTIONS.find((g) => g.value === member.gender)?.label}
                        </p>
                        <p className="text-xs text-gold">{member.zodiac}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </>
            )}
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
                          <span className="text-xs verified-badge px-1.5 py-0.5 rounded-full text-primary-foreground">Kimlik ✓</span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-xs">{user.age} · {user.city} · {user.profession}</p>
                      <p className="text-muted-foreground text-xs">{user.gender} · Başvurdu: {user.submittedAt}</p>
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
                        <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">{user.reason}</span>
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
