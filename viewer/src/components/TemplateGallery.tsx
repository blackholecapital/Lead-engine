import {useEffect,useState} from "react";
import {useQuery} from "@tanstack/react-query";
import ComponentInspector from "./ComponentInspector";

export default function TemplateGallery({repo}:{repo:string}){

const [selected,setSelected]=useState<any>(null);

const {data,isLoading,error}=useQuery({
    queryKey:["readiness",repo],
    queryFn:()=>fetch(`/api/readiness/${repo}`).then(r=>r.json())
});

useEffect(()=>{
    if(!selected && data?.components?.length)
        setSelected(data.components[0]);
},[data,selected]);

if(isLoading) return <div>Loading...</div>;
if(error) return <pre>{String(error)}</pre>;


return(
<div style={{
display:"grid",
gridTemplateColumns:"360px 1fr",
gap:20
}}>

<div style={{
maxHeight:"85vh",
overflow:"auto",
borderRight:"1px solid #333"
}}>

{data.components.map((c:any)=>(

<div
key={c.path}
onClick={()=>setSelected(c)}
style={{
padding:10,
cursor:"pointer",
borderBottom:"1px solid #333",
background:selected?.path===c.path?"#1f2937":"transparent"
}}>

<div style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center"
}}>

<div style={{
display:"flex",
alignItems:"center"
}}>
<div style={{
width:20,
height:20,
background:
    c.status==="green" ? "lime" :
    c.status==="yellow" ? "gold" :
    "red",
border:"2px solid white",
marginRight:10,
flexShrink:0
}}/>

<b>{c.name}</b>
</div>

<div style={{
fontFamily:"monospace",
fontWeight:"bold"
}}>
{c.score}
</div>

</div>

<div style={{
fontSize:11,
opacity:.65,
marginTop:4,
wordBreak:"break-all"
}}>
{c.path}
</div>

<div style={{
fontSize:10,
opacity:.7,
marginTop:4
}}>
{c.reasons.join(" • ")}
</div>

</div>

))}

</div>

<div>

{selected && (
<ComponentInspector
repo={repo}
name={selected.name}
path={selected.path}
/>
)}

</div>

</div>
);
}
