import { useEffect, useState } from "react";

type Incident = {
  id: number;
  type: string;
  date: string;
  county: string;
  status: string;
  source: string;
};

export default function Dashboard() {

  const [rows,setRows] = useState<Incident[]>([]);
  const [loading,setLoading] = useState(true);

  useEffect(() => {

    fetch((import.meta.env.VITE_API_URL || "http://127.0.0.1:8000") + "/incidents")
      .then(r=>r.json())
      .then(data=>{
        setRows(data);
        setLoading(false);
      });

  },[]);

  return (

<div className="p-8">

<h1 className="text-4xl font-bold mb-6">
Lead Intelligence Feed
</h1>

<div className="rounded-lg border border-zinc-700 overflow-hidden">

<table className="w-full">

<thead className="bg-zinc-900">

<tr>

<th className="text-left p-3">Location</th>
<th className="text-left p-3">Date</th>
<th className="text-left p-3">County</th>
<th className="text-left p-3">Status</th>
<th className="text-left p-3">Source</th>

</tr>

</thead>

<tbody>

{loading &&

<tr>

<td className="p-4" colSpan={5}>
Loading...
</td>

</tr>

}

{rows.map(row=>(

<tr
key={row.id}
className="border-t border-zinc-800 hover:bg-zinc-900"
>

<td className="p-3">{row.type}</td>

<td className="p-3">{row.date}</td>

<td className="p-3">{row.county || "Hillsborough"}</td>

<td className="p-3">

<span className="rounded bg-green-700 px-2 py-1 text-xs">
{row.status || "Crash"}
</span>

</td>

<td className="p-3">{row.source}</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

);

}
