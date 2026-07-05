import {useState} from "react";
import ComponentInspector from "./ComponentInspector";

export default function ComponentBrowser({repo,data}:{repo:string,data:any}){

const [selected,setSelected]=useState<any>(null);

return(
<div style={{display:"grid",gridTemplateColumns:"360px 1fr",gap:"20px"}}>

<div style={{maxHeight:"80vh",overflow:"auto"}}>

{data.components.map((c:any)=>(
<div
key={c.path || c.name}
onClick={()=>setSelected(c)}
style={{
padding:"8px",
cursor:"pointer",
borderBottom:"1px solid #333",
background:selected?.path===c.path?"#1f2937":"transparent"
}}
>
<b>{c.name}</b>

<div style={{fontSize:11,opacity:.7,wordBreak:"break-all"}}>
{c.path}
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
