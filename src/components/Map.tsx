import L, { LatLng } from "leaflet";
import { useCallback, useEffect, useRef, useState } from "react";

import type { Incident, IncidentSummary } from "../types/incident";
import { createIncidentMarkerIcon } from "../utils/create-marker-icon";
import CreateIncident from "./incident/CreateIncident";

import "leaflet.markercluster";
import { getIncidentById } from "../services/incidents/get-incident-by-id";
import { getIncidentsInBounds } from "../services/incidents/get-incidents-in-bounds";
import type { ActiveMarker } from "../types/marker";
import type { PopupPosition } from "../types/popup";
import IncidentPopup from "./incident/IncidentPopup";

function getPopupPosition(map: L.Map, latlng: L.LatLng): PopupPosition {
  const mapRect = map.getContainer().getBoundingClientRect();
  const point = map.latLngToContainerPoint(latlng);

  return {
    x: mapRect.left + point.x,
    y: mapRect.top + point.y,
  };
}

/**
 * Interactive incident map with viewport-based fetching and marker clustering.
 *
 * Handles map initialization, incident fetching, marker rendering,
 * clustering, and user-created incident placement with automatic zooming.
 */

function Map() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const renderedIdsRef = useRef<Set<number>>(new Set());
  const clusterRef = useRef<L.LayerGroup | null>(null);
  const debounceTimeoutRef = useRef<number | null>(null);
  const fetchedIncidentsRef = useRef<Record<number, Incident>>({});
  const lastRequestedIncidentIdRef = useRef<number | null>(null);

  const [incidentLocation, setIncidentLocation] = useState<LatLng | null>(null);
  const [activeMarker, setActiveMarker] = useState<ActiveMarker | null>(null);
  const [activeIncident, setActiveIncident] = useState<Incident | null>(null);
  const [isFetchingActiveIncident, setIsFetchingActiveIncident] =
    useState(false);
  const [popupPosition, setPopupPosition] = useState<PopupPosition | null>(
    null
  );

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

      marker.on("click", () => {
        setActiveMarker((prevState) => {
          return prevState?.id === incident.id
            ? null
            : { id: incident.id, latlng: marker.getLatLng() };
        });

        mapRef.current?.flyTo([incident.lat, incident.lng], 18, {
          animate: true,
        });
      });

      marker.off("click", () => setActiveMarker(null));
      clusterRef.current.addLayer(marker);

      // Zoom to new marker only if requested
      if (shouldZoom) {
        mapRef.current.flyTo([incident.lat, incident.lng], 18);
      }
    },
    []
  );

  // Close Popup & Incident Modal when both are open simultaneously
  useEffect(() => {
    if (activeMarker && incidentLocation) {
      setActiveMarker(null);
      setIncidentLocation(null);
    }
  }, [activeMarker, incidentLocation]);

  // Fetch incident associated with the active marker
  const fetchIncident = useCallback(async (id: number) => {
    lastRequestedIncidentIdRef.current = id;

    const cachedIncident = fetchedIncidentsRef.current[id];
    if (cachedIncident) {
      setActiveIncident(cachedIncident);
      return;
    }

    try {
      setIsFetchingActiveIncident(true);
      const incident = await getIncidentById(id);
      if (!incident) return;
      if (lastRequestedIncidentIdRef.current !== id) return;

      fetchedIncidentsRef.current[id] = incident;
      setActiveIncident(incident);
    } catch (error) {
      console.log("Could not get incident", error);
    } finally {
      setIsFetchingActiveIncident(false);
    }
  }, []);

  // Fetch incident when marker is clicked
  useEffect(() => {
    if (activeMarker) fetchIncident(activeMarker.id);
  }, [activeMarker, fetchIncident]);

  // Get & Set the popup position when a marker is clicked
  useEffect(() => {
    if (!activeMarker || !mapRef.current) {
      setPopupPosition(null);
      return;
    }

    const pos = getPopupPosition(mapRef.current, activeMarker.latlng);

    setPopupPosition(pos);
  }, [activeMarker]);

  // Position the popup when the map moves
  useEffect(() => {
    if (!mapRef.current || !activeMarker) return;

    function updatePosition() {
      if (!mapRef.current || !activeMarker) return;

      const pos = getPopupPosition(mapRef.current!, activeMarker.latlng);
      setPopupPosition(pos);
    }

    mapRef.current.on("move", updatePosition);
    mapRef.current.on("zoom", updatePosition);

    return () => {
      mapRef.current?.off("move", updatePosition);
      mapRef.current?.off("zoom", updatePosition);
    };
  }, [activeMarker]);

  // Fetch incidents that fall within the current map bounds.
  const fetchIncidentsInView = useCallback(async () => {
    const map = mapRef.current;
    if (!map) return;

    try {
      const bounds = map.getBounds();

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
  }, [addMarker]);

  // Debounce using ref
  const fetchIncidentsDebounced = useCallback(() => {
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      fetchIncidentsInView();
    }, 300);
  }, [fetchIncidentsInView]);

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

    map.on("moveend", fetchIncidentsDebounced);

    // Fetch incidents after map is initialized
    fetchIncidentsInView();

    return () => {
      renderedIds.clear();
      clusterRef.current?.clearLayers();
      map.off("moveend", fetchIncidentsDebounced);
      map.remove();
    };
  }, [fetchIncidentsDebounced, fetchIncidentsInView]);

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

      {popupPosition && (
        <IncidentPopup
          incident={activeIncident}
          position={popupPosition}
          isLoading={isFetchingActiveIncident}
          closePopup={() => setActiveMarker(null)}
        />
      )}
    </div>
  );
}

export default Map;
