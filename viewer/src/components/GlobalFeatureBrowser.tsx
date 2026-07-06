import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import ComponentBrowser from "./ComponentBrowser";

const repos=[
"chatwoot",
"novu",
"postiz",
"listmonk",
"cal-com"
];

export default function GlobalFeatureBrowser(){

const [feature,setFeature]=useState("");
const [repo,setRepo]=useState("");

const features=useQuery({
queryKey:["global-features"],
queryFn:()=>fetch("/api/features").then(r=>r.json())
});

const components=useQuery({
queryKey:["global",feature,repo],
enabled:!!feature,
queryFn:()=>fetch(
`/api/features/global/${feature}?repo=${repo}`
).then(r=>r.json())
});

return(
<div style={{display:"grid",gridTemplateColumns:"220px 180px 1fr",gap:"20px"}}>

<div>

{features.data?.map((f:any)=>(
<div
key={f.feature}
style={{cursor:"pointer",padding:8}}
onClick={()=>setFeature(f.feature)}
>
{f.feature} ({f.count})
</div>
))}

</div>

<div>

{repos.map(r=>(
<div
key={r}
style={{cursor:"pointer",padding:8}}
onClick={()=>setRepo(r)}
>
{r}
</div>
))}

</div>

<div>

{components.data &&
<ComponentBrowser
repo={repo}
data={{
components:components.data.components
}}
/>
}

</div>

</div>
);

}
