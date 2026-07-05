const fs = require("fs");
const path = require("path");

const INDEX="/mnt/eila-hot-sidecar/tracer-platform/imports/warehouse/generated/asset-browser";

const TYPES={
  ".png":"image/png",
  ".jpg":"image/jpeg",
  ".jpeg":"image/jpeg",
  ".gif":"image/gif",
  ".webp":"image/webp",
  ".svg":"image/svg+xml"
};

module.exports = app => app.get("/api/browser/:id/image",(req,res)=>{

    const metaFile=path.join(INDEX,req.params.id + ".json");

    if(!fs.existsSync(metaFile))
        return res.sendStatus(404);

    const meta=JSON.parse(fs.readFileSync(metaFile,"utf8"));

    const full=path.resolve(meta.root,String(req.query.path || ""));

    if(!fs.existsSync(full))
        return res.sendStatus(404);

    const ext=path.extname(full).toLowerCase();

    res.setHeader(
        "Content-Type",
        TYPES[ext] || "application/octet-stream"
    );

    fs.createReadStream(full)
      .on("error",err=>{
          console.error(err);
          if(!res.headersSent)
              res.sendStatus(500);
      })
      .pipe(res);

});
