import { Users, UserCheck, MessageSquare, UserPlus } from "lucide-react";
import { STATS } from "../data/sampleData";
import TopBar from "../components/layout/TopBar";
import StatCard from "../components/ui/StatCard";

export default function DashboardPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <TopBar title="Dashboard" subtitle="Welcome back, Admin" />
      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users}        label="Total Users"        value={STATS.totalUsers}             color="violet" />
          <StatCard icon={UserCheck}    label="Online Now"         value={STATS.onlineUsers}            color="green"  />
          <StatCard icon={MessageSquare} label="Total Messages"   value={STATS.totalMessages}          color="blue"   />
          <StatCard icon={UserPlus}     label="Pending Requests"   value={STATS.pendingFriendRequests}  color="orange" />
        </div>

        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-8 flex flex-col items-center justify-center text-center gap-2 text-gray-400">
          <p className="text-sm">More analytics coming soon.</p>
          <p className="text-xs">Head to <span className="text-violet-500 font-medium">Users</span> to manage all registered accounts.</p>
        </div>
      </div>
    </div>
  );
}
