const fs = require("fs");
const path = require("path");

const ROOT =
"/mnt/eila-hot-sidecar/Tracer-Dev/imports/warehouse/generated/asset-browser";

module.exports = app =>

app.get("/api/browser/:id", (req, res) => {

    const file = path.join(ROOT, req.params.id + ".json");

    if (!fs.existsSync(file))
        return res.status(404).json({ error: "missing" });

    const browser = JSON.parse(fs.readFileSync(file, "utf8"));

    if (Array.isArray(browser.components)) {

        browser.components = browser.components.map(c => {

            if (typeof c === "string") {

                return {
                    name: path.basename(c),
                    path: c
                };

            }

            return {
                name: c.name || path.basename(c.path || ""),
                path: c.path || ""
            };

        });

    }

    res.json(browser);

});
