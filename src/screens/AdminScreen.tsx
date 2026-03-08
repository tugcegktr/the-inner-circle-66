import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { ADMIN_PENDING_USERS, ADMIN_FLAGGED_PROFILES, LAUNCH_THRESHOLD, MOCK_APPROVED_COUNT, ADMIN_ALL_MEMBERS, GENDER_OPTIONS } from "@/data/mockData";

type PendingUser = typeof ADMIN_PENDING_USERS[0];
type FlaggedUser = typeof ADMIN_FLAGGED_PROFILES[0];
type Member = typeof ADMIN_ALL_MEMBERS[0];

// Full profile modal shown when admin clicks any user
const ProfileModal = ({
  title,
  profile,
  onClose,
  actions,
}: {
  title: string;
  profile: Record<string, string | number | boolean | string[]>;
  onClose: () => void;
  actions?: React.ReactNode;
}) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center" onClick={onClose}>
    <div className="w-full max-w-sm glass rounded-t-3xl p-5 animate-fade-up max-h-[85vh] overflow-y-auto no-scrollbar" onClick={(e) => e.stopPropagation()}>
      <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-4" />
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-xl text-foreground">{title}</h3>
        <button onClick={onClose} className="text-muted-foreground text-xs hover:text-gold transition-colors">✕ Kapat</button>
      </div>
      <div className="luxury-divider mb-4" />
      <div className="space-y-2 mb-4">
        {Object.entries(profile).map(([key, val]) => {
          if (val === undefined || val === null || val === "") return null;
          const labels: Record<string, string> = {
            name: "Ad Soyad", age: "Yaş", city: "Şehir", profession: "Meslek",
            gender: "Cinsiyet", zodiac: "Burç", height: "Boy", instagram: "Instagram",
            linkedin: "LinkedIn", status: "Durum", joinedAt: "Katılım", submittedAt: "Başvuru",
            verified: "Kimlik Doğrulama", socialLinked: "Sosyal Bağlantı", bio: "Hakkında",
            interests: "İlgi Alanları", reason: "Şikayet Sebebi", reportCount: "Şikayet Sayısı",
            reportedBy: "Şikayet Eden", reportDate: "Tarih",
          };
          const label = labels[key] || key;
          let display = "";
          if (typeof val === "boolean") display = val ? "✓ Evet" : "✗ Hayır";
          else if (Array.isArray(val)) display = val.join(", ");
          else display = String(val);
          if (key === "status") display = val === "approved" ? "✓ Onaylı" : "⏳ Bekliyor";
          return (
            <div key={key} className="flex items-start justify-between py-2 border-b border-border last:border-0">
              <span className="text-xs text-muted-foreground w-28 flex-shrink-0">{label}</span>
              <span className="text-xs text-foreground font-medium text-right flex-1">{display}</span>
            </div>
          );
        })}
      </div>
      {actions}
    </div>
  </div>
);

