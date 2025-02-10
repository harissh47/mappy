import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';

// Predefined list of distinct colors
const distinctColors = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFA1', '#FF8C33', '#8CFF33', '#338CFF',
    '#FF3333', '#33FF8C', '#8C33FF', '#FF338C', '#33A1FF', '#A1FF33', '#FF5733', '#33FF57', '#3357FF',
    '#FF33A1', '#A133FF', '#33FFA1', '#FF8C33', '#8CFF33', '#338CFF', '#FF3333', '#33FF8C', '#8C33FF',
    '#FF338C', '#33A1FF', '#A1FF33', '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFA1',
    '#FF8C33', '#8CFF33', '#338CFF', '#FF3333', '#33FF8C', '#8C33FF', '#FF338C', '#33A1FF', '#A1FF33'
];

export default function Map({ data }) {
    const mapContainerRef = useRef(null);

    useEffect(() => {
        const map = L.map(mapContainerRef.current);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);

        // Generate a color map for clusters dynamically
        const uniqueClusters = [...new Set(data.map(item => item.cluster))];

        // Simplified color assignment using modulo
        const clusterColors = uniqueClusters.reduce((acc, cluster) => {
            acc[cluster] = distinctColors[cluster % distinctColors.length];
            return acc;
        }, {});

        // Collect all points for bounding box calculation
        const allPoints = [];

        // Process each cluster
        uniqueClusters.forEach(cluster => {
            const clusterData = data.filter(item => item.cluster === cluster);
            const latitudes = clusterData.map(item => item.Latitude || item.latitude);
            const longitudes = clusterData.map(item => item.Longitude || item.longitude);

            if (latitudes.length > 0 && longitudes.length > 0) {
                // Add points to the allPoints array
                clusterData.forEach(item => {
                    allPoints.push([item.Latitude || item.latitude, item.Longitude || item.longitude]);
                });

                // Calculate and draw the convex hull
                const points = clusterData.map(item => [item.Longitude || item.longitude, item.Latitude || item.latitude]);
                if (points.length >= 3) {
                    const hull = turf.convex(turf.points(points));
                    if (hull) {
                        L.polygon(hull.geometry.coordinates[0].map(coord => [coord[1], coord[0]]), {
                            color: clusterColors[cluster],
                            weight: 2,
                            fillOpacity: 0.4,
                        }).addTo(map);
                    }
                }
            }
        });

        // Add markers for each data point
        data.forEach(item => {
            const { cluster } = item;
            const latitude = item.Latitude || item.latitude;
            const longitude = item.Longitude || item.longitude;

            // Determine the color based on the cluster
            const color = clusterColors[cluster] || '#000000'; // Default to black if cluster is not in the map

            // Add a circle marker
            const marker = L.circleMarker([latitude, longitude], {
                radius: 5,
                color: color,
                fillColor: color,
                fillOpacity: 0.8,
            }).addTo(map);

            // Filtered popup content (exclude coordinates and cluster)
            let popupContent = '';
            for (const [key, value] of Object.entries(item)) {
                const lowerKey = key.toLowerCase();
                if (lowerKey === 'latitude' || lowerKey === 'longitude' || lowerKey === 'cluster') continue;
                popupContent += `<b>${key}:</b> ${value || 'Unknown'}<br>`;
            }

            marker.bindPopup(popupContent);
        });

        // Fit the map to the bounding box of all points
        if (allPoints.length > 0) {
            const bounds = L.latLngBounds(allPoints);
            map.fitBounds(bounds, { maxZoom: 15 });
        } else {
            map.setView([0, 0], 15); // Default view if no points
        }

        return () => {
            map.remove();
        };
    }, [data]);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            mapContainerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div>
            <button onClick={toggleFullscreen} style={{ position: 'absolute', zIndex: 1000 }}>
                Toggle Fullscreen
            </button>
            <div ref={mapContainerRef} id="map" style={{ height: '500px', width: '100%' }}></div>
        </div>
    );
}
