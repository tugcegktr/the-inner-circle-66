import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface ClubUser {
  id: number;
  phone: string;
  name: string | null;
  status: "pending" | "approved" | "rejected";
  subscription_status: string;
  created_at: string;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const maskPhone = (phone: string) => {
  if (phone.length < 7) return phone;
  return phone.slice(0, 3) + " *** ** " + phone.slice(-2);
};

const apiRequest = async (path: string, method = "GET", body?: object) => {
  const token = localStorage.getItem("admin_token") || "";
  const res = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

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
  const queryClient = useQueryClient();
  const [actionId, setActionId] = useState<number | null>(null);

  const { data, isLoading } = useQuery<{ users: ClubUser[] }>({
    queryKey: ["/api/admin/users", "pending"],
    queryFn: () => apiRequest("/api/admin/users?status=pending"),
    refetchInterval: 30000,
  });

  const approveMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/admin/users/${id}/approve`, "POST"),
    onMutate: (id) => setActionId(id),
    onSettled: () => {
      setActionId(null);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/admin/users/${id}/reject`, "POST"),
    onMutate: (id) => setActionId(id),
    onSettled: () => {
      setActionId(null);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
  });

  const users = data?.users ?? [];
  const count = users.length;

  return (
    <div className="bg-[#141414] border border-[#242424] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#242424]">
        <h2 className="text-white text-sm font-medium tracking-wide">Onay Bekleyen Başvurular</h2>
        <span
          data-testid="badge-pending-count"
          className="bg-[#C9A84C]/10 text-[#C9A84C] text-xs px-2 py-0.5 rounded-full"
        >
          {isLoading ? "…" : count}
        </span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-5 h-5 border border-[#C9A84C]/30 border-t-[#C9A84C] rounded-full animate-spin" />
        </div>
      ) : count === 0 ? (
        <EmptyState />
      ) : (
        <div className="divide-y divide-[#1e1e1e]">
          {users.map((user) => {
            const busy = actionId === user.id;
            return (
              <div
                key={user.id}
                data-testid={`row-user-${user.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {user.name || "İsimsiz Üye"}
                  </p>
                  <p className="text-gray-600 text-xs mt-0.5">
                    +90 {maskPhone(user.phone)}
                  </p>
                  <p className="text-gray-700 text-xs mt-0.5">
                    {formatDate(user.created_at)}
                  </p>
                </div>
                <div className="flex gap-2 ml-4 flex-shrink-0">
                  <button
                    data-testid={`button-reject-${user.id}`}
                    disabled={busy}
                    onClick={() => rejectMutation.mutate(user.id)}
                    className="px-3 py-1.5 rounded-lg border border-red-900/40 text-red-500 text-xs hover:bg-red-900/10 transition-colors disabled:opacity-40"
                  >
                    {busy && rejectMutation.isPending ? "…" : "Reddet"}
                  </button>
                  <button
                    data-testid={`button-approve-${user.id}`}
                    disabled={busy}
                    onClick={() => approveMutation.mutate(user.id)}
                    className="px-3 py-1.5 rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] text-xs hover:bg-[#C9A84C]/20 transition-colors disabled:opacity-40"
                  >
                    {busy && approveMutation.isPending ? "…" : "Onayla"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
