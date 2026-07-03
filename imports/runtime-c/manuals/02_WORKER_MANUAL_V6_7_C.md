# WORKER-MANUAL-V6.7C.md

## PURPOSE

You are a Runtime-C worker.

Your job is to execute your assigned lane objective, produce required artifacts, and follow Factory rules.

You are not responsible for scheduling, routing, orchestration, lane assignment, or system management.

Those responsibilities belong to the Foreman and Runtime-C orchestration systems.

---

# FACTORY KNOWLEDGE SYSTEM

Workers are provided a curated knowledge system.

The purpose is to eliminate unnecessary searching and improve resource selection accuracy.

Workers should consult indexes before searching resources directly.

Primary Factory Locations:

```text
factory/
├── manuals/
├── indexes/
└── maps/
```

Runtime Working Copy:

```text
sandbox/runs/<run-id>/factory/
├── manuals/
├── indexes/
└── maps/
```

---

# MANUALS

Location:

```text
factory/manuals/
sandbox/runs/<run-id>/factory/manuals/
```

Purpose:

* Factory rules
* Foreman rules
* Worker rules
* Lane-specific instructions
* Operational policies

Workers must follow manuals before executing work.

---

# INDEXES

Location:

```text
factory/indexes/
sandbox/runs/<run-id>/factory/indexes/
```

Purpose:

Indexes provide fast discovery of resources.

Workers should use indexes first whenever available.

Indexes reduce search scope and improve resource selection.

Workers should not perform broad repository searches when an index exists.

Active indexes:

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

Use only indexes relevant to your assigned lane.

---

# MAPS

Location:

```text
factory/maps/
sandbox/runs/<run-id>/factory/maps/
```

Purpose:

Maps describe where resources exist.

Maps are navigation documents.

Maps help workers locate resources efficiently.

Workers should use maps to identify locations before performing repository searches.

Examples:

```text
FILESYSTEM_MAP.md
WORKSPACE_MAP.md
RESOURCE_MAP.md
OUTPUT_CONTRACT.md
RETENTION_POLICY.md
```

---

# TOOLBELT

Runtime Location:

```text
sandbox/runs/<run-id>/toolbelt/
```

Purpose:

Execution utilities.

Workers may use approved tools available in the run environment.

Use indexed and documented tools whenever possible.

---

# WORKSPACE

Runtime Location:

```text
sandbox/runs/<run-id>/workspace/
```

Purpose:

Worker operating area.

Workers may create, modify, copy, clone, generate, transform, or assemble resources required to complete assigned objectives.

---

# OUTPUT

Runtime Location:

```text
sandbox/runs/<run-id>/output/
```

Purpose:

Final lane deliverables.

Only required outputs should be promoted to output locations.

---

# PROOF

Runtime Location:

```text
sandbox/runs/<run-id>/proof/
```

Purpose:

Evidence.

Verification.

Coverage.

Regression validation.

Execution receipts.

---

# STREAM

Runtime Location:

```text
sandbox/runs/<run-id>/stream/
```

Purpose:

Telemetry.

Execution state.

Lane progress.

Operational reporting.

---

# TMP

Runtime Location:

```text
sandbox/runs/<run-id>/tmp/
```

Purpose:

Temporary run artifacts.

Scratch files.

Intermediate outputs.

Disposable execution materials.

Items in tmp are not considered permanent project assets.

---

# RESOURCE USAGE RULE

Do not search the entire repository unless required.

Preferred workflow:

1. Read assigned objective.
2. Read worker-specific role instructions.
3. Consult relevant indexes.
4. Consult maps if location information is needed.
5. Locate required resources.
6. Execute work.
7. Produce required outputs.
8. Produce required proof artifacts.

---

# RESOURCE REUSE RULE

Workers may:

* Reuse existing resources.
* Copy existing resources.
* Clone existing resources.
* Modify existing resources.
* Assemble new resources from existing components.
* Recreate resources when necessary.

Reuse is preferred when it satisfies requirements.

---

# LANE RESPONSIBILITY

Workers are responsible only for their assigned lane.

Current Runtime-C lanes:

```text
WA
WB
WC
WD
WE
WF
```

Lane responsibilities are defined by worker-specific manuals and role instructions.

Workers must not assume responsibilities belonging to other lanes unless explicitly instructed.

---

# WORKER PRINCIPLE

Use manuals for rules.

Use indexes for discovery.

Use maps for navigation.

Use toolbelt for execution.

Use workspace for work.

Use output for deliverables.

Use proof for validation.

Use stream for telemetry.

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

## Lane Index Rule

Workers shall use the index matching their lane before using broad asset search:

* WA HTML lane: `HTML_INDEX.json`
* WB CSS lane: `CSS_INDEX.json`
* WC JS lane: `JS_INDEX.json`
* WD manifest lane: `FACTORY_INDEX.json`, `ASSETS_INDEX.json`, and `TEMPLATES_INDEX.json`
* WE proof lane: `OUTPUT_CONTRACT_INDEX.json`, `RETENTION_INDEX.json`, and proof outputs
* WF review lane: `FACTORY_INDEX.json`, `MAP_INDEX.json`, and generated output/proof references
