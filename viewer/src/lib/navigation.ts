import {
LayoutDashboard,
Search,
Archive,
HardDrive,
Database,
ClipboardList,
Bot,
Settings
} from "lucide-react";

export const navigation=[
{name:"Dashboard",path:"/",icon:LayoutDashboard,status:"LIVE"},
{name:"Retrieval",path:"/retrieval",icon:Search,status:"LIVE"},
{name:"Warehouse",path:"/warehouse",icon:Archive,status:"LIVE"},
{name:"Storage",path:"/storage",icon:HardDrive,status:"LIVE"},
{name:"Indexes",path:"/indexes",icon:Database,status:"LIVE"},
{name:"Review",path:"/review",icon:ClipboardList,status:"READY"},
{name:"Agents",path:"/agents",icon:Bot,status:"IDLE"},
{name:"Settings",path:"/settings",icon:Settings,status:"SYS"}
];
