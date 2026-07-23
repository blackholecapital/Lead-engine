# Tracer AI / Runtime-C Asset Warehouse Handoff

Generated: 2026-06-20  
Primary active root: `/opt/eila-os/factory-xyz`  
Primary active warehouse: `/opt/eila-os/factory-xyz/runtime-c-assets`  
Legacy / larger asset corpus: `/mnt/eila-hot-sidecar/runtime-c-assets`

---

## 1. Executive Summary

Tracer AI is the resource-intelligence layer being built in front of Runtime-C and Factory XYZ.

It is not a basic file search. It is designed to take raw repositories, codebases, document packs, dashboards, templates, workflow platforms, graph systems, vector stores, and later customer databases, then convert them into:

- tagged assets
- scored assets
- content-aware review cards
- explainable promotion candidates
- graph-connected relationships
- vector-ready corpus rows
- Runtime-C resource bundles
- optional AI-assisted assembly instructions

The intended operating model:

```text
RAW SOURCES
  ↓
SCAN
  ↓
CLASSIFY
  ↓
VALUE SCORE
  ↓
FINGERPRINT
  ↓
CONTENT SAMPLE
  ↓
CONTENT MANIFEST
  ↓
REVIEW CARD
  ↓
AUTO TAG
  ↓
APPROVAL / REJECTION
  ↓
EXPLANATION
  ↓
PROMOTION CANDIDATE
  ↓
GOLDEN / CORPUS / VECTOR / GRAPH
  ↓
TRACER SEARCH
  ↓
RESOURCE BUNDLE
  ↓
RUNTIME-C ASSEMBLY
```

The key design rule: **do not promote assets based on filename alone.** Filename/path intelligence is bootstrap only. Final promotion should require content inspection, tags, scores, explanations, and review state.

---

## 2. Product Split

Use these names consistently:

```text
Runtime-C Retrieval Engine v2
  Retrieval / index / corpus / vector / graph pipeline.

Tracer Core
  Asset discovery, classification, scoring, review, bundle generation.

Tracer Graph
  Graph nodes, edges, dependency graph, feature graph, relationship layer.

Tracer AI
  Optional local-AI resource brain that queries Tracer, creates bundles, and hands off to Runtime-C.

Ollama Adapter
  Local model connector layer for Qwen / DeepSeek / Ollama pods.

Factory XYZ Warehouse
  Permanent asset warehouse Tracer operates on.
```

Mental model:

```text
Tracer AI  = resource brain
Runtime-C  = assembly body
Factory XYZ = production line
Warehouse = memory + parts vault
```

---

## 3. Canonical Roots

### Factory XYZ root

```bash
/opt/eila-os/factory-xyz
```

### Active warehouse

```bash
/opt/eila-os/factory-xyz/runtime-c-assets
```

### Larger legacy corpus

```bash
/mnt/eila-hot-sidecar/runtime-c-assets
```

Known large legacy areas:

```text
10-clmm-trading-lab        ~3.6G
11-rapid-prototypes        ~909M
admin-frameworks           ~283M
bi-reporting               ~892M
blockchain-reference       ~1.1G
crm-platforms              ~1.1G
crm-reference              ~638M
dashboard-patterns         ~784M
dashboard-templates        ~233M
data-admin                 ~604M
design-systems             ~642M
indexes                    ~2.6G
photos                     ~21G
registries                 ~782M
templates                  ~1.4G
ui-specialized             ~1004M
web3-clmm                  ~3.2G
workflow-platforms         ~2.4G
```

### Runtime-C products

```bash
/opt/eila-os/factory-xyz/runtime-c/products
```

Initialized product dirs:

```text
runtime-c-retrieval-v2/
tracer-core/
tracer-graph/
tracer-ai/
switchboard-ingestion-pipeline/
```

Each has:

```text
docs/
manifests/
src/
examples/
tests/
deploy/
```

### Runtime-C warehouse retrieval

```bash
/opt/eila-os/factory-xyz/runtime-c/warehouse/retrieval
```

Known files/folders include:

