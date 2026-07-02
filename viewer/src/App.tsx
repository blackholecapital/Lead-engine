import {
BrowserRouter,
Routes,
Route,
} from "react-router-dom";

import AppLayout from "./layout/AppLayout";

import Dashboard from "./pages/Dashboard";
import Retrieval from "./pages/Retrieval";
import Warehouse from "./pages/Warehouse";
import Storage from "./pages/Storage";
import Indexes from "./pages/Indexes";
import ReviewCenter from "./pages/ReviewCenter";
import Agents from "./pages/Agents";
import Settings from "./pages/Settings";

import "./styles/global.css";

export default function App() {

return (

<BrowserRouter>

<Routes>

<Route element={<AppLayout/>}>

<Route path="/" element={<Dashboard/>}/>
<Route path="/retrieval" element={<Retrieval/>}/>
<Route path="/warehouse" element={<Warehouse/>}/>
<Route path="/storage" element={<Storage/>}/>
<Route path="/indexes" element={<Indexes/>}/>
<Route path="/review" element={<ReviewCenter/>}/>
<Route path="/agents" element={<Agents/>}/>
<Route path="/settings" element={<Settings/>}/>

</Route>

</Routes>

</BrowserRouter>

);

}
