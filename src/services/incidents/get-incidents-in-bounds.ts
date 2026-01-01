import { supabase } from "../../lib/supabase";
import type { IncidentSummary } from "../../types/incident";
type Bounds = {
  south: number;
  north: number;
  west: number;
  east: number;
};

export async function getIncidentsInBounds(
  bounds: Bounds
): Promise<IncidentSummary[] | null> {
  const { north, south, east, west } = bounds;

  const { data: incident, error } = await supabase
    .from("incidents")
    .select("id, user_id, lat, lng, status")
    .gte("lat", south)
    .lte("lat", north)
    .gte("lng", west)
    .lte("lng", east);

  if (error) throw error;

  return incident;
}
