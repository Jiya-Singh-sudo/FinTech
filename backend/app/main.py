from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.transactions import router as transactions_router
from app.routes.fraud import router as fraud_router
from app.routes.results import router as results_router
from app.routes.predict import router as predict_router

app = FastAPI(title="Fraud Detection API")

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # During development, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transactions_router)
app.include_router(fraud_router)
app.include_router(results_router)
app.include_router(predict_router)

@app.get("/")
def home():
    return {"message": "API is running"}