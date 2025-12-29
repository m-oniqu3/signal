import L, { LatLng } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { getActivities } from "../services/incidents/get-activities";
import type { Activity } from "../types/activity";
import ActivityPopup from "./activity/ActivityPopup";
import IncidentReport from "./activity/CreateActivity";

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
  const [popup, setPopup] = useState<{
    latlng: LatLng;
    point: L.Point;
    activity: Activity;
  } | null>(null);

  // Add a marker to map
  function addMarker(activity: Activity) {
    if (!mapRef.current) return;

    const marker = L.marker([activity.lat, activity.lng], {
      icon: createMarkerIcon(),
    }).addTo(mapRef.current);

    // marker.bindPopup(createPopupHtml(activity));
    marker.addEventListener("click", (e) => {
      console.log(e);
      setPopup({
        latlng: e.latlng,
        activity,
        point: mapRef.current!.latLngToContainerPoint(e.latlng),
      });
    });

    markersRef.current.push(marker);

    // Zoom to new marker
    mapRef.current.setView([activity.lat, activity.lng], 18);
  }

  function addNewActivity(activity: Activity) {
    setActivites((prevState) => ({
      ...prevState,
      [activity.id]: activity,
    }));
  }

  useEffect(() => {
    if (!mapRef.current || !popup) return;

    const updatePosition = () => {
      setPopup((prev) =>
        prev
          ? {
              ...prev,
              point: mapRef.current!.latLngToContainerPoint(prev.latlng),
            }
          : null
      );
    };

    mapRef.current.on("move", updatePosition);
    mapRef.current.on("zoom", updatePosition);

    return () => {
      mapRef.current?.off("move", updatePosition);
      mapRef.current?.off("zoom", updatePosition);
    };
  }, [popup]);

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
      setActivityLocation(e.latlng);
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="">
      <div ref={containerRef} className="z-0 h-screen w-screen" />

      {activityLocation && (
        <IncidentReport
          activityLocation={activityLocation}
          addActivity={addNewActivity}
          addMarker={addMarker}
          onClose={() => setActivityLocation(null)}
        />
      )}

      {popup && (
        <div
          className="absolute z-50 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
          style={{
            left: popup.point.x,
            top: popup.point.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <ActivityPopup
            activity={popup.activity}
            closePopup={() => setPopup(null)}
          />
        </div>
      )}
    </div>
  );
}

export default Map;
