import {useQuery} from "@tanstack/react-query";
import {getWarehouse} from "../api/runtime";

export default function Warehouse(){

const {data,isLoading}=useQuery({
queryKey:["warehouse"],
queryFn:getWarehouse,
refetchInterval:3000
});

if(isLoading) return <h2>Loading Warehouse...</h2>;

return(
<div>
<h1>Warehouse</h1>

<div className="dashboard-grid">

<div className="panel">
<h3>Status</h3>
<p>{data.status}</p>
</div>

<div className="panel">
<h3>Collections</h3>
<p>{data.collections}</p>
</div>

<div className="panel">
<h3>Vectors</h3>
<p>{data.vectors}</p>
</div>

<div className="panel">
<h3>Last Sync</h3>
<p>{data.lastSync}</p>
</div>

</div>

</div>
);
}
