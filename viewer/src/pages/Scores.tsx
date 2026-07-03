import Explorer from "../components/Explorer";
import {getScores} from "../api/runtime";

export default function Scores(){
return (
<Explorer
title="Scores"
queryKey="scores"
queryFn={getScores}
listField="files"
countField="count"
inspectType="score"
/>
);
}
