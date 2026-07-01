import { useState } from "react";
import { Search, UserCheck, ShieldBan, Users, UserX, ChevronUp, ChevronDown, Eye } from "lucide-react";
import { USERS } from "../data/sampleData";
import TopBar from "../components/layout/TopBar";
import StatCard from "../components/ui/StatCard";

const STATUS_COLORS = { online: "bg-green-400", offline: "bg-gray-300" };

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [selectedUser, setSelectedUser] = useState(null);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  const filtered = USERS.filter((u) => {
    const matchSearch =
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchStatus;
  }).sort((a, b) => {
    let av = a[sortField], bv = b[sortField];
    if (sortField === "friends") { av = a.friends.length; bv = b.friends.length; }
    if (typeof av === "string") av = av.toLowerCase(), bv = bv.toLowerCase();
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const onlineCount = USERS.filter((u) => u.status === "online").length;
  const blockedCount = USERS.filter((u) => u.blockedUsers.length > 0).length;
  const blockedByOthers = USERS.filter((u) =>
    USERS.some((other) => other.blockedUsers.includes(u._id))
  ).length;

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp size={13} className="text-gray-300" />;
    return sortDir === "asc"
      ? <ChevronUp size={13} className="text-violet-500" />
      : <ChevronDown size={13} className="text-violet-500" />;
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <TopBar title="Users" subtitle="Manage all registered users" />

      <div className="p-6 flex flex-col gap-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users}    label="Total Users"    value={USERS.length}    color="violet" />
          <StatCard icon={UserCheck} label="Online Now"    value={onlineCount}     color="green"  />
          <StatCard icon={ShieldBan} label="Have Blocked"  value={blockedCount}    color="orange" />
          <StatCard icon={UserX}     label="Blocked by Others" value={blockedByOthers} color="red" />
        </div>

        {/* Table card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-700">
              All Users <span className="text-gray-400 font-normal">({filtered.length})</span>
            </p>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name or email..."
                  className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 w-full sm:w-56"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
              >
                <option value="all">All Status</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">#</th>
                  <th
                    className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none"
                    onClick={() => toggleSort("fullName")}
                  >
                    <div className="flex items-center gap-1">User <SortIcon field="fullName" /></div>
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th
                    className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none"
                    onClick={() => toggleSort("friends")}
                  >
                    <div className="flex items-center gap-1">Friends <SortIcon field="friends" /></div>
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Blocked</th>
                  <th
                    className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none"
                    onClick={() => toggleSort("createdAt")}
                  >
                    <div className="flex items-center gap-1">Joined <SortIcon field="createdAt" /></div>
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-10 text-center text-gray-400 text-sm">
                      No users found.
                    </td>
                  </tr>
                )}
                {filtered.map((user, i) => {
                  const isBlocked = USERS.some((u) => u.blockedUsers.includes(user._id));
                  return (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5 text-gray-400">{i + 1}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <img
                              src={user.profilePic}
                              alt={user.fullName}
                              className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200"
                            />
                            <span
                              className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${STATUS_COLORS[user.status]}`}
                            />
                          </div>
                          <span className="font-medium text-gray-900">{user.fullName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">{user.email}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            user.status === "online"
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[user.status]}`} />
                          {user.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-700 font-medium">{user.friends.length}</td>
                      <td className="px-5 py-3.5">
                        {isBlocked ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
                            Blocked
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">{formatDate(user.createdAt)}</td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-600 hover:text-violet-800 hover:underline"
                        >
                          <Eye size={13} /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User detail modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center gap-2 mb-5">
              <div className="relative">
                <img
                  src={selectedUser.profilePic}
                  alt={selectedUser.fullName}
                  className="w-16 h-16 rounded-full border-2 border-violet-200 bg-gray-100"
                />
                <span
                  className={`absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${STATUS_COLORS[selectedUser.status]}`}
                />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{selectedUser.fullName}</p>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center mb-5">
              <div className="bg-gray-50 rounded-xl py-3">
                <p className="text-xl font-bold text-gray-900">{selectedUser.friends.length}</p>
                <p className="text-xs text-gray-500 mt-0.5">Friends</p>
              </div>
              <div className="bg-gray-50 rounded-xl py-3">
                <p className="text-xl font-bold text-gray-900">{selectedUser.blockedUsers.length}</p>
                <p className="text-xs text-gray-500 mt-0.5">Blocked</p>
              </div>
              <div className="bg-gray-50 rounded-xl py-3">
                <p className="text-xl font-bold text-gray-900">{selectedUser.starredMessages.length}</p>
                <p className="text-xs text-gray-500 mt-0.5">Starred</p>
              </div>
            </div>

            <div className="text-sm space-y-2 text-gray-600 border-t border-gray-100 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Joined</span>
                <span className="font-medium text-gray-800">{formatDate(selectedUser.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Role</span>
                <span className="font-medium text-gray-800 capitalize">{selectedUser.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last seen</span>
                <span className="font-medium text-gray-800">
                  {selectedUser.lastSeen ? formatDate(selectedUser.lastSeen) : "Online now"}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="mt-5 w-full py-2 rounded-xl bg-gray-100 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
