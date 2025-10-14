import { useState } from "react";
import TitlePage from "../../components/title_pages/TitlePage";
import { ICONS } from "../../config/ICONS";
import Button from "../../components/button/Button";
import MapView from "../../components/map/MapView";

const School = () => {
  const AddressCardIcon = ICONS.School;

  const [position, setPosition] = useState([10.737, 106.62]);
  const [address, setAddress] = useState(
    "173, 90 An Dương Vương, An Lạc, Bình Tân, Hồ Chí Minh, Vietnam"
  );
  const [loading, setLoading] = useState(false); //State loading

  //Hàm chuyển đổi tọa độ thành địa chỉ
  const getAddressFromCoordinates = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
      );
      const data = await response.json();

      if (data && data.address) {
        const addr = data.address;

        //Lọc ịa chỉ
        const parts = [
          addr.house_number, // Số nhà (nếu có)
          addr.road, // Tên đường
          addr.suburb || addr.neighbourhood || addr.quarter, // Phường/Khu vực
          addr.city_district || addr.district, // Quận
          addr.city || addr.town, // Thành phố
          addr.country, // Quốc gia
        ].filter(Boolean); //Loại bỏ giá trị undefined/null

        return parts.join(", ");
      } else {
        return data.display_name || "Không tìm thấy địa chỉ";
      }
    } catch (error) {
      console.error("Lỗi khi lấy địa chỉ:", error);
      return "Không thể lấy địa chỉ";
    }
  };

  //Hàm lấy vị trí người dùng
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true); //Bật loading

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;

          console.log("📍 Vị trí mới:", latitude, longitude);
          setPosition([latitude, longitude]);

          //Lấy địa chỉ từ tọa độ
          const newAddress = await getAddressFromCoordinates(
            latitude,
            longitude
          );
          console.log("Địa chỉ mới:", newAddress);
          setAddress(newAddress);

          setLoading(false); //Tắt loading
        },
        (err) => {
          alert("Không thể lấy vị trí của bạn! Hãy bật quyền định vị.");
          console.error(err);
          setLoading(false); //Tắt loading khi lỗi
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      alert("Trình duyệt không hỗ trợ định vị!");
    }
  };

  return (
    <>
      <div className="p-6">
        <TitlePage
          title="School"
          icon={<AddressCardIcon className="text-orange-700" size={30} />}
          size="text-2xl"
          color="text-gray-700"
          className="mb-6"
        />

        <div className="flex w-full space-x-6">
          <div className="w-96 bg-white shadow-md rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                School Code
              </h2>
              <p className="text-gray-600 mb-4">#123</p>

              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Address Settings
              </h2>

              {/*Hiển thị địa chỉ động */}
              {loading ? (
                <p className="text-gray-400 italic">Đang lấy địa chỉ...</p>
              ) : (
                <p className="text-gray-600">{address}</p>
              )}
            </div>

            <div className="mt-6">
              <Button
                title={loading ? "Loading..." : "Use current location"}
                icon={<AddressCardIcon className="text-white" size={18} />}
                onClick={handleUseCurrentLocation}
                disabled={loading} //Disable khi đang loading
              />
            </div>
          </div>

          <div className="flex-grow h-[500px] bg-white shadow-md rounded-2xl overflow-hidden">
            <MapView position={position} />
          </div>
        </div>
      </div>
    </>
  );
};

export default School;
