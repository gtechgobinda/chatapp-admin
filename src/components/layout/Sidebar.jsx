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
} from "lucide-react";

const NAV = [
  { to: "/",         icon: LayoutDashboard,  label: "Dashboard"       },
  { to: "/users",    icon: Users,            label: "Users"           },
  { to: "/messages", icon: MessageSquare,    label: "Messages"        },
  { to: "/requests", icon: UserPlus,         label: "Friend Requests" },
  { to: "/blocked",  icon: ShieldOff,        label: "Blocked Users"   },
  { to: "/reports",  icon: FileBarChart2,    label: "Reports"         },
];

export default function Sidebar() {
  return (
    <aside className="w-60 min-h-screen bg-gray-900 text-white flex flex-col shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-700">
        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
          <MessagesSquare size={17} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold leading-none text-white">ChatKoro</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-violet-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-700">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-violet-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          <Settings size={17} />
          Settings
        </NavLink>
      </div>
    </aside>
  );
}
