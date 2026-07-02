import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/layout/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import ReportsPage from "./pages/ReportsPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import LoginPage from "./pages/LoginPage";

function AppShell() {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!admin) return <LoginPage />;

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
          <Route path="*"         element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
