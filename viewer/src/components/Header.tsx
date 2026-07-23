import { Bell, Wifi } from "lucide-react";

export default function Header() {
  return (
    <header className="header">

      <div>
        <h2>Lead Intelligence Platform</h2>
      </div>

      <div className="header-right">

        <div className="online">
          <Wifi size={16}/>
          Data Pipeline Connected
        </div>

        <Bell size={20}/>

      </div>

    </header>
  );
}
