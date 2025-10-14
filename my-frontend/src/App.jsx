// import "leaflet/dist/leaflet.css";
// import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
// import "leaflet-defaulticon-compatibility";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import Sidebar from "./components/sidebar/Sidebar.jsx";
// import Dashboard from "./pages/admin/Dashboard.jsx";
// import Students from "./pages/admin/Students.jsx";
// import Guardians from "./pages/admin/Guardians.jsx";
// import Drivers from "./pages/admin/Drivers.jsx";
// import School from "./pages/admin/School.jsx";
// import Buses from "./pages/admin/Buses.jsx";
// // import Login from "./pages/login.jsx";

// function App() {
//   return (
//     <Router>
//       <div className="flex">
//         <Sidebar />
//         <div className="flex-1 p-4">
//           <Routes>
//             <Route path="/" element={<Dashboard />} />
//             <Route path="/student" element={<Students />} />
//             <Route path="/guardians" element={<Guardians />} />
//             <Route path="/drivers" element={<Drivers />} />
//             <Route path="/school" element={<School />} />
//             <Route path="/buses" element={<Buses />} />
//             {/* <Route path="/Login" element={<Login />} /> */}
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Sidebar from "./components/sidebar/Sidebar.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import Students from "./pages/admin/Students.jsx";
import Guardians from "./pages/admin/Guardians.jsx";
import Drivers from "./pages/admin/Drivers.jsx";
import School from "./pages/admin/School.jsx";
import Buses from "./pages/admin/Buses.jsx";
import Login from "./pages/Login.jsx";

// ✅ Tạo component AppContent để có thể dùng hook useLocation
function AppContent() {
  const location = useLocation();

  // Nếu đang ở /login thì không hiện sidebar
  const hideSidebar = location.pathname === "/login";

  return (
    <div className="flex">
      {!hideSidebar && <Sidebar />} {/* Chỉ hiện Sidebar khi không ở /login */}
      <div className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/student" element={<Students />} />
          <Route path="/guardians" element={<Guardians />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/school" element={<School />} />
          <Route path="/buses" element={<Buses />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
