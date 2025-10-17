import React from "react";
import CardCoin from "../../components/card/CardCoin";
import StatsCard from "../../components/card/StatsCard";
import { ICONS } from "../../config/ICONS";

const Dashboard = () => {
  //Icons
  const GoldIcon = ICONS.gold;
  const DollarIcon = ICONS.dollar;
  const WarningIcon = ICONS.warning;
  const AddressCardIcon = ICONS.Students;
  const Guardians = ICONS.Guardians;
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
            value={0}
            icon={<AddressCardIcon className="text-white" size={40} />}
            bgColor="bg-blue-500"
          />
          <StatsCard
            title="Guardians"
            value={0}
            icon={<Guardians className="text-white" size={40} />}
            bgColor="bg-orange-500"
          />
          <StatsCard
            title="Drivers"
            value={0}
            icon={<AddressCardIcon className="text-white" size={40} />}
            bgColor="bg-green-500"
          />
          <StatsCard
            title="Routes"
            value={0}
            icon={<AddressCardIcon className="text-white" size={40} />}
            bgColor="bg-red-500"
          />
          <StatsCard
            title="Stops"
            value={0}
            icon={<AddressCardIcon className="text-white" size={40} />}
            bgColor="bg-green-500"
          />
          <StatsCard
            title="Trips"
            value={0}
            icon={<AddressCardIcon className="text-white" size={40} />}
            bgColor="bg-pink-500"
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
