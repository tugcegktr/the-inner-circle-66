import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const DiamondLogo = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8" aria-hidden="true">
    <circle cx="50" cy="50" r="46" fill="none" stroke="#C9A84C" strokeWidth="1.5" />
    <polygon points="50,32 64,50 50,68 36,50" fill="#C9A84C" />
  </svg>
);

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Giriş başarısız"); return; }
      localStorage.setItem("admin_token", data.token);
      navigate("/admin/dashboard");
    } catch {
      setError("Sunucuya bağlanılamadı");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
      <div className="w-full max-w-md px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-[#C9A84C]/30 mb-6">
            <DiamondLogo />
          </div>
          <h1 className="text-3xl tracking-[0.3em] text-[#C9A84C] font-light mb-1">THE CLUB</h1>
          <p className="text-gray-600 text-xs tracking-[0.25em] uppercase">Admin Panel</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            data-testid="input-admin-email"
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#141414] border border-[#242424] text-white rounded-xl px-4 py-3.5 outline-none focus:border-[#C9A84C]/50 transition-colors text-sm placeholder:text-gray-600"
            required
          />
          <input
            data-testid="input-admin-password"
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#141414] border border-[#242424] text-white rounded-xl px-4 py-3.5 outline-none focus:border-[#C9A84C]/50 transition-colors text-sm placeholder:text-gray-600"
            required
          />
          {error && (
            <p data-testid="text-login-error" className="text-red-400 text-sm text-center">
              {error}
            </p>
          )}
          <button
            data-testid="button-admin-login"
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#C9A84C] text-black font-medium text-sm tracking-wider hover:bg-[#d4b55c] transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? "Giriş yapılıyor…" : "Giriş Yap"}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-700 text-xs tracking-wider">
          www.theclubapp.com.tr/admin
        </p>
      </div>
    </div>
  );
};
