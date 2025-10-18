import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import React, { useState, useEffect, useRef } from "react";
import L, { routing } from "leaflet";
import { Polyline } from "react-leaflet";
const Routing = ({ start, end }) => {
   const map = useMap();
  const [routePoints, setRoutePoints] = useState([]);
  const [markerIndex, setMarkerIndex] = useState(0);

  useEffect(() => {
    if (!map || !start || !end) return;

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
      lineOptions: { styles: [{ color: "blue", weight: 5 }] },
      addWaypoints: false,
      draggableWaypoints: false,
      show: false,
    }).addTo(map);

    routingControl.on("routesfound", (e) => {
      if (e.routes.length > 0) {
        setRoutePoints(e.routes[0].coordinates);
        setMarkerIndex(0); // reset marker
      }
    });

    return () => {
      if (routingControl && routingControl._map) {
        map.removeControl(routingControl);
      }
      setRoutePoints([]);
      setMarkerIndex(0);
    };
  }, [map, start, end]);

  // Di chuyển marker mượt theo route
  useEffect(() => {
    if (routePoints.length === 0) return;

    const interval = setInterval(() => {
      setMarkerIndex((prev) =>
        prev < routePoints.length - 1 ? prev + 1 : prev
      );
    }, 100); // tốc độ: 100ms/step, có thể điều chỉnh

    return () => clearInterval(interval);
  }, [routePoints]);

  return (
    <>
      {/* Vẽ Polyline */}
      {routePoints.length > 0 && (
        <Polyline
          positions={routePoints.map((p) => [p.lat, p.lng])}
          pathOptions={{ color: "blue", weight: 5 }}
        />
      )}

      {/* Marker di chuyển */}
      {routePoints.length > 0 && (
        <Marker
          position={[
            routePoints[markerIndex].lat,
            routePoints[markerIndex].lng,
          ]}
        />
      )}
    </>
  );
};
export default Routing;