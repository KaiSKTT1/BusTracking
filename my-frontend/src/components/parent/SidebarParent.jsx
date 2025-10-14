import React from "react";
import { NavLink } from "react-router-dom";

export default function SidebarParent() {
  const links = [
    { path: "/parent/dashboard", label: "Dashboard" },
    { path: "/parent/notifications", label: "Notifications" },
    { path: "/parent/trips", label: "Trip History" },
    { path: "/parent/profile", label: "Profile" },
  ];

  return (
    <aside className="w-64 bg-blue-600 text-white min-h-screen hidden md:block">
      <div className="text-center py-6 border-b border-blue-500">
        <div className="text-3xl font-bold">🚌</div>
        <div className="mt-2 text-lg font-semibold">Parent Panel</div>
      </div>
      <nav className="p-4">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md mb-2 transition-colors ${
                isActive
                  ? "bg-red-500 text-white font-semibold"
                  : "hover:bg-blue-500"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