```text
BUNDLE_PRIORITY.json
CLMM_EXTRA_LANCEDB_ROWS.json
CLMM_EXTRA_REPOS.json
CLMM_EXTRA_RESOURCE_REGISTRY.txt
corpus/runtime_c_assets.seed.json
GOLDEN_COLLECTION.jsonl
GOLDEN_DISCOVERY.txt
GOLDEN_LANCEDB_ROWS.json
GOLDEN_MANIFESTS.txt
GOLDEN_MODULES.txt
GOLDEN_REGISTRIES.txt
GOLDEN_SAMPLE.txt
ingestion-protocols/CUSTOMER_DATABASE_INGESTION_V1.md
lancedb/
graph/
edge-graph/
customer-ingestion/
```

---

## 4. Ollama / Pod Resource Map

Known local/remote model layout:

```text
Pod A
Purpose: Large generation
Resource: http://100.105.163.20:11435
Model: qwen3
Host: DESKTOP-94COG4S

Pod B
Purpose: Heavy coder
Resource: http://100.105.163.20:11434
Model: qwen2.5-coder:32b
Host: DESKTOP-94COG4S

Pod C
Purpose: Local fallback / Blackhole compute
Resource: http://127.0.0.1:11434
Model: qwen2.5-coder:14b
Host: xyz-factory
Status: CORRECT
```

Runtime-C rule from golden lock:

```text
Routing should resolve by POD_RESOLUTION.
Do not override pod routing during production.
```

---

## 5. Active Warehouse Tree

Active warehouse root:

```bash
/opt/eila-os/factory-xyz/runtime-c-assets
```

Core layout:

```text
runtime-c-assets/
├── assembly-packs
├── crm-resource-packs
├── harvested-assets
├── manifests
├── metadata
├── product-packs
├── promoted-assets
├── review-center
├── tools
├── vector-seeds
└── vendor-source
```

Vendor source categories:

```text
vendor-source/
├── ai
├── calendar
├── comms
├── documents
├── email
├── esign
├── graph
├── marketing
├── ollama
├── retrieval
├── scoring
├── sms
├── social
├── tagging
├── templates
├── treasury
└── workspace
```

Assembly packs:

```text
assembly-packs/
├── ollama-adapter
│   ├── configs
│   ├── pods
│   └── routing
├── tracer-ai
│   ├── deepseek
│   ├── docs
│   ├── ollama
│   ├── prompts
│   ├── providers
│   ├── qwen
│   └── retrieval-adapters
├── tracer-core
│   ├── corpus
│   ├── docs
│   ├── goldens
│   ├── manifests
│   ├── resource-packs
│   ├── retrieval-engine
│   ├── search
│   └── vectors
├── tracer-graph
│   ├── adapters
│   ├── docs
│   ├── edges
│   ├── nodes
│   ├── relationships
│   ├── schemas
│   └── supabase
└── vector-ingestion
    ├── docs
    │   └── INGESTION_PIPELINE.md
    ├── manifests
    ├── pipeline
    ├── scoring
    └── tagging
```

---

## 6. Vendor Repositories Downloaded

Tracked vendor repo set: 15.

```text
comms/chatwoot       ~390M
comms/listmonk        ~59M
comms/novu           ~378M
documents/documenso  ~366M
graph/apache-age      ~63M
graph/memgraph       ~162M
marketing/postiz      ~67M
retrieval/lancedb     ~48M
retrieval/qdrant      ~90M
scoring/flexsearch
scoring/fusejs
scoring/fuzzysort
tagging/tagify        ~27M
treasury/rotki       ~782M
workspace/cal-com     ~1.4G
```

Failed / replaced repos:

```text
Postiz old repo failed:
https://github.com/Postiz/postiz-app.git

Correct Postiz:
https://github.com/gitroomhq/postiz-app.git

Debridge portfolio failed:
https://github.com/debridge-finance/portfolio.git

Debank API failed:
https://github.com/debankdev/debank-open-api.git

Treasury replacement:
https://github.com/rotki/rotki.git
```

Bootstrap vendor tags:

```json
{
  "novu":["comms","email","sms","workflow","notification"],
  "chatwoot":["comms","crm","support","inbox"],
  "listmonk":["email","campaign","marketing"],
  "postiz":["social","marketing","publishing"],
  "cal-com":["calendar","workspace","booking"],
  "documenso":["documents","esign","workflow"],
  "rotki":["treasury","defi","portfolio"],
  "lancedb":["vector","retrieval"],
  "qdrant":["vector","retrieval"],
  "memgraph":["graph","relationships"],
  "apache-age":["graph","postgres"],
  "tagify":["tagging","ui"],
  "flexsearch":["search","ranking"],
  "fuzzysort":["search","scoring"]
}
```

