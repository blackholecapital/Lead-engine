import {useState} from "react";
import {useQuery} from "@tanstack/react-query";

export default function ComponentBrowser({repo,data}:{repo:string,data:any}){

const [selected,setSelected]=useState<any>(null);

const q=useQuery({
    queryKey:["component",repo,selected?.path],
    enabled:!!selected,
    queryFn:()=>fetch(
        `/api/component/${repo}/${encodeURIComponent(selected.name)}?path=${encodeURIComponent(selected.path)}`
    ).then(r=>r.json())
});

return(
<div style={{
display:"grid",
gridTemplateColumns:"360px 1fr",
gap:20
}}>

<div style={{
overflow:"auto",
maxHeight:"85vh",
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
background:selected?.path===c.path ? "#202840" : "transparent"
}}
>

<div><b>{c.name}</b></div>

<div style={{
fontSize:11,
opacity:.65,
wordBreak:"break-all"
}}>
{c.path}
</div>

</div>

))}

</div>

<div>

{!selected &&

<div style={{opacity:.5}}>
Select a component.
</div>

}

{selected && q.isLoading &&
<div>Loading…</div>
}

{selected && q.data && (

<>

<h2>{q.data.component.name}</h2>

<div style={{
fontSize:12,
opacity:.65,
marginBottom:20
}}>
{q.data.path}
</div>

<h3>Preview Files</h3>

<pre style={{
background:"#111",
padding:10,
marginBottom:20
}}>
{JSON.stringify(q.data.previewFiles,null,2)}
</pre>

<h3>Imports</h3>

<pre style={{
background:"#111",
padding:10,
marginBottom:20
}}>
{JSON.stringify(q.data.imports,null,2)}
</pre>

<h3>Source</h3>

<pre style={{
background:"#111",
padding:16,
maxHeight:"60vh",
overflow:"auto"
}}>
{q.data.source}
</pre>

</>

)}

</div>

</div>
);

}
