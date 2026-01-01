import { useCallback, useRef, type RefObject } from "react";
import { getIncidentsInBounds } from "../services/incidents/get-incidents-in-bounds";
import useAddMarker from "./useAddMarker";

type Props = {
  mapRef: RefObject<L.Map | null>;
  clusterRef: RefObject<L.LayerGroup | null>;
};

function useFetchIncidentsInView(props: Props) {
  const { mapRef, clusterRef } = props;

  const { addMarker } = useAddMarker({ mapRef, clusterRef });

  const debounceTimeoutRef = useRef<number | null>(null);

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
  }, [addMarker, mapRef]);

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

  return {
    fetchIncidentsInView,
    fetchIncidentsDebounced,
  };
}

export default useFetchIncidentsInView;
