import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import ComponentBrowser from "./ComponentBrowser";

export default function FeatureBrowser({repo}:{repo:string}){

const [feature,setFeature]=useState("");

const {data}=useQuery({
    queryKey:["features",repo],
    queryFn:()=>fetch(`/api/features/${repo}`).then(r=>r.json())
});

if(!data) return null;

const features=Object.entries(data.features);

return(
<div style={{display:"grid",gridTemplateColumns:"240px 1fr",gap:"20px"}}>

<div>

{features.map(([name,list]:any)=>(
<div
key={name}
onClick={()=>setFeature(name)}
style={{
cursor:"pointer",
padding:"8px",
borderBottom:"1px solid #333"
}}
>
{name} ({list.length})
</div>
))}

</div>

<div>

{feature &&
<ComponentBrowser
repo={repo}
data={{
components:data.features[feature]
}}
/>
}

</div>

</div>
);

}
