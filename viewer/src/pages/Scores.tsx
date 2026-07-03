import AssetWorkbench from "../components/AssetWorkbench";
import {getScores} from "../api/runtime";

export default ()=>(
<AssetWorkbench
title="Scores"
queryKey="scores"
queryFn={getScores}
listField="files"
countField="count"
inspectType="score"
/>
);
