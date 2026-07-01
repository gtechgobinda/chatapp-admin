import { useState } from "react";
import {
  Search, UserCheck, ShieldBan, Users, UserX,
  ChevronUp, ChevronDown, Eye, Ban, CheckCircle2,
  MessageSquare, UserMinus,
} from "lucide-react";
import { users as INITIAL_USERS } from "../data/users";
import TopBar from "../components/layout/TopBar";
import StatCard from "../components/ui/StatCard";

const STATUS_DOT = { online: "bg-green-400", offline: "bg-gray-300" };

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function SortIcon({ active, dir }) {
  if (!active) return <ChevronUp size={13} className="text-gray-300" />;
  return dir === "asc"
    ? <ChevronUp size={13} className="text-violet-500" />
    : <ChevronDown size={13} className="text-violet-500" />;
}

export default function UsersPage() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [blockedFilter, setBlockedFilter] = useState("all");
  const [sortField, setSortField] = useState("joined");
  const [sortDir, setSortDir] = useState("desc");
  const [selectedUser, setSelectedUser] = useState(null);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  const toggleBlock = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, blocked: !u.blocked } : u))
    );
    if (selectedUser?.id === id) {
      setSelectedUser((u) => ({ ...u, blocked: !u.blocked }));
    }
  };

  const filtered = users
    .filter((u) => {
      const q = search.toLowerCase();
      const matchSearch =
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || u.status === statusFilter;
      const matchBlocked =
        blockedFilter === "all" ||
        (blockedFilter === "blocked" && u.blocked) ||
        (blockedFilter === "active" && !u.blocked);
      return matchSearch && matchStatus && matchBlocked;
    })
    .sort((a, b) => {
      let av = a[sortField], bv = b[sortField];
      if (typeof av === "string") { av = av.toLowerCase(); bv = bv.toLowerCase(); }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const onlineCount = users.filter((u) => u.status === "online").length;
  const blockedCount = users.filter((u) => u.blocked).length;
  const totalMessages = users.reduce((sum, u) => sum + u.messages, 0);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <TopBar title="Users" subtitle="Manage all registered users" />

      <div className="p-6 flex flex-col gap-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users}        label="Total Users"    value={users.length}   color="violet" />
          <StatCard icon={UserCheck}    label="Online Now"     value={onlineCount}    color="green"  />
          <StatCard icon={MessageSquare} label="Total Messages" value={totalMessages}  color="blue"   />
          <StatCard icon={ShieldBan}    label="Blocked"        value={blockedCount}   color="red"    />
        </div>

        {/* Table card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-700">
              All Users{" "}
              <span className="text-gray-400 font-normal">({filtered.length})</span>
            </p>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name or email…"
                  className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 w-full sm:w-52"
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
              <select
                value={blockedFilter}
                onChange={(e) => setBlockedFilter(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
              >
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
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
                    onClick={() => toggleSort("name")}
                  >
                    <div className="flex items-center gap-1">
                      User <SortIcon active={sortField === "name"} dir={sortDir} />
                    </div>
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th
                    className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none"
                    onClick={() => toggleSort("messages")}
                  >
                    <div className="flex items-center gap-1">
                      Messages <SortIcon active={sortField === "messages"} dir={sortDir} />
                    </div>
                  </th>
                  <th
                    className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none"
                    onClick={() => toggleSort("friends")}
                  >
                    <div className="flex items-center gap-1">
                      Friends <SortIcon active={sortField === "friends"} dir={sortDir} />
                    </div>
                  </th>
                  <th
                    className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none"
                    onClick={() => toggleSort("joined")}
                  >
                    <div className="flex items-center gap-1">
                      Joined <SortIcon active={sortField === "joined"} dir={sortDir} />
                    </div>
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-gray-400 text-sm">
                      No users found.
                    </td>
                  </tr>
                )}
                {filtered.map((user, i) => (
                  <tr
                    key={user.id}
                    className={`transition-colors ${user.blocked ? "bg-red-50/40" : "hover:bg-gray-50"}`}
                  >
                    <td className="px-5 py-3.5 text-gray-400">{i + 1}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200"
                          />
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${STATUS_DOT[user.status]}`}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          {user.blocked && (
                            <span className="text-[10px] font-semibold text-red-500 uppercase tracking-wide">Blocked</span>
                          )}
                        </div>
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
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[user.status]}`} />
                        {user.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-700 font-medium">{user.messages.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-gray-700 font-medium">{user.friends}</td>
                    <td className="px-5 py-3.5 text-gray-500">{formatDate(user.joined)}</td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-800 px-2 py-1 rounded-lg hover:bg-violet-50 transition-colors"
                      >
                        <Eye size={12} /> View
                      </button>
                    </td>
                  </tr>
                ))}
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
            className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header band */}
            <div className="h-16 bg-linear-to-r from-violet-600 to-violet-400 relative" />

            <div className="px-6 pb-6 -mt-8">
              <div className="flex items-end justify-between mb-4">
                <div className="relative">
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="w-16 h-16 rounded-full border-4 border-white bg-gray-100 shadow"
                  />
                  <span
                    className={`absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${STATUS_DOT[selectedUser.status]}`}
                  />
                </div>
                {selectedUser.blocked && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                    <UserMinus size={11} /> Blocked
                  </span>
                )}
              </div>

              <p className="text-lg font-bold text-gray-900">{selectedUser.name}</p>
              <p className="text-sm text-gray-400">{selectedUser.email}</p>

              <div className="grid grid-cols-3 gap-3 text-center my-5">
                <div className="bg-gray-50 rounded-xl py-3">
                  <p className="text-xl font-bold text-gray-900">{selectedUser.messages.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Messages</p>
                </div>
                <div className="bg-gray-50 rounded-xl py-3">
                  <p className="text-xl font-bold text-gray-900">{selectedUser.friends}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Friends</p>
                </div>
                <div className="bg-gray-50 rounded-xl py-3">
                  <p className={`text-xl font-bold ${selectedUser.blocked ? "text-red-500" : "text-green-600"}`}>
                    {selectedUser.blocked ? "Yes" : "No"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Blocked</p>
                </div>
              </div>

              <div className="text-sm space-y-2 text-gray-600 border-t border-gray-100 pt-4 mb-5">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span
                    className={`font-medium capitalize ${
                      selectedUser.status === "online" ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {selectedUser.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Joined</span>
                  <span className="font-medium text-gray-800">{formatDate(selectedUser.joined)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleBlock(selectedUser.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    selectedUser.blocked
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                >
                  {selectedUser.blocked ? (
                    <><CheckCircle2 size={14} /> Unblock</>
                  ) : (
                    <><Ban size={14} /> Block User</>
                  )}
                </button>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
