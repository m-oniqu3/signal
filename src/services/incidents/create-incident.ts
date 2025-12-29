import { supabase } from "../../lib/supabase";

export async function createIncident(
  title: string,
  content: string,
  lat: number,
  lng: number,
  userId: string
) {
  const { data: incident, error } = await supabase
    .from("incidents")
    .insert([{ title, content, lat, lng, user_id: userId }])
    .select()
    .single();

  if (error) throw error;

  return incident;
}
