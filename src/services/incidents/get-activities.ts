import { supabase } from "../../lib/supabase";
import type { Activity } from "../../types/activity";

export async function getActivities(): Promise<Activity[] | null> {
  const { data: activity, error } = await supabase
    .from("activities")
    .select("*");
  if (error) throw error;

  return activity;
}
