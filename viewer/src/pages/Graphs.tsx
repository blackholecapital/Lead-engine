import {useQuery} from "@tanstack/react-query";
import {getGraphs} from "../api/runtime";

export default function Indexes(){

const {data,isLoading}=useQuery({
queryKey:["graphs"],
queryFn:getGraphs,
refetchInterval:3000
});

if(isLoading) return <h2>Loading Indexes...</h2>;

return(
<div>

<h1>Relationship Graph</h1>

<div className="dashboard-grid">

<div className="panel">
<h3>Status</h3>
<p>{data.status}</p>
</div>

<div className="panel">
<h3>Graph Nodes</h3>
<p>{data.nodes}</p>
</div>

</div>

</div>
);

}
