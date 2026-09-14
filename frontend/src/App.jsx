import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentProtectedRoute from "./components/StudentProtectedRoute";
import Home from "./pages/Home";
import ReportItem from "./pages/ReportItem";
import ItemDetail from "./pages/ItemDetail";
import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="app">
      {!isAuthPage && <Navbar />}
      <main className="main-content">
        <Routes>
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/" element={<StudentProtectedRoute><Home /></StudentProtectedRoute>} />
          <Route path="/report" element={<StudentProtectedRoute><ReportItem /></StudentProtectedRoute>} />
          <Route path="/items/:id" element={<StudentProtectedRoute><ItemDetail /></StudentProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}