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
import Vectors from "./pages/Vectors";
import Graphs from "./pages/Graphs";
import Ranking from "./pages/Ranking";
import Families from "./pages/Families";
import Goldens from "./pages/Goldens";
import Runs from "./pages/Runs";

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
<Route path="/vectors" element={<Vectors/>}/>
<Route path="/graphs" element={<Graphs/>}/>
<Route path="/ranking" element={<Ranking/>}/>
<Route path="/families" element={<Families/>}/>
<Route path="/goldens" element={<Goldens/>}/>
<Route path="/runs" element={<Runs/>}/>

</Route>

</Routes>

</BrowserRouter>

);

}
