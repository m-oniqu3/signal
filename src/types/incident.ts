export type Incident = {
  id: number;
  user_id: string;
  title: string;
  content: string;
  lat: number;
  lng: number;
  status: "open" | "pending" | "resolved";
  created_at: string;
};
