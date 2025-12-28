import type { Address } from "../types/geo";

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<Address | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });

    if (!res.ok) {
      throw new Error(`Reverse geocoding failed: ${res.status}`);
    }

    const data = await res.json();

    if (!data) {
      throw new Error("No data found.");
    }

    return {
      name: data.name,
      displayName: data.display_name,
    };
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
}
