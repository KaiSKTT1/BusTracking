import { useMap } from 'react-leaflet';
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const MultiRouting = ({ routes, onRoutesLoaded }) => {
    const map = useMap();
    const [loadedCount, setLoadedCount] = useState(0);

    useEffect(() => {
        if (!map || !routes || routes.length === 0) return;

        const routingControls = [];
        let loadedRoutes = 0;

        routes.forEach((route, index) => {
            // Add small delay between route calculations to avoid blocking
            setTimeout(() => {
                // Convert waypoints array to Leaflet LatLng objects
                const waypointsLatLng = route.waypoints?.map(wp =>
                    L.latLng(wp.coords[0], wp.coords[1])
                ) || [];

                // Skip if no waypoints
                if (waypointsLatLng.length < 2) {
                    console.warn('Route has insufficient waypoints:', route.name);
                    loadedRoutes++;
                    setLoadedCount(loadedRoutes);
                    return;
                }

                const routingControl = L.Routing.control({
                    waypoints: waypointsLatLng,
                    lineOptions: {
                        styles: [{
                            color: route.color,
                            weight: 5,
                            opacity: 0.7
                        }],
                    },
                    show: false,
                    addWaypoints: false,
                    draggableWaypoints: false,
                    routeWhileDragging: false,
                    fitSelectedRoutes: false,
                    createMarker: function () { return null; },
                    router: L.Routing.osrmv1({
                        serviceUrl: 'https://router.project-osrm.org/route/v1',
                        timeout: 10000, // 10 second timeout
                    }),
                });

                routingControl.on('routesfound', function () {
                    loadedRoutes++;
                    setLoadedCount(loadedRoutes);
                    if (onRoutesLoaded && loadedRoutes === routes.length) {
                        onRoutesLoaded();
                    }
                });

                routingControl.on('routingerror', function (e) {
                    console.warn('Routing error for route:', route.name, e);
                    loadedRoutes++;
                    setLoadedCount(loadedRoutes);
                });

                routingControl.addTo(map);
                routingControls.push(routingControl);
            }, index * 200); // Stagger by 200ms each
        });

        // Cleanup function
        return () => {
            routingControls.forEach(control => {
                if (map && control) {
                    try {
                        map.removeControl(control);
                    } catch (e) {
                        console.warn('Error removing control:', e);
                    }
                }
            });
            setLoadedCount(0);
        };
    }, [map, routes, onRoutesLoaded]);

    return null;
};

export default MultiRouting;
