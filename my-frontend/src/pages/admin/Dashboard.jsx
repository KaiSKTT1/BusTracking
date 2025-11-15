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

  const [counts, setCounts] = useState({
    students: 0,
    guardians: 0,
    drivers: 0,
    routes: 0,
    stops: 0,
    trips: 0,
    buses: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [
          studentsRes,
          usersRes,
          routesRes,
          stopsRes,
          tripsRes,
          busesRes,
        ] = await Promise.allSettled([
          api.get("/students"),
          api.get("/user_account"), // filter by role on backend if available
          api.get("/routes"),
          api.get("/stop"),
          api.get("/trip"),
          api.get("/buses"),
        ]);

        const students = Array.isArray(studentsRes.value?.data)
          ? studentsRes.value.data.length
          : Array.isArray(studentsRes.value?.data?.data)
          ? studentsRes.value.data.data.length
          : 0;

        // usersRes: count guardians and drivers by role_id
        let guardians = 0;
        let drivers = 0;
        const usersList = Array.isArray(usersRes.value?.data)
          ? usersRes.value.data
          : Array.isArray(usersRes.value?.data?.data)
          ? usersRes.value.data.data
          : [];
        usersList.forEach((u) => {
          if ((u.role_id ?? u.role) === 3) guardians++;
          if ((u.role_id ?? u.role) === 2) drivers++;
        });

        const routes = Array.isArray(routesRes.value?.data)
          ? routesRes.value.data.length
          : Array.isArray(routesRes.value?.data?.data)
          ? routesRes.value.data.data.length
          : 0;
        const stops = Array.isArray(stopsRes.value?.data)
          ? stopsRes.value.data.length
          : Array.isArray(stopsRes.value?.data?.data)
          ? stopsRes.value.data.data.length
          : 0;
        const trips = Array.isArray(tripsRes.value?.data)
          ? tripsRes.value.data.length
          : Array.isArray(tripsRes.value?.data?.data)
          ? tripsRes.value.data.data.length
          : 0;
        const buses = Array.isArray(busesRes.value?.data)
          ? busesRes.value.data.length
          : Array.isArray(busesRes.value?.data?.data)
          ? busesRes.value.data.data.length
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
      }
    };

    fetchCounts();
  }, []);

  return (
    <>
      {/* Card Coin */}
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

      {/* Stats Card */}
      <div className="p-4 mt-10 col-span-2 bg-white rounded-2xl shadow-lg flex flex-col justify-between transition-shadow">
        <div className="p-4 text-3xl font-bold mb-6 text-gray-800">
          Statistics
        </div>
        <div className="p-4 grid grid-cols-6 gap-6 my-5">
          <StatsCard
            title="Student"
            value={counts.students}
            icon={<AddressCardIcon className="text-white" size={40} />}
            bgColor="bg-blue-500"
          />
          <StatsCard
            title="Guardians"
            value={counts.guardians}
            icon={<GuardiansIcon className="text-white" size={40} />}
            bgColor="bg-orange-500"
          />
          <StatsCard
            title="Drivers"
            value={counts.drivers}
            icon={<AddressCardIcon className="text-white" size={40} />}
            bgColor="bg-green-500"
          />
          <StatsCard
            title="Routes"
            value={counts.routes}
            icon={<AddressCardIcon className="text-white" size={40} />}
            bgColor="bg-red-500"
          />
          <StatsCard
            title="Stops"
            value={counts.stops}
            icon={<AddressCardIcon className="text-white" size={40} />}
            bgColor="bg-green-500"
          />
          <StatsCard
            title="Trips"
            value={counts.trips}
            icon={<AddressCardIcon className="text-white" size={40} />}
            bgColor="bg-pink-500"
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
