import pandas as pd

def feature_engineering(df: pd.DataFrame) -> pd.DataFrame:
    # Example features

    if "transaction_amount" in df.columns:
        df["is_large_txn"] = df["transaction_amount"] > df["transaction_amount"].mean()

    return df