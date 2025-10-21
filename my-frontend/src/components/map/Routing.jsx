    import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
    import React, { useState, useEffect, useRef } from "react";
    import L, { routing } from "leaflet";
    import { Polyline } from "react-leaflet";
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

        // useEffect(() => {
        //     if (!routePoints) return
        //     const interval = setInterval(() => {
        //         if (!routePoints && (routePoints.length === 0 || index >= routePoints.length)) return;
        //         setIndex(index => index + 1)
        //         return () => {clearInterval(interval)};
        //     }, 100)}, [routePoints]);

        useEffect(() => {
            const watchId = navigator.geolocation.watchPosition(
                pos => {
                    const { latitude, longitude } = pos.coords;
                    setRealPosition([latitude, longitude]);
                    console.log("Vị trí thực tế:", realPosition);
                },
                err => console.error(err),
                { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 }
            );

            return () => navigator.geolocation.clearWatch(watchId);
        }, [routePoints]);


        return (
            <>
                {/* {routePoints && index < routePoints.length &&
                    <Marker

                        position={[routePoints[0].lat, routePoints[0].lng]}
                    />} */}
                {realPosition &&
                    <Marker position={realPosition}>
                        <Popup>Vị trí thực tế của bạn</Popup>
                    </Marker>}
            </>
        );
    };
    export default Routing;