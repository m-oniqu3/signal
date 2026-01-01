import { supabase } from "../../lib/supabase";
import type { Incident } from "../../types/incident";

export async function getIncidentById(id: number): Promise<Incident | null> {
  const { data: incident, error } = await supabase
    .from("incidents")
    .select()
    .eq("id", id)
    .single();

  if (error) throw error;

  return incident;
}
