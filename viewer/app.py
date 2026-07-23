from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Lead Engine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten this to your Cloudflare domain later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

INCIDENTS = [
    {
        "id": 1,
        "county": "Hillsborough",
        "city": "Tampa",
        "type": "Motor Vehicle Incident",
        "date": "2026-07-23",
        "status": "New",
        "source": "Demo"
    }
]

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/incidents")
def incidents():
    return INCIDENTS

@app.post("/scrape/run")
def scrape():
    return {"success": True}
