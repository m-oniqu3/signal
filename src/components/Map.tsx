import L, { LatLng } from "leaflet";
import { useCallback, useEffect, useRef, useState } from "react";
import { getIncidentsInBounds } from "../services/incidents/get-incidents";
import type { IncidentSummary } from "../types/incident";
import { createIncidentMarkerIcon } from "../utils/create-marker-icon";
import CreateIncident from "./incident/CreateIncident";

import "leaflet.markercluster";

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
  // const markersRef = useRef<L.Marker[]>([]);
  const renderedIdsRef = useRef<Set<number>>(new Set());
  const clusterRef = useRef<L.LayerGroup | null>(null);
  const fetchTimeoutRef = useRef<number | null>(null);

  const [incidentLocation, setIncidentLocation] = useState<LatLng | null>(null);

  // Add a marker to map (wrapped in useCallback for stable reference)
  const addMarker = useCallback(
    (incident: IncidentSummary, shouldZoom = false) => {
      if (!mapRef.current || !clusterRef.current) return;

      // Prevent duplicates
      if (renderedIdsRef.current.has(incident.id)) return;

      renderedIdsRef.current.add(incident.id);

      const marker = L.marker([incident.lat, incident.lng], {
        icon: createIncidentMarkerIcon(incident.status),
      });

      clusterRef.current.addLayer(marker);

      // Zoom to new marker only if requested
      if (shouldZoom) {
        mapRef.current.setView([incident.lat, incident.lng], 18);
      }
    },
    []
  );

  const fetchIncidentsInView = useCallback(async () => {
    // Clear previous timeout
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    // Debounce: wait 300ms after user stops moving
    fetchTimeoutRef.current = setTimeout(async () => {
      if (!mapRef.current) return;

      try {
        const bounds = mapRef.current.getBounds();

        const incidents = await getIncidentsInBounds({
          south: bounds.getSouth(),
          north: bounds.getNorth(),
          west: bounds.getWest(),
          east: bounds.getEast(),
        });

        incidents?.forEach((incident) => {
          addMarker(incident);
        });
      } catch (error) {
        console.log("Failed to load incidents:", error);
      }
    }, 300);
  }, [addMarker]);

  // Create the map
  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current).setView([40.7128, -74.006], 13);

    mapRef.current = map;

    // Capture refs for cleanup
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

    clusterRef.current = L.markerClusterGroup();
    map.addLayer(clusterRef.current);

    map.addEventListener("click", function (e) {
      setIncidentLocation(e.latlng);
    });

    // Fetch incidents after map is initialized
    fetchIncidentsInView();

    mapRef.current.on("moveend", fetchIncidentsInView);

    return () => {
      renderedIds.clear();
      clusterRef.current?.clearLayers();
      map.off("moveend", fetchIncidentsInView);
      map.remove();
    };
  }, [fetchIncidentsInView]);

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
