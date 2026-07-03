import {useState} from "react";
import {useQuery} from "@tanstack/react-query";

export default function ComponentBrowser({repo,data}:{repo:string,data:any}){

const [selected,setSelected]=useState<any>(null);

const details=useQuery({
    queryKey:["component",repo,selected?.name],
    enabled:!!selected,
    queryFn:()=>fetch(
        `/api/component/${repo}/${encodeURIComponent(selected.name)}`
    ).then(r=>r.json())
});

return(
<div style={{display:"grid",gridTemplateColumns:"360px 1fr",gap:"20px"}}>

<div style={{maxHeight:"80vh",overflow:"auto"}}>

{data.components.map((c:any)=>(
<div
key={c.name}
onClick={()=>setSelected(c)}
style={{
padding:"8px",
cursor:"pointer",
borderBottom:"1px solid #333"
}}
>
<b>{c.name}</b>

<div style={{fontSize:11,opacity:.7}}>
{c.path}
</div>

</div>
))}

</div>

<div>

{selected && details.data && (

<>

<h2>{details.data.component}</h2>

<p>{details.data.path}</p>

<pre
style={{
background:"#111",
padding:"15px",
overflow:"auto",
maxHeight:"75vh",
fontSize:12
}}
>
{details.data.source}
</pre>

</>

)}

</div>

</div>
);
}