---

## 7. Metadata Structure

```text
metadata/
├── assets
├── build-requests
├── build-results
├── generated
├── graphs
├── previews
├── ranking
├── scores
├── states
├── tags
├── temp-resource-bundles
└── alignment
```

Important schemas created:

```text
metadata/build-requests/BUILD_REQUEST_SCHEMA.json
metadata/temp-resource-bundles/BUNDLE_SCHEMA.json
metadata/build-results/BUILD_RESULT_SCHEMA.json
metadata/states/ASSET_STATES.json
metadata/scores/SCORE_MODEL.md
metadata/assets/ASSET_CLASSIFICATION.md
metadata/WAREHOUSE_ENGINE_MODEL.md
```

### Build request schema

```json
{
  "request_id": "",
  "title": "",
  "objective": "",
  "product_type": "",
  "constraints": [],
  "required_tags": [],
  "excluded_tags": [],
  "target_stack": [],
  "priority": "normal",
  "created_at": ""
}
```

### Bundle schema

```json
{
  "bundle_id": "",
  "request_id": "",
  "selected_assets": [],
  "selected_templates": [],
  "selected_components": [],
  "selected_workflows": [],
  "tags": [],
  "scores": {},
  "graph_links": [],
  "instructions": ""
}
```

### Runtime handoff model

```text
request
-> Tracer AI resource selection
-> temp resource bundle
-> Runtime-C orchestration
-> generated artifact
-> review center
-> promoted product
```

---

## 8. Review Center

Review center path:

```bash
runtime-c-assets/review-center
```

Tree:

```text
review-center/
├── incoming
├── preview
│   ├── component
│   ├── components
│   ├── docs
│   ├── html
│   ├── icons
│   ├── image
│   ├── images
│   ├── pdf
│   ├── templates
│   └── workflows
├── scored
│   ├── component
│   ├── components
│   ├── docs
│   ├── html
│   ├── icons
│   ├── image
│   ├── images
│   ├── pdf
│   ├── templates
│   └── workflows
├── selected
├── approved
├── promoted
├── rejected
├── README.md
├── REVIEW_SCHEMA.json
└── ASSET_LIFECYCLE.md
```

Review flow:

```text
incoming
↓
scored
↓
preview
↓
selected
↓
approved
↓
promoted
↓
production

rejected exits pipeline
```

Review schema:

```json
{
  "id": "",
  "title": "",
  "asset_type": "",
  "source_pack": "",
  "source_path": "",
  "preview_path": "",
  "tags": [],
  "scores": {
    "visual": 0,
    "implementation": 0,
    "relevance": 0,
    "reuse": 0,
    "confidence": 0
  },
  "status": "incoming",
  "notes": ""
}
```

---

## 9. Bootstrap Metadata Coverage

Bootstrap metadata files:

```text
metadata/assets/bootstrap/
├── apache-age.json
├── cal-com.json
├── chatwoot.json
├── documenso.json
├── flexsearch.json
├── fusejs.json
├── fuzzysort.json
├── lancedb.json
├── listmonk.json
├── memgraph.json
├── novu.json
├── postiz.json
├── qdrant.json
├── rotki.json
└── tagify.json
```

Coverage status:

```text
15 repos
15 metadata records
0 missing
```

Example asset metadata:

```json
{
  "id":"cal-com",
  "title":"Cal.com",
  "category":"workspace",
  "tags":["calendar","workspace","booking"],
  "source":"vendor-source/workspace/cal-com",
  "status":"downloaded",
  "tier":"candidate"
}
```

---

## 10. Tags, Scores, States

Master tag list:

```text
crm
contacts
companies
deals
billing
documents
workspace
calendar
automation
marketing
social
sms
email
graph
retrieval
vector
ai
template
component
workflow
dashboard
reporting
treasury
defi
esign
```

Score model:

```text
Implementation Score
Visual Score
Reuse Score
Completeness Score
Production Readiness
Vector Relevance
Retrieval Relevance
Graph Compatibility

Final Score = weighted composite
```

Asset tiers:

```text
Tier 1 = Golden
Tier 2 = Finalist
Tier 3 = Candidate
Tier 4 = Experimental
Tier 5 = Archive
```

