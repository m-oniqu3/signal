import { supabase } from "../../lib/supabase";
import type { Activity } from "../../types/activity";

export async function createActivity(
  title: string,
  content: string,
  lat: number,
  lng: number,
  userId: string
): Promise<Activity> {
  const { data: activity, error } = await supabase
    .from("activities")
    .insert([{ title, content, lat, lng, user_id: userId }])
    .select()
    .single();

  if (error) throw error;

  return activity;
}
