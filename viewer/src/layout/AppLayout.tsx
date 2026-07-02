import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatusBar from "../components/StatusBar";

export default function AppLayout() {
  return (
    <div className="layout">

      <Sidebar />

      <div className="content">

        <Header />

        <main>
          <Outlet />
        </main>

        <StatusBar />

      </div>

    </div>
  );
}
