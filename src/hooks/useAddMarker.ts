import L from "leaflet";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { getIncidentById } from "../services/incidents/get-incident-by-id";
import { type Incident, type IncidentSummary } from "../types/incident";
import { createIncidentMarkerIcon } from "../utils/create-marker-icon";

type HoveredIncident = {
  incidentId: number;
  latlng: L.LatLng;
};

type Props = {
  mapRef: RefObject<L.Map | null>;
  clusterRef: RefObject<L.LayerGroup | null>;
};

function useAddMarker(props: Props) {
  const { mapRef, clusterRef } = props;

  const renderedIdsRef = useRef<Set<number>>(new Set());
  const [hoveredIncident, setHoveredIncident] =
    useState<HoveredIncident | null>(null);
  const [activeIncident, setActiveIncident] = useState<Incident | null>(null);

  const fetchedIncidentsRef = useRef<Record<number, Incident>>({});

  const addMarker = useCallback(
    (incident: IncidentSummary, shouldZoom = false) => {
      if (!mapRef.current || !clusterRef.current) return;

      // Prevent duplicates
      if (renderedIdsRef.current.has(incident.id)) return;

      renderedIdsRef.current.add(incident.id);

      const marker = L.marker([incident.lat, incident.lng], {
        icon: createIncidentMarkerIcon(incident.status),
      });

      marker.on("mouseover", () => {
        setHoveredIncident({
          incidentId: incident.id,
          latlng: marker.getLatLng(),
        });
      });

      marker.on("mouseout", () => {
        setHoveredIncident(null);
      });

      clusterRef.current.addLayer(marker);

      // Zoom to new marker only if requested
      if (shouldZoom) {
        mapRef.current.setView([incident.lat, incident.lng], 18);
      }
    },
    [clusterRef, mapRef]
  );

  useEffect(() => {
    async function fetchIncident() {
      if (!hoveredIncident) {
        setActiveIncident(null);
        return;
      }

      const { incidentId } = hoveredIncident;

      const cached = fetchedIncidentsRef.current[incidentId];
      if (cached) {
        setActiveIncident(cached);
        return;
      }

      try {
        const incident = await getIncidentById(incidentId);
        if (!incident) return;

        fetchedIncidentsRef.current[incidentId] = incident;
        setActiveIncident(incident);
      } catch (error) {
        console.log("Could not get incident", error);
      }
    }

    fetchIncident();
  }, [hoveredIncident]);

  return {
    addMarker,
    activeIncident,
    renderedIdsRef,
  };
}

export default useAddMarker;
