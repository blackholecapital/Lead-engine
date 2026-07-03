# WORKSPACE_MAP

Canonical run root:
/opt/eila-os/factory-xyz/runtime-c/sandbox/runs/<run-id>

Run layout:
- factory/manuals       snapshot
- factory/indexes       snapshot
- factory/maps          snapshot
- toolbelt/manifest.json
- workspace/            scratch
- tmp/delete_after.json delete-later
- output/               keep
- stream/               keep
- proof/                keep
- buildsheet.full.json  keep
- POD_RESOLUTION.json   keep
- PROMPT_WA.json        keep
- LLM_RECEIPT_WA.json   keep
- RUN_STATE.json        keep
- TPS_REPORT.*          keep

Workspace seed:
/opt/eila-os/factory-xyz/runtime-c/workspace-seed/factory
