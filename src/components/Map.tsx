import L, { LatLng } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { getIncidents } from "../services/incidents/get-incidents";
import type { Incident } from "../types/incident";
import { createIncidentMarkerIcon } from "../utils/create-marker-icon";
import IncidentReport from "./activity/CreateIncident";

// function createPopupHtml(activity: Activity) {
//   const container = document.createElement("div");
//   const root = createRoot(container);
//   root.render(<ActivityPopup activity={activity} />);
//   return container;
// }

function Map() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const [incidentLocation, setIncidentLocation] = useState<LatLng | null>(null);
  // const [incidents, setIncidents] = useState<Record<number, Incident> | null>(
  //   null
  // );

  // Add a marker to map
  function addMarker(incident: Incident) {
    if (!mapRef.current) return;

    const marker = L.marker([incident.lat, incident.lng], {
      icon: createIncidentMarkerIcon(incident.status),
    }).addTo(mapRef.current);

    // marker.bindPopup(createPopupHtml(activity));
    marker.bindPopup(`<p className="text-sm">${incident.title}</>`);

    markersRef.current.push(marker);

    // Zoom to new marker
    mapRef.current.setView([incident.lat, incident.lng], 18);
  }

  // function recordNewIncident(incident: Incident) {
  //   setIncidents((prevState) => ({
  //     ...prevState,
  //     [incident.id]: incident,
  //   }))
  // }

  // Get all activies from the db
  useEffect(() => {
    // async function fetchIncidents() {

    //     const incidents = await getIncidents();

    //     if (!incidents) {
    //       setIncidents(null);
    //       return null;
    //     }

    //   //   const incidentMap = incidents.reduce((acc, cur) => {
    //   //     acc[cur.id] = cur;
    //   //     return acc;
    //   //   }, {} as Record<number, Incident>);

    //   // setIncidents(incidentMap);

    //     return incidents

    // }

    // Add incident to the map
    getIncidents()
      .then((incidents) => {
        if (incidents) {
          incidents.forEach((i) => addMarker(i));
        }
      })
      .catch((err) => console.log(err));
  }, []);

  // Create the map
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
      maxZoom: 40,
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
    <div className="">
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
