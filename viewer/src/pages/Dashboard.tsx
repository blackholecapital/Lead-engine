import {useRuntime} from "../hooks/useRuntime";

export default function Dashboard(){

const {data}=useRuntime();

if(!data) return <h2>Connecting...</h2>;

return (
<>
<h1>Tracer Runtime</h1>

<pre>
{JSON.stringify(data,null,2)}
</pre>

</>
);

}
