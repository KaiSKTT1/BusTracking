
//import Header from "../components/header/Header";
import SidebarDrivers from "../components/sidebar/SidebarDrivers";

export default function DriversLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <SidebarDrivers /> {/* Sidebar của Admin luôn hiển thị */}
            <div className="flex-1">

                <main className="p-6">
                    {children} {/* Đây là nơi nội dung trang sẽ được chèn vào */}
                </main>
            </div>
        </div>
    );
}
