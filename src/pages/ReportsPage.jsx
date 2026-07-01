import { useState } from "react";
import {
  Users, MessageSquare, Archive, Radio, Bot, Palette, Shield,
  ChevronRight, X, TrendingUp, FileText,
} from "lucide-react";
import TopBar from "../components/layout/TopBar";
import { REPORT_CATEGORIES, COLOR_MAP } from "../data/reports";

const CATEGORY_ICONS = {
  friends:         Users,
  messaging:       MessageSquare,
  conversations:   Archive,
  presence:        Radio,
  ai:              Bot,
  personalization: Palette,
  security:        Shield,
};

const STATUS_COLORS = {
  accepted: "bg-green-100 text-green-700",
  pending:  "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
  Read:     "bg-green-100 text-green-700",
  Delivered:"bg-yellow-100 text-yellow-700",
  "For Everyone": "bg-red-100 text-red-700",
  "For Me": "bg-gray-100 text-gray-600",
  Forever:  "bg-red-100 text-red-700",
  Google:   "bg-blue-100 text-blue-700",
  "Email/Password": "bg-gray-100 text-gray-600",
  "Google OAuth": "bg-blue-100 text-blue-700",
};

function StatusCell({ value }) {
  const cls = STATUS_COLORS[value];
  if (!cls) return <span className="text-gray-700 text-sm">{value}</span>;
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {value}
    </span>
  );
}

function ReportModal({ report, category, onClose }) {
  const c = COLOR_MAP[category.color] ?? COLOR_MAP.violet;
  const statusCols = ["Status", "Type", "Mute Ends", "Method", "Browser / App"];

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`${c.bg} rounded-t-2xl px-6 py-5 border-b ${c.border} flex items-start justify-between gap-4`}>
          <div>
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${c.text} mb-2`}>
              <span className={`w-2 h-2 rounded-full ${c.dot}`} />
              {category.label}
            </span>
            <h2 className="text-lg font-bold text-gray-900">{report.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{report.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/10 transition-colors shrink-0"
          >
            <X size={16} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Summary banner */}
          <div className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            <TrendingUp size={16} className={`mt-0.5 shrink-0 ${c.text}`} />
            <p className="text-sm text-gray-700 italic">"{report.summary}"</p>
          </div>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3">
            {report.rows.map((r) => (
              <div key={r.label} className="bg-white border border-gray-200 rounded-xl px-4 py-3 min-w-[100px]">
                <p className="text-xl font-bold text-gray-900">{r.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{r.label}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          {report.table && (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
                <FileText size={14} className="text-gray-400" />
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Detailed Breakdown</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {report.table.headers.map((h) => (
                        <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {report.table.rows.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-3 text-gray-700 whitespace-nowrap">
                            {statusCols.includes(report.table.headers[j])
                              ? <StatusCell value={cell} />
                              : cell}
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

        <div className="px-6 pb-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gray-100 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [selected, setSelected] = useState(null); // { report, category }
  const [search, setSearch] = useState("");

  const totalReports = REPORT_CATEGORIES.reduce((acc, c) => acc + c.reports.length, 0);

  const filtered = search.trim()
    ? REPORT_CATEGORIES.map((cat) => ({
        ...cat,
        reports: cat.reports.filter(
          (r) =>
            r.name.toLowerCase().includes(search.toLowerCase()) ||
            r.description.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter((cat) => cat.reports.length > 0)
    : REPORT_CATEGORIES;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <TopBar title="Reports" subtitle="User-facing activity reports across all feature areas" />

      <div className="p-6 flex flex-col gap-6">
        {/* Summary bar */}
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center">
              <FileText size={17} className="text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {totalReports} Report Types
              </p>
              <p className="text-xs text-gray-500">across {REPORT_CATEGORIES.length} categories</p>
            </div>
          </div>
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports..."
              className="pl-4 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 w-56 bg-gray-50"
            />
          </div>
        </div>

        {/* Categories */}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">No reports found.</div>
        )}

        {filtered.map((category) => {
          const Icon = CATEGORY_ICONS[category.id] ?? FileText;
          const c = COLOR_MAP[category.color] ?? COLOR_MAP.violet;

          return (
            <section key={category.id}>
              {/* Category header */}
              <div className="flex items-center gap-2.5 mb-3">
                <div className={`w-7 h-7 rounded-lg ${c.bg} flex items-center justify-center`}>
                  <Icon size={15} className={c.text} />
                </div>
                <h2 className="text-sm font-bold text-gray-800">{category.label}</h2>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.badge}`}>
                  {category.reports.length}
                </span>
              </div>

              {/* Report cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {category.reports.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setSelected({ report, category })}
                    className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-left hover:border-violet-300 hover:shadow-sm transition-all group flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-violet-700 transition-colors leading-snug">
                        {report.name}
                      </p>
                      <ChevronRight size={15} className="text-gray-300 group-hover:text-violet-400 shrink-0 mt-0.5 transition-colors" />
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{report.description}</p>
                    <p className={`text-xs font-medium italic ${c.text} mt-auto pt-1 border-t ${c.border}`}>
                      "{report.summary}"
                    </p>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {selected && (
        <ReportModal
          report={selected.report}
          category={selected.category}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
