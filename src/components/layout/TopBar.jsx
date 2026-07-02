import { Bell, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function TopBar({ title, subtitle }) {
  const { admin } = useAuth();
  const initial = admin?.name?.[0]?.toUpperCase() ?? "A";

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div>
        <h1 className="text-lg font-semibold text-gray-900 leading-none">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-8 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent w-52"
          />
        </div>
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell size={18} className="text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div
          className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold"
          title={admin?.name}
        >
          {initial}
        </div>
      </div>
    </header>
  );
}
