import L, { LatLng } from "leaflet";
import { useCallback, useEffect, useRef, useState } from "react";
import { getIncidents } from "../services/incidents/get-incidents";
import type { IncidentSummary } from "../types/incident";
import { createIncidentMarkerIcon } from "../utils/create-marker-icon";
import CreateIncident from "./incident/CreateIncident";

/**
 *
 * Renders an interactive Leaflet map that displays incident markers and allows users to report new incidents.
 *
 * Features:
 * - Initializes a Leaflet map centered on NYC (or user's geolocation if available)
 * - Fetches and displays existing incidents from the database as markers
 * - Allows users to click anywhere on the map to report a new incident
 * - Prevents duplicate markers from being rendered
 * - Automatically zooms to newly created incidents
 * - Cleans up all markers and map resources on component unmount
 */
function Map() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const renderedIdsRef = useRef<Set<number>>(new Set());

  const [incidentLocation, setIncidentLocation] = useState<LatLng | null>(null);

  // Add a marker to map (wrapped in useCallback for stable reference)
  const addMarker = useCallback(
    (incident: IncidentSummary, shouldZoom = false) => {
      if (!mapRef.current) return;

      // Prevent duplicates
      if (renderedIdsRef.current.has(incident.id)) return;

      renderedIdsRef.current.add(incident.id);

      const marker = L.marker([incident.lat, incident.lng], {
        icon: createIncidentMarkerIcon(incident.status),
      }).addTo(mapRef.current);

      markersRef.current.push(marker);

      // Zoom to new marker only if requested
      if (shouldZoom) {
        mapRef.current.setView([incident.lat, incident.lng], 18);
      }
    },
    []
  );

  // Create the map
  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current).setView([40.7128, -74.006], 13);

    mapRef.current = map;

    // Capture refs for cleanup
    const markers = markersRef.current;
    const renderedIds = renderedIdsRef.current;

    // Attempt to center on user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 13); // recenter map
      });
    }

    // Tile layer (OpenStreetMap)
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    map.addEventListener("click", function (e) {
      setIncidentLocation(e.latlng);
    });

    // Fetch incidents after map is initialized
    getIncidents()
      .then((incidents) => {
        if (incidents) {
          incidents.forEach((i) => addMarker(i, false));
        }
      })
      .catch((err) => console.error("Failed to load incidents:", err));

    return () => {
      markers.forEach((marker) => marker.remove());
      markers.length = 0;
      renderedIds.clear();
      map.remove();
    };
  }, [addMarker]);

  return (
    <div className="">
      <div ref={containerRef} className="z-0 h-screen w-screen" />

      {incidentLocation && (
        <CreateIncident
          incidentLocation={incidentLocation}
          addMarker={(i) => addMarker(i, true)}
          onClose={() => setIncidentLocation(null)}
        />
      )}
    </div>
  );
}

export default Map;
