export async function getRuntime(){
 const r=await fetch("http://100.104.23.59:3001/api/runtime");
 return r.json();
}
