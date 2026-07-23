import {
  LayoutDashboard,
  Search,
  Archive,
  HardDrive,
  Database,
  ClipboardList,
  Bot,
  Settings,
  GitBranch,
} from "lucide-react";

export const navigation = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    status: "LIVE",
  },
  {
    name: "Incident Map",
    path: "/retrieval",
    icon: Search,
    status: "LIVE",
  },
  {
    name: "Lead Queue",
    path: "/warehouse",
    icon: Archive,
    status: "LIVE",
  },
  {
    name: "Sources",
    path: "/storage",
    icon: HardDrive,
    status: "LIVE",
  },
  {
    name: "Indexes",
    path: "/indexes",
    icon: Database,
    status: "LIVE",
  },
  {
    name: "Compliance",
    path: "/review",
    icon: ClipboardList,
    status: "LIVE",
  },
  {
    name: "Automation",
    path: "/agents",
    icon: Bot,
    status: "LIVE",
  },
  {
    name: "Reports",
    path: "/graphs",
    icon: GitBranch,
    status: "LIVE",
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
    status: "LIVE",
  },
];
