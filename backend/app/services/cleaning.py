import pandas as pd

def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    # Example cleaning (expand later)

    # Remove duplicates
    df = df.drop_duplicates()

    # Handle missing values
    df = df.fillna(0)

    return df