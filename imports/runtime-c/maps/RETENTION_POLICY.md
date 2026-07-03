# RETENTION_POLICY

Keep permanently:
- factory/manuals
- factory/indexes
- factory/maps
- sandbox/runs/*/output
- sandbox/runs/*/stream
- sandbox/runs/*/proof
- buildsheet.full.json
- POD_RESOLUTION.json
- RUN_STATE.json
- TPS_REPORT.*

Snapshot:
- workspace-seed/factory/manuals
- workspace-seed/factory/indexes
- workspace-seed/factory/maps

Delete candidates:
- sandbox/runs/*/tmp
- tmp/delete_after.json targets
- caches
- failed transient workspaces

Do not delete:
- /mnt/eila-hot-sidecar/runtime-c-assets
- /mnt/eila-hot-sidecar/runtime-c-assets/indexes
- /mnt/eila-hot-sidecar/runtime-c-assets/registries
