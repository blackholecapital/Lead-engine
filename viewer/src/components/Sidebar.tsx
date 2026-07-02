import { NavLink } from "react-router-dom";
import { navigation } from "../lib/navigation";

export default function Sidebar() {
  return (
    <aside className="sidebar">

      <h1>Tracer</h1>

      {navigation.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
          >
            <Icon size={18}/>
            {item.name}
          </NavLink>
        );
      })}

    </aside>
  );
}
