const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/api/runtime", (req, res) => {
  res.json({
    runtime: "online",
    agents: 0,
    warehouse: "ready",
    storage: "48 GB",
    indexes: "healthy",
    cpu: 0,
    memory: 0,
    timestamp: Date.now()
  });
});

app.listen(9090, "0.0.0.0", () => {
  console.log("Tracer Runtime API listening on http://0.0.0.0:9090");
});
