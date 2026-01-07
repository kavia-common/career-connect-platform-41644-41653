import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

/**
 * PUBLIC_INTERFACE
 * AppShell provides the top navbar + sidebar + main content layout.
 */
export default function AppShell() {
  return (
    <div className="App">
      <Navbar />
      <div className="shell">
        <aside className="sidebar">
          <div className="card">
            <Sidebar />
          </div>
        </aside>
        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
