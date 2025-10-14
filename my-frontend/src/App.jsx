import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 1. Import các Layout
import AdminLayout from "./layouts/AdminLayout";
import ParentLayout from "./layouts/ParentLayout";

// 2. Import các trang chung
import RoleSelect from "./pages/RoleSelect";
import ParentLogin from "./pages/parent/Login";
import AdminLogin from "./pages/admin/Login";

// 3. Import các trang của Admin
import AdminDashboard from "./pages/admin/Dashboard";
import AdminStudents from "./pages/admin/Students";
import AdminGuardians from "./pages/admin/Guardians";
import AdminDrivers from "./pages/admin/Drivers";
import AdminSchool from "./pages/admin/School";
import AdminBuses from "./pages/admin/Buses";

// 4. Import các trang của Parent
import ParentDashboard from "./pages/parent/Dashboard";
import ParentBuses from "./pages/parent/TripHistory";
import ParentStudents from "./pages/parent/Profile";
import ParentNotifications from "./pages/parent/Notifications";
import TripHistory from "./pages/parent/TripHistory";
import Profile from "./pages/parent/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelect />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/parent/login" element={<ParentLogin />} />

        {/* --- NHÓM ROUTE CỦA ADMIN (dùng AdminLayout) --- */}
        <Route
          path="/dashboard"
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/student"
          element={
            <AdminLayout>
              <AdminStudents />
            </AdminLayout>
          }
        />
        <Route
          path="/guardians"
          element={
            <AdminLayout>
              <AdminGuardians />
            </AdminLayout>
          }
        />
        <Route
          path="/drivers"
          element={
            <AdminLayout>
              <AdminDrivers />
            </AdminLayout>
          }
        />
        <Route
          path="/school"
          element={
            <AdminLayout>
              <AdminSchool />
            </AdminLayout>
          }
        />
        <Route
          path="/buses"
          element={
            <AdminLayout>
              <AdminBuses />
            </AdminLayout>
          }
        />

        {/* --- NHÓM ROUTE CỦA PARENT (dùng ParentLayout) --- */}
        <Route
          path="/parent/dashboard"
          element={
            <ParentLayout>
              <ParentDashboard />
            </ParentLayout>
          }
        />
        <Route
          path="/parent/trips"
          element={
            <ParentLayout>
              <TripHistory />
            </ParentLayout>
          }
        />
        <Route
          path="/parent/profile"
          element={
            <ParentLayout>
              <Profile />
            </ParentLayout>
          }
        />
        <Route
          path="/parent/notifications"
          element={
            <ParentLayout>
              <ParentNotifications />
            </ParentLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
