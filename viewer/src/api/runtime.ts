const api="http://100.104.23.59:3001/api";

export const getRuntime=()=>fetch(`${api}/runtime`).then(r=>r.json());
export const getRetrieval=()=>fetch(`${api}/retrieval`).then(r=>r.json());
export const getStorage=()=>fetch(`${api}/storage`).then(r=>r.json());
export const getIndexes=()=>fetch(`${api}/indexes`).then(r=>r.json());
export const getWarehouse=()=>fetch(`${api}/warehouse`).then(r=>r.json());
export const getReview=()=>fetch(`${api}/review`).then(r=>r.json());
export const getAgents=()=>fetch(`${api}/agents`).then(r=>r.json());
