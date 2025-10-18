import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MapUpdater from "../../hooks/MapUpdate";
import "leaflet/dist/leaflet.css";
import Routing from "./Routing";

const MapView = ({ position, currentPosition }) => {
  return (
    <MapContainer
      center={position}
      zoom={15}
      style={{ height: "100%", width: "100%", borderRadius: "12px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      />
      {console.log("Current Position in MapView:", currentPosition)}
      {currentPosition && (
  <Marker position={currentPosition}>
    <Popup>Vị trí hiện tại của bạn</Popup>
    
  </Marker>
)}

      <MapUpdater position={position} />
      <Routing start={[position[0],position[1]]} end={[10.7554, 106.6784]}/>
    </MapContainer>
  );
};

export default MapView;
