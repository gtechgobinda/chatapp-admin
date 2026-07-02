import { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Users, MessageSquare, Archive, Radio, Bot, Palette, Shield,
  ChevronRight, X, TrendingUp, FileText, Download, Search,
  ChevronDown, UserCircle2,
} from "lucide-react";
import TopBar from "../components/layout/TopBar";
import { api } from "../lib/api";
import { generateUserReports } from "../data/generateUserReports";
import { COLOR_MAP } from "../data/reports";

const CATEGORY_ICONS = {
  friends:         Users,
  messaging:       MessageSquare,
  conversations:   Archive,
  presence:        Radio,
  ai:              Bot,
  personalization: Palette,
  security:        Shield,
};

const STATUS_BADGE = {
  accepted:         "bg-green-100 text-green-700",
  Accepted:         "bg-green-100 text-green-700",
  pending:          "bg-yellow-100 text-yellow-700",
  Pending:          "bg-yellow-100 text-yellow-700",
  rejected:         "bg-red-100 text-red-700",
  Rejected:         "bg-red-100 text-red-700",
  Read:             "bg-green-100 text-green-700",
  Delivered:        "bg-yellow-100 text-yellow-700",
  "For Everyone":   "bg-red-100 text-red-700",
  "For Me":         "bg-gray-100 text-gray-600",
  Forever:          "bg-red-100 text-red-700",
  Google:           "bg-blue-100 text-blue-700",
  "Email/Password": "bg-gray-100 text-gray-600",
  "Google OAuth":   "bg-blue-100 text-blue-700",
  online:           "bg-green-100 text-green-700",
  offline:          "bg-gray-100 text-gray-500",
};

function StatusCell({ value }) {
  const cls = STATUS_BADGE[value];
  if (!cls) return <span className="text-gray-700">{value}</span>;
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {value}
    </span>
  );
}

