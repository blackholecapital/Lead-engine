# WD_PRODUCT_MANIFEST_WORKER.md

## Role

Worker D owns product manifests, asset lineage, buildsheet metadata, and output package descriptions.

## Required Reading

- 00_FACTORY_MANUAL_V6_7_C.md
- 01_FOREMAN_MANUAL_V6_7_C.md
- 02_WORKER_MANUAL_V6_7_C.md

## Required Index References

- FACTORY_INDEX.json
- ASSETS_INDEX.json
- TEMPLATES_INDEX.json
- WAREHOUSE_INDEX.json
- RESOURCES_INDEX.json
- QWEN_INDEX.json
- runtime_c_assets.sqlite
- QWEN_TOP_ROOTS.txt

## Output Rule

- sandbox/runs/<run-id>/output/
- sandbox/runs/<run-id>/proof/

## Boundary

WD references outputs from WA/WB/WC but does not implement HTML, CSS, or JS.
