import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"; 
import MapUpdater from "../../hooks/MapUpdate"; 
import Routing from "./Routing";

const MapView = ({ position, check }) => {
    return (
        <MapContainer
            key={`${position[0]}-${position[1]}`}
            center={position}
            zoom={15}
            style={{ height: "100%", width: "100%", borderRadius: "12px" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
                <Popup>Vị trí của bạn</Popup>
            </Marker>
            

            <MapUpdater position={position} />
            
            {check==1 && <Routing start={[position[0],position[1]]} end={[10.7554, 106.6784]}/>}
    

        </MapContainer>
    );
};

export default MapView;