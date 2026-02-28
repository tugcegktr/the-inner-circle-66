import React from "react";
import { useApp } from "@/context/AppContext";
import { LAUNCH_THRESHOLD, MOCK_APPROVED_COUNT } from "@/data/mockData";

export const PreLaunchScreen = () => {
  const { currentUser, setScreen } = useApp();
  const progress = Math.min((MOCK_APPROVED_COUNT / LAUNCH_THRESHOLD) * 100, 100);
  const remaining = LAUNCH_THRESHOLD - MOCK_APPROVED_COUNT;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 max-w-sm mx-auto">
      <div className="text-center w-full animate-fade-up">
        {/* Emblem */}
        <div className="w-24 h-24 rounded-full glass-gold mx-auto mb-8 flex items-center justify-center animate-float">
          <span className="text-5xl font-serif gold-text">♦</span>
        </div>

        <h1 className="font-serif text-4xl text-foreground mb-2">
          Açılış Günü Bekleniyor
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-10 max-w-xs mx-auto">
          The Club, üyelerin birbirini görebilmesi için belirli bir üye sayısına ulaşmayı bekliyor. Bu, her üyenin kaliteli bir deneyim yaşamasını sağlıyor.
        </p>

        {/* Progress */}
        <div className="glass rounded-2xl p-6 mb-8 text-left">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-xs tracking-widest text-gold uppercase mb-0.5">Onaylanan Üyeler</p>
              <p className="font-serif text-4xl text-foreground">
                {MOCK_APPROVED_COUNT}
                <span className="text-muted-foreground text-xl font-sans font-light"> / {LAUNCH_THRESHOLD}</span>
              </p>
            </div>
            <p className="text-sm text-muted-foreground pb-1">{remaining} kişi kaldı</p>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full gold-gradient rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-right">%{Math.round(progress)} tamamlandı</p>
        </div>

        {/* What happens at launch */}
        <div className="space-y-3 mb-10 text-left">
          {[
            { icon: "✦", title: "Açılış Gününde", desc: "Onaylanan tüm üyeler birbirini görmeye başlayacak." },
            { icon: "🔔", title: "Bildirim Alacaksın", desc: "Eşik sayısına ulaşıldığında sana haber vereceğiz." },
            { icon: "🛡", title: "Seçici Kalacağız", desc: "Her yeni üye yine de manuel incelemeden geçecek." },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4 bg-surface rounded-xl p-4 border border-border">
              <div className="w-8 h-8 rounded-full glass-gold flex items-center justify-center text-sm flex-shrink-0">{icon}</div>
              <div>
                <p className="text-sm font-medium text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Member status */}
        <div className="glass-gold rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Hesabın Durumu</p>
              <p className="text-sm font-medium text-foreground mt-0.5">{currentUser.name}</p>
            </div>
            <div className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wider ${
              currentUser.isApproved
                ? "gold-gradient text-primary-foreground"
                : "bg-surface border border-border text-muted-foreground"
            }`}>
              {currentUser.isApproved ? "✓ Onaylandı" : "İncelemede"}
            </div>
          </div>
        </div>

        {/* Demo shortcut */}
        <button
          onClick={() => setScreen("discovery")}
          className="w-full py-4 rounded-xl bg-surface border border-border text-muted-foreground text-sm hover:border-gold hover:text-foreground transition-all"
        >
          Demo Olarak Görüntüle →
        </button>

        <button onClick={() => setScreen("profile")} className="mt-3 text-xs text-muted-foreground hover:text-gold transition-colors">
          Profilimi Düzenle
        </button>
      </div>
    </div>
  );
};
