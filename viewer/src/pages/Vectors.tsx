import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {getVectors} from "../api/runtime";
import Inspector from "../components/Inspector";

export default function Vectors(){

const [selected,setSelected]=useState("");

const {data,isLoading}=useQuery({
queryKey:["vectors"],
queryFn:getVectors,
refetchInterval:5000
});

if(isLoading) return <h2>Loading...</h2>;

return(
<div>

<h1>Vector Manifests</h1>

<div style={{
display:"grid",
gridTemplateColumns:"320px 1fr",
gap:"20px"
}}>

<div className="panel">

<h3>Vectors ({data.count})</h3>

<ul style={{listStyle:"none",padding:0}}>
{data.vectors.map((v:string)=>(
<li
key={v}
style={{
padding:"8px",
cursor:"pointer"
}}
onClick={()=>setSelected(v)}
>
{v}
</li>
))}
</ul>

</div>

<Inspector
type="vector"
name={selected}
/>

</div>

</div>
);

}
