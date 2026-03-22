import { useQuery } from "@tanstack/react-query";

interface Stats {
  pending: number;
  approved: number;
  thisWeek: number;
  activeSubscriptions: number;
}

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
  loading?: boolean;
}

const StatCard = ({ label, value, sub, accent, loading }: StatCardProps) => (
  <div className="bg-[#141414] border border-[#242424] rounded-2xl p-5">
    <p className="text-gray-500 text-xs tracking-wider uppercase mb-2">{label}</p>
    <p className={`text-3xl font-light ${accent ? "text-[#C9A84C]" : "text-white"}`}>
      {loading ? <span className="animate-pulse text-gray-700">—</span> : value}
    </p>
    {sub && <p className="text-gray-600 text-xs mt-1">{sub}</p>}
  </div>
);

const apiRequest = async (path: string) => {
  const token = localStorage.getItem("admin_token") || "";
  const res = await fetch(path, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const AdminStats = () => {
  const { data, isLoading } = useQuery<Stats>({
    queryKey: ["/api/admin/stats"],
    queryFn: () => apiRequest("/api/admin/stats"),
    refetchInterval: 30000,
  });

  const stats: StatCardProps[] = [
    { label: "Onay Bekleyen", value: data?.pending ?? 0, sub: "Yeni başvurular", accent: true, loading: isLoading },
    { label: "Toplam Üye", value: data?.approved ?? 0, sub: "Aktif profiller", loading: isLoading },
    { label: "Bu Hafta Katılan", value: data?.thisWeek ?? 0, sub: "Yeni kayıtlar", loading: isLoading },
    { label: "Aktif Abonelik", value: data?.activeSubscriptions ?? 0, sub: "Premium üyeler", loading: isLoading },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
};
