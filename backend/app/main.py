from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Router imports
from app.routes.predict import router as predict_router
from app.routes.transactions import router as transactions_router
from app.routes.fraud import router as fraud_router
from app.routes.results import router as results_router

app = FastAPI(title="Guardia Fraud Detection API")

# 🌍 CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🚀 Include Routers
# Root predict router for main detection flow
app.include_router(predict_router, prefix="/predict", tags=["Detection"])

# Auxiliary routers (Internal Dashboard Logic)
app.include_router(transactions_router, prefix="/transactions", tags=["Data"])
app.include_router(fraud_router, prefix="/fraud", tags=["Analysis"])
app.include_router(results_router, prefix="/results", tags=["Reports"])

# 🏁 Global Root & Health
@app.get("/")
def home():
    """Server entry point."""
    return {"message": "Guardia Analytic Systems API v1.0", "status": "active"}

@app.get("/health")
def health():
    """Production health check."""
    return {"status": "ok"}