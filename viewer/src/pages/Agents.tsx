import {useQuery} from "@tanstack/react-query";
import {getAgents} from "../api/runtime";

export default function Agents(){

const {data,isLoading}=useQuery({
queryKey:["agents"],
queryFn:getAgents,
refetchInterval:3000
});

if(isLoading) return <h2>Loading Agents...</h2>;

return(
<div>
<h1>Agents</h1>

<div className="dashboard-grid">

<div className="panel">
<h3>Status</h3>
<p>{data.status}</p>
</div>

<div className="panel">
<h3>Running</h3>
<p>{data.running}</p>
</div>

</div>
</div>
);
}
