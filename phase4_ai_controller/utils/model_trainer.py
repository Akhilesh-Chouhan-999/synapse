import os
import pandas as pd
import joblib
from sklearn.linear_model import LinearRegression

# --- Correct absolute directory resolution ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "model")

# --- Create model folder if missing ---
os.makedirs(MODEL_DIR, exist_ok=True)

DATA_PATH = os.path.join(MODEL_DIR, "training_data.csv")
MODEL_PATH = os.path.join(MODEL_DIR, "ai_controller_model.pkl")

def log_training_data(metrics, score):
    """Append new observation for future training."""
    df_new = pd.DataFrame([{**metrics, "score": score}])
    header = not os.path.exists(DATA_PATH)
    df_new.to_csv(DATA_PATH, mode='a', header=header, index=False)
    print(f"[LOG] Added new training sample → {metrics} | Score={score}")

def retrain_model():
    """Retrain regression model when enough data accumulates."""
    if not os.path.exists(DATA_PATH):
        print("[WARN] No data yet to retrain.")
        return

    df = pd.read_csv(DATA_PATH)
    if len(df) < 10:
        print("[INFO] Waiting for more data before retraining.")
        return

    X = df[['tps', 'latency', 'cpu', 'memory']]
    y = df['score']

    model = LinearRegression()
    model.fit(X, y)
    joblib.dump(model, MODEL_PATH)
    print("[✅] Model retrained with", len(df), "samples.")
