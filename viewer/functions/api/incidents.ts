export async function onRequestGet() {

  const url =
    "https://gis.fdot.gov/arcgis/rest/services/Crashes_All/FeatureServer/0/query" +
    "?where=COUNTY_TXT='Hillsborough'" +
    "&outFields=CRASH_DATE,ON_ROADWAY_NAME,INT_ROADWAY_NAME,COUNTY_TXT" +
    "&returnGeometry=false" +
    "&resultRecordCount=25" +
    "&orderByFields=CRASH_DATE DESC" +
    "&f=json";

  const r = await fetch(url);

  const data = await r.json();

  const rows = (data.features || []).map((f:any,i:number)=>{

    const a = f.attributes;

    return {

      id:i+1,

      type:
        (a.ON_ROADWAY_NAME || "") +
        (a.INT_ROADWAY_NAME
          ? " @ " + a.INT_ROADWAY_NAME
          : ""),

      county:a.COUNTY_TXT || "Hillsborough",

      date:new Date(a.CRASH_DATE).toLocaleString(),

      status:"Crash",

      source:"FDOT"

    };

  });

  return Response.json(rows);

}
