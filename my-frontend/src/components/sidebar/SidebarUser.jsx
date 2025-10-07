import React from "react";
import "./Sidebar.css";
import logo from "../../assets/react.svg"
import ItemSidebar from "../item_sidebar/ItemSidebar";

class SidebarUser extends React.Component {
    render(){
    return (
        <div className="flex">
            <div className="w-64 h-screen bg-blue-600 text-white flex flex-col p-4">
                <div className="flex justify-center mb-6">
                    <img src={logo} alt="Logo" className="w-16 h-16" />
                </div>

                <nav className="flex flex-col space-y-2">
                    <ItemSidebar href="student" title="Students" size="text-lg" />
                    <ItemSidebar href="guardians" title="Guardians" size="text-lg" />
                    <ItemSidebar href="notifications" title="Notifications" size="text-lg" />
                    <ItemSidebar href="infor" title="Infor" size="text-lg" /> 
                </nav>
            </div>
        </div>

    );
}
}
export default SidebarUser;