import { useState } from "react";
import { Link } from "react-router-dom";
import Marquee from "./Marquee";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLoggedIn = Boolean(localStorage.getItem("studentToken"));
  const studentName = localStorage.getItem("studentName");

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          🔎 ReUnite
        </Link>

        {isLoggedIn && (
          <div className="navbar-greeting">
            <Marquee>Hi, {studentName} 👋 &nbsp;&nbsp;•&nbsp;&nbsp; </Marquee>
          </div>
        )}

        <button className="menu-toggle" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}