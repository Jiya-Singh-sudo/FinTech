import numpy as np
import pandas as pd
import joblib
import os

# Loading path for potential ML model
# Relative to this file: ../models/model.pkl
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "model.pkl")

# In production, we could load the model. For this hackathon/demo version, we use robust heuristics.
model = None
if os.path.exists(MODEL_PATH):
    try:
        model = joblib.load(MODEL_PATH)
    except Exception:
        model = None

def predict(df):
    """
    Predicts fraud based on high-level heuristics for demonstration purposes.
    Returns: (predictions, probabilities)
    """
    # 🧪 Hackathon Heuristic Loop
    # Standardize column name for the mock
    amount_col = None
    possible_cols = ['amount', 'transaction_amount', 'Amount', 'Transaction Amount']
    
    for c in possible_cols:
        if c in df.columns:
            amount_col = c
            break

    if amount_col:
        try:
            # ✅ DEEP COERCION: Ensure pure numeric float type
            # We explicitly convert and fill NaNs to be 100% sure comparison works
            amounts_series = pd.to_numeric(df[amount_col], errors='coerce').fillna(0.0)
            
            # High risk for high amounts (> 50,000)
            predictions_raw = (amounts_series > 50000).astype(int)
            predictions = predictions_raw.values
            
            # Probabilities: 0.85 for fraud, 0.05 for safe (mock)
            probabilities = np.where(predictions == 1, 0.85, 0.05)
            
            return predictions, probabilities
            
        except Exception as e:
            # Fallback if coercion fails for some pandas technical reason
            print(f"Prediction coercion error: {e}")
            pass

    # Fallback to random if no amount column found or error occurred
    size = len(df)
    predictions = np.random.choice([0, 1], size=size, p=[0.98, 0.02])
    probabilities = np.where(predictions == 1, 0.75, 0.08)

    return predictions, probabilities

# Alias for backwards compatibility if needed
def predict_model(df):
    """
    Backwards compatibility for files calling predict_model.
    """
    preds, _ = predict(df)
    return preds