// ─── User Picker ─────────────────────────────────────────────────────────────
function UserPicker({ selected, onSelect, users }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(q.toLowerCase()) ||
      u.email.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div ref={ref} className="relative w-full sm:w-80">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl text-left hover:border-violet-400 transition-colors shadow-sm"
      >
        {selected ? (
          <>
            <img src={selected.profilePic || `https://api.dicebear.com/9.x/avataaars/svg?seed=${selected._id}`} alt={selected.fullName} className="w-8 h-8 rounded-full border border-gray-200 bg-gray-100 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{selected.fullName}</p>
              <p className="text-xs text-gray-400 truncate">{selected.email}</p>
            </div>
          </>
        ) : (
          <>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <UserCircle2 size={18} className="text-gray-400" />
            </div>
            <span className="text-sm text-gray-400 flex-1">Select a user…</span>
          </>
        )}
        <ChevronDown size={15} className={`text-gray-400 transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search users…"
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>
          <ul className="max-h-64 overflow-y-auto">
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-gray-400 text-center">No users found.</li>
            )}
            {filtered.map((u) => (
              <li key={u._id}>
                <button
                  onClick={() => { onSelect(u); setOpen(false); setQ(""); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-violet-50 transition-colors text-left ${selected?._id === u._id ? "bg-violet-50" : ""}`}
                >
                  <div className="relative shrink-0">
                    <img src={u.profilePic || `https://api.dicebear.com/9.x/avataaars/svg?seed=${u._id}`} alt={u.fullName} className="w-8 h-8 rounded-full border border-gray-200 bg-gray-100" />
                    <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${u.status === "online" ? "bg-green-400" : "bg-gray-300"}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{u.fullName}</p>
                    <p className="text-xs text-gray-400 truncate">{u.email}</p>
                  </div>
                  {selected?._id === u._id && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-violet-500 shrink-0" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── User Profile Card ────────────────────────────────────────────────────────
function UserCard({ user }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center gap-4">
      <div className="relative shrink-0">
        <img src={user.profilePic} alt={user.fullName} className="w-14 h-14 rounded-full border-2 border-violet-100 bg-gray-100" />
        <span className={`absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${user.status === "online" ? "bg-green-400" : "bg-gray-300"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-base font-bold text-gray-900">{user.fullName}</p>
        <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.status === "online" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
            {user.status}
          </span>
          <span className="text-xs text-gray-400">{user.friends.length} friends</span>
          <span className="text-xs text-gray-400">{user.blockedUsers.length} blocked</span>
          <span className="text-xs text-gray-400">{user.starredMessages.length} starred</span>
        </div>
      </div>
      <div className="text-right shrink-0 hidden sm:block">
        <p className="text-xs text-gray-400">Joined</p>
        <p className="text-sm font-medium text-gray-700 mt-0.5">
          {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
        </p>
        <p className="text-xs text-violet-600 font-semibold mt-1 capitalize">{user.role}</p>
      </div>
    </div>
  );
}

// ─── PDF Generator ────────────────────────────────────────────────────────────
function downloadPDF(report, category, user) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();

  doc.setFillColor(109, 40, 217);
  doc.rect(0, 0, pageW, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("ChatKoro Admin Panel", 14, 10);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Super Admin Report", 14, 16);
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  doc.text(`Generated: ${today}`, pageW - 14, 16, { align: "right" });

  // User info box
  doc.setFillColor(248, 245, 255);
  doc.setDrawColor(221, 214, 254);
  doc.roundedRect(14, 27, pageW - 28, 18, 2, 2, "FD");
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(user.fullName, 20, 35);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(user.email, 20, 40.5);
  doc.text(`Status: ${user.status}  |  Friends: ${user.friends.length}  |  Blocked: ${user.blockedUsers.length}`, pageW - 14, 35, { align: "right" });
  doc.text(`Joined: ${new Date(user.createdAt).toLocaleDateString("en-IN")}`, pageW - 14, 40.5, { align: "right" });

  // Report title
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(report.name, 14, 56);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Category: ${category.label}  |  ${report.description}`, 14, 62);

  // Summary
  doc.setFillColor(245, 243, 255);
  doc.setDrawColor(221, 214, 254);
  doc.roundedRect(14, 67, pageW - 28, 10, 2, 2, "FD");
  doc.setTextColor(109, 40, 217);
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.text(`"${report.summary}"`, 18, 73.5);

  // Stats
  let xPos = 14;
  const statW = (pageW - 28 - (report.rows.length - 1) * 4) / report.rows.length;
  report.rows.forEach((r) => {
    doc.setFillColor(250, 250, 252);
    doc.setDrawColor(220, 220, 225);
    doc.roundedRect(xPos, 82, statW, 17, 2, 2, "FD");
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(String(r.value), xPos + statW / 2, 90, { align: "center" });
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text(r.label, xPos + statW / 2, 95.5, { align: "center" });
    xPos += statW + 4;
  });

  // Table
  if (report.table) {
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Detailed Breakdown", 14, 107);

    autoTable(doc, {
      startY: 111,
      head: [report.table.headers],
      body: report.table.rows,
      styles: { fontSize: 9, cellPadding: 3.5, textColor: [50, 50, 50] },
      headStyles: { fillColor: [109, 40, 217], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
      alternateRowStyles: { fillColor: [250, 248, 255] },
      margin: { left: 14, right: 14 },
      tableLineColor: [220, 220, 230],
      tableLineWidth: 0.1,
    });
  }

  const pageH = doc.internal.pageSize.getHeight();
  doc.setFillColor(245, 243, 255);
  doc.rect(0, pageH - 10, pageW, 10, "F");
  doc.setTextColor(140, 120, 180);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(`ChatKoro Admin — Report for ${user.fullName} — Confidential`, pageW / 2, pageH - 4, { align: "center" });

  doc.save(`${user._id}-${report.id}-report.pdf`);
}

// ─── Report Modal ─────────────────────────────────────────────────────────────
function ReportModal({ report, category, user, onClose }) {
  const c = COLOR_MAP[category.color] ?? COLOR_MAP.violet;
  const statusCols = new Set(["Status", "Type", "Mute Ends", "Method", "Current Status"]);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={`${c.bg} rounded-t-2xl px-6 py-4 border-b ${c.border} flex items-start justify-between gap-4 shrink-0`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-semibold ${c.text}`}>{category.label}</span>
              <span className="text-gray-300">·</span>
              <img src={user.profilePic} alt={user.fullName} className="w-4 h-4 rounded-full border border-gray-200" />
              <span className="text-xs text-gray-500 font-medium">{user.fullName}</span>
            </div>
            <h2 className="text-base font-bold text-gray-900">{report.name}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{report.description}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-black/10 transition-colors shrink-0">
            <X size={15} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 flex flex-col gap-4">
          {/* Summary */}
          <div className={`flex items-start gap-3 ${c.bg} border ${c.border} rounded-xl px-4 py-3`}>
            <TrendingUp size={14} className={`mt-0.5 shrink-0 ${c.text}`} />
            <p className="text-sm text-gray-700 italic">"{report.summary}"</p>
          </div>

          {/* Stat pills */}
          <div className={`grid gap-3 grid-cols-${Math.min(report.rows.length, 4)}`} style={{ gridTemplateColumns: `repeat(${Math.min(report.rows.length, 4)}, minmax(0, 1fr))` }}>
            {report.rows.map((r) => (
              <div key={r.label} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-center">
                <p className="text-xl font-bold text-gray-900">{r.value}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-snug">{r.label}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          {report.table && (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 bg-gray-50">
                <FileText size={13} className="text-gray-400" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Detailed Breakdown</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {report.table.headers.map((h) => (
                        <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap bg-gray-50">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {report.table.rows.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-3 whitespace-nowrap">
                            {statusCols.has(report.table.headers[j])
                              ? <StatusCell value={cell} />
                              : <span className="text-gray-700 text-sm">{cell}</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 shrink-0 flex gap-3">
          <button
            onClick={() => downloadPDF(report, category, user)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
          >
            <Download size={15} />
            Download PDF
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const [USERS, setUSERS] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/api/admin/users").then(setUSERS).catch(() => {});
  }, []);

  const categories = selectedUser ? generateUserReports(selectedUser) : [];
  const totalReports = categories.reduce((acc, c) => acc + c.reports.length, 0);

  const filtered = search.trim()
    ? categories.map((cat) => ({
        ...cat,
        reports: cat.reports.filter(
          (r) =>
            r.name.toLowerCase().includes(search.toLowerCase()) ||
            r.description.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter((cat) => cat.reports.length > 0)
    : categories;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <TopBar title="Reports" subtitle="Select a user to view their activity reports" />

      <div className="p-6 flex flex-col gap-5">

        {/* User selector row */}
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center">
              <UserCircle2 size={18} className="text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Choose User</p>
              <p className="text-xs text-gray-400">Reports are generated per user</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
            <UserPicker selected={selectedUser} onSelect={(u) => { setSelectedUser(u); setSearch(""); }} users={USERS} />
            {selectedUser && (
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search reports…"
                  className="pl-8 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 w-52 bg-gray-50"
                />
              </div>
            )}
          </div>
          {selectedUser && (
            <span className="text-xs text-gray-400 shrink-0">{totalReports} reports available</span>
          )}
        </div>

        {/* Selected user card */}
        {selectedUser && <UserCard user={selectedUser} />}

        {/* Empty state */}
        {!selectedUser && (
          <div className="flex-1 flex flex-col items-center justify-center py-24 gap-3 text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center">
              <UserCircle2 size={30} className="text-violet-300" />
            </div>
            <p className="text-gray-500 font-medium text-sm">No user selected</p>
            <p className="text-gray-400 text-xs max-w-xs">Use the dropdown above to select a user. You'll see all their activity reports across every feature.</p>
          </div>
        )}

        {/* Report categories */}
        {filtered.map((category) => {
          const Icon = CATEGORY_ICONS[category.id] ?? FileText;
          const c = COLOR_MAP[category.color] ?? COLOR_MAP.violet;

          return (
            <section key={category.id}>
              <div className="flex items-center gap-2.5 mb-3">
                <div className={`w-7 h-7 rounded-lg ${c.bg} flex items-center justify-center shrink-0`}>
                  <Icon size={14} className={c.text} />
                </div>
                <h2 className="text-sm font-bold text-gray-800">{category.label}</h2>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.badge}`}>{category.reports.length}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {category.reports.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport({ report, category })}
                    className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-left hover:border-violet-300 hover:shadow-sm transition-all group flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-violet-700 transition-colors leading-snug">
                        {report.name}
                      </p>
                      <ChevronRight size={14} className="text-gray-300 group-hover:text-violet-400 shrink-0 mt-0.5 transition-colors" />
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{report.description}</p>
                    <div className={`flex items-center justify-between mt-auto pt-2 border-t ${c.border}`}>
                      <p className={`text-xs italic ${c.text} line-clamp-1`}>"{report.summary}"</p>
                      <span className={`text-[10px] font-semibold ${c.text} shrink-0 ml-2 flex items-center gap-0.5`}>
                        <Download size={10} /> PDF
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          );
        })}

        {selectedUser && filtered.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">No reports match your search.</div>
        )}
      </div>

      {selectedReport && (
        <ReportModal
          report={selectedReport.report}
          category={selectedReport.category}
          user={selectedUser}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}
