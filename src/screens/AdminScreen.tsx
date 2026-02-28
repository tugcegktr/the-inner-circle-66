import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { ADMIN_PENDING_USERS, ADMIN_FLAGGED_PROFILES } from "@/data/mockData";

export const AdminScreen = () => {
  const { setScreen } = useApp();
  const [tab, setTab] = useState<"pending" | "flagged" | "stats">("pending");
  const [pending, setPending] = useState(ADMIN_PENDING_USERS);
  const [flagged, setFlagged] = useState(ADMIN_FLAGGED_PROFILES);

  const approve = (id: string) => setPending((p) => p.filter((u) => u.id !== id));
  const reject = (id: string) => setPending((p) => p.filter((u) => u.id !== id));
  const ban = (id: string) => setFlagged((f) => f.filter((u) => u.id !== id));

  const stats = [
    { label: "Total Members", value: "2,847", delta: "+12%" },
    { label: "Pending Review", value: pending.length.toString(), delta: `${pending.length} new` },
    { label: "Active Today", value: "1,204", delta: "+8%" },
    { label: "Flagged Profiles", value: flagged.length.toString(), delta: `${flagged.length} open` },
  ];

  return (
    <div className="min-h-screen bg-background max-w-sm mx-auto">
      {/* Header */}
      <div className="px-6 pt-10 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-serif text-2xl gold-text">Admin Dashboard</h1>
            <p className="text-muted-foreground text-xs tracking-wider">The Club · Internal</p>
          </div>
          <button
            onClick={() => setScreen("login")}
            className="px-3 py-1.5 rounded-lg bg-surface border border-border text-muted-foreground text-xs hover:border-gold hover:text-gold transition-colors"
          >
            Exit
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-surface rounded-xl p-1">
          {(["pending", "flagged", "stats"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all capitalize ${
                tab === t ? "gold-gradient text-primary-foreground" : "text-muted-foreground"
              }`}>
              {t === "pending" ? `Pending (${pending.length})` : t === "flagged" ? `Flagged (${flagged.length})` : "Stats"}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-10 overflow-y-auto no-scrollbar">
        {/* Stats */}
        {tab === "stats" && (
          <div className="space-y-4 animate-fade-up">
            <div className="grid grid-cols-2 gap-3">
              {stats.map(({ label, value, delta }) => (
                <div key={label} className="bg-surface rounded-xl p-4 border border-border">
                  <p className="text-muted-foreground text-xs mb-1">{label}</p>
                  <p className="font-serif text-2xl text-foreground">{value}</p>
                  <p className="text-xs text-gold mt-1">{delta}</p>
                </div>
              ))}
            </div>

            <div className="bg-surface rounded-xl p-4 border border-border">
              <p className="text-xs text-gold uppercase tracking-wider mb-3">Activity Graph (Last 7 Days)</p>
              <div className="flex items-end gap-1.5 h-16">
                {[42, 58, 35, 70, 65, 80, 74].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm gold-gradient" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <span key={d} className="text-xs text-muted-foreground">{d}</span>
                ))}
              </div>
            </div>

            <div className="bg-surface rounded-xl p-4 border border-border">
              <p className="text-xs text-gold uppercase tracking-wider mb-3">Member Breakdown</p>
              <div className="space-y-3">
                {[
                  { label: "Women", value: 68, color: "gold-gradient" },
                  { label: "Men", value: 32, color: "bg-surface-raised" },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="text-foreground font-medium">{value}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pending Review */}
        {tab === "pending" && (
          <div className="space-y-3 animate-fade-up">
            {pending.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">✓</p>
                <p className="font-serif text-xl text-foreground">All Caught Up</p>
                <p className="text-muted-foreground text-sm">No pending applications</p>
              </div>
            ) : pending.map((user) => (
              <div key={user.id} className="bg-surface rounded-xl p-4 border border-border animate-fade-up">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-foreground font-medium text-sm">{user.name}</p>
                      {user.verified && (
                        <span className="text-xs text-gold verified-badge px-1.5 py-0.5 rounded-full text-primary-foreground">ID ✓</span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs">{user.age} · {user.city}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">Applied {user.submittedAt}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs px-2 py-1 rounded-full ${user.socialLinked ? "bg-green-500/10 text-green-400" : "bg-destructive/10 text-destructive"}`}>
                      {user.socialLinked ? "✓ Social" : "✕ No Social"}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => reject(user.id)}
                    className="flex-1 py-2.5 rounded-lg bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors">
                    Reject
                  </button>
                  <button onClick={() => approve(user.id)}
                    className="flex-[2] py-2.5 rounded-lg gold-gradient text-primary-foreground text-xs font-medium">
                    ✓ Approve to The Club
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Flagged */}
        {tab === "flagged" && (
          <div className="space-y-3 animate-fade-up">
            {flagged.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">🛡</p>
                <p className="font-serif text-xl text-foreground">All Clear</p>
                <p className="text-muted-foreground text-sm">No flagged profiles</p>
              </div>
            ) : flagged.map((user) => (
              <div key={user.id} className="bg-surface rounded-xl p-4 border border-destructive/30 animate-fade-up">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-foreground font-medium text-sm">{user.name}</p>
                    <p className="text-muted-foreground text-xs">{user.age} · {user.city}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                        {user.reason}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{user.reportCount} report{user.reportCount > 1 ? "s" : ""}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2.5 rounded-lg bg-surface border border-border text-muted-foreground text-xs hover:border-gold hover:text-gold transition-colors">
                    Review
                  </button>
                  <button onClick={() => ban(user.id)}
                    className="flex-1 py-2.5 rounded-lg bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors">
                    Ban User
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
