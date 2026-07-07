import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./layout/AppLayout";
import Vectors from "./pages/Vectors";
import Dashboard from "./pages/Dashboard";
import Retrieval from "./pages/Retrieval";
import Warehouse from "./pages/Warehouse";
import Storage from "./pages/Storage";
import Indexes from "./pages/Indexes";
import ReviewCenter from "./pages/ReviewCenter";
import Agents from "./pages/Agents";
import Settings from "./pages/Settings";
import Graphs from "./pages/Graphs";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/assets" replace />} />
          <Route path="/assets" element={<Vectors />} />
          <Route path="/vectors" element={<Vectors />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/retrieval" element={<Retrieval />} />
          <Route path="/warehouse" element={<Warehouse />} />
          <Route path="/storage" element={<Storage />} />
          <Route path="/indexes" element={<Indexes />} />
          <Route path="/graphs" element={<Graphs />} />
          <Route path="/review" element={<ReviewCenter />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
