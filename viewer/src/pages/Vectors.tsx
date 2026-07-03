import AssetWorkbench from "../components/AssetWorkbench";
import {getVectors} from "../api/runtime";

export default ()=>(
<AssetWorkbench
title="Vectors"
queryKey="vectors"
queryFn={getVectors}
listField="vectors"
countField="count"
inspectType="vector"
/>
);
