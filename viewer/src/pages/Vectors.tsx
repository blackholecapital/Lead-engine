import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {getVectors} from "../api/runtime";

const api="/api";

export default function Vectors(){
const [selected,setSelected]=useState("lancedb.vector.json");
const {data,isLoading}=useQuery({queryKey:["vectors"],queryFn:getVectors,refetchInterval:5000});
const detail=useQuery({
queryKey:["inspect","vector",selected],
queryFn:()=>fetch(`${api}/inspect/vector/${selected}`).then(r=>r.json()),
enabled:!!selected
});

if(isLoading) return <h2>Loading Vectors...</h2>;

return <div>
<h1>Vector Manifests</h1>
<div className="dashboard-grid">
<div className="panel"><h3>Status</h3><p>{data.status}</p></div>
<div className="panel"><h3>Vector Count</h3><p>{data.count}</p></div>
</div>
<div className="dashboard-grid">
<div className="panel">
<h3>Manifests</h3>
<ul>{data.vectors?.map((v:string)=><li key={v} onClick={()=>setSelected(v)} style={{cursor:"pointer",margin:"8px 0"}}>{v}</li>)}</ul>
</div>
<div className="panel">
<h3>{selected}</h3>
<pre style={{whiteSpace:"pre-wrap",fontSize:"12px"}}>{JSON.stringify(detail.data,null,2)}</pre>
</div>
</div>
</div>;
}
