# FACTORY-MANUAL-V67C.md

## Worker Initialization Law

Before beginning assigned work, every worker shall review:

* Factory Manual
* Foreman Manual
* Worker Manual
* Assigned Worker Role Manual
* Factory Maps
* Relevant Factory Indexes

Workers are expected to understand the overall factory structure before performing lane-specific work.

---

## Knowledge Access Law

Factory knowledge is organized into:

* Manuals
* Maps
* Indexes
* Resources
* Tooling

Workers should consult the smallest relevant source first.

Workers should use indexes and maps to locate information before performing broad searches.

The objective is efficient retrieval, accurate resource selection, and reduced context waste.

---

## Resource Utilization Law

Workers may:

* reference resources
* reuse resources
* clone resources
* adapt resources
* recreate resources
* derive new resources from existing resources

when doing so improves factory output quality.

Workers are not limited to direct creation when a suitable factory resource already exists.

---

## Resource Discovery Law

Workers should begin with:

1. Assigned role responsibilities
2. Relevant indexes
3. Relevant maps
4. Relevant resources

before expanding outward.

Workers should avoid unnecessary exploration of unrelated resource classes.

The goal is targeted retrieval rather than broad searching.

---

## Shared Factory Awareness Law

All workers should understand:

* factory structure
* lineage structure
* promotion structure
* iteration structure
* variant structure
* worker responsibilities
* foreman responsibilities

A worker is not expected to perform every role.

A worker is expected to understand how its role fits into the larger factory.

---

## Factory Lineage Law

All workers shall recognize that outputs may:

* originate from previous products
* originate from previous passes
* originate from variants
* be merged
* be promoted
* be superseded

Lineage exists to preserve continuity while allowing improvement.

Workers should preserve inherited value unless directed otherwise.

---

## Factory Evolution Law

Worker roles may evolve.

Worker responsibilities may evolve.

Factory capabilities may evolve.

Factory structure may evolve.

Factory laws remain stable while implementation details may change.

Workers should follow current manuals, maps, indexes, and role definitions.

---

## Index First Principle

Indexes exist to reduce search cost.

Maps exist to reduce navigation cost.

Workers should prefer indexed discovery over broad discovery whenever possible.

The objective is faster resource identification, improved consistency, and higher quality outputs.

---

## Context Efficiency Principle

Workers should retrieve only the information necessary to perform their assigned work.

More information is not automatically better information.

Accurate retrieval is preferred over excessive retrieval.

The objective is maximum signal and minimum noise.

---

## Factory Intelligence Principle

The factory becomes more capable when workers can quickly locate:

* instructions
* resources
* tooling
* lineage
* references
* prior work

The purpose of manuals, maps, indexes, and role definitions is to make factory intelligence accessible without requiring excessive prompt context.

---

## Runtime-C Filesystem Reference

The verified Runtime-C filesystem structure is:

