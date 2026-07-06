import {useQuery} from "@tanstack/react-query";
import ComponentBrowser from "./ComponentBrowser";

export default function Inspector({name}:{type:string,name:string}){

const {data,isLoading,error}=useQuery({
    queryKey:["browser",name],
    enabled:!!name,
    queryFn:async()=>{
        const r=await fetch(`/api/browser/${name}`);
        if(!r.ok) throw new Error(await r.text());
        return r.json();
    }
});

if(!name) return <div className="panel">Select an asset.</div>;
if(isLoading) return <div className="panel">Loading...</div>;
if(error) return <pre>{String(error)}</pre>;
if(!data) return <div className="panel">No data.</div>;
if(!Array.isArray(data.components))
    return <pre>{JSON.stringify(data,null,2)}</pre>;

return(
<div className="panel">

<h1>{name}</h1>

<h2>Components ({data.components.length})</h2>

<ComponentBrowser
    repo={name}
    data={data}
/>

</div>
);

}
