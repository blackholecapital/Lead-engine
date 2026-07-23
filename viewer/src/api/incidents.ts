export interface Incident {
  id: number;
  county: string;
  city: string;
  type: string;
  date: string;
  status: string;
  source: string;
}

const API =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function getIncidents(): Promise<Incident[]> {
  const res = await fetch(`${API}/incidents`);

  if (!res.ok) {
    throw new Error("Unable to load incidents");
  }

  return await res.json();
}
