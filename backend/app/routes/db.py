from fastapi import APIRouter, Depends
from app.utils.supabase_client import supabase
from app.utils.auth import verify_user

router = APIRouter()

# 🔐 Protected route
@router.get("/secure-data")
def secure_data(user=Depends(verify_user)):
    return {
        "message": "You are authenticated",
        "user_email": user["email"]
    }


# 🧪 Test DB insert
@router.post("/add-test")
def add_test(user=Depends(verify_user)):
    data = {
        "user_id": user["id"],
        "amount": 1000,
        "status": "success"
    }

    response = supabase.table("transactions").insert(data).execute()

    return response.data