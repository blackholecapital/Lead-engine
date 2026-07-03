import AssetWorkbench from "../components/AssetWorkbench";
import {getRanking} from "../api/runtime";

export default ()=>(
<AssetWorkbench
title="Ranking"
queryKey="ranking"
queryFn={getRanking}
listField="files"
countField="count"
inspectType="rank"
/>
);
