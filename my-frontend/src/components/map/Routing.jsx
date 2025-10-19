import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import React, { useState, useEffect, useRef } from "react";
import L, { routing } from "leaflet";
import { Polyline } from "react-leaflet";
const Routing = ({ start, end }) => {
    const map = useMap();
    const [routePoints, setRoutePoints] = useState(null);
    const [index, setIndex] = useState(0);

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
            console.log("Route coordinates:", coords);
        });
        return () => {
            if (map && routingControl)
                map.removeControl(routingControl);
        }

    }, [map, start, end]);
    useEffect(() => {
        const interval = setInterval(() => {
            if (routePoints.length === 0 || index > routePoints.length) return;
            setIndex(index => index + 1)
            return () => {clearInterval(interval)};
        }, 1000)}, [routePoints]);
    return (
        <> 
        {routePoints &&  
            <Marker
            
          position={[
            routePoints[index].lat,
            routePoints[index].lng,
          ]}
        />}
        </>
    );
};
export default Routing;