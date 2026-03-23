from fastapi import APIRouter, UploadFile, File, Depends
import pandas as pd
import uuid

from app.utils.supabase_client import supabase
from app.utils.auth import verify_user

router = APIRouter()

# 📤 Upload CSV
@router.post("/transactions/upload")
async def upload_csv(file: UploadFile = File(...), user=Depends(verify_user)):
    df = pd.read_csv(file.file)

    session_id = str(uuid.uuid4())

    records = df.to_dict(orient="records")

    # Add session + user
    for r in records:
        r["session_id"] = session_id
        r["user_id"] = user["id"]

    supabase.table("transactions_raw").insert(records).execute()

    return {
        "message": "File uploaded",
        "session_id": session_id,
        "rows": len(records)
    }


# 🧪 Sample data
@router.post("/transactions/sample")
def load_sample(user=Depends(verify_user)):
    session_id = str(uuid.uuid4())

    sample_data = [
        {
            "transaction_id": "tx1",
            "user_id": user["id"],
            "transaction_amount": "5000",
            "session_id": session_id
        },
        {
            "transaction_id": "tx2",
            "user_id": user["id"],
            "transaction_amount": "50",
            "session_id": session_id
        }
    ]

    supabase.table("transactions_raw").insert(sample_data).execute()

    return {
        "message": "Sample loaded",
        "session_id": session_id
    }
