import React, { useEffect, useState } from "react";
import CardCoin from "../../components/card/CardCoin";
import StatsCard from "../../components/card/StatsCard";
import { ICONS } from "../../config/ICONS";
import api from "../../utils/axios";

const Dashboard = () => {
  const GoldIcon = ICONS.gold;
  const DollarIcon = ICONS.dollar;
  const WarningIcon = ICONS.warning;
  const AddressCardIcon = ICONS.Students;
  const GuardiansIcon = ICONS.Guardians;
  // Lấy thêm các icon khác từ config
  const DriversIcon = ICONS.Drivers || AddressCardIcon; 
  const RoutesIcon = ICONS.Routes || AddressCardIcon;
  const StopsIcon = ICONS.Stops || AddressCardIcon;
  const TripsIcon = ICONS.Trips || AddressCardIcon;

  const [counts, setCounts] = useState({
    students: 0,
    guardians: 0,
    drivers: 0,
    routes: 0,
    stops: 0,
    trips: 0,
    buses: 0,
  });
  
  // Thêm state loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true); 
      try {
        const [
          studentsRes,
          usersRes,
          routesRes,
          stopsRes,
          tripsRes,
          busesRes,
        ] = await Promise.allSettled([
          api.get("/students"),         // ✅ Đã đúng
          api.get("/users"),            // SỬA 1: từ "/user_account"
          api.get("/routes"),  // SỬA 2: từ "/routes"
          api.get("/stops"),   // SỬA 3: từ "/stop"
          api.get("/trips"),  // SỬA 4: từ "/trip"
          api.get("/buses"),            // ✅ Đã đúng
        ]);

        // Xử lý students
        const students = studentsRes.status === 'fulfilled' 
          ? (Array.isArray(studentsRes.value?.data) ? studentsRes.value.data.length : 0) // File student của bạn trả về mảng
          : 0;

        // Xử lý users (guardians, drivers)
        let guardians = 0;
        let drivers = 0;
        if (usersRes.status === 'fulfilled') {
          // File user của bạn trả về { message: 'ok', data: [...] }
          const usersList = usersRes.value?.data?.data || []; 
          usersList.forEach((u) => {
            // SỬA 5: Check 'role' (chữ) vì API trả về role (chữ)
            if (u.role === "Parent") guardians++;
            if (u.role === "Driver") drivers++;
          });
        }

        // Xử lý các mục khác
        const routes = routesRes.status === 'fulfilled' 
          ? (routesRes.value?.data?.data?.length || 0) // API trả về { message: 'ok', data: [...] }
          : 0;
        const stops = stopsRes.status === 'fulfilled' 
          ? (stopsRes.value?.data?.data?.length || 0) // API trả về { message: 'ok', data: [...] }
          : 0;
        const trips = tripsRes.status === 'fulfilled' 
          ? (tripsRes.value?.data?.data?.length || 0) // API trả về { message: 'ok', data: [...] }
          : 0;
        const buses = busesRes.status === 'fulfilled' 
          ? (busesRes.value?.data?.data?.length || 0) // API trả về { message: 'ok', data: [...] }
          : 0;

        setCounts({
          students,
          guardians,
          drivers,
          routes,
          stops,
          trips,
          buses,
        });
        
      } catch (err) {
        console.error("Error fetching dashboard counts:", err);
      } finally {
        setLoading(false); // Hoàn thành loading
      }
    };

    fetchCounts();
  }, []);
  
  // Hàm hiển thị giá trị, nếu đang load thì hiện "..."
  const renderValue = (value) => {
    return loading ? "..." : value;
  };

  return (
    <>
      {/* Card Coin (Vẫn là dữ liệu chết, vì chưa có API cho nó) */}
      <div className="p-4 mb-10 grid grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="col-span-2 bg-white rounded-2xl shadow-lg p-4 flex flex-col justify-between transition-shadow">
          <div className="flex justify-between items-center">
            <span className="text-3xl font-bold mb-6 text-gray-800">
              Remaining Coins
            </span>
            <GoldIcon className="text-yellow-500" size={40} />
          </div>
          <div className="text-2xl font-bold text-gray-900">0</div>
        </div>
        {/* Card 2 */}
        <CardCoin
          title="Purchased Coins"
          value={10}
          icon={<DollarIcon className="text-green-500" size={40} />}
        />
        {/* Card 3 */}
        <CardCoin
          title="Consumed Coins"
          value={5}
          icon={<WarningIcon className="text-red-500" size={40} />}
        />
      </div>

      {/* Stats Card (Giờ đã là dữ liệu động) */}
      <div className="p-4 mt-10 col-span-2 bg-white rounded-2xl shadow-lg ...">
        <div className="p-4 text-3xl font-bold ...">
          Statistics
        </div>
        <div className="p-4 grid grid-cols-6 gap-6 my-5">
          <StatsCard
            title="Student"
            value={renderValue(counts.students)}
            icon={<AddressCardIcon className="text-white" size={40} />}
            bgColor="bg-blue-500"
          />
          <StatsCard
            title="Guardians"
            value={renderValue(counts.guardians)}
            icon={<GuardiansIcon className="text-white" size={40} />}
            bgColor="bg-orange-500"
          />
          <StatsCard
            title="Drivers"
            value={renderValue(counts.drivers)}
            icon={<DriversIcon className="text-white" size={40} />}
            bgColor="bg-green-500"
          />
          <StatsCard
            title="Routes"
            value={renderValue(counts.routes)}
            icon={<RoutesIcon className="text-white" size={40} />}
            bgColor="bg-red-500"
          />
          <StatsCard
            title="Stops"
            value={renderValue(counts.stops)}
            icon={<StopsIcon className="text-white" size={40} />}
            bgColor="bg-purple-500"
          />
          <StatsCard
            title="Trips"
            value={renderValue(counts.trips)}
            icon={<TripsIcon className="text-white" size={40} />}
            bgColor="bg-pink-500"
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;