Current states file:

```json
{
  "states": [
    "candidate",
    "review",
    "approved",
    "golden",
    "deprecated",
    "archived"
  ],
  "default": "candidate"
}
```

Recommended next state addition:

```text
needs-human-review
```

---

## 11. Graph Layer

Graph paths:

```text
metadata/graphs/bootstrap/SYSTEM_RELATIONSHIPS.md
metadata/graphs/nodes/*.node.json
metadata/graphs/edges/system.edges.json
```

System edges:

```json
[
  {"from":"tracer-ai","to":"runtime-c"},
  {"from":"runtime-c","to":"review-center"},
  {"from":"runtime-c","to":"temp-resource-bundles"},
  {"from":"lancedb","to":"tracer-core"},
  {"from":"qdrant","to":"tracer-core"},
  {"from":"memgraph","to":"tracer-graph"},
  {"from":"apache-age","to":"tracer-graph"}
]
```

Relationship doc includes:

```text
Tracer AI -> Runtime-C
Tracer AI -> Resource Packs
Tracer AI -> Review Center
Runtime-C -> Resource Bundles
Runtime-C -> Artifacts
LanceDB -> Vector Search
Qdrant -> Vector Search
Memgraph -> Relationships
Apache AGE -> Relationships
Tagify -> Tags
FlexSearch -> Search
Fuzzysort -> Scoring
```

---

## 12. Query and Bundle Commands

Run from:

```bash
cd /opt/eila-os/factory-xyz
```

### Search assets

```bash
./runtime-c-assets/tools/query/search-assets.sh calendar
```

### Find by tag

```bash
./runtime-c-assets/tools/query/find-by-tag.sh retrieval
```

### Find by state

```bash
./runtime-c-assets/tools/query/find-by-state.sh candidate
```

### Top assets

```bash
./runtime-c-assets/tools/query/top-assets.sh 15
```

Observed top rankings after real ranking pass:

```text
Qdrant       95
LanceDB      95
Memgraph     92
Apache AGE   92
Novu         90
Listmonk     90
Chatwoot     90
Cal.com      88
Documenso    87
Postiz       85
Rotki        84
Tagify       82
Fuzzysort    80
FuseJS       80
FlexSearch   80
```

### Recommend stack

```bash
./runtime-c-assets/tools/query/recommend-stack.sh retrieval \
| jq '.assets[].title'
```

Observed output:

```text
FlexSearch
FuseJS
Fuzzysort
LanceDB
Qdrant
Tagify
```

### Manual bundle

```bash
./runtime-c-assets/tools/build-resource-bundle.sh \
crm-stack \
runtime-c-assets/metadata/generated/asset-cards/cal-com.card.json \
runtime-c-assets/metadata/generated/asset-cards/chatwoot.card.json \
runtime-c-assets/metadata/generated/asset-cards/novu.card.json \
runtime-c-assets/metadata/generated/asset-cards/postiz.card.json \
> runtime-c-assets/metadata/generated/resource-bundles/crm-stack.bundle.json
```

### Bundle from tags

```bash
./runtime-c-assets/tools/build-bundle-from-tags.sh \
crm-auto \
calendar \
email \
social \
> runtime-c-assets/metadata/generated/resource-bundles/crm-auto.bundle.json
```

Observed output assets:

```text
Cal.com
Listmonk
Novu
Postiz
```

---

## 13. Scan / Classification / Discovery Pipeline

### Scan warehouse

```bash
./runtime-c-assets/tools/ingestion/warehouse-scan-pass.sh \
/opt/eila-os/factory-xyz/runtime-c-assets
```

Output:

```text
metadata/generated/scans/scan-files.txt
```

Result:

```text
105,625 files
```

File types included:

```text
*.md
*.json
*.ts
*.tsx
*.js
*.jsx
```

### Build corpus

```bash
./runtime-c-assets/tools/ingestion/build-corpus-pass.sh
```

Output:

```text
metadata/generated/corpus/corpus-files.txt
```

Result:

```text
105,625 files
```

### Basic classification

```bash
./runtime-c-assets/tools/ingestion/classify-corpus-pass.sh
```

Counts:

```text
components.txt    21,156
docs.txt           5,222
json.txt          19,623
typescript.txt    56,777
total            102,778
```

### High-value discovery

