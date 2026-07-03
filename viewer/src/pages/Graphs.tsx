import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {getGraphs} from "../api/runtime";
import Inspector from "../components/Inspector";

const api="/api";

export default function Graphs(){

const [selected,setSelected]=useState("");

const graph=useQuery({
queryKey:["graphs"],
queryFn:getGraphs,
refetchInterval:5000
});

const nodes=useQuery({
queryKey:["graphNodes"],
queryFn:()=>fetch(`${api}/graphs`).then(r=>r.json())
});

if(graph.isLoading) return <h2>Loading...</h2>;

const list=nodes.data?.files ?? [];

return(
<div>

<h1>Relationship Graph</h1>

<div style={{
display:"grid",
gridTemplateColumns:"320px 1fr",
gap:"20px"
}}>

<div className="panel">

<h3>Nodes ({graph.data.nodes})</h3>

<ul style={{listStyle:"none",padding:0}}>
{list.map((n:string)=>(
<li
key={n}
style={{padding:"8px",cursor:"pointer"}}
onClick={()=>setSelected(n)}
>
{n}
</li>
))}
</ul>

</div>

<Inspector
type="node"
name={selected}
/>

</div>

</div>
);

}
