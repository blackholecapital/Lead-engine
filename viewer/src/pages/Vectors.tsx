import {useState} from "react";
import {useQuery} from "@tanstack/react-query";

import AssetCard from "../components/AssetCard";
import Inspector from "../components/Inspector";

export default function Assets(){

const [selected,setSelected]=useState("");

const {data,isLoading}=useQuery({
queryKey:["assets"],
queryFn:()=>fetch("/api/assets").then(r=>r.json())
});

if(isLoading) return <h2>Loading Assets...</h2>;

return(

<div>

<h1>Asset Library</h1>

<div style={{
display:"grid",
gridTemplateColumns:"340px 1fr",
gap:"20px"
}}>

<div
style={{
maxHeight:"80vh",
overflow:"auto"
}}
>

{data.map((asset:any)=>

<AssetCard
key={asset.id}
asset={asset}
onSelect={setSelected}
/>

)}

</div>

<Inspector
type="asset"
name={selected}
/>

</div>

</div>

);

}
