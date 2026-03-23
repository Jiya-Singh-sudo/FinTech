import joblib
import os

# MODEL_PATH = os.path.join("backend", "models", "fraud_model.pkl")

model = joblib.load(MODEL_PATH)

def predict_model(df):
    return model.predict(df)