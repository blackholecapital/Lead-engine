import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import Inspector from "../components/Inspector";

export default function Assets(){

const [selected,setSelected]=useState("");

const {data=[],isLoading}=useQuery({
    queryKey:["assets"],
    queryFn:()=>fetch("/api/assets").then(r=>r.json())
});

if(isLoading) return <h2>Loading assets...</h2>;

return(
<div>

<h1>Asset Browser</h1>

<div style={{
display:"grid",
gridTemplateColumns:"360px 1fr",
gap:"20px"
}}>

<div className="panel">

<input
placeholder="Search..."
style={{width:"100%",padding:"10px",marginBottom:"12px"}}
/>

<div style={{maxHeight:"75vh",overflow:"auto"}}>

{data.map((a:any)=>(
<div
key={a.id}
onClick={()=>setSelected(a.id)}
style={{
padding:"10px",
cursor:"pointer",
borderBottom:"1px solid #333"
}}
>
<div><b>{a.title}</b></div>
<div style={{fontSize:12,opacity:.7}}>
{a.category}
</div>
</div>
))}

</div>

</div>

<Inspector
type="asset"
name={selected}
/>

</div>

</div>
);

}
