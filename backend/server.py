# /// script
# dependencies = [
#   "fastapi",
#   "uvicorn[standard]",
#   "pandas",
#   "numpy",
#   "joblib",
#   "scikit-learn",
#   "python-multipart",
#   "requests",
#   "python-dotenv",
#   "lightgbm",
# ]
# ///

import uvicorn
import pandas as pd
import numpy as np
import joblib
from fastapi import FastAPI, UploadFile, File, Header, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import io
import os
import requests
import lightgbm
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# 🛡️ AUTHENTICATION LOGIC
SUPABASE_URL = os.getenv("SUPABASE_URL")
MOCK_AUTH = os.getenv("MOCK_AUTH", "true").lower() == "true" # Default to true for easy dev

def verify_user(authorization: str = Header(None)):
    if MOCK_AUTH:
        # Mock user object for development
        return {"id": "demo-user-123", "email": "demo@guardia.ai"}

    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    try:
        token = authorization.split(" ")[1] if " " in authorization else authorization

        if not SUPABASE_URL:
             raise HTTPException(status_code=500, detail="SUPABASE_URL not configured in .env")

        response = requests.get(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={"Authorization": f"Bearer {token}"}
        )

        if response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid or expired session token")

        return response.json()
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use absolute path to the model file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'app', 'models', 'model.pkl')

if not os.path.exists(MODEL_PATH):
    # Try alternate location if not found
    MODEL_PATH = os.path.join(BASE_DIR, 'model.pkl')

print(f"⌛ AGENT: Loading REAL MODEL from {MODEL_PATH}...")
# Note: This will raise an error if lightgbm or other deps are missing from uv environment
model = joblib.load(MODEL_PATH)
print("✅ SUCCESS: Real model loaded.")

def clean_amount(x):
    if pd.isna(x): return 0.0
    s = str(x).replace(',', '').replace('₹', '').replace('INR', '').replace('Rs', '').replace(' ', '').strip()
    try: return float(s)
    except: return 0.0

def parse_date(x):
    try:
        x_str = str(x).strip()
        if x_str.isdigit():
            if len(x_str) == 10:
                return pd.to_datetime(int(x_str), unit='s', errors='coerce')
            elif len(x_str) == 14:
                return pd.to_datetime(x_str, format='%Y%m%d%H%M%S', errors='coerce')
        return pd.to_datetime(x_str, format='mixed', errors='coerce')
    except:
        return pd.NaT

def preprocess(df):
    # Ensure transaction_amount exists (fallback to amt if needed)
    if 'transaction_amount' not in df.columns and 'amt' in df.columns:
        df['transaction_amount'] = df['amt']
    elif 'transaction_amount' not in df.columns:
        df['transaction_amount'] = 0.0

    df['transaction_amount'] = df['transaction_amount'].apply(clean_amount)
    if 'account_balance' in df.columns:
        df['account_balance'] = df['account_balance'].apply(clean_amount)
    else:
        df['account_balance'] = 0.0

    # Ensure transaction_timestamp exists
    if 'transaction_timestamp' not in df.columns:
        df['transaction_timestamp'] = pd.Timestamp("2024-01-01")
    else:
        df['transaction_timestamp'] = df['transaction_timestamp'].apply(parse_date)
        df['transaction_timestamp'] = df['transaction_timestamp'].fillna(pd.Timestamp("2024-01-01"))

    df['user_id'] = df['user_id'].fillna("UNKNOWN") if 'user_id' in df.columns else "UNKNOWN"
    df['device_id'] = df['device_id'].fillna("UNKNOWN") if 'device_id' in df.columns else "UNKNOWN"
    df['user_location'] = df['user_location'].fillna("UNKNOWN") if 'user_location' in df.columns else "UNKNOWN"
    df['ip_address'] = df['ip_address'].fillna("UNKNOWN") if 'ip_address' in df.columns else "UNKNOWN"

    if 'transaction_id' not in df.columns:
        df['transaction_id'] = ["TXN_UNK_" + str(i) for i in range(len(df))]

    df = df.sort_values(by=['user_id', 'transaction_timestamp'])

    user_avg = df.groupby('user_id')['transaction_amount'].transform('mean')
    user_std = df.groupby('user_id')['transaction_amount'].transform('std').fillna(1)
    df['amount_vs_user_avg'] = df['transaction_amount'] / user_avg.replace(0, 1)
    df['amount_zscore'] = (df['transaction_amount'] - user_avg) / user_std

    df['seconds_since_prev'] = df.groupby('user_id')['transaction_timestamp'].diff().dt.total_seconds().fillna(86400)

    # User's rolling logic
    df = df.set_index('transaction_timestamp')
    df['txn_count_last_5min'] = df.groupby('user_id').rolling('5min')['transaction_amount'].count().reset_index(level=0, drop=True)
    df = df.reset_index()

    df['is_new_device_for_user'] = ~df.duplicated(subset=['user_id', 'device_id'])
    df['is_new_city_for_user'] = ~df.duplicated(subset=['user_id', 'user_location'])

    df['device_user_count'] = df.groupby('device_id')['user_id'].transform('nunique')
    df['user_device_count'] = df.groupby('user_id')['device_id'].transform('nunique')

    df['location_switch_flag'] = (df.groupby('user_id')['user_location'].shift(1) != df['user_location']).astype(int)
    df['user_city_count'] = df.groupby('user_id')['user_location'].transform('nunique')

    df['ip_multi_user_flag'] = (df.groupby('ip_address')['user_id'].transform('nunique') > 1).astype(int)
    df['ip_anomaly'] = (df['ip_address'] == "UNKNOWN").astype(int)
    df['ip_is_private'] = df['ip_address'].astype(str).str.startswith(('192.168.', '10.', '172.')).astype(int)

    df['hour'] = df['transaction_timestamp'].dt.hour
    df['is_night'] = ((df['hour'] < 6) | (df['hour'] > 22)).astype(int)

    df['amount_to_balance_ratio'] = df['transaction_amount'] / df['account_balance'].replace(0, 1)
    df['device_location_combo'] = df.groupby(['device_id', 'user_location']).ngroup()

    df['amount_velocity_interaction'] = df['transaction_amount'] / df['seconds_since_prev'].clip(lower=1)
    df['strong_combo_flag'] = 0.0
    df['anomaly_score'] = 0.0

    features = [
        'amount_vs_user_avg', 'amount_zscore', 'txn_count_last_5min', 'seconds_since_prev',
        'is_new_device_for_user', 'is_new_city_for_user', 'device_user_count', 'user_device_count',
        'location_switch_flag', 'user_city_count', 'ip_multi_user_flag', 'ip_anomaly',
        'ip_is_private', 'hour', 'is_night', 'amount_to_balance_ratio', 'device_location_combo',
        'amount_velocity_interaction', 'strong_combo_flag', 'anomaly_score'
    ]

    for c in features:
        if df[c].dtype == bool:
            df[c] = df[c].astype(float)

    X = df[features].fillna(0)
    return X, df['transaction_id'].tolist()

