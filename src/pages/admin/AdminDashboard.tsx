import { useNavigate, Routes, Route, Link, useLocation } from "react-router-dom";
import { AdminStats } from "./AdminStats";
import { PendingApprovals } from "./PendingApprovals";

const NAV_ITEMS = [
  { path: "/admin/dashboard", label: "Genel Bakış", icon: "◆" },
  { path: "/admin/dashboard/approvals", label: "Onay Bekleyenler", icon: "⏳" },
  { path: "/admin/dashboard/members", label: "Üyeler", icon: "👥" },
  { path: "/admin/dashboard/reports", label: "Raporlar", icon: "⚑" },
];

const Sidebar = ({ onLogout }: { onLogout: () => void }) => {
  const { pathname } = useLocation();
  return (
    <aside className="w-56 bg-[#0a0a0a] border-r border-[#1e1e1e] flex flex-col min-h-screen">
      <div className="px-6 py-7 border-b border-[#1e1e1e]">
        <p className="text-[#C9A84C] tracking-[0.25em] text-sm font-light">THE CLUB</p>
        <p className="text-gray-700 text-[10px] tracking-widest uppercase mt-0.5">Admin</p>
      </div>
      <nav className="flex-1 py-4">
        {NAV_ITEMS.map(({ path, label, icon }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
              pathname === path
                ? "text-[#C9A84C] bg-[#C9A84C]/5 border-r-2 border-[#C9A84C]"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <span className="text-xs">{icon}</span>
            {label}
          </Link>
        ))}
      </nav>
      <button
        onClick={onLogout}
        className="mx-4 mb-6 py-2.5 rounded-xl border border-[#2a2a2a] text-gray-600 hover:text-gray-300 hover:border-[#3a3a3a] text-xs tracking-wider transition-colors"
      >
        Çıkış Yap
      </button>
    </aside>
  );
};

const Overview = () => (
  <div className="space-y-6">
    <AdminStats />
    <PendingApprovals />
  </div>
);

const ComingSoon = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-gray-700 text-xs mt-1">Yakında aktif olacak</p>
    </div>
  </div>
);

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin");
  };

  const pageTitle = NAV_ITEMS.find((n) => n.path === pathname)?.label ?? "Admin Panel";

  return (
    <div className="flex min-h-screen bg-[#0D0D0D]">
      <Sidebar onLogout={handleLogout} />
      <main className="flex-1 p-8">
        <h1 className="text-white text-xl font-light tracking-wide mb-6">{pageTitle}</h1>
        <Routes>
          <Route index element={<Overview />} />
          <Route path="approvals" element={<PendingApprovals />} />
          <Route path="members" element={<ComingSoon title="Üye Yönetimi" />} />
          <Route path="reports" element={<ComingSoon title="Rapor Yönetimi" />} />
        </Routes>
      </main>
    </div>
  );
};
