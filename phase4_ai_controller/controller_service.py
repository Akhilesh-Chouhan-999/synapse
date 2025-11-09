# phase4_ai_controller/controller_service.py
from fastapi import FastAPI, Request
from ai_controller import AIController

app = FastAPI(title="Synapse AI Controller")
ai = AIController()

@app.get("/")
def home():
    return {"status": "AI Controller Online"}

@app.post("/analyze")
async def analyze(request: Request):
    data = await request.json()
    result = ai.analyze_metrics(data)
    return {"flag": True, "result": result}

