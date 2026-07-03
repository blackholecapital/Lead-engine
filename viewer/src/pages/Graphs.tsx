import AssetWorkbench from "../components/AssetWorkbench";

const getGraphs=()=>fetch("/api/graphs").then(r=>r.json());

export default ()=>(
<AssetWorkbench
title="Graphs"
queryKey="graphs"
queryFn={getGraphs}
listField="files"
countField="nodes"
inspectType="node"
/>
);
