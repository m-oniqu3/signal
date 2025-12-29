import { supabase } from "../../lib/supabase";
import type { Incident } from "../../types/incident";

export async function createIncident(
  title: string,
  content: string,
  lat: number,
  lng: number,
  userId: string
): Promise<Incident> {
  const { data: incident, error } = await supabase
    .from("incidents")
    .insert([{ title, content, lat, lng, user_id: userId }])
    .select()
    .single();

  if (error) throw error;

  return incident;
}
