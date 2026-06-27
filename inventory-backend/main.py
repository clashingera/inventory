from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router as core_engine_router

app = FastAPI(
    title="StockFlow Micro-Engine",
    description="High-speed non-database dynamic JSON pipeline framework for modern spreadsheet applications."
)

# Enable connection bridges between frontend view ports and local environments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect tracking routes
app.include_router(core_engine_router, prefix="/api/inventory", tags=["JSON Spreadsheet Core"])

@app.get("/")
def systems_handshake():
    return {"status": "operational", "message": "JSON Pipeline Operational."}