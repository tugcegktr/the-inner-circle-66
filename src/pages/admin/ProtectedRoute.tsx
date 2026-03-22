import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin");
      return;
    }
    fetch("/api/admin/verify", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.ok) setChecking(false);
        else { localStorage.removeItem("admin_token"); navigate("/admin"); }
      })
      .catch(() => navigate("/admin"));
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-[#C9A84C] tracking-widest text-sm animate-pulse">YÜKLENİYOR…</div>
      </div>
    );
  }
  return <>{children}</>;
};
