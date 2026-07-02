import { useEffect, useState } from "react";
import { Users, MessageSquare, UserPlus, ShieldBan } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import TopBar from "../components/layout/TopBar";
import StatCard from "../components/ui/StatCard";

export default function DashboardPage() {
  const { admin } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/api/admin/stats")
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <TopBar title="Dashboard" subtitle={`Welcome back, ${admin?.name ?? "Admin"}`} />

      <div className="p-6 flex flex-col gap-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="Total Users"
            value={stats ? stats.totalUsers : "—"}
            color="violet"
          />
          <StatCard
            icon={MessageSquare}
            label="Total Messages"
            value={stats ? stats.totalMessages.toLocaleString() : "—"}
            color="blue"
          />
          <StatCard
            icon={UserPlus}
            label="Pending Requests"
            value={stats ? stats.pendingRequests : "—"}
            color="orange"
          />
          <StatCard
            icon={ShieldBan}
            label="Users With Blocks"
            value={stats ? stats.totalBlocked : "—"}
            color="red"
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col items-center justify-center text-center gap-2 text-gray-400">
          <p className="text-sm">More analytics coming soon.</p>
          <p className="text-xs">
            Head to <span className="text-violet-500 font-medium">Users</span> to manage all registered accounts.
          </p>
        </div>
      </div>
    </div>
  );
}