```bash
./runtime-c-assets/tools/ingestion/discover-high-value-assets.sh
```

Search terms:

```text
dashboard
workflow
component
template
builder
automation
retrieval
graph
```

Result:

```text
27,432 high-value assets
```

### Asset type pass

```bash
./runtime-c-assets/tools/ingestion/build-asset-type-pass.sh
```

Counts:

```text
adapters       14
components 18,171
dashboards  6,290
providers     279
templates   1,002
workflows   1,929
total      27,685
```

---

## 14. Production / Tests / Docs / Examples / Configs / Translations

Created:

```text
metadata/generated/production-assets
metadata/generated/tests
metadata/generated/docs
metadata/generated/examples
metadata/generated/configs
metadata/generated/translations
```

Counts:

```text
Production Assets : 2,967
Tests             : 6,584
Docs              : 8,688
Examples          : 5,624
Configs           : 6,256
Translations      : 9,685
```

Important conclusion:

```text
Only about 2.8% of scanned files are likely direct production assets.
Docs/tests/examples/configs/translations are huge and must not dominate final retrieval.
```

---

## 15. Value, Candidate, Promotion, and Golden Queues

### Value pass

Script:

```bash
runtime-c-assets/tools/ingestion/build-value-pass.sh
```

Output:

```text
metadata/generated/value/value-ranked-assets.txt
```

Result:

```text
105,625 records
```

Current scoring rules:

```text
dashboard   -> 95
builder     -> 95
page.tsx    -> 90
workflow    -> 85
template    -> 80
/examples/  -> 60
README.md   -> 40
/i18n/      -> 20
.spec.ts    -> 10
default     -> 10
```

Important warning:

```text
This still has builder bias and path bias.
Do not promote final goldens from value score alone.
```

### Value golden queue

```bash
head -5000 \
runtime-c-assets/metadata/generated/value/value-ranked-assets.txt \
> runtime-c-assets/metadata/generated/goldens/value-golden-queue.txt
```

Count:

```text
5,000
```

### Promotion queue

```bash
./runtime-c-assets/tools/ingestion/build-promotion-queue.sh
```

Count:

```text
4,724
```

### CRM discovery

```bash
./runtime-c-assets/tools/ingestion/discover-crm-assets.sh
```

Count:

```text
16,763
```

### CRM golden queue

```bash
./runtime-c-assets/tools/ingestion/build-crm-goldens.sh
```

Count:

```text
1,000
```

---

## 16. Feature Index / Module Discovery

### Fingerprint V2

Script:

```bash
runtime-c-assets/tools/ingestion/build-feature-fingerprints-v2.sh
```

Output:

```text
metadata/generated/fingerprint-v2/basic-fingerprints.jsonl
```

Count:

```text
105,625 JSONL records
```

JSONL shape:

```json
{"score":95,"file":"/path/to/file.ts"}
```

### Module discovery

Output:

```text
metadata/generated/module-discovery/modules.txt
```

Count:

```text
22,520
```

### Feature index

```bash
./runtime-c-assets/tools/ingestion/build-feature-index.sh
```

Counts:

```text
billing       402
calendar      828
companies      84
contacts       87
dashboard   4,658
deals           5
documents   2,223
workflow      782
total       9,069
```

---

## 17. Alignment Layer

Path:

```text
metadata/alignment
```

Tree:

```text
alignment/
├── canonical-tags
├── conflicts
├── duplicates
├── filters
├── golden-links
├── manifests
├── path-map
└── remediation
```

Canonical tag map:

```json
{
  "customer":"contacts",
  "customers":"contacts",
  "people":"contacts",
  "lead":"deals",
  "leads":"deals",
  "lead-management":"deals",
  "customer-management":"crm",
  "invoice":"billing",
  "invoices":"billing",
  "payment":"billing",
  "payments":"billing",
  "doc":"documents",
  "docs":"documents",
  "signature":"esign",
  "signatures":"esign",
  "schedule":"calendar",
  "scheduling":"calendar",
  "booking":"calendar"
}
```

Duplicate detection:

```bash
./runtime-c-assets/tools/ingestion/find-duplicates.sh
```

Result:

```text
275 duplicate groups
```

Path map:

```bash
./runtime-c-assets/tools/ingestion/build-path-map.sh
```

Result:

```text
105,625 mapped paths
```

