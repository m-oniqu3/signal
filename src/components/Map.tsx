import L from "leaflet";
import { useEffect, useRef } from "react";

function Map() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current).setView([40.7128, 74.006], 13);

    mapRef.current = map;

    // Tile layer (OpenStreetMap)
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Attempt to center on user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 13); // recenter map
        console.log("User location:", latitude, longitude);
      });
    }

    return () => {
      map.remove();
    };
  }, []);

  return <div ref={containerRef} className="h-screen w-screen" />;
}

export default Map;
