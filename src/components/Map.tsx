import L, { LatLng } from "leaflet";
import { useEffect, useRef, useState } from "react";
import IncidentReport from "./IncidentReport";

function Map() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [incidentLocation, setIncidentLocation] = useState<LatLng | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current).setView([40.7128, 74.006], 13);

    mapRef.current = map;

    // Attempt to center on user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 13); // recenter map
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

  return (
    <div className="relative">
      <div ref={containerRef} className="z-0 h-screen w-screen" />

      {incidentLocation && (
        <IncidentReport
          incidentLocation={incidentLocation}
          onClose={() => setIncidentLocation(null)}
        />
      )}
    </div>
  );
}

export default Map;
