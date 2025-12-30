export type IncidentStatus = "active" | "in_progress" | "resolved";

export type Incident = {
  id: number;
  user_id: string;
  title: string;
  content: string;
  lat: number;
  lng: number;
  status: IncidentStatus;
  created_at: string;
};

export type IncidentSummary = {
  id: number;
  user_id: string;
  lat: number;
  lng: number;
  status: IncidentStatus;
};
