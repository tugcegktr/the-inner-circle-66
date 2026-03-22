const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-12 h-12 rounded-full border border-[#C9A84C]/20 flex items-center justify-center mb-4">
      <svg viewBox="0 0 100 100" className="w-6 h-6">
        <polygon points="50,32 64,50 50,68 36,50" fill="#C9A84C" opacity="0.5" />
      </svg>
    </div>
    <p className="text-gray-500 text-sm">Onay bekleyen başvuru yok</p>
    <p className="text-gray-700 text-xs mt-1">Yeni başvurular burada görünecek</p>
  </div>
);

export const PendingApprovals = () => {
  return (
    <div className="bg-[#141414] border border-[#242424] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#242424]">
        <h2 className="text-white text-sm font-medium tracking-wide">Onay Bekleyen Başvurular</h2>
        <span className="bg-[#C9A84C]/10 text-[#C9A84C] text-xs px-2 py-0.5 rounded-full">0</span>
      </div>
      <EmptyState />
    </div>
  );
};
