from fastapi import APIRouter, Depends
from app.utils.supabase_client import supabase
from app.utils.auth import verify_user

router = APIRouter()

@router.get("/results/{session_id}")
def get_results(session_id: str, user=Depends(verify_user)):

    response = supabase.table("predictions") \
        .select("*") \
        .eq("session_id", session_id) \
        .execute()

    return response.data