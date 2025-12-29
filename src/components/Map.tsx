import L, { LatLng } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { getActivities } from "../services/incidents/get-activities";
import type { Activity } from "../types/activity";
import IncidentReport from "./CreateActivity";

function createMarkerIcon(size = 36) {
  const center = size / 2;

  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [center, center],
    popupAnchor: [0, -center],
    html: `
      <svg width="${size}" height="${size}">
        <circle cx="${center}" cy="${center}" r="16" fill="#f19101c9" />
        <circle cx="${center}" cy="${center}" r="4" fill="#0581a7 " />
      </svg>
    `,
  });
}

function Map() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const [activityLocation, setActivityLocation] = useState<LatLng | null>(null);
  const [activities, setActivites] = useState<Record<number, Activity> | null>(
    null
  );

  // Add a marker to map
  function addMarker(activity: Activity) {
    if (!mapRef.current) return;

    const marker = L.marker([activity.lat, activity.lng], {
      icon: createMarkerIcon(),
    }).addTo(mapRef.current);

    marker.bindPopup(`<strong>${activity.title}</strong>`);

    markersRef.current.push(marker);

    // Zoom to new marker
    mapRef.current.setView([activity.lat, activity.lng], 20);
  }

  // Get all activies from the db
  useEffect(() => {
    async function getAllActivities() {
      try {
        const activities = await getActivities();

        if (!activities) {
          setActivites(null);
          return;
        }
        const activityMap = activities.reduce((acc, cur) => {
          acc[cur.id] = cur;

          return acc;
        }, {} as Record<number, Activity>);
        setActivites(activityMap);
      } catch (error) {
        console.log(error);
      }
    }

    getAllActivities();
  }, []);

  //When the activities update, add the marker to the map
  useEffect(() => {
    console.log(activities);
    function addActivityToMap(activities: Record<number, Activity>) {
      const ids = Object.keys(activities);
      ids.forEach((id) => addMarker(activities[+id]));
    }

    if (activities) addActivityToMap(activities);
  }, [activities]);

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
      maxZoom: 40,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    map.addEventListener("click", function (e) {
      setActivityLocation(e.latlng);
    });

    return () => {
      map.remove();
    };
  }, []);

  function addNewActivity(activity: Activity) {
    setActivites((prevState) => ({
      ...prevState,
      [activity.id]: activity,
    }));
  }

  return (
    <div className="relative">
      <div ref={containerRef} className="z-0 h-screen w-screen" />

      {activityLocation && (
        <IncidentReport
          activityLocation={activityLocation}
          addActivity={addNewActivity}
          addMarker={addMarker}
          onClose={() => setActivityLocation(null)}
        />
      )}
    </div>
  );
}

export default Map;
