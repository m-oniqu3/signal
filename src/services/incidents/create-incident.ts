import { supabase } from "../../lib/supabase";
import type { Address } from "../../types/geo";
import type { Incident } from "../../types/incident";

export async function createIncident(
  title: string,
  content: string,
  lat: number,
  lng: number,
  userId: string,
  address: Address | null
): Promise<Incident> {
  const { data: incident, error } = await supabase
    .from("incidents")
    .insert([
      {
        title,
        content,
        lat,
        lng,
        user_id: userId,
        address_name: address?.name ?? "",
        address_display: address?.displayName ?? "",
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return incident;
}
