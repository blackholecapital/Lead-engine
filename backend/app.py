from fastapi import FastAPI

app = FastAPI(title="Lead Engine API")

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

@app.get("/")
def root():
    return {
        "service": "Lead Engine",
        "version": "0.1.0"
    }

@app.get("/health")
def health():
    return {
        "status": "ok"
    }

@app.get("/incidents")
def incidents():
    return INCIDENTS

@app.post("/scrape/run")
def scrape():
    return {
        "success": True,
        "message": "Scraper placeholder executed"
    }
