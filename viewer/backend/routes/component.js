const fs = require("fs");
const path = require("path");

const COMPONENTS = "/mnt/eila-hot-sidecar/Tracer-Dev/imports/warehouse/generated/component-catalog";
const BROWSER = "/mnt/eila-hot-sidecar/Tracer-Dev/imports/warehouse/generated/asset-browser";

module.exports = app => app.get("/api/component/:repo/:name", (req, res) => {
  const repo = req.params.repo;
  const requestedPath = decodeURIComponent(req.query.path || "");
  const requestedName = decodeURIComponent(req.params.name || "");

  const compFile = path.join(COMPONENTS, repo + ".json");
  const browserFile = path.join(BROWSER, repo + ".json");

  let catalog = { components: [] };
  if (fs.existsSync(compFile)) {
    catalog = JSON.parse(fs.readFileSync(compFile, "utf8"));
  }

  let browser = {};
  if (fs.existsSync(browserFile)) {
    browser = JSON.parse(fs.readFileSync(browserFile, "utf8"));
  }

  let component =
    catalog.components.find(c => c.path === requestedPath) ||
    catalog.components.find(c => c.name === requestedName) ||
    null;

  if (!component && requestedPath) {
    component = {
      name: path.basename(requestedPath),
      path: requestedPath,
      story: /\.story\./i.test(requestedPath)
    };
  }

  if (!component) {
    return res.status(404).json({
      error: "component_not_found",
      repo,
      requestedName,
      requestedPath
    });
  }

  const repoRoot =
    browser.root ||
    catalog.root ||
    "/mnt/eila-hot-sidecar/factory-xyz/runtime-c-assets/vendor-source";

  const sourcePath = path.join(repoRoot, component.path);

  let source = "";
  if (fs.existsSync(sourcePath)) {
    source = fs.readFileSync(sourcePath, "utf8");
  }

  const imports = [...source.matchAll(/import .*?['"](.*?)['"]/g)].map(x => x[1]);

  const images = Array.isArray(browser.images)
    ? browser.images.filter(img => {
        const n = path.basename(img).toLowerCase();
        return source.toLowerCase().includes(n);
      })
    : [];

  const related = Array.isArray(catalog.components)
    ? catalog.components
        .filter(c =>
          c.path &&
          component.path &&
          c.path.split("/").slice(0, -1).join("/") ===
            component.path.split("/").slice(0, -1).join("/")
        )
        .slice(0, 50)
    : [];

  let previewFiles = [];
  const componentDir = path.dirname(sourcePath);

  if (fs.existsSync(componentDir)) {
    previewFiles = fs.readdirSync(componentDir)
      .filter(f => /\.(vue|tsx|jsx|ts|js|png|jpg|jpeg|gif|svg|webp)$/i.test(f))
      .sort();
  }

  res.json({
    component,
    path: component.path,
    sourcePath,
    source,
    imports,
    images,
    related,
    previewFiles
  });
});
