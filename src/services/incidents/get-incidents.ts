import { supabase } from "../../lib/supabase";
import type { IncidentSummary } from "../../types/incident";

export async function getIncidents(): Promise<IncidentSummary[] | null> {
  const { data: incident, error } = await supabase
    .from("incidents")
    .select("id, user_id, lat, lng, status");
  if (error) throw error;

  return incident;
}
