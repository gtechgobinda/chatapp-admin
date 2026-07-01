import { BrowserRouter, Routes, Route } from "react-router";
import Sidebar from "./components/layout/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import ReportsPage from "./pages/ReportsPage";
import PlaceholderPage from "./pages/PlaceholderPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <Routes>
          <Route path="/"         element={<DashboardPage />} />
          <Route path="/users"    element={<UsersPage />} />
          <Route path="/messages" element={<PlaceholderPage title="Messages" subtitle="View all chat messages" />} />
          <Route path="/requests" element={<PlaceholderPage title="Friend Requests" subtitle="Manage pending requests" />} />
          <Route path="/blocked"  element={<PlaceholderPage title="Blocked Users" subtitle="View blocked pairs" />} />
          <Route path="/reports"  element={<ReportsPage />} />
          <Route path="/settings" element={<PlaceholderPage title="Settings" subtitle="Admin settings" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
