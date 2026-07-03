# Runtime C Stage Matrix

| Stage | Terminal state | Purpose |
|---|---|---|
| sim | completed_sim | Full simulator smoke path |
| prompt_only | PROMPT_READY | Real adapter prompt/pod command plan only |
| execute_dry | EXECUTE_DRY_COMPLETE | Execute safe pod commands and receipts |
| wa_only | WA_ARTIFACTS_PASS | WA_ARTIFACTS_BLOCKED | WA artifact gate |
| wa_wb_only | WA_WB_CLASS_GATE_PASS | WA/WB class handoff + policy |
| wa_wb_wc_only | WA_WB_WC_GATE_PASS | WA/WB/WC + JS syntax |
| artifact_smoke_full | FULL_ARTIFACT_SMOKE_PASS | Six-lane controlled artifact run |
| streaming | STREAMING_PASS | STREAMING_BLOCK | Future hybrid streaming run |

FINAL_STATUS=PASS
