from fastapi import APIRouter, UploadFile, File
import pandas as pd
import io

from app.services.cleaning import clean_data
from app.services.features import feature_engineering
from app.services.model import predict_model

router = APIRouter()

@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # ✅ Validate file
        if not file.filename.endswith('.csv'):
            return {"error": "Only CSV files are allowed"}

        # ✅ Read file safely
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))

        if df.empty:
            return {"error": "Uploaded file is empty"}

        # ✅ Pipeline
        df = clean_data(df)
        df = feature_engineering(df)
        preds = predict_model(df)

        fraud_count = int(sum(preds))
        total = len(df)

        sample = preds[:10].tolist() if hasattr(preds, "tolist") else list(preds[:10])

        return {
            "total_transactions": total,
            "fraud_detected": fraud_count,
            "fraud_rate": fraud_count / total if total > 0 else 0,
            "sample_predictions": sample
        }

    except Exception as e:
        return {"error": str(e)}