import {useQuery} from "@tanstack/react-query";

export default function ComponentInspector({
  repo,
  name,
  path,
}:{
  repo:string;
  name:string;
  path:string;
}) {
  const {data,isLoading,error}=useQuery({
    queryKey:["component",repo,path],
    queryFn:()=>fetch(
      `/api/component/${repo}/${encodeURIComponent(name)}?path=${encodeURIComponent(path)}`
    ).then(r=>r.json())
  });

  if(isLoading) return <div>Loading...</div>;
  if(error) return <pre>{String(error)}</pre>;
  if(!data) return <div>No component data.</div>;

  return(
    <div style={{marginTop:20}}>
      <h2>{data.component.name}</h2>
      <div style={{fontSize:12,opacity:.7,wordBreak:"break-all"}}>
        {data.path}
      </div>

      <h3>Preview Files</h3>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:20}}>
        {(data.previewFiles||[]).map((f:string)=>(
          <div
            key={f}
            style={{
              fontFamily:"monospace",
              padding:"6px 10px",
              border:"1px solid #333",
              borderRadius:6,
              background:"#181818"
            }}
          >
            {f}
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"320px 1fr",gap:20}}>
        <div>
          <h3>Related</h3>
          <div style={{maxHeight:300,overflow:"auto"}}>
            {(data.related||[]).map((r:any)=>(
              <div key={r.path}>{r.name}</div>
            ))}
          </div>

          <h3 style={{marginTop:20}}>Imports</h3>
          <div style={{fontFamily:"monospace",fontSize:12,maxHeight:300,overflow:"auto"}}>
            {(data.imports||[]).map((i:string)=>(
              <div key={i}>{i}</div>
            ))}
          </div>
        </div>

        <div>
          <h3>Source</h3>
          <pre style={{
            background:"#111",
            padding:16,
            overflow:"auto",
            maxHeight:"80vh",
            fontSize:12
          }}>
            {data.source}
          </pre>
        </div>
      </div>
    </div>
  );
}