Dependency seeds:

```bash
./runtime-c-assets/tools/ingestion/build-dependency-graph.sh
```

Result:

```text
9,581 dependency seeds
```

Low-value patterns:

```text
test
tests
spec
i18n
translation
locale
mock
fixture
storybook
stories
```

Known bug: `filter-low-value-assets.sh` removed only 1 line. Rewrite with awk before relying on it.

---

## 18. Review Cards, Tags, Approval, Explanations

### Build review cards

```bash
./runtime-c-assets/tools/ingestion/build-review-cards.sh
```

Output:

```text
metadata/generated/review-cards/*.review.json
```

Count:

```text
5,000
```

Review card schema:

```json
{
  "id": "md5-of-file-path",
  "file": "/path/to/source",
  "score": 95,
  "suggested_tags": [],
  "review_state": "pending",
  "approved": false,
  "notes": ""
}
```

### Auto tag v2

```bash
./runtime-c-assets/tools/ingestion/auto-tag-pass-v2.sh
```

Validated example:

```json
{
  "file": ".../EventGroupBuilder.ts",
  "score": 95,
  "suggested_tags": [
    "builder",
    "calendar",
    "typescript"
  ],
  "review_state": "pending",
  "approved": false
}
```

### Approval pass

```bash
./runtime-c-assets/tools/ingestion/approval-pass.sh
```

Rules:

```text
score >= 80
suggested_tags length > 0
not test/mock/fixture/i18n/translation
```

Result:

```text
Approved: 4,470
Rejected:   530
```

### Explanation pass

```bash
./runtime-c-assets/tools/ingestion/build-explanation-pass.sh
```

Count:

```text
4,470
```

Current explanation shape:

```json
{
  "id":"...",
  "score":95,
  "file":"...",
  "reasons":"dashboard-feature,typescript-source,"
}
```

Recommended improvement: reasons should become an array.

### Promotion candidates

```bash
./runtime-c-assets/tools/ingestion/build-promotion-candidates.sh
```

Rule:

```text
approved && score >= 90
```

Count:

```text
4,200
```

---

## 19. Content-Based Evaluation

This is the current active frontier. The user explicitly said:

```text
we should not be going off file name alone
```

### Content samples

```bash
./runtime-c-assets/tools/ingestion/content-sample-pass.sh
```

Input:

```text
metadata/generated/goldens/promotion-queue.txt
```

Output:

```text
metadata/generated/content-samples/*.sample.txt
```

Each sample:

```text
FILE: /path/to/file

[first 100 lines]
```

Count:

```text
1,000
```

### Content classification

Script created:

```text
runtime-c-assets/tools/ingestion/content-classification-pass.sh
```

It should classify sample content as:

```text
unknown
react-component
data-layer
api
dashboard
workflow
calendar
```

### Content manifests

Script created:

```text
runtime-c-assets/tools/ingestion/content-manifest-pass.sh
```

Target output:

```text
metadata/generated/content-manifests/*.manifest.json
```

Manifest shape:

```json
{
  "id": "sample-id",
  "feature": "",
  "layer": "",
  "asset_type": ""
}
```

Current detection rules:

```text
feature:
  calendar -> calendar
  billing -> billing
  invoice -> billing
  contact -> contacts
  company -> companies

layer:
  router -> api
  service -> service
  provider -> provider

asset_type:
  react -> react-component
  usequery -> data-layer
  dashboard -> dashboard
```

Recommended fix: avoid loading sample content into shell variable at scale. Use `grep -qi` directly against each sample.

---

## 20. Missing Canonical Object: Fused Assets

Tracer currently has separate records:

```text
review-cards/
approved/
explanations/
content-manifests/
```

The next required step is to fuse these into a canonical asset record:

```text
metadata/generated/fused-assets/*.asset.json
```

Target schema:

```json
{
  "id": "",
  "file": "",
  "score": 95,
  "feature": "calendar",
  "layer": "api",
  "asset_type": "react-component",
  "tags": ["calendar","builder","typescript"],
  "reasons": ["calendar-feature","builder-pattern","typescript-source"],
  "review_state": "approved",
  "approved": true
}
```

Suggested script:

