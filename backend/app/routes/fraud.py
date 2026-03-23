from fastapi import APIRouter, Depends
from app.utils.supabase_client import supabase
from app.utils.auth import verify_user

# (later import your ML functions)
# from app.services.cleaning import clean_data
# from app.services.features import feature_engineering
# from app.services.model import predict_model

router = APIRouter()


@router.post("/fraud/run")
def run_fraud(session_id: str, user=Depends(verify_user)):

    # 1. Fetch raw data
    response = supabase.table("transactions_raw") \
        .select("*") \
        .eq("session_id", session_id) \
        .execute()

    data = response.data

    if not data:
        return {"error": "No data found"}

    # 2. (Temporary logic — replace with model later)
    predictions = []
    for row in data:
        amount = float(row.get("transaction_amount", 0))

        is_fraud = amount > 3000

        predictions.append({
            "transaction_id": row["transaction_id"],
            "user_id": row["user_id"],
            "is_fraud": is_fraud,
            "fraud_probability": 0.8 if is_fraud else 0.1,
            "reason": "High amount" if is_fraud else "Normal",
            "session_id": session_id
        })

    # 3. Store predictions
    supabase.table("predictions").insert(predictions).execute()

    return {
        "message": "Fraud analysis complete",
        "total": len(predictions),
        "fraud_count": sum([p["is_fraud"] for p in predictions])
    }