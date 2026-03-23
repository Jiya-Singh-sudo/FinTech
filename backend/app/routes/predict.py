from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
import io
from app.services.model import predict

router = APIRouter()

# 1. 🔍 MAIN ENDPOINT — /
@router.post("/")
async def run_predict(file: UploadFile = File(...)):
    """
    Main prediction endpoint that processes a CSV and returns summary statistics.
    """
    try:
        # ✅ Validate file type
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="Only CSV files are allowed")

        # ✅ Read file safely
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))

        if df.empty:
            return {"error": "Uploaded file is empty"}

        # ✅ Call model prediction
        # predict(df) returns (predictions, probabilities)
        predictions, probabilities = predict(df)

        fraud_detected = int(sum(predictions))
        total_transactions = int(len(df))
        
        # ✅ Prepare sample (increased limit to support small demo files)
        sample = [
            {"prediction": int(p), "confidence": float(c)} 
            for p, c in zip(predictions[:100], probabilities[:100])
        ]

        # ✅ Final payload
        response_data = {
            "total_transactions": total_transactions,
            "fraud_detected": fraud_detected,
            "fraud_rate": float(fraud_detected / total_transactions) if total_transactions > 0 else 0,
            "sample": sample
        }

        # 📺 Console Output for Debugging
        print("\n" + "="*40)
        print(f"--- 🛡️ GUARDIA MODEL SUMMARY ---")
        print(f"TOTAL TRX: {total_transactions}")
        print(f"FRAUD DETECTED: {fraud_detected}")
        print(f"FRAUD RATE: {(response_data['fraud_rate']*100):.2f}%")
        print("="*40 + "\n")

        return response_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


# 2. ❤️ HEALTH CHECK ENDPOINT
@router.get("/health")
def health_check():
    """Simple heart-beat endpoint."""
    return {"status": "ok"}


# 3. 📄 OPTIONAL DETAILS ENDPOINT — /details
@router.post("/details")
async def get_predict_details(file: UploadFile = File(...)):
    """
    Returns row-level prediction data for detailed analysis.
    """
    try:
        # ✅ Validate file type
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="Only CSV files are allowed")

        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))

        predictions, probabilities = predict(df)

        # ✅ Prepare complete list
        row_level_results = [
            {"prediction": int(p), "confidence": float(c)} 
            for p, c in zip(predictions, probabilities)
        ]

        return row_level_results

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing details: {str(e)}")