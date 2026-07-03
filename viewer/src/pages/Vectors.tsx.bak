import {useQuery} from "@tanstack/react-query";
import {getIndexes} from "../api/runtime";

export default function Indexes(){

const {data,isLoading}=useQuery({
queryKey:["indexes"],
queryFn:getIndexes,
refetchInterval:3000
});

if(isLoading) return <h2>Loading Indexes...</h2>;

return(
<div>

<h1>Indexes</h1>

<div className="dashboard-grid">

<div className="panel">
<h3>Status</h3>
<p>{data.status}</p>
</div>

<div className="panel">
<h3>Registry Rows</h3>
<p>{data.rows}</p>
</div>

</div>

</div>
);

}
