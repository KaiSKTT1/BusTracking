import React from "react";
import "./Sidebar.css";
import logo from "../../assets/react.svg";
import ItemSidebar from "../item_sidebar/ItemSidebar";

const Sidebar = () => {
  return (
    <div className="flex">
      <div className="w-64 min-h-screen bg-blue-600 text-white flex flex-col p-4 sticky top-0">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="w-16 h-16" />
        </div>

        <nav className="flex flex-col space-y-2">
          <ItemSidebar href="admin/dashboard" title="Dashboard" size="text-lg" />
          <ItemSidebar href="admin/student" title="Students" size="text-lg" />
          <ItemSidebar href="admin/guardians" title="Guardians" size="text-lg" />
          <ItemSidebar href="admin/drivers" title="Drivers" size="text-lg" />
          <ItemSidebar href="admin/school" title="School" size="text-lg" />
          <ItemSidebar href="admin/buses" title="Buses" size="text-lg" />
          <ItemSidebar href="admin/routes" title="Routes" size="text-lg" />
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