export const AdminScreen = () => {
  const { setScreen } = useApp();
  const [tab, setTab] = useState<"pending" | "flagged" | "stats" | "members">("stats");
  const [pending, setPending] = useState(ADMIN_PENDING_USERS);
  const [flagged, setFlagged] = useState(ADMIN_FLAGGED_PROFILES);
  const [members] = useState(ADMIN_ALL_MEMBERS);
  const [approvedCount, setApprovedCount] = useState(MOCK_APPROVED_COUNT);
  const [notif, setNotif] = useState<string | null>(null);

  // Modal states
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedPending, setSelectedPending] = useState<PendingUser | null>(null);
  const [selectedFlagged, setSelectedFlagged] = useState<FlaggedUser | null>(null);
  const [approveAction, setApproveAction] = useState<{ user: PendingUser; type: "premium" | "standard" } | null>(null);

  const launchReady = approvedCount >= LAUNCH_THRESHOLD;
  const progress = Math.min((approvedCount / LAUNCH_THRESHOLD) * 100, 100);

  const showNotif = (msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 4000);
  };

  const confirmApprove = (user: PendingUser, type: "premium" | "standard") => {
    setApproveAction({ user, type });
    setSelectedPending(null);
  };

  const executeApprove = () => {
    if (!approveAction) return;
    const { user, type } = approveAction;
    setPending((p) => p.filter((u) => u.id !== user.id));
    setApprovedCount((c) => c + 1);
    const msg = type === "premium"
      ? `📱 ${user.name}'e bildirim: "Tebrikler! The Club üyeliğiniz onaylandı. 3 ay ücretsiz Premium Gold hediyeniz aktif edildi. Yeni bağlantılar kurmaya başlayın."`
      : `📱 ${user.name}'e bildirim: "Tebrikler! The Club üyeliğiniz onaylandı. Yeni bağlantılar kurmaya başlayın."`;
    showNotif(msg);
    setApproveAction(null);
  };

  const reject = (id: string) => {
    setPending((p) => p.filter((u) => u.id !== id));
    setSelectedPending(null);
  };

  const ban = (id: string) => {
    setFlagged((f) => f.filter((u) => u.id !== id));
    setSelectedFlagged(null);
  };

  // Stats
  const genderCounts = members.reduce((acc, m) => {
    const label = GENDER_OPTIONS.find((g) => g.value === m.gender)?.label ?? m.gender;
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-xs w-full px-4 animate-fade-up">
          <div className="bg-surface border border-gold/40 rounded-xl px-4 py-3 shadow-gold-sm">
            <p className="text-xs text-foreground">{notif}</p>
          </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {approveAction && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="glass rounded-2xl p-6 w-full max-w-sm animate-scale-in">
            <p className="font-serif text-xl text-center mb-2">
              {approveAction.type === "premium" ? "🏆 Ücretsiz Premium Onayla" : "✓ Ücretli Üye Onayla"}
            </p>
            <p className="text-muted-foreground text-sm text-center mb-2">
              <span className="text-foreground font-medium">{approveAction.user.name}</span>
            </p>
            {approveAction.type === "premium" ? (
              <p className="text-xs text-muted-foreground text-center mb-6">
                Bu üyeye <span className="text-gold font-medium">3 ay ücretsiz Premium Gold</span> verilecek. Ödeme ekranı gösterilmeyecek, direkt keşfet sayfasına yönlendirilecek.
              </p>
            ) : (
              <p className="text-xs text-muted-foreground text-center mb-6">
                Bu üye ödeme ekranına yönlendirilecek. Ücretli üyelik aktivasyonu yapacak.
              </p>
            )}
            <button onClick={executeApprove}
              className="w-full py-3 rounded-xl gold-gradient text-primary-foreground text-sm font-medium mb-2">
              Onayla
            </button>
            <button onClick={() => setApproveAction(null)} className="w-full py-3 text-muted-foreground text-sm">İptal</button>
          </div>
        </div>
      )}

      {/* Member profile modal */}
      {selectedMember && (
        <ProfileModal
          title={selectedMember.name}
          profile={{
            name: selectedMember.name,
            age: selectedMember.age,
            city: selectedMember.city,
            gender: GENDER_OPTIONS.find((g) => g.value === selectedMember.gender)?.label ?? selectedMember.gender,
            profession: selectedMember.profession,
            zodiac: selectedMember.zodiac,
            instagram: selectedMember.instagram,
            linkedin: selectedMember.linkedin || "—",
            status: selectedMember.status,
            joinedAt: selectedMember.joinedAt,
          }}
          onClose={() => setSelectedMember(null)}
        />
      )}

      {/* Pending profile modal */}
      {selectedPending && (
        <ProfileModal
          title={selectedPending.name}
          profile={{
            name: selectedPending.name,
            age: selectedPending.age,
            city: selectedPending.city,
            gender: selectedPending.gender,
            profession: selectedPending.profession,
            zodiac: (selectedPending as any).zodiac || "—",
            height: (selectedPending as any).height || "—",
            instagram: (selectedPending as any).instagram || "—",
            linkedin: (selectedPending as any).linkedin || "—",
            bio: (selectedPending as any).bio || "—",
            interests: (selectedPending as any).interests || [],
            submittedAt: selectedPending.submittedAt,
            verified: selectedPending.verified,
            socialLinked: selectedPending.socialLinked,
          }}
          onClose={() => setSelectedPending(null)}
          actions={
            <div className="space-y-2">
              <button
                onClick={() => confirmApprove(selectedPending, "premium")}
                className="w-full py-3 rounded-xl gold-gradient text-primary-foreground text-sm font-medium"
              >
                🏆 3 Ay Ücretsiz Premium ile Onayla
              </button>
              <button
                onClick={() => confirmApprove(selectedPending, "standard")}
                className="w-full py-3 rounded-xl border border-gold text-gold text-sm font-medium hover:bg-gold/10 transition-colors"
              >
                ✓ Ücretli Üyeliğe Yönlendir
              </button>
              <button
                onClick={() => reject(selectedPending.id)}
                className="w-full py-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors"
              >
                ✕ Reddet
              </button>
            </div>
          }
        />
      )}

      {/* Flagged profile modal */}
      {selectedFlagged && (
        <ProfileModal
          title={selectedFlagged.name}
          profile={{
            name: selectedFlagged.name,
            age: selectedFlagged.age,
            city: selectedFlagged.city,
            reason: selectedFlagged.reason,
            reportCount: selectedFlagged.reportCount,
            reportedBy: (selectedFlagged as any).reportedBy || "—",
            reportDate: (selectedFlagged as any).reportDate || "—",
            instagram: (selectedFlagged as any).instagram || "—",
            linkedin: (selectedFlagged as any).linkedin || "—",
          }}
          onClose={() => setSelectedFlagged(null)}
          actions={
            <div className="space-y-2">
              <button
                onClick={() => ban(selectedFlagged.id)}
                className="w-full py-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors"
              >
                🚫 Hesabı Yasakla
              </button>
              <button
                onClick={() => setSelectedFlagged(null)}
                className="w-full py-3 rounded-xl border border-border text-muted-foreground text-sm hover:border-gold hover:text-gold transition-colors"
              >
                Şimdilik İzle
              </button>
            </div>
          }
        />
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
                {launchReady ? "Eşiğe ulaşıldı. Üyeler artık birbirini görebilir." : `${LAUNCH_THRESHOLD - approvedCount} üye daha onaylanınca uygulama açılacak.`}
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
            <p className="text-xs text-muted-foreground mb-2">Detayları görmek için üyeye dokun</p>
            {members.map((member) => (
              <button
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className="w-full bg-surface rounded-xl p-4 border border-border text-left hover:border-gold transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-foreground font-medium text-sm">{member.name}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        member.status === "approved" ? "bg-green-500/10 text-green-400" : "bg-muted text-muted-foreground"
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
                    <p className="text-xs text-muted-foreground">{GENDER_OPTIONS.find((g) => g.value === member.gender)?.label}</p>
                    <p className="text-xs text-gold">{member.zodiac}</p>
                  </div>
                </div>
              </button>
            ))}
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
                <button
                  key={user.id}
                  onClick={() => setSelectedPending(user)}
                  className="w-full bg-surface rounded-xl p-4 border border-border text-left hover:border-gold transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-foreground font-medium text-sm">{user.name}</p>
                        {user.verified && (
                          <span className="text-xs verified-badge px-1.5 py-0.5 rounded-full text-primary-foreground">Kimlik ✓</span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-xs">{user.age} · {user.city} · {user.profession}</p>
                      <p className="text-muted-foreground text-xs">{user.gender} · Başvurdu: {user.submittedAt}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        📸 {(user as any).instagram}
                        {(user as any).linkedin && <span className="ml-2">💼 {(user as any).linkedin}</span>}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className={`text-xs px-2 py-1 rounded-full ${user.socialLinked ? "bg-green-500/10 text-green-400" : "bg-destructive/10 text-destructive"}`}>
                        {user.socialLinked ? "✓ Sosyal" : "✕ Sosyal Yok"}
                      </div>
                      <span className="text-xs text-gold">→ Profil</span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {/* ── FLAGGED ── */}
        {tab === "flagged" && (
          <div className="space-y-3 animate-fade-up">
            <p className="text-xs text-muted-foreground mb-2">Eşleşmelerden gelen şikayetler. Detay için dokun.</p>
            {flagged.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">🛡</p>
                <p className="font-serif text-xl text-foreground">Temiz</p>
                <p className="text-muted-foreground text-sm">İşaretlenmiş profil yok</p>
              </div>
            ) : (
              flagged.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedFlagged(user)}
                  className="w-full bg-surface rounded-xl p-4 border border-destructive/30 text-left hover:border-destructive transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-foreground font-medium text-sm">{user.name}</p>
                      <p className="text-muted-foreground text-xs">{user.age} · {user.city}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">{user.reason}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {user.reportCount} şikayet · Şikayet eden: {(user as any).reportedBy}
                      </p>
                    </div>
                    <span className="text-xs text-destructive">→ İncele</span>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
