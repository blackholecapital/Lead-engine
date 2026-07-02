import {useQuery} from "@tanstack/react-query";
import {getReview} from "../api/runtime";

export default function ReviewCenter(){

const {data,isLoading}=useQuery({
queryKey:["review"],
queryFn:getReview,
refetchInterval:3000
});

if(isLoading) return <h2>Loading Review Center...</h2>;

return(
<div>
<h1>Review Center</h1>

<div className="dashboard-grid">

<div className="panel">
<h3>Status</h3>
<p>{data.status}</p>
</div>

<div className="panel">
<h3>Pending Reviews</h3>
<p>{data.pending}</p>
</div>

<div className="panel">
<h3>Files</h3>
<p>{data.files}</p>
</div>

</div>
</div>
);
}
