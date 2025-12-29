import L, { LatLng } from "leaflet";
import { useEffect, useRef, useState } from "react";
import type { Incident } from "../types/incident";
import IncidentReport from "./IncidentReport";

// Status marker helper
type MarkerStatus = "open" | "pending" | "resolved";

const statusColors: Record<MarkerStatus, { inner: string; outer: string }> = {
  open: { inner: "#fd4238", outer: "#ffbcbcb2" },
  pending: { inner: "#ff9500", outer: "#ffd8a893" },
  resolved: { inner: "#34c759", outer: "#b8f1c4a6" },
};

function createStatusMarkerIcon(
  status: MarkerStatus,
  size = { width: 36, height: 36 }
) {
  const colors = statusColors[status];
  const outerRadius = 13;
  const innerRadius = 4;
  const cx = size.width / 2;
  const cy = size.height / 2;

  const html = `
    <svg width="${size.width}" height="${size.height}">
      <circle cx="${cx}" cy="${cy}" r="${outerRadius}" fill="${colors.outer}" />
      <circle cx="${cx}" cy="${cy}" r="${innerRadius}" fill="${colors.inner}" />
    </svg>
  `;

  return L.divIcon({
    html,
    className: "",
    iconAnchor: [cx, cy],
    popupAnchor: [1, -cy],
  });
}

function Map() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const [incidentLocation, setIncidentLocation] = useState<LatLng | null>(null);

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
      maxZoom: 50,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    map.addEventListener("click", function (e) {
      setIncidentLocation(e.latlng);
    });

    return () => {
      map.remove();
    };
  }, []);

  // Add a marker to map
  function addMarker(incident: Incident) {
    if (!mapRef.current) return;

    const marker = L.marker([incident.lat, incident.lng], {
      icon: createStatusMarkerIcon(incident.status),
    }).addTo(mapRef.current);

    marker.bindPopup(`<strong>${incident.title}</strong>`);

    markersRef.current.push(marker);

    // Zoom to new marker
    mapRef.current.setView([incident.lat, incident.lng], 16);
  }

  return (
    <div className="relative">
      <div ref={containerRef} className="z-0 h-screen w-screen" />

      {incidentLocation && (
        <IncidentReport
          incidentLocation={incidentLocation}
          addMarker={addMarker}
          onClose={() => setIncidentLocation(null)}
        />
      )}
    </div>
  );
}

export default Map;
