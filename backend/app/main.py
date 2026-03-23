from fastapi import FastAPI
from app.routes import transactions, fraud, results
from app.routes.predict import router as predict_router

app = FastAPI(title="Fraud Detection API")

app.include_router(transactions.router)
app.include_router(fraud.router)
app.include_router(results.router)
app.include_router(predict_router)

@app.get("/")
def home():
    return {"message": "API is running"}