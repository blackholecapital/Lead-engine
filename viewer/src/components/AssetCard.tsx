type Asset={
  id:string;
  title:string;
  category:string;
  tags:string[];
};

export default function AssetCard({
  asset,
  onSelect
}:{
  asset:Asset;
  onSelect:(id:string)=>void;
}){

return(
<div
className="panel"
style={{cursor:"pointer",marginBottom:"12px"}}
onClick={()=>onSelect(asset.id)}
>

<h3>{asset.title}</h3>

<p>{asset.category}</p>

<p style={{
fontSize:"12px",
opacity:.7
}}>
{asset.tags.join(" • ")}
</p>

</div>
);

}
