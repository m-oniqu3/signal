import { supabase } from "../../lib/supabase";
import type { Incident } from "../../types/incident";

export async function getIncidents(): Promise<Incident[] | null> {
  const { data: activity, error } = await supabase
    .from("incidents")
    .select("*");
  if (error) throw error;

  return activity;
}
