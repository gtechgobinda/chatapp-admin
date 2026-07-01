import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  UserPlus,
  ShieldOff,
  Settings,
  MessagesSquare,
  FileBarChart2,
  LogOut,
} from "lucide-react";

const NAV = [
  { to: "/",         icon: LayoutDashboard, label: "Dashboard"       },
  { to: "/users",    icon: Users,           label: "Users"           },
  { to: "/messages", icon: MessageSquare,   label: "Messages"        },
  { to: "/requests", icon: UserPlus,        label: "Friend Requests" },
  { to: "/blocked",  icon: ShieldOff,       label: "Blocked Users"   },
  { to: "/reports",  icon: FileBarChart2,   label: "Reports"         },
];

export default function Sidebar() {
  return (
    <aside className="w-60 min-h-screen bg-white border-r border-gray-200 flex flex-col shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shrink-0">
          <MessagesSquare size={16} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold leading-none text-gray-900">ChatKoro</p>
          <p className="text-[10px] text-gray-400 mt-0.5 font-medium tracking-wide uppercase">Admin Panel</p>
        </div>
      </div>

      {/* Nav label */}
      <div className="px-5 pt-5 pb-1.5">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Menu</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-violet-50 text-violet-700 font-semibold"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? "text-violet-600" : "text-gray-400"} />
                {label}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 pt-2 border-t border-gray-100 mt-4 space-y-0.5">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? "bg-violet-50 text-violet-700 font-semibold"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Settings size={16} className={isActive ? "text-violet-600" : "text-gray-400"} />
              Settings
            </>
          )}
        </NavLink>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all">
          <LogOut size={16} className="text-gray-400" />
          Logout
        </button>
      </div>
    </aside>
  );
}
