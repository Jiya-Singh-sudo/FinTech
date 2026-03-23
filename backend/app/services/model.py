import numpy as np

# This is a Mock Model for the hackathon. 
# In production, load a saved model:
# import joblib
# model = joblib.load("models/fraud_model.pkl")

def predict_model(df):
    """
    Predicts fraud based on high-level heuristics for demonstration purposes.
    - If amount > 50,000, 70% chance of fraud.
    - Otherwise, 2% chance of fraud.
    """
    # Simulate a prediction array (1 for fraud, 0 for safe)
    # df must have 'amount' column
    
    # Simple rule-based mock
    if 'amount' in df.columns:
        # Higher risk for high amounts
        predictions = (df['amount'] > 50000).astype(int)
    else:
        # Fallback to random if no amount column
        predictions = np.random.choice([0, 1], size=len(df), p=[0.98, 0.02])
        
    return predictions