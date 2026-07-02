import {useQuery} from "@tanstack/react-query";
import {getStorage} from "../api/runtime";

export default function Storage(){

const {data,isLoading}=useQuery({
queryKey:["storage"],
queryFn:getStorage,
refetchInterval:5000
});

if(isLoading) return <h2>Loading Storage...</h2>;

return(
<div>
<h1>Storage</h1>

<div className="dashboard-grid">

<div className="panel"><h3>Total</h3><p>{data.total}</p></div>
<div className="panel"><h3>Used</h3><p>{data.used}</p></div>
<div className="panel"><h3>Free</h3><p>{data.free}</p></div>
<div className="panel"><h3>Usage</h3><p>{data.percent}%</p></div>

</div>
</div>
);
}
