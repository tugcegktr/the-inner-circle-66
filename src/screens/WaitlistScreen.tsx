import React from "react";
import { useApp } from "@/context/AppContext";
import { LAUNCH_THRESHOLD, MOCK_APPROVED_COUNT } from "@/data/mockData";

export const WaitlistScreen = () => {
  const { setScreen, currentUser } = useApp();

  const steps = [
    { icon: "📋", title: "Başvuru Alındı", desc: "Profilin ve fotoğrafların sisteme kaydedildi.", done: true },
    { icon: "🔍", title: "Profil İncelemesi", desc: "Ekibimiz profilini manuel olarak inceliyor.", done: true },
    { icon: "📱", title: "Sosyal Doğrulama", desc: "Instagram veya LinkedIn hesabın kontrol ediliyor.", done: Boolean(currentUser.instagramHandle || currentUser.linkedinUrl) },
    { icon: "✅", title: "Üyelik Onayı", desc: "The Club'a hoş geldin bildirimi alacaksın.", done: false },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 max-w-sm mx-auto">
      <div className="text-center w-full animate-fade-up">
        {/* Logo */}
        <div className="w-20 h-20 rounded-full glass-gold mx-auto mb-6 flex items-center justify-center animate-float">
          <span className="text-3xl gold-text font-serif">♦</span>
        </div>

        <h1 className="font-serif text-4xl text-foreground mb-2">
          Başvurun <span className="gold-text">Alındı</span>
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-xs mx-auto">
          Ekibimiz başvurunu inceliyor. Onaylandığında SMS ile bilgilendirileceksin.
        </p>

        {/* Status card */}
        <div className="glass rounded-2xl p-5 mb-8 text-left">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs tracking-widest text-gold uppercase">Başvuru Durumu</p>
            <span className="text-xs bg-surface border border-gold/30 text-gold px-2.5 py-1 rounded-full">İncelemede</span>
          </div>

          <div className="space-y-4">
            {steps.map(({ icon, title, desc, done }, i) => (
              <div key={title} className="flex items-start gap-3">
                {/* Connector line */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                    done ? "gold-gradient text-primary-foreground" : "bg-surface border border-border text-muted-foreground"
                  }`}>
                    {done ? "✓" : icon}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-px flex-1 mt-1 mb-1 ${done ? "bg-gold/40" : "bg-border"}`} style={{ height: "16px" }} />
                  )}
                </div>
                <div className="pt-1">
                  <p className={`text-sm font-medium ${done ? "text-foreground" : "text-muted-foreground"}`}>{title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Launch info */}
        <div className="bg-surface rounded-xl p-4 border border-border mb-6">
          <p className="text-xs text-gold font-medium mb-1">🚀 Açılış Hakkında</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Onaylandıktan sonra bile The Club, <span className="text-foreground font-medium">{LAUNCH_THRESHOLD} üyeye</span> ulaşana kadar aktif olmayacak. Şu an <span className="text-gold font-medium">{MOCK_APPROVED_COUNT} onaylı üye</span> var.
          </p>
        </div>

        {/* What you CANNOT do yet (clear info) */}
        <div className="space-y-2 mb-8 text-left">
          {[
            { icon: "🔒", text: "Diğer üyeleri göremezsin (açılış gününe kadar)" },
            { icon: "🔒", text: "Profilleri gezemezsin" },
            { icon: "✅", text: "Profilini düzenleyebilirsin" },
            { icon: "✅", text: "Durumunu takip edebilirsin" },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{icon}</span>
              <span className={icon === "✅" ? "text-foreground" : ""}>{text}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setScreen("profile")}
          className="w-full py-4 rounded-xl gold-gradient text-primary-foreground font-medium text-sm tracking-wider hover:opacity-90 active:scale-95 transition-all"
        >
          Profilimi Düzenle
        </button>

        {/* Demo shortcut */}
        <button
          onClick={() => setScreen("pre-launch")}
          className="mt-3 w-full py-3 text-muted-foreground text-xs hover:text-gold transition-colors"
        >
          Açılış Sayfasını Görüntüle
        </button>
      </div>
    </div>
  );
};
