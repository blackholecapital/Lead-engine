import Explorer from "./Explorer";

type Props={
    title:string;
    queryKey:string;
    queryFn:()=>Promise<any>;
    listField:string;
    countField:string;
    inspectType:string;
};

export default function AssetWorkbench(props:Props){
    return <Explorer {...props} />;
}
