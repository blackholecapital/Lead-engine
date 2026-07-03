import {useQuery} from "@tanstack/react-query";

const assetId=(name:string)=>name.replace(/\.(vector|rank|score|node)\.json$/,"").replace(/\.json$/,"");

export default function Inspector({name}:{type:string,name:string}){

const id=assetId(name);

const {data,isLoading}=useQuery({
queryKey:["related",id],
queryFn:()=>fetch(`/api/related/${id}`).then(r=>r.json()),
enabled:!!id
});

if(!name) return <div className="panel">Nothing selected.</div>;
if(isLoading) return <div className="panel">Loading...</div>;

return <div className="panel">
<h2>{id}</h2>
<p><b>Title:</b> {data?.vector?.data?.title || data?.node?.data?.label || id}</p>
<p><b>Category:</b> {data?.vector?.data?.category || data?.node?.data?.category || "unknown"}</p>
<p><b>Tags:</b> {(data?.vector?.data?.tags || data?.node?.data?.tags || []).join(", ")}</p>

<h3>Ranking</h3>
<pre>{JSON.stringify(data?.rank?.data?.ranking || {},null,2)}</pre>

<h3>Score</h3>
<pre>{JSON.stringify(data?.score?.data || {},null,2)}</pre>

<h3>Graph Node</h3>
<pre>{JSON.stringify(data?.node?.data || {},null,2)}</pre>

<details>
<summary>Raw Asset JSON</summary>
<pre style={{whiteSpace:"pre-wrap",fontSize:12}}>{JSON.stringify(data,null,2)}</pre>
</details>
</div>;
}
