from fastapi import Header, HTTPException
import requests
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")

def verify_user(authorization: str = Header(...)):
    if not authorization:
        raise HTTPException(status_code=401, detail="No token")

    token = authorization.split(" ")[1]

    response = requests.get(
        f"{SUPABASE_URL}/auth/v1/user",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    if response.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid token")

    return response.json()