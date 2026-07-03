import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import Inspector from "./Inspector";

type ExplorerProps={
title:string;
queryKey:string;
queryFn:()=>Promise<any>;
listField:string;
countField:string;
inspectType:string;
};

export default function Explorer({
title,
queryKey,
queryFn,
listField,
countField,
inspectType
}:ExplorerProps){

const [selected,setSelected]=useState("");

const {data,isLoading}=useQuery({
queryKey:[queryKey],
queryFn,
refetchInterval:5000
});

if(isLoading) return <h2>Loading...</h2>;

const list=data?.[listField] ?? [];

return(
<div>

<h1>{title}</h1>

<div style={{
display:"grid",
gridTemplateColumns:"320px 1fr",
gap:"20px"
}}>

<div className="panel">

<h3>{title} ({data?.[countField] ?? list.length})</h3>

<ul style={{listStyle:"none",padding:0}}>
{list.map((item:string)=>(
<li
key={item}
style={{padding:"8px",cursor:"pointer"}}
onClick={()=>setSelected(item)}
>
{item}
</li>
))}
</ul>

</div>

<Inspector
type={inspectType}
name={selected}
/>

</div>

</div>
);

}
