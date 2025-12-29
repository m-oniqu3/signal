import L, { LatLng } from "leaflet";
import { useEffect, useRef, useState } from "react";
import type { Activity } from "../types/activity";
import IncidentReport from "./CreateActivity";

function createMarkerIcon(size = 36) {
  const center = size / 2;

  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [center, center],
    popupAnchor: [0, -center],
    html: `
      <svg width="${size}" height="${size}">
        <circle cx="${center}" cy="${center}" r="18" fill="#c5f7d0a2" />
        <circle cx="${center}" cy="${center}" r="4" fill="#75eeb4 " />
      </svg>
    `,
  });
}

function Map() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const [activityLocation, setActivityLocation] = useState<LatLng | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current).setView([40.7128, 74.006], 16);

    mapRef.current = map;

    // Attempt to center on user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 16); // recenter map
        console.log("User location:", latitude, longitude);
      });
    }

    // Tile layer (OpenStreetMap)
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 40,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    map.addEventListener("click", function (e) {
      setActivityLocation(e.latlng);
    });

    return () => {
      map.remove();
    };
  }, []);

  // Add a marker to map
  function addMarker(activity: Activity) {
    if (!mapRef.current) return;

    const marker = L.marker([activity.lat, activity.lng], {
      icon: createMarkerIcon(),
    }).addTo(mapRef.current);

    marker.bindPopup(`<strong>${activity.title}</strong>`);

    markersRef.current.push(marker);

    // Zoom to new marker
    mapRef.current.setView([activity.lat, activity.lng], 16);
  }

  return (
    <div className="relative">
      <div ref={containerRef} className="z-0 h-screen w-screen" />

      {activityLocation && (
        <IncidentReport
          activityLocation={activityLocation}
          addMarker={addMarker}
          onClose={() => setActivityLocation(null)}
        />
      )}
    </div>
  );
}

export default Map;
