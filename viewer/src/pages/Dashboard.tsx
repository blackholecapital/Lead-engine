import {useRuntime} from "../hooks/useRuntime";

export default function Dashboard(){

const {data,isLoading}=useRuntime();

if(isLoading) return <h2>Connecting to Runtime...</h2>;

return(
<div>

<h1>Tracer Runtime</h1>

<div className="dashboard-grid">

<div className="panel"><h3>Runtime</h3><p>{data.runtime}</p></div>

<div className="panel"><h3>CPU Load</h3><p>{data.cpu}</p></div>

<div className="panel"><h3>Memory</h3><p>{data.memory}%</p></div>

<div className="panel"><h3>Storage</h3><p>{data.storage}</p></div>

<div className="panel"><h3>Warehouse</h3><p>{data.warehouse}</p></div>

<div className="panel"><h3>Indexes</h3><p>{data.indexes}</p></div>

</div>

</div>
);

}
