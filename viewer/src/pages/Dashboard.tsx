import {
  Cpu,
  Database,
  HardDrive,
  Search,
  Activity,
  Boxes,
  Bot,
  Clock,
} from "lucide-react";

const cards = [
  { title: "Runtime", value: "ONLINE", icon: Cpu },
  { title: "Retrieval", value: "0 Jobs", icon: Search },
  { title: "Warehouse", value: "Ready", icon: Boxes },
  { title: "Storage", value: "48 GB", icon: HardDrive },
  { title: "Indexes", value: "Healthy", icon: Database },
  { title: "Agents", value: "Idle", icon: Bot },
];

export default function Dashboard() {
  return (
    <>
      <div className="hero-header">
        <div>
          <h1>Tracer Runtime</h1>
          <p>
            Autonomous Retrieval · Runtime Intelligence · Factory Operations
          </p>
        </div>

        <div className="hero-status">
          <Activity size={18} />
          Connected
        </div>
      </div>

      <div className="dashboard-grid">
        {cards.map((c) => {
          const Icon = c.icon;

          return (
            <div className="panel" key={c.title}>
              <Icon size={34} className="panel-icon" />
              <h3>{c.title}</h3>
              <strong>{c.value}</strong>
            </div>
          );
        })}
      </div>

      <div className="bottom-grid">

        <div className="panel">
          <h3>Live Event Stream</h3>

          <ul className="events">
            <li><Clock size={15}/> Runtime initialized</li>
            <li><Clock size={15}/> Retrieval service ready</li>
            <li><Clock size={15}/> Warehouse mounted</li>
            <li><Clock size={15}/> Storage online</li>
            <li><Clock size={15}/> Waiting for activity…</li>
          </ul>
        </div>

        <div className="panel">
          <h3>System</h3>

          <table className="stats">
            <tbody>
              <tr><td>CPU</td><td>0%</td></tr>
              <tr><td>Memory</td><td>0 MB</td></tr>
              <tr><td>Agents</td><td>0</td></tr>
              <tr><td>Embeddings</td><td>0</td></tr>
              <tr><td>Review Queue</td><td>0</td></tr>
            </tbody>
          </table>

        </div>

      </div>
    </>
  );
}
