import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 1. Import các Layout
import AdminLayout from "./layouts/AdminLayout";
import ParentLayout from "./layouts/ParentLayout";
import DriversLayout from "./layouts/DriversLayout";

// 2. Import các trang chung
import RoleSelect from "./pages/RoleSelect";
import ParentLogin from "./pages/parent/Login";
import AdminLogin from "./pages/admin/Login";
import DriverLogin from "./pages/driver/Login";


// 3. Import các trang của Admin
import AdminDashboard from "./pages/admin/Dashboard";
import AdminStudents from "./pages/admin/Students";
import AdminGuardians from "./pages/admin/Guardians";
import AdminDrivers from "./pages/admin/Drivers";
import AdminSchool from "./pages/admin/School";
import AdminBuses from "./pages/admin/Buses";
import AdminRoute from "./pages/admin/Route";

// 4. Import các trang của Parent
import ParentDashboard from "./pages/parent/Dashboard";
import ParentBuses from "./pages/parent/TripHistory";
import ParentStudents from "./pages/parent/Profile";
import ParentNotifications from "./pages/parent/Notifications";
import TripHistory from "./pages/parent/TripHistory";
import Profile from "./pages/parent/Profile";


import PickupDropoff from "./pages/driver/PickupDropoff";
import ScheduleViewer from "./pages/driver/Schedules";
import Report from "./pages/driver/Report";
import Drivers from "./pages/admin/Drivers";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelect />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/parent/login" element={<ParentLogin />} />
        <Route path="/driver/login" element={< DriverLogin />} />


        {/* --- NHÓM ROUTE CỦA ADMIN (dùng AdminLayout) --- */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/student"
          element={
            <AdminLayout>
              <AdminStudents />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/guardians"
          element={
            <AdminLayout>
              <AdminGuardians />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/drivers"
          element={
            <AdminLayout>
              <AdminDrivers />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/school"
          element={
            <AdminLayout>
              <AdminSchool />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/buses"
          element={
            <AdminLayout>
              <AdminBuses />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/routes"
          element={
            <AdminLayout>
              <AdminRoute />
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

        <Route
          path="/driver/pickupdropoff"
          element={
            <DriversLayout>
              <PickupDropoff />
            </DriversLayout>
          }
        />
        <Route
          path="/driver/schedules"
          element={
            <DriversLayout>
              <ScheduleViewer />
            </DriversLayout>
          }
        /> <Route
          path="/driver/report"
          element={
            <DriversLayout>
              <Report />
            </DriversLayout>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
