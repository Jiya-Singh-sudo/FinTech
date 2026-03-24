import pandas as pd
import sys
import os

# Add backend directory to sys.path so 'app.services' can be imported
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.model import predict

def test():
    try:
        df = pd.read_csv('train/sample.csv')
        print(f"Loaded {len(df)} rows from sample.csv")
        
        results = predict(df)
        
        print(f"\n✅ Prediction successful! Got {len(results)} results.")
        
        fraud_count = sum(1 for r in results if r['prediction'] == 'fraud')
        print(f"Found {fraud_count} fraud cases in the sample.\n")
        
        print("First 3 legit cases:")
        legit = [r for r in results if r['prediction'] == 'legitimate']
        for r in legit[:3]:
            print(f"  {r['transaction_id']}: Score: {r['score']}, Type: {r['fraud_type']}")
            
        print("\nFirst 3 fraud cases:")
        fraud = [r for r in results if r['prediction'] == 'fraud']
        for r in fraud[:3]:
            print(f"  {r['transaction_id']}: Score: {r['score']}, Type: {r['fraud_type']}, Reason: {r['reason']}")
            
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test()