```bash
cat > runtime-c-assets/tools/ingestion/build-fused-assets.sh <<'EOF'
#!/bin/bash

APP="runtime-c-assets/metadata/generated/approved"
MAN="runtime-c-assets/metadata/generated/content-manifests"
EXP="runtime-c-assets/metadata/generated/explanations"
OUT="runtime-c-assets/metadata/generated/fused-assets"

mkdir -p "$OUT"

for f in "$APP"/*.json
do
  ID=$(jq -r '.id' "$f")
  M="$MAN/$ID.manifest.json"
  E="$EXP/$ID.explanation.json"

  if [ -f "$M" ] && [ -f "$E" ]
  then
    jq -s '
      {
        id: .[0].id,
        file: .[0].file,
        score: .[0].score,
        tags: .[0].suggested_tags,
        review_state: .[0].review_state,
        approved: .[0].approved,
        feature: .[1].feature,
        layer: .[1].layer,
        asset_type: .[1].asset_type,
        reasons: (.[2].reasons | split(",") | map(select(. != "")))
      }
    ' "$f" "$M" "$E" > "$OUT/$ID.asset.json"
  fi
done

echo "Fused Assets:"
find "$OUT" -name "*.json" | wc -l
EOF

chmod +x runtime-c-assets/tools/ingestion/build-fused-assets.sh
```

---

## 21. Known Bugs / Cleanup Required

### 21.1 Low-value filter is broken

Observed:

```text
Original: 105,625
Filtered: 105,624
```

It only removed 1 line. Rewrite with awk or chained temp files.

### 21.2 Feature manifest scripts reference moved path

Broken path:

```text
metadata/generated/golden-candidates/golden-candidates.txt
```

Corrected broad candidate pool path:

```text
metadata/generated/candidate-pool/golden-candidates.txt
```

Affected scripts:

```text
build-feature-manifests.sh
build-golden-fingerprints.sh
```

### 21.3 Explanations are strings

Current:

```json
"reasons":"dashboard-feature,typescript-source,"
```

Better:

```json
"reasons":["dashboard-feature","typescript-source"]
```

### 21.4 Content manifests must be run and fused

Current state: script created, but final output and fused asset pass still need completion.

### 21.5 Do not promote based on filename alone

Path score is not enough. Promotion should require:

```text
Path Score
+ Content Score
+ Tag Confidence
+ Feature Detection
+ Approval
+ Explanation
```

### 21.6 Add needs-human-review

Recommended states:

```text
pending
needs-human-review
approved
rejected
golden
deprecated
archived
```

---

## 22. Current Status Snapshot

```text
Vendor repos:             15
Bootstrap metadata:       15
Search index:             15
Tag index:                15
Vector manifests:         15
Graph nodes:              15
Graph edge map:            1
Asset cards:              15

Scanned files:       105,625
Corpus files:        105,625
High value assets:    27,432
Candidate pool:        8,798
Fingerprint pass:      8,020
Value ranked:        105,625
Promotion queue:       4,724
Golden queue:          5,000

Production assets:     2,967
Tests:                 6,584
Docs:                  8,688
Examples:              5,624
Configs:               6,256
Translations:          9,685

Module discovery:     22,520
Feature index total:   9,069

Feature counts:
  billing:              402
  calendar:             828
  companies:             84
  contacts:              87
  dashboard:          4,658
  deals:                  5
  documents:          2,223
  workflow:             782

Duplicate groups:       275
Dependency seeds:     9,581

Review cards:         5,000
Approved:             4,470
Rejected:               530
Explanations:         4,470
Promotion candidates: 4,200
Content samples:      1,000
```

---

## 23. Current Tool Inventory

### Root tools

```text
runtime-c-assets/tools/
├── build-asset-card.sh
├── build-asset-registry.sh
├── build-real-ranking-pass.sh
├── build-recommendation-engine.sh
├── build-resource-bundle.sh
├── build-search-index.sh
├── build-state-index.sh
├── build-tag-index.sh
├── build-vector-manifests.sh
├── bootstrap-edge-pass.sh
├── bootstrap-graph-pass.sh
├── bootstrap-preview-pass.sh
├── bootstrap-ranking-pass.sh
├── bootstrap-score-pass.sh
├── missing-assets.sh
├── query/
└── ingestion/
```

### Query tools

```text
runtime-c-assets/tools/query/
├── find-by-state.sh
├── find-by-tag.sh
├── recommend-stack.sh
├── search-assets.sh
└── top-assets.sh
```

