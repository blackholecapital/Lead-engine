import {useQuery} from "@tanstack/react-query";
import {getRetrieval} from "../api/runtime";

export default function Retrieval(){

const {data,isLoading}=useQuery({
queryKey:["retrieval"],
queryFn:getRetrieval,
refetchInterval:3000
});

if(isLoading) return <h2>Loading Retrieval...</h2>;

return(
<div>
<h1>Retrieval Engine</h1>

<div className="dashboard-grid">

<div className="panel">
<h3>Status</h3>
<p>{data.status}</p>
</div>

<div className="panel">
<h3>Documents</h3>
<p>{data.documents}</p>
</div>

<div className="panel">
<h3>Embeddings</h3>
<p>{data.embeddings}</p>
</div>

<div className="panel">
<h3>Queries/sec</h3>
<p>{data.qps}</p>
</div>

</div>
</div>
);
}
