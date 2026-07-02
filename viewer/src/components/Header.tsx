import { Bell, Wifi } from "lucide-react";

export default function Header() {
  return (
    <header className="header">

      <div>
        <h2>Tracer AI</h2>
      </div>

      <div className="header-right">

        <div className="online">
          <Wifi size={16}/>
          Runtime Connected
        </div>

        <Bell size={20}/>

      </div>

    </header>
  );
}