### Ingestion tools

```text
runtime-c-assets/tools/ingestion/
├── approval-pass.sh
├── auto-tag-pass.sh
├── auto-tag-pass-v2.sh
├── build-asset-type-pass.sh
├── build-corpus-pass.sh
├── build-crm-goldens.sh
├── build-dependency-graph.sh
├── build-explanation-pass.sh
├── build-feature-fingerprints-v2.sh
├── build-feature-index.sh
├── build-feature-manifests.sh          # needs path fix
├── build-fingerprint-pass.sh
├── build-golden-candidate-pass.sh
├── build-golden-fingerprints.sh        # needs path fix
├── build-path-map.sh
├── build-promotion-candidates.sh
├── build-promotion-queue.sh
├── build-review-cards.sh
├── build-review-queue.sh
├── build-value-pass.sh
├── classify-configs.sh
├── classify-corpus-pass.sh
├── classify-docs.sh
├── classify-examples.sh
├── classify-production-assets.sh
├── classify-tests.sh
├── classify-translations.sh
├── content-classification-pass.sh
├── content-manifest-pass.sh
├── content-sample-pass.sh
├── discover-crm-assets.sh
├── discover-high-value-assets.sh
├── filter-low-value-assets.sh          # needs rewrite
├── find-duplicates.sh
└── warehouse-scan-pass.sh
```

---

## 24. Run Order From Current State

From:

```bash
cd /opt/eila-os/factory-xyz
```

Sanity check:

```bash
./runtime-c-assets/tools/warehouse-stats.sh
wc -l runtime-c-assets/metadata/generated/fingerprint-v2/basic-fingerprints.jsonl
find runtime-c-assets/metadata/generated/review-cards -name "*.json" | wc -l
find runtime-c-assets/metadata/generated/approved -name "*.json" | wc -l
find runtime-c-assets/metadata/generated/promotion-candidates -name "*.json" | wc -l
```

Continue content intelligence:

```bash
chmod +x runtime-c-assets/tools/ingestion/content-classification-pass.sh
./runtime-c-assets/tools/ingestion/content-classification-pass.sh

chmod +x runtime-c-assets/tools/ingestion/content-manifest-pass.sh
./runtime-c-assets/tools/ingestion/content-manifest-pass.sh
```

Then build fused assets:

```bash
# create build-fused-assets.sh as described above
./runtime-c-assets/tools/ingestion/build-fused-assets.sh
```

Then build:

```text
golden-assets.jsonl
vector-seeds/tracer-vector-seed.jsonl
graph-edges/tracer-edges.jsonl
```

---

## 25. What Tracer Should Do When Complete

Tracer should be able to:

```text
1. Scan a file system or database.
2. Classify files by kind: production, docs, tests, examples, configs, translations.
3. Assign value scores.
4. Generate fingerprints.
5. Sample content.
6. Create content manifests.
7. Suggest tags.
8. Approve / reject / flag human review.
9. Explain why an asset was selected.
10. Promote assets into goldens.
11. Generate vector seeds.
12. Generate graph nodes and edges.
13. Build resource bundles.
14. Allow AI to query the warehouse.
15. Hand selected resource bundles to Runtime-C.
```

---

## 26. Immediate Next Work

Do this next:

```text
1. Run content-classification-pass.sh.
2. Run or fix content-manifest-pass.sh.
3. Build fused-assets.
4. Add needs-human-review state.
5. Rewrite low-value filter.
6. Convert explanation reasons to JSON arrays.
7. Create golden promotion rules.
8. Create golden corpus manifest.
9. Generate vector seeds from fused assets.
10. Generate graph edges from fused assets.
11. Package tracer-core / tracer-graph / tracer-ai zips.
```

The most important immediate change:

```text
Stop treating path score as final truth.
Use content manifests + approval + explanations.
```

That is the difference between a file crawler and Tracer AI.

---

## 27. Bottom Line

The core Tracer warehouse architecture now exists.

It has:

```text
warehouse
metadata
tags
scores
state
review center
search
recommendations
bundles
scan
classification
value ranking
fingerprints
review cards
approval engine
explanations
promotion candidates
content sampling
```

The final step before broad ingestion is creating the canonical fused asset object.

Once fused assets are working, Tracer becomes a real asset-governance and retrieval layer rather than a folder crawler.
