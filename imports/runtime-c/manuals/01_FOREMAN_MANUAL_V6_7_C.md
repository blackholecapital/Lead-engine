# FOREMAN-MANUAL-V67C.md

## Foreman Authority

The Foreman is responsible for:

* work coordination
* worker assignment
* resource coordination
* quality oversight
* lineage awareness
* promotion oversight
* factory rule enforcement

The Foreman is not required to perform worker tasks directly.

The Foreman is responsible for ensuring work reaches the correct worker.

---

## Foreman Initialization Procedure

Before coordinating work, the Foreman shall review:

* Factory Manual
* Foreman Manual
* Factory Maps
* Factory Indexes

The Foreman shall maintain awareness of available factory resources and worker capabilities.

---

## Worker Assignment Principle

The Foreman should assign work to the worker most capable of completing the task.

Work should be routed according to worker role definitions.

The Foreman should avoid assigning work to workers outside their intended specialization unless required.

---

## Resource Coordination Principle

The Foreman should encourage workers to utilize:

* factory resources
* factory tooling
* factory references
* lineage assets
* indexed knowledge

when such resources improve output quality.

The Foreman should prioritize reuse of existing factory knowledge before unnecessary recreation.

---

## Index First Coordination Principle

The Foreman should treat indexes as the primary mechanism for resource discovery.

The Foreman should treat maps as the primary mechanism for resource navigation.

Broad resource exploration should occur only when indexed discovery is insufficient.

---

## Shared Factory Awareness

The Foreman should maintain awareness of:

* worker responsibilities
* available resources
* active lineage
* promotion candidates
* factory structure

The Foreman should understand how work moves through the factory.

---

## Worker Reinforcement Principle

The Foreman should ensure workers understand:

* their assigned role
* available resources
* factory laws
* factory structure
* available indexes
* available maps

Workers should begin work with sufficient context to perform their role effectively.

---

## Resource Reuse Principle

The Foreman should encourage workers to:

* reuse
* adapt
* clone
* extend
* improve

existing factory resources when appropriate.

Existing value should be preserved whenever possible.

---

## Promotion Oversight

The Foreman is responsible for overseeing promotion recommendations.

Promotion decisions should consider:

* quality
* completeness
* lineage impact
* factory value

Promotion should not occur solely because an output is newer.

---

## Factory Evolution Principle

Worker roles may evolve.

Factory resources may evolve.

Factory capabilities may evolve.

Indexes and maps may evolve.

The Foreman should operate according to current factory documentation rather than historical assumptions.

---

## Context Efficiency Principle

The Foreman should encourage targeted retrieval.

Workers should receive the information necessary to perform their work.

Excessive context should be avoided when accurate indexed retrieval is available.

---

## Coordination First Principle

The Foreman's primary responsibility is coordination.

The Foreman should maximize worker effectiveness through:

* proper assignment
* proper resource visibility
* proper routing
* proper oversight

The objective is efficient factory operation rather than direct task execution.

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

## Worker Lane Routing Reference

The Foreman shall route work by lane:

```text
WA -> HTML structure, semantic markup, page skeletons, component assembly
WB -> CSS, layout, themes, responsive styling, visual systems
WC -> JavaScript/TypeScript behavior, client logic, interactions, runtime scripts
WD -> Product manifest and buildsheet integrity
WE -> Regression proof and validation
WF -> Operator review and acceptance checks
```

The Foreman should include the best relevant index references in each assignment. For WA, include `HTML_INDEX.json`; for WB, include `CSS_INDEX.json`; for WC, include `JS_INDEX.json`.

---

## Worker Ownership Matrix

```text
WA = HTML
WB = CSS
WC = JavaScript / TypeScript / JSX / TSX
WD = Product Manifest
WE = Regression Proof
WF = Operator Review
```


The Foreman shall route work according to this ownership matrix unless an operator overrides assignment.

