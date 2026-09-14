import { Link, useNavigate } from "react-router-dom";

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("studentRole") === "admin";

  function handleLogout() {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentName");
    localStorage.removeItem("studentRole");
    onClose();
    navigate("/login");
  }

  return (
    <>
      <div className={`sidebar-overlay ${open ? "open" : ""}`} onClick={onClose} />
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-header">
          <span>Menu</span>
          <button className="sidebar-close" onClick={onClose} aria-label="Close menu">
            ✕
          </button>
        </div>
        <nav className="sidebar-links">
          <Link to="/" onClick={onClose}>
            🏠 Browse
          </Link>
          <Link to="/report" onClick={onClose}>
            📢 Report Item
          </Link>
          {isAdmin && (
            <Link to="/admin" onClick={onClose}>
              🛠️ Admin Dashboard
            </Link>
          )}
          <button className="sidebar-logout" onClick={handleLogout}>
            🚪 Logout
          </button>
        </nav>
      </aside>
    </>
  );
}