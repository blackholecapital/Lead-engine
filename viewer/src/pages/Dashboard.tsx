export default function Dashboard() {
  return (
    <div style={{padding:32}}>
      <h1>Lead Engine</h1>

      <p>
        Legal Lead Intelligence Platform
      </p>

      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(4,1fr)",
        gap:"20px",
        marginTop:"40px"
      }}>

        <div className="card">
          <h3>Incidents</h3>
          <h1>0</h1>
        </div>

        <div className="card">
          <h3>Qualified Leads</h3>
          <h1>0</h1>
        </div>

        <div className="card">
          <h3>Counties</h3>
          <h1>1</h1>
        </div>

        <div className="card">
          <h3>Status</h3>
          <h1>Ready</h1>
        </div>

      </div>

    </div>
  );
}
