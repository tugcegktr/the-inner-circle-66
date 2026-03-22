interface Stat {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}

const StatCard = ({ label, value, sub, accent }: Stat) => (
  <div className="bg-[#141414] border border-[#242424] rounded-2xl p-5">
    <p className="text-gray-500 text-xs tracking-wider uppercase mb-2">{label}</p>
    <p className={`text-3xl font-light ${accent ? "text-[#C9A84C]" : "text-white"}`}>{value}</p>
    {sub && <p className="text-gray-600 text-xs mt-1">{sub}</p>}
  </div>
);

export const AdminStats = () => {
  const stats: Stat[] = [
    { label: "Onay Bekleyen", value: 0, sub: "Yeni başvurular", accent: true },
    { label: "Toplam Üye", value: 0, sub: "Aktif profiller" },
    { label: "Bu Hafta Katılan", value: 0, sub: "Yeni kayıtlar" },
    { label: "Aktif Abonelik", value: 0, sub: "Premium üyeler" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
};
