import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import ParentLayout from "./layouts/ParentLayout";
import DriversLayout from "./layouts/DriversLayout";

// Pages
import RoleSelect from "./pages/RoleSelect";
import ParentLogin from "./pages/parent/Login";
import AdminLogin from "./pages/admin/Login";
import DriverLogin from "./pages/driver/Login";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminStudents from "./pages/admin/Students";
import AdminGuardians from "./pages/admin/Guardians";
import AdminDrivers from "./pages/admin/Drivers";
import AdminSchool from "./pages/admin/School";
import AdminBuses from "./pages/admin/Buses";
import AdminRoute from "./pages/admin/Route";

// Parent pages
import ParentDashboard from "./pages/parent/Dashboard";
import TripHistory from "./pages/parent/TripHistory";
import Profile from "./pages/parent/Profile";
import ParentNotifications from "./pages/parent/Notifications";

// Driver pages
import PickupDropoff from "./pages/driver/PickupDropoff";
import ScheduleViewer from "./pages/driver/Schedules";
import Report from "./pages/driver/Report";
import AccountViewer from "./pages/driver/AccountViewer";
// ✅ Import ProtectedRoute
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login & Role Select */}
        <Route path="/" element={<RoleSelect />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/parent/login" element={<ParentLogin />} />
        <Route path="/driver/login" element={<DriverLogin />} />

        {/* --- ADMIN ROUTES --- */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/student"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminStudents />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/guardians"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminGuardians />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/drivers"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminDrivers />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/school"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminSchool />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/buses"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminBuses />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/routes"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminRoute />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* --- PARENT ROUTES --- */}
        <Route
          path="/parent/dashboard"
          element={
            <ProtectedRoute allowedRole="parent">
              <ParentLayout>
                <ParentDashboard />
              </ParentLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent/trips"
          element={
            <ProtectedRoute allowedRole="parent">
              <ParentLayout>
                <TripHistory />
              </ParentLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent/profile"
          element={
            <ProtectedRoute allowedRole="parent">
              <ParentLayout>
                <Profile />
              </ParentLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent/notifications"
          element={
            <ProtectedRoute allowedRole="parent">
              <ParentLayout>
                <ParentNotifications />
              </ParentLayout>
            </ProtectedRoute>
          }
        />

        {/* --- DRIVER ROUTES --- */}
        <Route
          path="/driver/pickupdropoff"
          element={
            <ProtectedRoute allowedRole="driver">
              <DriversLayout>
                <PickupDropoff />
              </DriversLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/schedules"
          element={
            <ProtectedRoute allowedRole="driver">
              <DriversLayout>
                <ScheduleViewer />
              </DriversLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/report"
          element={
            <ProtectedRoute allowedRole="driver">
              <DriversLayout>
                <Report />
              </DriversLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/info"
          element={
            <ProtectedRoute allowedRole="driver">
              <DriversLayout>
                <AccountViewer />
              </DriversLayout>
            </ProtectedRoute>
          }
        />
      </Routes>

    </Router>
  );
}

export default App;
