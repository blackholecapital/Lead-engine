import { useEffect, useState } from "react";
import { getIncidents } from "../api/incidents";
import type { Incident } from "../api/incidents";

export default function Dashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getIncidents()
      .then(setIncidents)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: 32 }}>
      <h1>Lead Engine</h1>

      <h2>Total Incidents: {incidents.length}</h2>

      {loading && <p>Loading...</p>}

      {!loading && (
        <table width="100%" cellPadding={8}>
          <thead>
            <tr>
              <th>ID</th>
              <th>County</th>
              <th>City</th>
              <th>Type</th>
              <th>Date</th>
              <th>Status</th>
              <th>Source</th>
            </tr>
          </thead>

          <tbody>
            {incidents.map(i => (
              <tr key={i.id}>
                <td>{i.id}</td>
                <td>{i.county}</td>
                <td>{i.city}</td>
                <td>{i.type}</td>
                <td>{i.date}</td>
                <td>{i.status}</td>
                <td>{i.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