@app.get("/")
def home(user: dict = Depends(verify_user)):
    """Server entry point."""
    return {"message": f"Welcome back {user.get('email', 'User')}! Guardia API v1.0", "status": "active"}

@app.get("/health")
def health():
    """Production health check."""
    return {"status": "ok"}

@app.post("/predict/")
async def predict_endpoint(file: UploadFile = File(...), user: dict = Depends(verify_user)):
    contents = await file.read()
    string_data = contents.decode("utf-8")

    try:
        df = pd.read_csv(io.StringIO(string_data))
        print(f"📊 Received file with {len(df)} rows.")
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": "Invalid CSV file"})

    try:
        X, tx_ids = preprocess(df.copy())
        print(f"🛠️ Preprocessed into {X.shape[1]} features.")

        preds = model.predict(X)
        prob_matrix = np.asarray(model.predict_proba(X))
        probs = prob_matrix[:, 1]

        print(f"🔮 Model inference complete. Detected {int(sum(preds))} frauds.")

        results = []
        for i, (tx_id, p, prob) in enumerate(zip(tx_ids, preds, probs)):
            status = 'fraud' if p == 1 else 'legitimate'
            reason = "Transaction aligns with normal user behavior"
            if p == 1:
                row = X.iloc[i]
                if row.get('is_new_device_for_user', 0) == 1:
                    reason = "Transaction from a new device"
                elif row.get('is_new_city_for_user', 0) == 1:
                    reason = "Transaction from a new location"
                elif row.get('txn_count_last_5min', 0) > 3:
                    reason = "High frequency of transactions in last 5 minutes"
                elif row.get('amount_zscore', 0) > 2:
                    reason = "Unusually high transaction amount for this user"
                elif row.get('ip_multi_user_flag', 0) == 1:
                    reason = "Multiple users accessing from the same IP"
                elif row.get('is_night', 0) == 1:
                    reason = "Transaction during unusual hours"
                else:
                    reason = "Model detected anomalous patterns"

            results.append({
                "transaction_id": tx_id,
                "prediction": status,
                "score": float(prob),
                "reason": reason
            })

        # Summary metrics for dashboard compatibility
        fraud_detected = int(sum(preds))
        total_transactions = int(len(df))

        return {
            "predictions": results,
            "total_transactions": total_transactions,
            "fraud_detected": fraud_detected,
            "fraud_rate": float(fraud_detected / total_transactions) if total_transactions > 0 else 0,
            "sample": [{"prediction": int(p), "confidence": float(c)} for p, c in zip(preds[:100], probs[:100])]
        }
    except Exception as e:
        print(f"🚨 Prediction Error: {str(e)}")
        import traceback
        return JSONResponse(status_code=500, content={"error": str(e), "traceback": traceback.format_exc()})

# Legacy /transactions support
@app.post("/transactions/upload")
async def transactions_upload(file: UploadFile = File(...), user: dict = Depends(verify_user)):
    # Redirect to predict logic for the demo
    return await predict_endpoint(file, user)

@app.post("/transactions/sample")
def transactions_sample(user: dict = Depends(verify_user)):
    import uuid
    return {
        "message": "Sample loaded",
        "session_id": str(uuid.uuid4()),
        "user_id": user.get("id")
    }

# Legacy /fraud support
@app.post("/fraud/run")
def fraud_run(session_id: str = "demo-session", user: dict = Depends(verify_user)):
    return {
        "message": "Fraud analysis complete",
        "total": 100,
        "fraud_count": 5,
        "user_id": user.get("id")
    }

# Legacy /results support
@app.get("/results/{session_id}")
def get_results(session_id: str, user: dict = Depends(verify_user)):
    # Mock some results for the given session for current user
    return [
        {"transaction_id": f"TXN_{session_id}_{i}", "prediction": "legitimate", "score": 0.05, "reason": "Normal behavior"}
        for i in range(5)
    ]

if __name__ == "__main__":
    # Get the filename of the current script to support uvicorn
    script_name = os.path.basename(__file__).replace('.py', '')
    uvicorn.run(f"{script_name}:app", host="0.0.0.0", port=8000, reload=False)