```text
/opt/eila-os/factory-xyz/runtime-c/                         [EXISTS]
├── FACTORY_XYZ_BOUNDARY.md                                 [EXISTS]
├── RUNTIME_C_ARCHITECTURE.json                             [EXISTS]
├── README_RUNTIME_C.md                                     [EXISTS]
│
├── factory/                                                [NEW]
│   ├── manuals/                                            [NEW]
│   │   ├── 00_FACTORY_MANUAL_V6_7_C.md
│   │   ├── 01_FOREMAN_MANUAL_V6_7_C.md
│   │   ├── 02_WORKER_MANUAL_V6_7_C.md
│   │   ├── WA_HTML_WORKER.md
│   │   ├── WB_CSS_WORKER.md
│   │   ├── WC_JS_WORKER.md
│   │   ├── WD_PRODUCT_MANIFEST_WORKER.md
│   │   ├── WE_REGRESSION_PROOF_WORKER.md
│   │   └── WF_OPERATOR_REVIEW_WORKER.md
│   │
│   ├── indexes/                                            [NEW]
│   │   ├── FACTORY_INDEX.json
│   │   ├── HTML_INDEX.json
│   │   ├── CSS_INDEX.json
│   │   ├── JS_INDEX.json
│   │   ├── ASSETS_INDEX.json
│   │   ├── TEMPLATES_INDEX.json
│   │   ├── TOOLS_INDEX.json
│   │   └── PODS_INDEX.json
│   │
│   └── maps/                                               [NEW]
│       ├── FILESYSTEM_MAP.md
│       ├── WORKSPACE_MAP.md
│       ├── RESOURCE_MAP.md
│       ├── OUTPUT_CONTRACT.md
│       └── RETENTION_POLICY.md
│
├── workspace-seed/                                         [EXISTS]
│   └── factory/                                            [NEW]
│       ├── manuals/                                        [SNAPSHOT SOURCE]
│       ├── indexes/                                        [SNAPSHOT SOURCE]
│       └── maps/                                           [SNAPSHOT SOURCE]
│
├── sandbox/                                                [EXISTS]
│   ├── runs/                                               [EXISTS / CANONICAL]
│   │   └── <run-id>/                                       [GENERATED]
│   │       ├── factory/                                    [SNAPSHOT]
│   │       │   ├── manuals/
│   │       │   ├── indexes/
│   │       │   └── maps/
│   │       ├── toolbelt/                                   [GENERATED]
│   │       │   └── manifest.json
│   │       ├── workspace/                                  [GENERATED SCRATCH]
│   │       ├── tmp/                                        [GENERATED DELETE-LATER]
│   │       │   └── delete_after.json
│   │       ├── output/                                     [KEEP]
│   │       ├── stream/                                     [KEEP]
│   │       ├── proof/                                      [KEEP]
│   │       ├── buildsheet.full.json                        [KEEP]
│   │       ├── POD_RESOLUTION.json                         [KEEP]
│   │       ├── PROMPT_WA.json                              [KEEP]
│   │       ├── LLM_RECEIPT_WA.json                         [KEEP]
│   │       ├── RUN_STATE.json                              [KEEP]
│   │       └── TPS_REPORT.md/json/txt                      [KEEP]
│   │
│   └── artifacts/                                          [EXISTS]
│
├── pods/                                                   [EXISTS]
├── tools/runtime-c-lab/                                    [EXISTS]
├── warehouse/                                              [EXISTS]
├── families/                                               [EXISTS]
├── products/                                               [EXISTS]
├── apps/web-public/                                        [EXISTS]
├── golden/                                                 [EXISTS]
├── restore-points/                                         [EXISTS]
├── quarantine/                                             [EXISTS]
└── runtime-c-runs/                                         [EXISTS / LEGACY EVIDENCE]
```


---

## Factory Index Reference

The current factory index set is larger than the original proposal. Workers and Foremen shall use the following active index files:

```text
factory/indexes/
├── FACTORY_INDEX.json
├── MAP_INDEX.json
├── MANUALS_INDEX.json
├── HTML_INDEX.json
├── CSS_INDEX.json
├── JS_INDEX.json
├── ASSETS_INDEX.json
├── TEMPLATES_INDEX.json
├── TOOLS_INDEX.json
├── PODS_INDEX.json
├── RESOURCES_INDEX.json
├── WAREHOUSE_INDEX.json
├── QWEN_INDEX.json
├── QWEN_BUNDLES_INDEX.json
├── RUN_LAYOUT_INDEX.json
├── WORKSPACE_SEED_INDEX.json
├── RETENTION_INDEX.json
└── OUTPUT_CONTRACT_INDEX.json
```

Index intent:

* `FACTORY_INDEX.json` is the top-level factory index.
* `MAP_INDEX.json` points to the active map documents.
* `MANUALS_INDEX.json` tracks factory and worker manuals.
* `HTML_INDEX.json` is the primary reference for HTML lane discovery.
* `CSS_INDEX.json` is the primary reference for CSS lane discovery.
* `JS_INDEX.json` is the primary reference for JavaScript, TypeScript, JSX, and TSX lane discovery.
* `ASSETS_INDEX.json` points to the master asset warehouse and SQLite catalog.
* `TEMPLATES_INDEX.json` points to template resources.
* `TOOLS_INDEX.json` tracks available tools.
* `PODS_INDEX.json` tracks pod resources.
* `RESOURCES_INDEX.json` points to major resource collections.
* `WAREHOUSE_INDEX.json` summarizes the asset warehouse.
* `QWEN_INDEX.json` points to Qwen retrieval indexes and curated repo packs.
* `QWEN_BUNDLES_INDEX.json` tracks generated retrieval bundles.
* `RUN_LAYOUT_INDEX.json` describes canonical run layout.
* `WORKSPACE_SEED_INDEX.json` describes factory snapshot seed contents.
* `RETENTION_INDEX.json` points to retention policy.
* `OUTPUT_CONTRACT_INDEX.json` points to output and proof rules.


