import {useRuntime} from "../hooks/useRuntime";

export default function Dashboard(){

const {data,isLoading}=useRuntime();

if(isLoading) return <h2>Connecting...</h2>;

const cards=[
["Runtime",data.runtime],
["Hostname",data.hostname],
["CPU",data.cpu],
["Memory",`${data.memory}%`],
["Storage",data.storage],
["Uptime",`${Math.floor(data.uptime/3600)} hrs`]
];

return(
<div>

<h1>Tracer Runtime</h1>

<div className="dashboard-grid">

{cards.map(([k,v])=>(
<div className="panel" key={k}>
<h3>{k}</h3>
<p>{v}</p>
</div>
))}

</div>

</div>
);

}
