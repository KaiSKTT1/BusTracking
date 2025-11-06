import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
const Routing = ({ start, end }) => {
    const map = useMap();
    const [routePoints, setRoutePoints] = useState(null);
    const [index, setIndex] = useState(0);
    const [realPosition, setRealPosition] = useState(null);

    useEffect(() => {
        if (!map || !start || !end) return;

        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(start[0], start[1]),
                L.latLng(end[0], end[1]),
            ],
            lineOptions: {
                styles: [{ color: "blue", weight: 5 }],
            },
            show: false,
            addWaypoints: false,
            draggableWaypoints: false,
        });
        routingControl.addTo(map);
        routingControl.on("routesfound", function (e) {
            const coords = e.routes[0].coordinates; // lấy route đầu tiên
            setRoutePoints(coords);
        });
        return () => {
            if (map && routingControl)
                map.removeControl(routingControl);
        }

    }, [map, start, end]);

    useEffect(() => {
        if (!routePoints) return;
        const interval = setInterval(() => {
            // use functional update to avoid depending on `index` and ensure safe increments
            setIndex((i) => {
                if (!routePoints || routePoints.length === 0) return i;
                if (i + 1 >= routePoints.length) return i; // stop at last point
                return i + 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [routePoints]);

    // useEffect(() => {
    //     const watchId = navigator.geolocation.watchPosition(
    //         pos => {
    //             const { latitude, longitude } = pos.coords;
    //             setRealPosition([latitude, longitude]);
    //             console.log("Vị trí thực tế:", realPosition);
    //         },
    //         err => console.error(err),
    //         { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 }
    //     );

    //     return () => navigator.geolocation.clearWatch(watchId);
    // }, [routePoints]);


    return (
        <>
            {routePoints && index < routePoints.length &&
                <Marker

                    position={[routePoints[index].lat, routePoints[index].lng]}
                />}
            {/* {realPosition &&
                    <Marker position={realPosition}>
                        <Popup>Vị trí thực tế của bạn</Popup>
                    </Marker>} */}
        </>
    );
};
export default Routing;