import {useEffect,useState} from "react";

export default function Dashboard(){

const [rows,setRows]=useState<any[]>([]);

useEffect(()=>{

fetch("/api/incidents")
.then(r=>r.json())
.then(setRows);

},[]);

return(

<div className="p-8">

<h1 className="text-2xl font-bold mb-6">
Live FDOT Incident Feed
</h1>

<div className="grid gap-4">

{rows.map(row=>(

<div
key={row.id}
className="rounded border border-zinc-700 p-4 bg-zinc-900"
>

<div className="text-base font-semibold">

📍 {row.type}

</div>

<div className="text-sm text-zinc-400 mt-2">

📅 {row.date}

</div>

<div className="mt-2">

🏛 {row.county}

</div>

<div>

🚔 {row.source}

</div>

</div>

))}

</div>

</div>

);

}
