const api="/api";

export const getRuntime=()=>fetch(`${api}/runtime`).then(r=>r.json());
export const getRetrieval=()=>fetch(`${api}/retrieval`).then(r=>r.json());
export const getStorage=()=>fetch(`${api}/storage`).then(r=>r.json());
export const getIndexes=()=>fetch(`${api}/indexes`).then(r=>r.json());
export const getWarehouse=()=>fetch(`${api}/warehouse`).then(r=>r.json());
export const getReview=()=>fetch(`${api}/review`).then(r=>r.json());
export const getAgents=()=>fetch(`${api}/agents`).then(r=>r.json());

export const getVectors=()=>fetch(`${api}/vectors`).then(r=>r.json());
export const getGraphs=()=>fetch(`${api}/graphs`).then(r=>r.json());
export const getRanking=()=>fetch(`${api}/ranking`).then(r=>r.json());
export const getGoldens=()=>fetch(`${api}/goldens`).then(r=>r.json());
export const getFamilies=()=>fetch(`${api}/families`).then(r=>r.json());
export const getRuns=()=>fetch(`${api}/runs`).then(r=>r.json());
export const getBundles=()=>fetch(`${api}/bundles`).then(r=>r.json());
export const getSearch=()=>fetch(`${api}/search`).then(r=>r.json());

export const getScores=()=>fetch(`${api}/scores`).then(r=>r.json());
