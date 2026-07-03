import Explorer from "../components/Explorer";
import {getRanking} from "../api/runtime";

export default function Ranking(){
return (
<Explorer
title="Ranking"
queryKey="ranking"
queryFn={getRanking}
listField="files"
countField="count"
inspectType="rank"
/>
);
}