---

## Factory Map Reference

Active map documents:

```text
factory/maps/
├── FILESYSTEM_MAP.md
├── WORKSPACE_MAP.md
├── RESOURCE_MAP.md
├── OUTPUT_CONTRACT.md
└── RETENTION_POLICY.md
```

Map intent:

* `FILESYSTEM_MAP.md` describes Runtime-C roots and navigation.
* `WORKSPACE_MAP.md` describes canonical run workspace layout.
* `RESOURCE_MAP.md` describes asset and Qwen resource locations.
* `OUTPUT_CONTRACT.md` defines keep/delete output expectations.
* `RETENTION_POLICY.md` defines what must not be deleted and what may be cleaned later.


---

## Best Indexers and Retrieval References

Use these references before broad search:

```text
/opt/eila-os/factory-xyz/runtime-c/factory/indexes/FACTORY_INDEX.json
/opt/eila-os/factory-xyz/runtime-c/factory/indexes/MAP_INDEX.json
/opt/eila-os/factory-xyz/runtime-c/factory/indexes/RESOURCES_INDEX.json
/opt/eila-os/factory-xyz/runtime-c/factory/indexes/WAREHOUSE_INDEX.json
/mnt/eila-hot-sidecar/runtime-c-assets/indexes/runtime_c_assets.sqlite
/mnt/eila-hot-sidecar/runtime-c-assets/indexes/ASSET_TREE_MAP.md
/mnt/eila-hot-sidecar/runtime-c-assets/indexes/qwen/QWEN_INDEX_SYSTEM.md
/mnt/eila-hot-sidecar/runtime-c-assets/indexes/qwen/QWEN_TOP_ROOTS.txt
/mnt/eila-hot-sidecar/runtime-c-assets/indexes/qwen/qwen_asset_search.sh
/mnt/eila-hot-sidecar/runtime-c-assets/indexes/qwen/qwen_bundle.sh
```

Preferred retrieval order:

1. Read the assigned role manual.
2. Read `FACTORY_INDEX.json`.
3. Read the lane-specific index.
4. Read `MAP_INDEX.json` and the relevant map.
5. Use Qwen curated indexes for code examples.
6. Use the SQLite asset catalog only when the curated indexes are insufficient.


---

## Lane-Specific Index Rule

* Worker A / WA uses `HTML_INDEX.json` first for HTML structure, semantic markup, page shells, and component assembly references.
* Worker B / WB uses `CSS_INDEX.json` first for styling, layout, themes, responsive behavior, visual systems, and stylesheet references.
* Worker C / WC uses `JS_INDEX.json` first for JavaScript, TypeScript, JSX, TSX, state logic, interaction behavior, and client runtime references.

Workers may also consult `ASSETS_INDEX.json`, `TEMPLATES_INDEX.json`, `QWEN_INDEX.json`, and `WAREHOUSE_INDEX.json` when their lane requires reusable assets, templates, or implementation examples.

---

## Active Factory Index Inventory

The active Runtime-C factory index set is:

```text
factory/indexes/
├── FACTORY_INDEX.json
├── MAP_INDEX.json
├── MANUALS_INDEX.json
├── HTML_INDEX.json
├── CSS_INDEX.json
├── JS_INDEX.json
├── ASSETS_INDEX.json
├── TEMPLATES_INDEX.json
├── TOOLS_INDEX.json
├── PODS_INDEX.json
├── RESOURCES_INDEX.json
├── WAREHOUSE_INDEX.json
├── QWEN_INDEX.json
├── QWEN_BUNDLES_INDEX.json
├── RUN_LAYOUT_INDEX.json
├── WORKSPACE_SEED_INDEX.json
├── RETENTION_INDEX.json
└── OUTPUT_CONTRACT_INDEX.json

Workers shall treat this list as authoritative when it conflicts with older proposed trees.


```
