import {useQuery} from "@tanstack/react-query";
import ComponentBrowser from "./ComponentBrowser";

export default function Inspector({name}:{type:string,name:string}){

const {data,isLoading}=useQuery({
    queryKey:["browser",name],
    queryFn:()=>fetch(`/api/browser/${name}`).then(r=>r.json()),
    enabled:!!name
});

if(!name) return <div className="panel">Select an asset.</div>;
if(isLoading) return <div className="panel">Loading...</div>;

return(
<div className="panel">

<h1>{name}</h1>

<h2>Components ({data.components.length})</h2>

<ComponentBrowser repo={name} data={data}/>

</div>
);
}
