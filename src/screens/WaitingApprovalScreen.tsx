import { useEffect, useRef, useState } from "react";
import { useApp } from "@/context/AppContext";

const DiamondLogo = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8" aria-hidden="true">
    <polygon points="50,28 68,50 50,72 32,50" fill="#C9A84C" />
  </svg>
);

const STEPS = [
  "Başvurunuz alındı",
  "Profil inceleniyor",
  "Üyelik komitesi değerlendiriyor",
];

export const WaitingApprovalScreen = () => {
  const { setScreen, registeredPhone } = useApp();
  const [activeStep, setActiveStep] = useState(0);
  const [notification, setNotification] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((s) => (s < STEPS.length - 1 ? s + 1 : s));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!registeredPhone) return;

    const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;
    const wsUrl = `${proto}//${host}/ws?phone=${encodeURIComponent(registeredPhone)}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => console.log("[ws] connected, waiting for approval");

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "approved") {
          setNotification("approved");
          setTimeout(() => setScreen("premium"), 2000);
        } else if (msg.type === "rejected") {
          setNotification("rejected");
        }
      } catch {}
    };

    ws.onerror = (err) => console.error("[ws] error:", err);

    return () => {
      ws.close();
    };
  }, [registeredPhone, setScreen]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full glass-gold mb-8 animate-float">
          <DiamondLogo />
        </div>

        <h1 className="font-serif text-3xl font-light tracking-widest text-[#C9A84C] mb-3">
          THE CLUB
        </h1>
        <p className="text-gray-500 text-xs tracking-[0.3em] uppercase mb-12">
          Başvurunuz İnceleniyor
        </p>

        {notification === "approved" && (
          <div
            data-testid="status-approved"
            className="mb-8 bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-2xl p-5 animate-fade-up"
          >
            <p className="text-[#C9A84C] font-serif text-lg mb-1">Tebrikler!</p>
            <p className="text-gray-400 text-sm">Üyeliğiniz onaylandı. Premium ekrana yönlendiriliyorsunuz…</p>
          </div>
        )}

        {notification === "rejected" && (
          <div
            data-testid="status-rejected"
            className="mb-8 bg-red-900/10 border border-red-900/30 rounded-2xl p-5 animate-fade-up"
          >
            <p className="text-red-400 font-serif text-lg mb-1">Üzgünüz</p>
            <p className="text-gray-400 text-sm">Başvurunuz bu aşamada onaylanamadı. Daha sonra tekrar deneyebilirsiniz.</p>
          </div>
        )}

        {!notification && (
          <div className="space-y-4 mb-12">
            {STEPS.map((step, i) => (
              <div
                key={step}
                data-testid={`step-approval-${i}`}
                className="flex items-center gap-4 text-left"
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-700 ${
                  i <= activeStep
                    ? "bg-[#C9A84C]/20 border border-[#C9A84C]"
                    : "bg-transparent border border-gray-800"
                }`}>
                  {i < activeStep && (
                    <svg viewBox="0 0 12 12" className="w-3 h-3">
                      <polyline points="2,6 5,9 10,3" stroke="#C9A84C" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {i === activeStep && (
                    <div className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
                  )}
                </div>
                <span className={`text-sm transition-colors duration-700 ${
                  i <= activeStep ? "text-gray-300" : "text-gray-700"
                }`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="bg-[#141414] border border-[#242424] rounded-2xl p-5 text-left">
          <p className="text-gray-600 text-xs tracking-wider uppercase mb-2">Bilgi</p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Başvurular 24–48 saat içinde sonuçlanır. Onay aldığınızda size bildirim gönderilecektir.
          </p>
          {registeredPhone && (
            <p className="text-gray-600 text-xs mt-3">
              Kayıtlı numara: <span className="text-gray-500">+90 {registeredPhone}</span>
            </p>
          )}
        </div>

        <button
          data-testid="button-back-to-login"
          onClick={() => setScreen("login")}
          className="mt-8 text-gray-700 text-xs hover:text-gray-500 transition-colors"
        >
          Farklı bir numara ile giriş yap
        </button>
      </div>
    </div>
  );
};
