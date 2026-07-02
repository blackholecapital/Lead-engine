import {
  LayoutDashboard,
  Search,
  Archive,
  HardDrive,
  Database,
  ClipboardList,
  Bot,
  Settings,
} from "lucide-react";

export const navigation = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Retrieval", path: "/retrieval", icon: Search },
  { name: "Warehouse", path: "/warehouse", icon: Archive },
  { name: "Storage", path: "/storage", icon: HardDrive },
  { name: "Indexes", path: "/indexes", icon: Database },
  { name: "Review Center", path: "/review", icon: ClipboardList },
  { name: "Agents", path: "/agents", icon: Bot },
  { name: "Settings", path: "/settings", icon: Settings },
];
