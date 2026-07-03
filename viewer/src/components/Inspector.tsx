import {useQuery} from "@tanstack/react-query";

const api="/api";

export default function Inspector({
type,
name
}:{type:string,name:string}){

const {data,isLoading,error}=useQuery({
queryKey:["inspect",type,name],
queryFn:()=>fetch(`${api}/inspect/${type}/${name}`).then(r=>r.json()),
enabled:!!name
});

if(!name) return <div className="panel">Nothing selected.</div>;
if(isLoading) return <div className="panel">Loading</div>;
if(error) return <div className="panel">Unable to load.</div>;

return(
<div className="panel">
<h3>{name}</h3>
<pre style={{
whiteSpace:"pre-wrap",
fontSize:12,
overflow:"auto",
maxHeight:"70vh"
}}>
{JSON.stringify(data,null,2)}
</pre>
</div>
);

}
