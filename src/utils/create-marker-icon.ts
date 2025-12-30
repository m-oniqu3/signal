import L from "leaflet";
import type { IncidentStatus } from "../types/incident";

const statusColors: Record<IncidentStatus, { inner: string; outer: string }> = {
  active: { inner: "#FF0000", outer: "#F78D8D" },
  in_progress: { inner: "#ff9500", outer: "#ffd8a893" },
  resolved: { inner: "#34c759", outer: "#b8f1c4a6" },
};

export function createIncidentMarkerIcon(status: IncidentStatus, size = 36) {
  const colors = statusColors[status];
  const center = size / 2;

  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [center, center],
    popupAnchor: [0, -center],
    html: `
      <svg width="${size}" height="${size}">
        <circle cx="${center}" cy="${center}" r="16" fill="${colors.outer}" />
        <circle cx="${center}" cy="${center}" r="5" fill="${colors.inner}" />
      </svg>
    `,
  });
}
